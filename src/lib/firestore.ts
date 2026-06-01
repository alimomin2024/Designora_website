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

const DAILY_FREE_LIMIT = 3;
const COUPON_REWARDS: Record<string, number> = {
  DESI1998: 100,
};
const CREDIT_ONLY_TOOLS: ToolName[] = ["upscale", "bgRemoval", "watermark"];

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
  const data = snap.data() as UserDoc;
  if (data.dailyFreeDate !== todayUTC()) {
    data.dailyFreeUsed = 0;
    data.dailyFreeDate = todayUTC();
    try {
      await updateDoc(usersDoc(uid), {
        dailyFreeUsed: 0,
        dailyFreeDate: todayUTC(),
      });
    } catch {
      // Gracefully continue even if user rules reject updates for legacy docs.
    }
  }
  return data;
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
  return 1;
}

export async function canUse(
  uid: string,
  tool: ToolName,
  tier?: string,
): Promise<{ allowed: boolean; reason: string; useFree: boolean }> {
  const d = await getUserDoc(uid);
  if (!d) return { allowed: false, reason: "Account not found", useFree: false };

  if (
    d.dailyFreeUsed < DAILY_FREE_LIMIT &&
    !CREDIT_ONLY_TOOLS.includes(tool)
  ) {
    return { allowed: true, reason: "free", useFree: true };
  }

  const cost = getToolCost(tool, tier);
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
  const check = await canUse(uid, tool, tier);
  if (!check.allowed) return false;

  if (check.useFree) {
    await updateDoc(usersDoc(uid), {
      dailyFreeUsed: increment(1),
      dailyFreeDate: todayUTC(),
    });
  } else {
    const cost = getToolCost(tool, tier);
    await updateDoc(usersDoc(uid), {
      credits: increment(-cost),
    });
  }
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
  if (userDoc.dailyFreeDate !== todayUTC()) return DAILY_FREE_LIMIT;
  return Math.max(0, DAILY_FREE_LIMIT - userDoc.dailyFreeUsed);
}
