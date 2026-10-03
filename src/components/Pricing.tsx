"use client";
import Link from "next/link";
import { useState } from "react";
import { PLANS, PLAN_IDS, MAIN_PLAN, perOf, type Billing } from "@/lib/site";
import { CURRENCIES, CURRENCY_CODES, money, moneyYear, rateNote, type CurrencyCode } from "@/lib/currency";

export default function Pricing({ currency: initial = "USD" }: { currency?: CurrencyCode }) {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [cur, setCur] = useState<CurrencyCode>(initial);
  return (
    <div>
      <div className="bill-row">
        <div className="bill" role="group" aria-label="Billing period">
          <button type="button" aria-pressed={billing === "monthly"} onClick={() => setBilling("monthly")}>Monthly</button>
          <button type="button" aria-pressed={billing === "annual"} onClick={() => setBilling("annual")}>Annual</button>
        </div>
        <span className="bill-save">2 months free with annual billing</span>
        <label className="cur-pick"><span>Currency</span><select value={cur} onChange={(e) => setCur(e.target.value as CurrencyCode)} aria-label="Currency">{CURRENCY_CODES.map((c) => <option key={c} value={c}>{c} · {CURRENCIES[c].label}</option>)}</select></label>
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
                <b>{billing === "annual" ? moneyYear(p.monthly, cur) : money(p.monthly, cur)}</b><span>per {perOf(billing)}</span>
              </p>
              <p className="plan-alt">{billing === "annual" ? `Same as ${money(p.monthly, cur)} a month for ten months` : `or ${moneyYear(p.monthly, cur)} per year`}</p>
              <Link href={`/subscribe?plan=${id}&billing=${billing}&currency=${cur}`} className={`btn ${main ? "btn-primary" : "btn-ghost"}`}>Choose {p.name}</Link>
              <p className="plan-intro">{p.intro}</p>
              <ul className="ticks">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
              {p.without.length ? <ul className="nots">{p.without.map((f) => <li key={f}>{f}</li>)}</ul> : null}
            </article>
          );
        })}
      </div>
      {cur !== "USD" ? <p className="rate-note">{rateNote(cur)}</p> : null}
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
