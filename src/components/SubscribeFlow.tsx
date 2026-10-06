"use client";
import WorkspaceBuilder, { type Box } from "./WorkspaceBuilder";
import { useEffect, useRef, useState } from "react";
import { Sent, ViaWhatsApp } from "./Result";
import { useRequest } from "./useRequest";
import { PLANS, PLAN_IDS, priceOf, perOf, type PlanId, type Billing } from "@/lib/site";
import { planLine } from "@/lib/requests";
import { CURRENCIES, localAmount, money, moneyYear, rateNote, type CurrencyCode } from "@/lib/currency";
import { COMPANY_MAX, previewSlug } from "@/lib/slug";
import LivePreview, { handoffBox } from "./wizard/LivePreview";
import { Wizard, Step, Field, Chips, Suggest, Strength, Count, TickIcon, emailHelp } from "./wizard/kit";
import { useWizard, useSaved, forget, readFields } from "./wizard/useWizard";

const NAMES = ["Plan", "Your business", "Your details", "Review and send"];
const TEAM = ["Just me", "2 to 5", "6 to 15", "16 to 50", "More than 50"];
const KEY = "ts-wizard-subscribe";
const STEP_OF: Record<string, number> = { plan: 0, billing: 0, company: 1, country: 1, team: 1, name: 2, email: 2, phone: 2, password: 2, website: 3, notes: 3 };
const NEED = [["plan", "billing"], ["company", "country"], ["name", "email", "phone"], ["website", "notes"]];
const TEXT = ["company", "country", "name", "email", "phone"];
// Where each currency is used, offered as a one-tap suggestion for the country field (never filled in for them).
const HOME: Partial<Record<CurrencyCode, string>> = { QAR: "Qatar", AED: "United Arab Emirates", SAR: "Saudi Arabia", BHD: "Bahrain", OMR: "Oman", KWD: "Kuwait", EGP: "Egypt", GBP: "United Kingdom" };
const COUNTRIES = ["Egypt", "Saudi Arabia", "United Arab Emirates", "Qatar"];

// The price shown for a plan, as a number (for the count-up) and as the exact text the rest of the site uses.
const yearLocal = (monthlyUsd: number, c: CurrencyCode) => Math.round(localAmount(monthlyUsd, c) * 10 * 10) / 10;
const fmt = (c: CurrencyCode) => (n: number) => CURRENCIES[c].prefix + n.toLocaleString("en-US", { maximumFractionDigits: 1 });
const amount = (plan: PlanId, billing: Billing, c: CurrencyCode) => (billing === "annual" ? yearLocal(PLANS[plan].monthly, c) : localAmount(PLANS[plan].monthly, c));
/** What a year costs paying monthly, minus what the annual plan costs: the real saving, in the currency shown. */
export const savingOf = (plan: PlanId, c: CurrencyCode) => Math.round((localAmount(PLANS[plan].monthly, c) * 12 - yearLocal(PLANS[plan].monthly, c)) * 10) / 10;
const monthsFree = (plan: PlanId) => Math.round(((PLANS[plan].monthly * 12 - PLANS[plan].annual) / PLANS[plan].monthly) * 10) / 10;

export default function SubscribeFlow({ initialPlan, initialBilling, currency = "USD", instant = false, card = false }: { initialPlan: PlanId; initialBilling: Billing; currency?: CurrencyCode; instant?: boolean; card?: boolean }) {
  const r = useRequest("subscribe", { plan: initialPlan, billing: initialBilling, currency, company: "", name: "", email: "", phone: "", country: "", team: "", website: "", notes: "" });
  const wz = useWizard(NAMES.length);
  const [password, setPassword] = useState(""); const [pwErr, setPwErr] = useState(""); const [creating, setCreating] = useState(false); const [createErr, setCreateErr] = useState(""); const [openUrl, setOpenUrl] = useState("");
  const [hp, setHp] = useState(""); const [from, setFrom] = useState<Box | null>(null); const [more, setMore] = useState(false);
  const lock = useRef(false), app = useRef<HTMLDivElement>(null), strip = useRef<HTMLDivElement>(null);
  const { values: v, errors: e, set } = r;
  const plan = v.plan as PlanId, billing = v.billing as Billing, P = PLANS[plan] ?? PLANS[initialPlan];

  useSaved(KEY, { v, step: wz.step }, (saved) => {
    const got: Record<string, string> = { ...v, ...Object.fromEntries(Object.entries(saved?.v ?? {}).filter(([k, x]) => k in v && typeof x === "string")), currency };
    // A plan or billing period named in the link wins over an older answer.
    const q = new URLSearchParams(window.location.search);
    if (q.get("plan") || !(got.plan in PLANS)) got.plan = initialPlan;
    if (q.get("billing") || (got.billing !== "monthly" && got.billing !== "annual")) got.billing = initialBilling;
    r.setValues(got);
    let ok = 0; while (ok < NEED.length - 1 && NEED[ok].every((k) => !r.errorOf(k, got))) ok++;
    wz.restore(Math.min(Number(saved?.step) || 0, instant ? Math.min(ok, 2) : ok)); // the password is never kept, so its step comes back
  });
  useEffect(() => { const dom = readFields(wz.root.current, TEXT); r.setValues((s) => { const n = { ...s }; for (const k of TEXT) if (dom[k] && !n[k]) n[k] = dom[k]; return n; }); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  useEffect(() => { if (r.status === "sent" || r.status === "whatsapp") { document.getElementById("result")?.focus(); if (r.status === "sent") forget(KEY); } }, [r.status]);

  const jump = (k: string | null) => { if (k) wz.go(STEP_OF[k] ?? wz.step, `f-${k}`); };
  // With instant workspaces on: create the company's workspace now, with the plan attached. It opens on "how to pay",
  // or, when the product takes cards (card), on Stripe's payment page for that plan.
  const create = async (now: Record<string, string>, pw: string) => {
    if (lock.current) return;
    const bad = r.check(undefined, now); if (bad) return jump(bad);
    if (pw.length < 8) { setPwErr("Use at least 8 characters"); return jump("password"); }
    lock.current = true;
    setFrom(handoffBox(app.current, strip.current));
    setCreating(true); setCreateErr(""); (document.activeElement as HTMLElement | null)?.blur?.();
    try {
      const res = await fetch("/api/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ company: now.company, name: now.name, email: now.email, phone: now.phone, password: pw, plan: now.plan, billing: now.billing, currency, website_url: hp }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok && data.loginUrl) { forget(KEY); setOpenUrl(data.loginUrl); return; } // stay locked: the film is playing
      lock.current = false; setCreating(false);
      // Could not create it right now: send the order to the team instead, so it is not lost.
      if (data.code === "NOT_CONFIGURED" || data.code === "FAILED" || data.code === "FULL") { jump(await r.send(hp, now)); return; }
      if (data.errors) { const errs = { ...(data.errors as Record<string, string>) }; if (errs.password) { setPwErr(errs.password); delete errs.password; } r.setErrors(errs); return jump(Object.keys(data.errors)[0]); }
      const m: string = data.message || "We couldn't create your workspace just now.";
      const k = data.code === "TAKEN" || /company|name is already/i.test(m) ? "company" : /password/i.test(m) ? "password" : /email/i.test(m) ? "email" : "";
      if (k === "password") { setPwErr(m); jump(k); } else if (k) { r.setErrors({ [k]: m }); jump(k); } else setCreateErr(m);
    } catch { lock.current = false; setCreating(false); jump(await r.send(hp, now)); }
  };

  if (r.status === "sent") return (
    <Sent title="Subscription request sent">
      <p>You have not been charged. We'll send an invoice for your first {perOf(billing)} to {v.email}. Once it is paid we set up your Toursside workspace and send your login.</p>
    </Sent>
  );
  if (r.status === "whatsapp") return <ViaWhatsApp url={r.whatsappUrl} what="subscription request" onBack={() => r.setStatus("idle")} />;

  const pwOk = !instant || password.length >= 8;
  const ready = NEED[wz.step].every((k) => !r.errorOf(k)) && (wz.step !== 2 || pwOk);
  const submit = async () => {
    const dom = readFields(wz.root.current, [...TEXT, "password"]);
    const now = { ...v }; for (const k of TEXT) if (dom[k] && dom[k] !== now[k]) now[k] = dom[k];
    if (TEXT.some((k) => now[k] !== v[k])) r.setValues(now);
    const pw = instant && dom.password && dom.password !== password ? dom.password : password; if (pw !== password) setPassword(pw);
    if (wz.step < NAMES.length - 1) {
      const bad = r.check(NEED[wz.step], now);
      const pwBad = wz.step === 2 && instant && pw.length < 8; setPwErr(pwBad ? "Use at least 8 characters" : "");
      if (bad) jump(bad); else if (pwBad) jump("password"); else wz.next();
      return;
    }
    if (instant) await create(now, pw); else jump(await r.send(hp, now));
  };

  const field = (k: string) => ({ value: v[k], error: e[k], ok: !!v[k].trim() && !r.errorOf(k), onChange: (x: string) => set(k, x), onBlur: () => { if (v[k].trim()) r.flag(k); } });
  const price = <Count value={amount(plan, billing, currency)} text={fmt(currency)} />;
  const save = savingOf(plan, currency);
  const places = [...new Set([HOME[currency], ...COUNTRIES].filter(Boolean) as string[])].filter((c) => c !== v.country.trim()).slice(0, 4);
  const busy = r.status === "sending" || creating;

  const side = (
    <div className="wz-side">
      <LivePreview company={v.company} primary="#102A43" accent="#FF8A3D" address={instant} typing={wz.step === 1} gone={creating} appRef={app} stripRef={strip}
        extra={<><b>{P.name}</b> {price} <small>per {perOf(billing)}</small></>} />
      <section className="pp" aria-label={`What ${P.name} includes`}>
        <h2><span>{P.name}</span><span className="pp-price">{price}<small> per {perOf(billing)}</small></span></h2>
        <p className="pp-intro">{P.intro}</p>
        <ul key={plan}>
          {P.features.map((f, i) => <li key={f} style={{ ["--i" as string]: i }}><TickIcon />{f}</li>)}
          {P.without.map((f) => <li key={f} className="no"><span aria-hidden="true">–</span>{f}</li>)}
        </ul>
      </section>
    </div>
  );

  return (
    <>
      {creating ? <WorkspaceBuilder company={v.company} ready={!!openUrl} from={from} onDone={() => window.location.assign(openUrl)}
        after={card ? "Opening the secure payment page now." : "Opening it on the page that shows how to pay for your plan."} /> : null}
      <Wizard wz={wz} names={NAMES} onSubmit={submit} busy={busy} ready={ready} side={side}
        label={wz.step === 0 ? `Continue with ${P.name}` : wz.step === 1 ? "Next" : wz.step === 2 ? "Review your order" : creating ? "Creating your workspace" : r.status === "sending" ? "Sending order" : instant ? "Create my workspace" : "Send subscription request"}
        after={<div className="hp" aria-hidden="true"><label>Leave this empty<input tabIndex={-1} autoComplete="off" value={hp} onChange={(x) => setHp(x.target.value)} /></label></div>}
        note={wz.step === 0 ? <small>{currency !== "USD" ? <>{rateNote(currency)} </> : null}{instant ? "Already trying Toursside? Open your workspace and choose your plan there, so everything stays in one place." : "You can change plan later. Need custom integrations or high volume? Ask about Enterprise."}</small> : null}>

        <Step wz={wz} index={0} title="Choose your plan" sub="You are not charged on this page.">
          <fieldset className="wz-bill" id="f-billing" tabIndex={-1}>
            <legend className="sr">Billing</legend>
            {(["monthly", "annual"] as Billing[]).map((b) => (
              <label key={b}>
                <input type="radio" name="billing" value={b} checked={billing === b} tabIndex={wz.step === 0 ? undefined : -1} onChange={() => set("billing", b)} />
                <span><b>{b === "monthly" ? "Monthly" : "Annual"}</b><small>{b === "monthly" ? "Billed every month" : `Billed once a year, ${monthsFree(plan) === 2 ? "two" : monthsFree(plan)} months free`}</small></span>
              </label>
            ))}
          </fieldset>
          <p className={`wz-bill-save${billing === "annual" ? " on" : ""}`} aria-live="polite">
            {billing === "annual" ? <>You save <b>{fmt(currency)(save)}</b> a year on {P.name}, compared with paying monthly.</> : <>Pay yearly and save <b>{fmt(currency)(save)}</b> a year on {P.name}.</>}
          </p>
          <fieldset className="wz-plans" id="f-plan" tabIndex={-1}>
            <legend className="sr">Plan</legend>
            {PLAN_IDS.map((id) => (
              <label key={id} className="wz-plan" data-plan={id}>
                <input type="radio" name="plan" value={id} checked={plan === id} tabIndex={wz.step === 0 ? undefined : -1} data-autofocus={plan === id ? "" : undefined} onChange={() => set("plan", id)} />
                <b>{PLANS[id].name}</b>
                <span className="p"><Count value={amount(id, billing, currency)} text={fmt(currency)} /> <small>per {perOf(billing)}</small></span>
                <span className="t">{PLANS[id].target}</span>
                <i aria-hidden="true"><TickIcon /></i>
              </label>
            ))}
          </fieldset>
          {e.plan || e.billing ? <p className="err" role="alert">{e.plan || e.billing}</p> : null}
        </Step>

        <Step wz={wz} index={1} title="Tell us about your business" sub={instant ? "Your workspace is created under this name." : "We set up your workspace under this name."}>
          <div className="wf-pair">
            <Field id="company" label="Company" lead {...field("company")} autoComplete="organization" capitalize="words" maxLength={COMPANY_MAX}
              hint={instant && previewSlug(v.company) ? <>Your address will be <b className="addr">{previewSlug(v.company)}.toursside.com</b>. If someone already has it, we add a number.</> : undefined} />
            <Field id="country" label="Country" {...field("country")} autoComplete="country-name" capitalize="words">
              <Suggest label="Suggested countries" items={places.map((c) => ({ text: c, value: c }))} onPick={(c) => set("country", c)} />
            </Field>
          </div>
          <Chips id="team" label="People who will use it" optional small options={TEAM} value={v.team} onChange={(x) => set("team", x)} />
        </Step>

        <Step wz={wz} index={2} title="Who should we set it up for?" sub={instant ? "You'll be the owner and sign in with this email." : "We send the invoice and your login here."}>
          <div className="wf-pair">
            <Field id="name" label="Your name" lead {...field("name")} autoComplete="name" capitalize="words" />
            <Field id="email" label="Work email" type="email" inputMode="email" {...field("email")} autoComplete="email" capitalize="none">
              <Suggest label="Finish your email address" items={emailHelp(v.email)} onPick={(x) => { set("email", x); document.getElementById("f-email")?.focus(); }} />
            </Field>
            <Field id="phone" label="Phone or WhatsApp" type="tel" inputMode="tel" {...field("phone")} autoComplete="tel" placeholder="+20 100 000 0000" />
            {instant ? <Field id="password" label="Choose a password for your workspace" type="password" value={password} error={pwErr} ok={password.length >= 8} onChange={(x) => { setPassword(x); setPwErr(""); }} autoComplete="new-password" placeholder="At least 8 characters"><Strength value={password} /></Field> : null}
          </div>
        </Step>

        <Step wz={wz} index={3} title="Check your order" sub="Everything look right? Go back to change anything.">
          <dl className="summary">
            <div><dt>Plan</dt><dd>{planLine(v.plan, v.billing, currency)}</dd></div>
            <div><dt>Company</dt><dd>{v.company}</dd></div>
            <div><dt>Contact</dt><dd>{v.name}</dd></div>
            <div><dt>Email</dt><dd>{v.email}</dd></div>
            <div><dt>Phone</dt><dd>{v.phone}</dd></div>
            <div><dt>Country</dt><dd>{v.country}</dd></div>
          </dl>
          {currency !== "USD" ? <p className="rate-note" style={{ margin: "0 0 12px" }}>{rateNote(currency)}</p> : null}
          {instant && card
            ? <p className="notice">You are not charged on this page. Your workspace is created straight away, then a secure payment page opens to pay for your plan by card. Payment is handled by Stripe{currency !== "USD" ? `, and your card is charged in US dollars: $${priceOf(plan, billing).toLocaleString("en-US")} per ${perOf(billing)}` : ""}. Cancel any time.</p>
            : instant
            ? <p className="notice">You are not charged now. Your workspace is created straight away and opens on a page that shows how to pay. Your plan starts when the payment is confirmed, and you can use the workspace in the meantime.</p>
            : <p className="notice">Card payment on this page is not open yet. Sending this order does not charge you. We reply with an invoice for the plan you chose, and your workspace is set up once it is paid.</p>}
          {createErr ? <p className="notice" role="alert">{createErr}</p> : null}
          <details className="more" open={more || !!(v.website || v.notes || e.website || e.notes)} onToggle={(ev) => setMore(ev.currentTarget.open)}>
            <summary tabIndex={wz.step === 3 ? undefined : -1}>Add your website or a note <em>(optional)</em></summary>
            <div className="wf-pair">
              <Field id="website" label="Current website" optional inputMode="url" {...field("website")} placeholder="yourcompany.com" capitalize="none" />
              <Field id="notes" label="Anything we should know" optional textarea {...field("notes")} />
            </div>
          </details>
        </Step>
      </Wizard>
    </>
  );
}
