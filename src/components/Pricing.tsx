"use client";
import Link from "next/link";
import { useState } from "react";
import { PLANS, PLAN_IDS, MAIN_PLAN, perOf, priceOf, type Billing } from "@/lib/site";

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  return (
    <div>
      <div className="bill-row">
        <div className="bill" role="group" aria-label="Billing period">
          <button type="button" aria-pressed={billing === "monthly"} onClick={() => setBilling("monthly")}>Monthly</button>
          <button type="button" aria-pressed={billing === "annual"} onClick={() => setBilling("annual")}>Annual</button>
        </div>
        <span className="bill-save">2 months free with annual billing</span>
      </div>
      <div className="plans">
        {PLAN_IDS.map((id) => {
          const p = PLANS[id], main = id === MAIN_PLAN;
          return (
            <article key={id} className={`plan${main ? " main" : ""}`} aria-label={`${p.name} plan`}>
              {main ? <span className="plan-flag">Recommended</span> : null}
              <h3>{p.name}</h3>
              <p className="plan-for">{p.target}</p>
              <p className="plan-price" aria-live="polite">
                <b>${priceOf(id, billing).toLocaleString("en-US")}</b><span>per {perOf(billing)}</span>
              </p>
              <p className="plan-alt">{billing === "annual" ? `Same as $${p.monthly} a month for ten months` : `or $${p.annual.toLocaleString("en-US")} per year`}</p>
              <Link href={`/subscribe?plan=${id}&billing=${billing}`} className={`btn ${main ? "btn-primary" : "btn-ghost"}`}>Choose {p.name}</Link>
              <p className="plan-intro">{p.intro}</p>
              <ul className="ticks">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
              {p.without.length ? <ul className="nots">{p.without.map((f) => <li key={f}>{f}</li>)}</ul> : null}
            </article>
          );
        })}
      </div>
      <div className="enterprise">
        <div>
          <h3>Enterprise</h3>
          <p>Custom pricing for high-volume operations and custom integrations.</p>
        </div>
        <Link href="/demo" className="btn btn-ghost">Talk to us</Link>
      </div>
    </div>
  );
}
