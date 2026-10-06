"use client";
import { useEffect, useState } from "react";
import { Sent, ViaWhatsApp } from "./Result";
import { useRequest } from "./useRequest";
import { whatsappLink } from "@/lib/site";
import { DemoPass } from "./wizard/LivePreview";
import Confetti from "./wizard/Confetti";
import { Wizard, Step, Field, Chips, Suggest, emailHelp } from "./wizard/kit";
import { useWizard, useSaved, forget, readFields } from "./wizard/useWizard";

const TEAM = ["Just me", "2 to 5", "6 to 15", "16 to 50", "More than 50"];
const VOLUME = ["Fewer than 20", "20 to 100", "100 to 500", "More than 500"];
const CURRENT = ["WhatsApp and spreadsheets", "Email and documents", "Another booking system", "Software built for us", "Nothing yet"];
const SELLS = ["Tours", "Flights", "Hotels", "Visas", "Transfers", "Groups"];
const DAYS = ["As soon as possible", "This week", "Next week"];
const PARTS = ["Morning", "Afternoon", "Evening"];
const VIA = ["WhatsApp", "Email", "Phone call"];
const COUNTRIES = ["Egypt", "Saudi Arabia", "United Arab Emirates", "Qatar"];
// A first guess at the country from the device clock's time zone. Only ever offered as a one-tap suggestion.
const ZONES: Record<string, string> = { "Africa/Cairo": "Egypt", "Asia/Riyadh": "Saudi Arabia", "Asia/Dubai": "United Arab Emirates", "Asia/Qatar": "Qatar", "Asia/Kuwait": "Kuwait", "Asia/Bahrain": "Bahrain", "Asia/Muscat": "Oman", "Asia/Amman": "Jordan", "Africa/Casablanca": "Morocco", "Europe/Istanbul": "Türkiye", "Europe/London": "United Kingdom", "Africa/Johannesburg": "South Africa" };

const KEY = "ts-wizard-demo";
const NAMES = ["You", "Your agency", "Today", "Reaching you"];
const STEP_OF: Record<string, number> = { name: 0, company: 0, country: 0, sells: 1, team: 1, volume: 1, current: 2, goal: 2, email: 3, phone: 3, time: 3 };
const NEED = [["name", "company", "country"], [], ["goal"], ["email", "phone"]];
const TEXT = ["name", "company", "country", "email", "phone"];

export default function DemoForm() {
  const r = useRequest("demo", { name: "", company: "", email: "", phone: "", country: "", sells: "", team: "", volume: "", current: "", goal: "", time: "" });
  // The three "when" answers are tapped separately and written into the one "Preferred demo time" line the team reads.
  const [when, setWhen] = useState({ day: "", part: "", via: "" });
  const [zone, setZone] = useState("");
  const [hp, setHp] = useState("");
  const wz = useWizard(NAMES.length);
  const { values: v, errors: e, set } = r;

  useEffect(() => { try { setZone(Intl.DateTimeFormat().resolvedOptions().timeZone || ""); } catch { /* no time zone: leave it out */ } }, []);
  const timeOf = (w: typeof when) => [w.day, w.part && zone ? `${w.part.toLowerCase()} (${zone.replace(/_/g, " ")} time)` : w.part.toLowerCase(), w.via ? `reply by ${w.via}` : ""].filter(Boolean).join(", ");
  const pick = (k: keyof typeof when) => (x: string) => { const w = { ...when, [k]: x }; setWhen(w); set("time", timeOf(w)); };

  useSaved(KEY, { v, when, step: wz.step }, (saved) => {
    const got = { ...v, ...Object.fromEntries(Object.entries(saved?.v ?? {}).filter(([k, x]) => k in v && typeof x === "string")) };
    r.setValues(got); if (saved?.when) setWhen({ day: String(saved.when.day || ""), part: String(saved.when.part || ""), via: String(saved.when.via || "") });
    let ok = 0; while (ok < NEED.length - 1 && NEED[ok].every((k) => !r.errorOf(k, got))) ok++;
    wz.restore(Math.min(Number(saved?.step) || 0, ok));
  });
  useEffect(() => { const dom = readFields(wz.root.current, TEXT); r.setValues((s) => { const n = { ...s }; for (const k of TEXT) if (dom[k] && !n[k]) n[k] = dom[k]; return n; }); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  useEffect(() => { if (r.status === "sent" || r.status === "whatsapp") { document.getElementById("result")?.focus(); if (r.status === "sent") forget(KEY); } }, [r.status]);

  if (r.status === "sent") return (
    <div className="wz-done">
      <Confetti colors={["#16A6A3", "#FF8A3D", "#102A43", "#E2F3F2"]} />
      <Sent title="Demo request sent">
        <p>Thanks, {v.name.trim().split(" ")[0]}. We'll contact you at {v.email} or on {v.phone} to confirm a time.</p>
        <p className="wz-wa">Prefer not to wait? <a className="btn btn-wa btn-sm" href={whatsappLink(`Hi Toursside, I just asked for a demo for ${v.company.trim()}.`)} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a></p>
      </Sent>
    </div>
  );
  if (r.status === "whatsapp") return <ViaWhatsApp url={r.whatsappUrl} what="demo request" onBack={() => r.setStatus("idle")} />;

  const ready = NEED[wz.step].every((k) => !r.errorOf(k));
  const submit = async () => {
    const dom = readFields(wz.root.current, TEXT);
    const now = { ...v }; for (const k of TEXT) if (dom[k] && dom[k] !== now[k]) now[k] = dom[k];
    if (TEXT.some((k) => now[k] !== v[k])) r.setValues(now);
    const jump = (k: string | null) => { if (k) wz.go(STEP_OF[k] ?? wz.step, `f-${k}`); };
    if (wz.step < NAMES.length - 1) { const bad = r.check(NEED[wz.step], now); if (bad) jump(bad); else wz.next(); return; }
    jump(await r.send(hp, now));
  };
  const guess = ZONES[zone], places = [...new Set([guess, ...COUNTRIES].filter(Boolean))].filter((c) => c !== v.country.trim()).slice(0, 4);
  const field = (k: string) => ({ value: v[k], error: e[k], ok: !!v[k].trim() && !r.errorOf(k), onChange: (x: string) => set(k, x), onBlur: () => { if (v[k].trim()) r.flag(k); } });

  return (
    <Wizard wz={wz} names={NAMES} onSubmit={submit} busy={r.status === "sending"} ready={ready}
      label={wz.step === 3 ? (r.status === "sending" ? "Sending request" : "Request a demo") : "Next"}
      side={<div className="wz-side"><DemoPass name={v.name} company={v.company} country={v.country} sells={v.sells} team={v.team} when={v.time} open={wz.step === 1} /><p className="wz-cap">Your demo, shaped by your answers.</p></div>}
      after={<div className="hp" aria-hidden="true"><label>Leave this empty<input tabIndex={-1} autoComplete="off" value={hp} onChange={(x) => setHp(x.target.value)} /></label></div>}
      note={<small>We use these details only to arrange your demo. See the <a href="/privacy">Privacy Policy</a>.</small>}>

      <Step wz={wz} index={0} title="Who are we talking to?" sub="So we know who to ask for.">
        <div className="wf-pair">
          <Field id="name" label="Your name" lead {...field("name")} autoComplete="name" capitalize="words" />
          <Field id="company" label="Company" {...field("company")} autoComplete="organization" capitalize="words" />
          <Field id="country" label="Country" {...field("country")} autoComplete="country-name" capitalize="words">
            <Suggest label="Suggested countries" items={places.map((c) => ({ text: c, value: c }))} onPick={(c) => set("country", c)} />
          </Field>
        </div>
      </Step>

      <Step wz={wz} index={1} title="Tell us about your agency" sub="Tap what fits. We'll build the demo around it.">
        <Chips id="sells" label="What do you sell?" multi optional options={SELLS} value={v.sells} onChange={(x) => set("sells", x)} />
        <Chips id="team" label="People who will use it" optional options={TEAM} value={v.team} onChange={(x) => set("team", x)} />
        <Chips id="volume" label="Bookings per month" optional options={VOLUME} value={v.volume} onChange={(x) => set("volume", x)} />
      </Step>

      <Step wz={wz} index={2} title="How do you work today?" sub="One tap is enough. Add a line if something bothers you.">
        <Chips id="current" label="What you use today" optional options={CURRENT} value={v.current} onChange={(x) => set("current", x)} />
        <Field id="goal" label="What you want to improve" optional textarea {...field("goal")} placeholder="For example: we lose track of who has paid" />
      </Step>

      <Step wz={wz} index={3} title="How do we reach you?" sub="We confirm the time by email or WhatsApp.">
        <div className="wf-pair">
          <Field id="email" label="Work email" lead type="email" inputMode="email" {...field("email")} autoComplete="email" capitalize="none">
            <Suggest label="Finish your email address" items={emailHelp(v.email)} onPick={(x) => { set("email", x); document.getElementById("f-email")?.focus(); }} />
          </Field>
          <Field id="phone" label="Phone or WhatsApp" type="tel" inputMode="tel" {...field("phone")} autoComplete="tel" placeholder="+20 100 000 0000" enter="send" />
        </div>
        <Chips id="day" label="When suits you?" optional small options={DAYS} value={when.day} onChange={pick("day")} />
        <Chips id="part" label="Time of day" optional small options={PARTS} value={when.part} onChange={pick("part")} />
        <Chips id="via" label="Reply by" optional small options={VIA} value={when.via} onChange={pick("via")} />
      </Step>
    </Wizard>
  );
}
