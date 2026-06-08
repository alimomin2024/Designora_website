import {
  arrayUnion,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDbInstance, type User } from "@/lib/firebase";

export type ToolName =
  | "resize"
  | "upscale"
  | "bgRemoval"
  | "watermark"
  | "compress"
  | "convert"
  | "batchResize"
  | "palette"
  | "metadata"
  | "pdf"
  | "enhance";

export interface UserDoc {
  email: string;
  displayName: string;
  credits: number;
  dailyFreeUsed: number;
  dailyFreeDate: string;
  totalPurchased: number;
  createdAt: number;
}

const COUPON_REWARDS: Record<string, number> = {
  DESI1998: 100,
};

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function usersDoc(uid: string) {
  return doc(getDbInstance(), "users", uid);
}

export async function ensureUserDoc(user: User) {
  const ref = usersDoc(user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const data: UserDoc = {
      email: user.email ?? "",
      displayName: user.displayName ?? "",
      credits: 0,
      dailyFreeUsed: 0,
      dailyFreeDate: todayUTC(),
      totalPurchased: 0,
      createdAt: Date.now(),
    };
    await setDoc(ref, data);
  }
}

export async function getUserDoc(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(usersDoc(uid));
  if (!snap.exists()) return null;
  const raw = snap.data() as Partial<UserDoc>;
  const now = todayUTC();
  const normalized: UserDoc = {
    email: raw.email ?? "",
    displayName: raw.displayName ?? "",
    credits: typeof raw.credits === "number" ? raw.credits : 0,
    dailyFreeUsed: typeof raw.dailyFreeUsed === "number" ? raw.dailyFreeUsed : 0,
    dailyFreeDate: raw.dailyFreeDate ?? now,
    totalPurchased: typeof raw.totalPurchased === "number" ? raw.totalPurchased : 0,
    createdAt: typeof raw.createdAt === "number" ? raw.createdAt : Date.now(),
  };

  const patch: Partial<UserDoc> = {};
  if (typeof raw.credits !== "number") patch.credits = normalized.credits;
  if (typeof raw.dailyFreeUsed !== "number") patch.dailyFreeUsed = normalized.dailyFreeUsed;
  if (!raw.dailyFreeDate) patch.dailyFreeDate = normalized.dailyFreeDate;
  if (typeof raw.totalPurchased !== "number") patch.totalPurchased = normalized.totalPurchased;
  if (typeof raw.createdAt !== "number") patch.createdAt = normalized.createdAt;

  if (normalized.dailyFreeDate !== now) {
    normalized.dailyFreeUsed = 0;
    normalized.dailyFreeDate = now;
    patch.dailyFreeUsed = 0;
    patch.dailyFreeDate = now;
  }

  if (Object.keys(patch).length > 0) {
    try {
      await updateDoc(usersDoc(uid), patch);
    } catch {
      // Continue with normalized in-memory data when client writes are blocked.
    }
  }

  return normalized;
}

export function getToolCost(tool: ToolName, tier?: string): number {
  if (tool === "upscale") {
    if (tier === "4k-600dpi") return 4;
    if (tier === "4k") return 2;
    return 1;
  }
  if (tool === "bgRemoval" || tool === "watermark") {
    return 4;
  }
  return 0;
}

export async function canUse(
  uid: string,
  tool: ToolName,
  tier?: string,
): Promise<{ allowed: boolean; reason: string; useFree: boolean }> {
  const cost = getToolCost(tool, tier);
  if (cost === 0) {
    return { allowed: true, reason: "free-unlimited", useFree: false };
  }

  const d = await getUserDoc(uid);
  if (!d) return { allowed: false, reason: "Account not found", useFree: false };
  if (d.credits >= cost) {
    return { allowed: true, reason: "credits", useFree: false };
  }

  return {
    allowed: false,
    reason: `Not enough credits (need ${cost}, have ${d.credits})`,
    useFree: false,
  };
}

export async function deductCredits(
  uid: string,
  tool: ToolName,
  tier?: string,
): Promise<boolean> {
  const cost = getToolCost(tool, tier);
  if (cost === 0) return true;

  const check = await canUse(uid, tool, tier);
  if (!check.allowed) return false;
  await updateDoc(usersDoc(uid), {
    credits: increment(-cost),
  });
  return true;
}

export async function addCredits(uid: string, amount: number, orderId: string) {
  await updateDoc(usersDoc(uid), {
    credits: increment(amount),
    totalPurchased: increment(amount),
    cashfreeOrderId: orderId,
  });
}

export async function redeemCoupon(uid: string, couponCode: string) {
  const normalizedCode = couponCode.trim().toUpperCase();
  const reward = COUPON_REWARDS[normalizedCode];
  if (!reward) {
    return { success: false, message: "Invalid coupon code", creditsAdded: 0 };
  }

  const ref = usersDoc(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return { success: false, message: "Account not found", creditsAdded: 0 };
  }

  const data = snap.data() as UserDoc & { redeemedCoupons?: string[] };
  const redeemedCoupons = data.redeemedCoupons || [];
  if (redeemedCoupons.includes(normalizedCode)) {
    return { success: false, message: "Coupon already redeemed", creditsAdded: 0 };
  }

  await updateDoc(ref, {
    credits: increment(reward),
    totalBonus: increment(reward),
    redeemedCoupons: arrayUnion(normalizedCode),
  });

  return {
    success: true,
    message: `Coupon applied. ${reward} credits added.`,
    creditsAdded: reward,
  };
}

export function getDailyFreeRemaining(userDoc: UserDoc): number {
  if (!userDoc) return 0;
  return 0;
}
