import type { PlanId } from "./site";

// The one place a payment provider plugs in. Today no gateway is connected, so a subscription is a request that the
// team answers with an invoice. To take cards online, return { mode: "redirect", url } from createCheckout (for
// example a Stripe or Paymob checkout session) and the subscribe flow will send the customer there instead.
export type CheckoutResult = { mode: "manual" } | { mode: "redirect"; url: string };

export async function createCheckout(_order: { plan: PlanId; email: string; company: string }): Promise<CheckoutResult> {
  return { mode: "manual" };
}
