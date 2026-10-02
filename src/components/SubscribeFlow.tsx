"use client";
import { useEffect, useState } from "react";
import Field from "./Field";
import { Sent, ViaWhatsApp } from "./Result";
import { useRequest } from "./useRequest";
import { PLANS, type PlanId } from "@/lib/site";
import { planLine } from "@/lib/requests";

const STEPS = ["Billing", "Your business", "Review and send"];
const TEAM = ["Just me", "2 to 5", "6 to 15", "16 to 50", "More than 50"];

export default function SubscribeFlow({ initialPlan }: { initialPlan: PlanId }) {
  const r = useRequest("subscribe", { plan: initialPlan, company: "", name: "", email: "", phone: "", country: "", team: "", website: "", notes: "" });
  const [step, setStep] = useState(0);
  const [hp, setHp] = useState("");
  const { values: v, errors: e, set } = r;
  useEffect(() => { document.getElementById(r.status === "sent" || r.status === "whatsapp" ? "result" : "step-title")?.focus(); }, [step, r.status]);

  if (r.status === "sent") return (
    <Sent title="Subscription request sent">
      <p>You have not been charged. We'll send an invoice for your first {PLANS[v.plan as PlanId].per} to {v.email}. Once it is paid we set up your Toursside workspace and send your login.</p>
    </Sent>
  );
  if (r.status === "whatsapp") return <ViaWhatsApp url={r.whatsappUrl} what="subscription request" onBack={() => r.setStatus("idle")} />;

  const next = () => { if (step === 1 && !r.check(["company", "name", "email", "phone", "country"])) return; setStep((s) => s + 1); };

  return (
    <form className="panel" noValidate onSubmit={(ev) => { ev.preventDefault(); if (step < 2) next(); else r.send(hp); }}>
      <ol className="steps" aria-label="Progress">
        {STEPS.map((s, i) => <li key={s} className={i < step ? "done" : ""} aria-current={i === step ? "step" : undefined}>{i + 1}. {s}</li>)}
      </ol>
      <h2 id="step-title" tabIndex={-1} style={{ fontSize: "1.6rem", marginBottom: 18, outline: 0 }}>
        {["Choose how you want to pay", "Tell us about your business", "Check your order"][step]}
      </h2>

      {step === 0 && (
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="sr">Billing period</legend>
          <div className="choice">
            {(Object.keys(PLANS) as PlanId[]).map((id) => (
              <label key={id}>
                <input type="radio" name="plan" value={id} checked={v.plan === id} onChange={() => set("plan", id)} />
                <b>{PLANS[id].label}</b>
                <span className="p">${PLANS[id].price} <small>per {PLANS[id].per}</small></span>
                <span>Starting price. {PLANS[id].note}.</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {step === 1 && (
        <div className="fields two">
          <Field id="company" label="Company" value={v.company} error={e.company} onChange={(x) => set("company", x)} autoComplete="organization" />
          <Field id="name" label="Your name" value={v.name} error={e.name} onChange={(x) => set("name", x)} autoComplete="name" />
          <Field id="email" label="Work email" type="email" inputMode="email" value={v.email} error={e.email} onChange={(x) => set("email", x)} autoComplete="email" />
          <Field id="phone" label="Phone or WhatsApp" type="tel" inputMode="tel" value={v.phone} error={e.phone} onChange={(x) => set("phone", x)} autoComplete="tel" placeholder="+20 100 000 0000" />
          <Field id="country" label="Country" value={v.country} error={e.country} onChange={(x) => set("country", x)} autoComplete="country-name" />
          <Field id="team" label="People who will use it" optional options={TEAM} value={v.team} onChange={(x) => set("team", x)} />
          <Field id="website" label="Current website" optional full inputMode="url" value={v.website} onChange={(x) => set("website", x)} placeholder="yourcompany.com" />
          <Field id="notes" label="Anything we should know" optional textarea full value={v.notes} error={e.notes} onChange={(x) => set("notes", x)} />
        </div>
      )}

      {step === 2 && (
        <>
          <dl className="summary">
            <div><dt>Plan</dt><dd>{planLine(v.plan)}</dd></div>
            <div><dt>Company</dt><dd>{v.company}</dd></div>
            <div><dt>Contact</dt><dd>{v.name}</dd></div>
            <div><dt>Email</dt><dd>{v.email}</dd></div>
            <div><dt>Phone</dt><dd>{v.phone}</dd></div>
            <div><dt>Country</dt><dd>{v.country}</dd></div>
          </dl>
          <p className="notice">Card payment on this page is not open yet. Sending this order does not charge you. We reply with an invoice that confirms your price, and your workspace is set up once it is paid.</p>
          <div className="hp" aria-hidden="true"><label>Leave this empty<input tabIndex={-1} autoComplete="off" value={hp} onChange={(x) => setHp(x.target.value)} /></label></div>
        </>
      )}

      <div className="form-foot">
        {step > 0 ? <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>Back</button> : <small>The final price depends on your team size and booking volume. We confirm it before you pay.</small>}
        <button className="btn btn-primary" disabled={r.status === "sending"}>
          {step === 0 ? "Continue to your details" : step === 1 ? "Review your order" : r.status === "sending" ? "Sending order" : "Send subscription request"}
        </button>
      </div>
    </form>
  );
}
