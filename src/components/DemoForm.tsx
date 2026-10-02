"use client";
import { useEffect, useState } from "react";
import Field from "./Field";
import { Sent, ViaWhatsApp } from "./Result";
import { useRequest } from "./useRequest";

const TEAM = ["Just me", "2 to 5", "6 to 15", "16 to 50", "More than 50"];
const VOLUME = ["Fewer than 20", "20 to 100", "100 to 500", "More than 500"];
const CURRENT = ["WhatsApp and spreadsheets", "Email and documents", "Another booking system", "Software built for us", "Nothing yet"];

export default function DemoForm() {
  const r = useRequest("demo", { name: "", company: "", email: "", phone: "", country: "", team: "", volume: "", current: "", goal: "", time: "" });
  const [hp, setHp] = useState("");
  const { values: v, errors: e, set } = r;
  useEffect(() => { if (r.status === "sent" || r.status === "whatsapp") document.getElementById("result")?.focus(); }, [r.status]);

  if (r.status === "sent") return <Sent title="Demo request sent"><p>Thanks, {v.name.split(" ")[0]}. We'll contact you at {v.email} or on {v.phone} to confirm a time.</p></Sent>;
  if (r.status === "whatsapp") return <ViaWhatsApp url={r.whatsappUrl} what="demo request" onBack={() => r.setStatus("idle")} />;

  return (
    <form className="panel" noValidate onSubmit={(ev) => { ev.preventDefault(); r.send(hp); }}>
      <div className="fields two">
        <Field id="name" label="Your name" value={v.name} error={e.name} onChange={(x) => set("name", x)} autoComplete="name" />
        <Field id="company" label="Company" value={v.company} error={e.company} onChange={(x) => set("company", x)} autoComplete="organization" />
        <Field id="email" label="Work email" type="email" inputMode="email" value={v.email} error={e.email} onChange={(x) => set("email", x)} autoComplete="email" />
        <Field id="phone" label="Phone or WhatsApp" type="tel" inputMode="tel" value={v.phone} error={e.phone} onChange={(x) => set("phone", x)} autoComplete="tel" placeholder="+20 100 000 0000" />
        <Field id="country" label="Country" value={v.country} error={e.country} onChange={(x) => set("country", x)} autoComplete="country-name" />
        <Field id="team" label="People who will use it" optional options={TEAM} value={v.team} onChange={(x) => set("team", x)} />
        <Field id="volume" label="Bookings per month" optional options={VOLUME} value={v.volume} onChange={(x) => set("volume", x)} />
        <Field id="current" label="What you use today" optional options={CURRENT} value={v.current} onChange={(x) => set("current", x)} />
        <Field id="goal" label="What you want to improve" optional textarea full value={v.goal} error={e.goal} onChange={(x) => set("goal", x)} placeholder="For example: we lose track of who has paid" />
        <Field id="time" label="Preferred demo time" optional full value={v.time} onChange={(x) => set("time", x)} placeholder="For example: Tuesday afternoon, Cairo time" />
      </div>
      <div className="hp" aria-hidden="true"><label>Leave this empty<input tabIndex={-1} autoComplete="off" value={hp} onChange={(x) => setHp(x.target.value)} /></label></div>
      <div className="form-foot">
        <small>We use these details only to arrange your demo. See the <a href="/privacy">Privacy Policy</a>.</small>
        <button className="btn btn-primary" disabled={r.status === "sending"}>{r.status === "sending" ? "Sending request" : "Request a demo"}</button>
      </div>
    </form>
  );
}
