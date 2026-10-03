import type { Metadata } from "next";
import Link from "next/link";
import StartForm from "@/components/StartForm";
import { instantEnabled, TRIAL_DAYS } from "@/lib/instant";

export const metadata: Metadata = { title: "Start your free demo", description: "Get your own Toursside workspace in seconds, with your company name and colours and sample orders to try.", alternates: { canonical: "/start" } };
export const dynamic = "force-dynamic";

export default function Start() {
  if (!instantEnabled()) return (
    <div className="wrap"><div className="page-head" style={{ paddingBottom: 120 }}>
      <h1>Instant demos open soon</h1>
      <p className="lede">For now we set up each demo by hand. Tell us about your business and we'll show you Toursside.</p>
      <div className="cta-row"><Link href="/demo" className="btn btn-primary">Book a demo</Link></div>
    </div></div>
  );
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Start your free demo</h1>
        <p className="lede">Your own Toursside workspace, with your name and colours, ready in seconds. Free for {TRIAL_DAYS} days.</p>
      </div>
      <div className="form-grid">
        <StartForm />
        <aside className="aside">
          <h2>What you get</h2>
          <ol>
            <li><b>Your own address</b><span>A private workspace at yourcompany.toursside.com.</span></li>
            <li><b>Sample orders to try</b><span>Orders, inquiries and a partner request are already there, so nothing is empty.</span></li>
            <li><b>{TRIAL_DAYS} days to explore</b><span>Choose a plan when you're ready and keep everything you've added.</span></li>
          </ol>
        </aside>
      </div>
    </div>
  );
}
