"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Coins, Loader2, Sparkles, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";
import { load } from "@cashfreepayments/cashfree-js";
import { redeemCoupon } from "@/lib/firestore";

const CREDIT_PACKS = [
  { amount: 100, price: 1, priceINR: 85, label: "Starter" },
  { amount: 500, price: 4, priceINR: 340, label: "Popular", featured: true },
  { amount: 1000, price: 7, priceINR: 595, label: "Best Value" },
];

const TOOL_COSTS = [
  { tool: "Image Resize", cost: "Free (unlimited)" },
  { tool: "Image Upscaler (2K)", cost: "1 credit" },
  { tool: "Image Upscaler (4K)", cost: "2 credits" },
  { tool: "Background Removal", cost: "4 credits" },
  { tool: "Watermark Removal", cost: "4 credits" },
  { tool: "All non-AI tools", cost: "Free (unlimited)" },
];

export default function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { credits, refresh } = useUsage();
  const [paying, setPaying] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [error, setError] = useState("");

  const verifyOrder = useCallback(
    async (orderId: string) => {
      if (!user) return;
      setVerifying(true);
      try {
        const res = await fetch("/api/cashfree/verify-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, uid: user.uid }),
        });
        const data = await res.json();
        if (data.success) {
          await refresh();
          router.push("/dashboard");
        } else {
          setError(`Payment status: ${data.status}. Please try again.`);
        }
      } catch {
        setError("Verification failed. Please contact support.");
      } finally {
        setVerifying(false);
      }
    },
    [user, refresh, router],
  );

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    if (!orderId || !user) return;

    const verification = window.setTimeout(() => {
      void verifyOrder(orderId);
    }, 0);

    return () => window.clearTimeout(verification);
  }, [searchParams, user, verifyOrder]);

  async function handleBuy(pack: (typeof CREDIT_PACKS)[number]) {
    if (!user) {
      router.push("/signup");
      return;
    }
    setError("");
    setPaying(true);
    try {
      const res = await fetch("/api/cashfree/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName || "User",
          amount: pack.priceINR,
          credits: pack.amount,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const cfMode =
        process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
          ? "production"
          : "sandbox";
      const cashfree = await load({ mode: cfMode });
      if (!cashfree) throw new Error("Failed to load Cashfree SDK");

      const result = await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_modal",
      });

      if (result?.paymentDetails) {
        await verifyOrder(data.orderId);
      } else if (result?.error) {
        setError(result.error.message || "Payment failed. Please try again.");
        setPaying(false);
      } else {
        setError("Payment was not completed. Please try again.");
        setPaying(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setPaying(false);
    }
  }

  async function handleCouponRedeem() {
    if (!user) {
      router.push("/signup");
      return;
    }
    setError("");
    setCouponMessage("");
    setCouponLoading(true);
    try {
      const result = await redeemCoupon(user.uid, couponCode);
      if (!result.success) {
        throw new Error(result.message || "Coupon redeem failed");
      }
      setCouponCode("");
      setCouponMessage(result.message || "Coupon applied.");
      await refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Coupon redeem failed");
    } finally {
      setCouponLoading(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/6 blur-[120px]" />
      </div>

      {user && (
        <div className="mb-12 flex items-center justify-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-primary">
            <Coins className="h-4 w-4" /> {credits} credits
          </span>
        </div>
      )}

      {verifying && (
        <div className="mb-8 flex items-center justify-center gap-3 rounded-2xl bg-primary/10 p-4 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
          Verifying your payment…
        </div>
      )}

      {error && (
        <div className="mb-8 rounded-2xl bg-destructive/10 p-4 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Free tier */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="glass rounded-2xl p-6 mb-8 text-center"
      >
        <h2 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
          <Gift className="h-5 w-5 text-emerald-400" /> Free Non-AI Tools
        </h2>
        <p className="text-muted-foreground text-sm">
          All non-AI tools (resize, compress, convert, batch resize, palette, metadata, PDF, enhance) are <strong>free and unlimited</strong>. AI tools (Upscale, Background Removal, Watermark Removal) use credits.
        </p>
      </motion.div>

      {/* Credit packs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.5 }}
        className="glass mb-8 rounded-2xl p-6"
      >
        <h3 className="mb-2 text-lg font-semibold">Have a coupon code?</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Enter your code to add bonus credits instantly.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="sm:max-w-xs"
          />
          <Button
            onClick={handleCouponRedeem}
            disabled={!couponCode.trim() || couponLoading || authLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply Coupon"}
          </Button>
        </div>
        {couponMessage && (
          <p className="mt-3 text-sm text-emerald-400">{couponMessage}</p>
        )}
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-3 mb-12">
        {CREDIT_PACKS.map((pack, i) => (
          <motion.div
            key={pack.amount}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
            className={`glass rounded-2xl p-6 relative overflow-hidden ${
              pack.featured ? "gradient-border glow" : ""
            }`}
          >
            {pack.featured && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                  <Sparkles className="h-3 w-3" /> Popular
                </div>
              </div>
            )}
            <h3 className="text-lg font-semibold">{pack.label}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold gradient-text">{pack.amount}</span>
              <span className="text-muted-foreground">credits</span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              ${pack.price} (₹{pack.priceINR})
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              ${(pack.price / pack.amount * 100).toFixed(1)}¢ per credit
            </div>
            <Button
              onClick={() => handleBuy(pack)}
              disabled={paying || authLoading}
              className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90 glow"
            >
              {paying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                `Buy ${pack.amount} Credits`
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Cost table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Credit Costs per Use</h3>
        <div className="space-y-2">
          {TOOL_COSTS.map((item) => (
            <div key={item.tool} className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0">
              <span className="text-muted-foreground">{item.tool}</span>
              <span className="flex items-center gap-1 font-medium">
                <Check className="h-3.5 w-3.5 text-primary" /> {item.cost}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
