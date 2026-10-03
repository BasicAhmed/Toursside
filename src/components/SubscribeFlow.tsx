"use client";
import { useEffect, useState } from "react";
import Field from "./Field";
import { Sent, ViaWhatsApp } from "./Result";
import { useRequest } from "./useRequest";
import { PLANS, PLAN_IDS, priceOf, perOf, type PlanId, type Billing } from "@/lib/site";
import { planLine } from "@/lib/requests";
import { money, moneyYear, rateNote, type CurrencyCode } from "@/lib/currency";

const STEPS = ["Plan", "Your business", "Review and send"];
const TEAM = ["Just me", "2 to 5", "6 to 15", "16 to 50", "More than 50"];

export default function SubscribeFlow({ initialPlan, initialBilling, currency = "USD", instant = false }: { initialPlan: PlanId; initialBilling: Billing; currency?: CurrencyCode; instant?: boolean }) {
  const r = useRequest("subscribe", { plan: initialPlan, billing: initialBilling, currency, company: "", name: "", email: "", phone: "", country: "", team: "", website: "", notes: "" });
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState(""); const [pwErr, setPwErr] = useState(""); const [creating, setCreating] = useState<"" | "busy" | "open">(""); const [createErr, setCreateErr] = useState("");
  // With instant workspaces on: create the company's workspace now, with the plan attached, and open it on "how to pay".
  const create = async () => {
    setCreating("busy"); setCreateErr("");
    try {
      const res = await fetch("/api/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ company: v.company, name: v.name, email: v.email, phone: v.phone, password, plan: v.plan, billing: v.billing, currency, website_url: hp }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok && data.loginUrl) { setCreating("open"); window.location.assign(data.loginUrl); return; }
      // Could not create it right now: send the order to the team instead, so it is not lost.
      if (data.code === "NOT_CONFIGURED" || data.code === "FAILED" || data.code === "FULL") { setCreating(""); r.send(hp); return; }
      setCreateErr(data.errors ? Object.values(data.errors as Record<string, string>).join(". ") : data.message || "We couldn't create your workspace just now."); setCreating("");
    } catch { setCreating(""); r.send(hp); }
  };
  const [hp, setHp] = useState("");
  const { values: v, errors: e, set } = r;
  useEffect(() => { document.getElementById(r.status === "sent" || r.status === "whatsapp" ? "result" : "step-title")?.focus(); }, [step, r.status]);

  if (creating === "open") return (
    <div className="panel result" role="status"><h2>Your workspace is ready</h2><p>Opening {v.company.trim()} now, on the page that shows how to pay for your plan.</p></div>
  );
  if (r.status === "sent") return (
    <Sent title="Subscription request sent">
      <p>You have not been charged. We'll send an invoice for your first {perOf(v.billing as Billing)} to {v.email}. Once it is paid we set up your Toursside workspace and send your login.</p>
    </Sent>
  );
  if (r.status === "whatsapp") return <ViaWhatsApp url={r.whatsappUrl} what="subscription request" onBack={() => r.setStatus("idle")} />;

  const next = () => {
    if (step === 1) { const ok = r.check(["company", "name", "email", "phone", "country"]); const pw = !instant || password.length >= 8; setPwErr(pw ? "" : "Use at least 8 characters"); if (!ok || !pw) return; }
    setStep((s) => s + 1);
  };

  return (
    <form className="panel" noValidate onSubmit={(ev) => { ev.preventDefault(); if (step < 2) next(); else if (instant) create(); else r.send(hp); }}>
      <ol className="steps" aria-label="Progress">
        {STEPS.map((s, i) => <li key={s} className={i < step ? "done" : ""} aria-current={i === step ? "step" : undefined}>{i + 1}. {s}</li>)}
      </ol>
      <h2 id="step-title" tabIndex={-1} style={{ fontSize: "1.6rem", marginBottom: 18, outline: 0 }}>
        {["Choose your plan", "Tell us about your business", "Check your order"][step]}
      </h2>

      {step === 0 && (
        <>
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="sr">Plan</legend>
            <div className="choice three">
              {PLAN_IDS.map((id) => (
                <label key={id}>
                  <input type="radio" name="plan" value={id} checked={v.plan === id} onChange={() => set("plan", id)} />
                  <b>{PLANS[id].name}</b>
                  <span className="p">{v.billing === "annual" ? moneyYear(PLANS[id].monthly, currency) : money(PLANS[id].monthly, currency)} <small>per {perOf(v.billing as Billing)}</small></span>
                  <span>{PLANS[id].target}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="step-sub">Billing</legend>
            <div className="choice">
              {(["monthly", "annual"] as Billing[]).map((b) => (
                <label key={b}>
                  <input type="radio" name="billing" value={b} checked={v.billing === b} onChange={() => set("billing", b)} />
                  <b>{b === "monthly" ? "Monthly" : "Annual"}</b>
                  <span>{b === "monthly" ? "Billed every month" : "Billed once a year, two months free"}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </>
      )}

      {step === 1 && (
        <div className="fields two">
          <Field id="company" label="Company" value={v.company} error={e.company} onChange={(x) => set("company", x)} autoComplete="organization" />
          <Field id="name" label="Your name" value={v.name} error={e.name} onChange={(x) => set("name", x)} autoComplete="name" />
          <Field id="email" label="Work email" type="email" inputMode="email" value={v.email} error={e.email} onChange={(x) => set("email", x)} autoComplete="email" />
          <Field id="phone" label="Phone or WhatsApp" type="tel" inputMode="tel" value={v.phone} error={e.phone} onChange={(x) => set("phone", x)} autoComplete="tel" placeholder="+20 100 000 0000" />
          <Field id="country" label="Country" value={v.country} error={e.country} onChange={(x) => set("country", x)} autoComplete="country-name" />
          <Field id="team" label="People who will use it" optional options={TEAM} value={v.team} onChange={(x) => set("team", x)} />
          {instant ? <Field id="password" label="Choose a password for your workspace" type="password" full value={password} error={pwErr} onChange={(x) => { setPassword(x); setPwErr(""); }} autoComplete="new-password" placeholder="At least 8 characters" /> : null}
          <Field id="website" label="Current website" optional full inputMode="url" value={v.website} onChange={(x) => set("website", x)} placeholder="yourcompany.com" />
          <Field id="notes" label="Anything we should know" optional textarea full value={v.notes} error={e.notes} onChange={(x) => set("notes", x)} />
        </div>
      )}

      {step === 2 && (
        <>
          <dl className="summary">
            <div><dt>Plan</dt><dd>{planLine(v.plan, v.billing, currency)}</dd></div>
            <div><dt>Company</dt><dd>{v.company}</dd></div>
            <div><dt>Contact</dt><dd>{v.name}</dd></div>
            <div><dt>Email</dt><dd>{v.email}</dd></div>
            <div><dt>Phone</dt><dd>{v.phone}</dd></div>
            <div><dt>Country</dt><dd>{v.country}</dd></div>
          </dl>
          {currency !== "USD" ? <p className="rate-note" style={{ margin: "0 0 12px" }}>{rateNote(currency)}</p> : null}
          {instant
            ? <p className="notice">You are not charged now. Your workspace is created straight away and opens on a page that shows how to pay. Your plan starts when the payment is confirmed, and you can use the workspace in the meantime.</p>
            : <p className="notice">Card payment on this page is not open yet. Sending this order does not charge you. We reply with an invoice for the plan you chose, and your workspace is set up once it is paid.</p>}
          {createErr ? <p className="notice" role="alert">{createErr}</p> : null}
          <div className="hp" aria-hidden="true"><label>Leave this empty<input tabIndex={-1} autoComplete="off" value={hp} onChange={(x) => setHp(x.target.value)} /></label></div>
        </>
      )}

      <div className="form-foot">
        {step > 0 ? <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>Back</button> : <small>{instant ? "Already trying Toursside? Open your workspace and choose your plan there, so everything stays in one place." : "You can change plan later. Need custom integrations or high volume? Ask about Enterprise."}</small>}
        <button className="btn btn-primary" disabled={r.status === "sending" || creating === "busy"}>
          {step === 0 ? "Continue to your details" : step === 1 ? "Review your order" : creating === "busy" ? "Creating your workspace" : r.status === "sending" ? "Sending order" : instant ? "Create my workspace" : "Send subscription request"}
        </button>
      </div>
    </form>
  );
}
