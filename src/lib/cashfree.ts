const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
const IS_PROD = process.env.NEXT_PUBLIC_CASHFREE_ENV === "production";
const BASE_URL = IS_PROD
  ? "https://api.cashfree.com/pg"
  : "https://sandbox.cashfree.com/pg";

interface CreateOrderPayload {
  orderId: string;
  customerId: string;
  orderAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
}

export async function createCashfreeOrder(payload: CreateOrderPayload) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": CASHFREE_APP_ID,
      "x-client-secret": CASHFREE_SECRET_KEY,
      "x-api-version": "2023-08-01",
    },
    body: JSON.stringify({
      order_id: payload.orderId,
      order_amount: payload.orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: payload.customerId,
        customer_name: payload.customerName,
        customer_email: payload.customerEmail,
        customer_phone: payload.customerPhone,
      },
      order_meta: {
        return_url: payload.returnUrl,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Cashfree order creation failed: ${res.status}`);
  }

  return res.json();
}

export async function verifyCashfreeOrder(orderId: string) {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
    headers: {
      "x-client-id": CASHFREE_APP_ID,
      "x-client-secret": CASHFREE_SECRET_KEY,
      "x-api-version": "2023-08-01",
    },
  });

  if (!res.ok) {
    throw new Error(`Verification failed: ${res.status}`);
  }

  return res.json();
}
