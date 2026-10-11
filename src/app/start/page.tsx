import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import StartForm from "@/components/StartForm";
import { instantEnabled, TRIAL_DAYS } from "@/lib/instant";

export const metadata: Metadata = pageMeta({ title: "Start your free demo", description: "Get your own Toursside workspace in seconds, with your company name and colours and sample orders to try.", path: "/start" });
export const dynamic = "force-dynamic";

export default function Start() {
  if (!instantEnabled()) return (
    <div className="wrap"><div className="page-head" style={{ paddingBottom: 120 }}>
      <h1 className="duo md"><span className="thin">Instant demos</span><span className="bold">open soon.</span></h1>
      <p className="lede">For now we set up each demo by hand. Tell us about your business and we'll show you Toursside.</p>
      <div className="cta-row"><Link href="/demo" className="btn btn-primary">Book a demo</Link></div>
    </div></div>
  );
  return (
    <div className="wrap wz-page">
      <div className="page-head">
        <h1 className="duo md"><span className="thin">Your workspace,</span><span className="bold">ready in seconds.</span></h1>
        <p className="lede">Your own Toursside workspace with your name and colours, filled with sample orders. <b>Free for {TRIAL_DAYS} days.</b></p>
      </div>
      <StartForm trialDays={TRIAL_DAYS} />
      <aside className="aside wz-aside">
        <h2>What you get</h2>
        <ol>
          <li><b>Your own address</b><span>A private workspace at yourcompany.toursside.com.</span></li>
          <li><b>Sample orders to try</b><span>Orders, inquiries and a partner request are already there, so nothing is empty.</span></li>
          <li><b>{TRIAL_DAYS} days to explore</b><span>Choose a plan when you're ready and keep everything you've added.</span></li>
        </ol>
      </aside>
    </div>
  );
}
