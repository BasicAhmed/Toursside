import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import SubscribeFlow from "@/components/SubscribeFlow";
import { visitorCurrency } from "@/lib/visitor";
import { instantEnabled, cardPayments } from "@/lib/instant";
import { PLANS, MAIN_PLAN, type PlanId, type Billing } from "@/lib/site";

export const metadata: Metadata = pageMeta({ title: "Subscribe", description: "Start a Toursside subscription. Choose Starter, Growth or Business and tell us about your travel business.", path: "/subscribe" });

export default async function Subscribe({ searchParams }: { searchParams: Promise<{ plan?: string; billing?: string; currency?: string }> }) {
  const { plan, billing, currency } = await searchParams;
  const cur = await visitorCurrency(currency);
  const instant = instantEnabled();
  const card = instant && (await cardPayments());
  const initial: PlanId = plan && plan in PLANS ? (plan as PlanId) : MAIN_PLAN;
  const initialBilling: Billing = billing === "monthly" ? "monthly" : "annual";
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Start your subscription</h1>
        <p className="lede">Three short steps. You are not charged on this page.</p>
      </div>
      <div className="form-grid">
        <SubscribeFlow initialPlan={initial} initialBilling={initialBilling} currency={cur} instant={instant} card={card} />
        <aside className="aside">
          <h2>What happens next</h2>
          {instant && card ? <ol>
            <li><b>Your workspace opens</b><span>Created in seconds with your company name, ready to use.</span></li>
            <li><b>You pay by card</b><span>On a secure payment page run by Stripe. Plans are charged in US dollars.</span></li>
            <li><b>Your plan starts</b><span>As soon as the payment goes through. Cancel any time from your workspace.</span></li>
          </ol> : instant ? <ol>
            <li><b>Your workspace opens</b><span>Created in seconds with your company name, ready to use.</span></li>
            <li><b>You see how to pay</b><span>The amount for your plan and the payment details, on one page.</span></li>
            <li><b>Your plan starts</b><span>As soon as we confirm the payment. Nothing you add in the meantime is lost.</span></li>
          </ol> : <ol>
            <li><b>Invoice</b><span>We send an invoice for the plan and billing period you chose.</span></li>
            <li><b>Setup</b><span>Once it is paid, we set up your workspace with your name, logo and colours.</span></li>
            <li><b>Onboarding</b><span>You get your login and a walkthrough for your team.</span></li>
          </ol>}
        </aside>
      </div>
    </div>
  );
}
