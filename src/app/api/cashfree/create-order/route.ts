import { NextRequest, NextResponse } from "next/server";
import { createCashfreeOrder } from "@/lib/cashfree";
import { applyRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const limited = applyRateLimit(req, "cashfree-create-order", 15, 60_000);
    if (limited) return limited;

    const body = await req.json();
    const { uid, email, name, phone, amount, credits } = body;

    if (!uid || !email) {
      return NextResponse.json({ error: "Missing uid or email" }, { status: 400 });
    }

    const orderAmount = amount || 85;
    const creditAmount = credits || 100;

    const shortUid = String(uid).slice(0, 12);
    const orderId = `credits_${shortUid}_${creditAmount}_${Date.now().toString(36)}`;
    const customerId = `cust_${String(uid).slice(0, 45)}`;
    let origin = req.headers.get("origin") || "http://localhost:3000";
    if (origin.startsWith("http://")) {
      origin = origin.replace("http://", "https://");
    }

    const result = await createCashfreeOrder({
      orderId,
      customerId,
      orderAmount,
      customerName: name || "User",
      customerEmail: email,
      customerPhone: phone || "9999999999",
      returnUrl: `${origin}/pricing?order_id={order_id}`,
    });

    return NextResponse.json({
      orderId: result.order_id,
      paymentSessionId: result.payment_session_id,
      credits: creditAmount,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
