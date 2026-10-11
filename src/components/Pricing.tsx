"use client";
import Link from "next/link";
import { useState } from "react";
import { PLANS, PLAN_IDS, MAIN_PLAN, perOf, type Billing } from "@/lib/site";
import { CURRENCIES, CURRENCY_CODES, money, moneyYear, rateNote, type CurrencyCode } from "@/lib/currency";

// One boarding pass per plan: what it is for and what it includes on the left, the fare and the button on the stub.
const LEG: Record<string, string> = { starter: "Up and running", growth: "The complete platform", business: "Larger teams and DMCs" };

export default function Pricing({ currency: initial = "USD", card = false }: { currency?: CurrencyCode; card?: boolean }) {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [cur, setCur] = useState<CurrencyCode>(initial);
  const yearly = billing === "annual";
  return (
    <div>
      <div className="bill-row">
        <div className="bill" role="group" aria-label="Billing period">
          <button type="button" aria-pressed={!yearly} onClick={() => setBilling("monthly")}>Monthly</button>
          <button type="button" aria-pressed={yearly} onClick={() => setBilling("annual")}>Yearly</button>
        </div>
        <span className="bill-save">Two months free when you pay yearly</span>
        <label className="cur-pick"><span>Currency</span><select value={cur} onChange={(e) => setCur(e.target.value as CurrencyCode)}>{CURRENCY_CODES.map((c) => <option key={c} value={c}>{c} · {CURRENCIES[c].label}</option>)}</select></label>
      </div>
      <div className="passes">
        {PLAN_IDS.map((id) => {
          const p = PLANS[id], main = id === MAIN_PLAN;
          return (
            <article key={id} className={`pass${main ? " main" : ""}`} aria-label={`${p.name} plan`}>
              <div className="pass-body">
                <p className="pass-leg" aria-hidden="true"><span>Your agency</span><i /><span>{LEG[id] ?? p.intro}</span></p>
                <div className="pass-name"><h3>{p.name}</h3><p>{p.target}</p>{main ? <span className="tag">Recommended</span> : null}</div>
                <div>
                  <p className="inc-h">{p.intro}</p>
                  <ul className="inc">
                    {p.features.map((f) => <li key={f}>{f}</li>)}
                    {p.without.map((f) => <li key={f} className="no">{f}</li>)}
                  </ul>
                </div>
              </div>
              <div className="stub">
                <div className="fare" aria-live="polite">
                  <small>{p.name} fare</small>
                  <b>{yearly ? moneyYear(p.monthly, cur) : money(p.monthly, cur)}</b> <span>a {perOf(billing)}</span>
                  <p className="alt">{yearly ? `Same as ${money(p.monthly, cur)} a month for ten months` : `or ${moneyYear(p.monthly, cur)} a year`}</p>
                </div>
                <div className="barcode" aria-hidden="true" />
                <Link href={`/subscribe?plan=${id}&billing=${billing}&currency=${cur}`} className={`btn ${main ? "btn-primary" : "btn-ghost"}`}>Choose {p.name}</Link>
              </div>
            </article>
          );
        })}
      </div>
      {cur !== "USD" ? <p className="rate-note">{rateNote(cur)}</p> : null}
      {card ? <p className="rate-note">Pay by card on a secure page run by Stripe. {cur !== "USD" ? "Your card is charged in US dollars. " : ""}Cancel any time.</p> : null}
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
