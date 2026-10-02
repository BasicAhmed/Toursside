import type { Metadata } from "next";
import SubscribeFlow from "@/components/SubscribeFlow";
import { PLANS, type PlanId } from "@/lib/site";

export const metadata: Metadata = { title: "Subscribe", description: "Start a Toursside subscription. Choose monthly or annual billing and tell us about your travel business.", alternates: { canonical: "/subscribe" } };

export default async function Subscribe({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  const initial: PlanId = plan && plan in PLANS ? (plan as PlanId) : "annual";
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Start your subscription</h1>
        <p className="lede">Three short steps. You are not charged on this page.</p>
      </div>
      <div className="form-grid">
        <SubscribeFlow initialPlan={initial} />
        <aside className="aside">
          <h2>After you send it</h2>
          <ol>
            <li><b>Invoice</b><span>We confirm your price and send an invoice for the first period.</span></li>
            <li><b>Setup</b><span>Once it is paid, we set up your workspace with your name, logo and colours.</span></li>
            <li><b>Onboarding</b><span>You get your login and a walkthrough for your team.</span></li>
          </ol>
        </aside>
      </div>
    </div>
  );
}
