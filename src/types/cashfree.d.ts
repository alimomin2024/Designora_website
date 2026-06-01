declare module "@cashfreepayments/cashfree-js" {
  interface CheckoutResult {
    error?: { message: string };
    redirect?: boolean;
    paymentDetails?: Record<string, unknown>;
  }

  interface CashfreeInstance {
    checkout(options: {
      paymentSessionId: string;
      redirectTarget?: string;
      returnUrl?: string;
    }): Promise<CheckoutResult>;
    version(): string;
  }

  export function load(config: {
    mode: "sandbox" | "production";
  }): Promise<CashfreeInstance | null>;
}
