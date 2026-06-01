import { NextRequest, NextResponse } from "next/server";
import { verifyCashfreeOrder } from "@/lib/cashfree";
import { applyRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const limited = applyRateLimit(req, "cashfree-verify-order", 30, 60_000);
    if (limited) return limited;

    const { orderId, uid } = await req.json();

    if (!orderId || !uid) {
      return NextResponse.json({ error: "Missing orderId or uid" }, { status: 400 });
    }

    const order = await verifyCashfreeOrder(orderId);

    if (order.order_status === "PAID") {
      const creditsMatch = orderId.match(/credits_[^_]+_(\d+)_/);
      const creditAmount = creditsMatch ? parseInt(creditsMatch[1], 10) : 100;

      const { addCredits } = await import("@/lib/firestore");
      await addCredits(uid, creditAmount, orderId);
      return NextResponse.json({ success: true, status: "PAID", credits: creditAmount });
    }

    return NextResponse.json({ success: false, status: order.order_status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
