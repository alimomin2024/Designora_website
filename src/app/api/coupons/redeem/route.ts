import { NextRequest, NextResponse } from "next/server";
import { arrayUnion, doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { getDbInstance } from "@/lib/firebase";
import { applyRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const COUPON_CODE = "DESI1998";
const COUPON_CREDITS = 100;

export async function POST(req: NextRequest) {
  try {
    const limited = applyRateLimit(req, "coupon-redeem", 10, 60_000);
    if (limited) return limited;

    const { uid, couponCode } = await req.json();

    if (!uid || !couponCode) {
      return NextResponse.json({ error: "Missing uid or couponCode" }, { status: 400 });
    }

    const normalizedCode = String(couponCode).trim().toUpperCase();
    if (normalizedCode !== COUPON_CODE) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }

    const userRef = doc(getDbInstance(), "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const existing = userSnap.data();
    const redeemedCoupons = (existing.redeemedCoupons || []) as string[];
    if (redeemedCoupons.includes(COUPON_CODE)) {
      return NextResponse.json({ error: "Coupon already redeemed" }, { status: 400 });
    }

    await updateDoc(userRef, {
      credits: increment(COUPON_CREDITS),
      totalBonus: increment(COUPON_CREDITS),
      redeemedCoupons: arrayUnion(COUPON_CODE),
    });

    return NextResponse.json({
      success: true,
      creditsAdded: COUPON_CREDITS,
      message: `Coupon applied. ${COUPON_CREDITS} credits added.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
