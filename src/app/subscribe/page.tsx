import type { Metadata } from "next";
import SubscribeFlow from "@/components/SubscribeFlow";
import { visitorCurrency } from "@/lib/visitor";
import { PLANS, MAIN_PLAN, type PlanId, type Billing } from "@/lib/site";

export const metadata: Metadata = { title: "Subscribe", description: "Start a Toursside subscription. Choose Starter, Growth or Business and tell us about your travel business.", alternates: { canonical: "/subscribe" } };

export default async function Subscribe({ searchParams }: { searchParams: Promise<{ plan?: string; billing?: string; currency?: string }> }) {
  const { plan, billing, currency } = await searchParams;
  const cur = await visitorCurrency(currency);
  const initial: PlanId = plan && plan in PLANS ? (plan as PlanId) : MAIN_PLAN;
  const initialBilling: Billing = billing === "monthly" ? "monthly" : "annual";
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Start your subscription</h1>
        <p className="lede">Three short steps. You are not charged on this page.</p>
      </div>
      <div className="form-grid">
        <SubscribeFlow initialPlan={initial} initialBilling={initialBilling} currency={cur} />
        <aside className="aside">
          <h2>After you send it</h2>
          <ol>
            <li><b>Invoice</b><span>We send an invoice for the plan and billing period you chose.</span></li>
            <li><b>Setup</b><span>Once it is paid, we set up your workspace with your name, logo and colours.</span></li>
            <li><b>Onboarding</b><span>You get your login and a walkthrough for your team.</span></li>
          </ol>
        </aside>
      </div>
    </div>
  );
}
