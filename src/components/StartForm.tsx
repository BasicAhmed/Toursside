"use client";
import Link from "next/link";
import { useState } from "react";
import Field from "./Field";
import { THEMES } from "@/lib/instant";
import WorkspaceBuilder from "./WorkspaceBuilder";

type Status = "idle" | "creating" | "failed";

export default function StartForm() {
  const [v, setV] = useState({ company: "", name: "", email: "", password: "", theme: "ocean" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); const [url, setUrl] = useState("");
  const set = (k: string, x: string) => { setV((s) => ({ ...s, [k]: x })); if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; }); };
  const theme = THEMES.find((t) => t.id === v.theme) ?? THEMES[0];
  const initials = v.company.trim().split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "TS";

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setStatus("creating"); setMessage("");
    try {
      const res = await fetch("/api/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...v, website_url: hp }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok && data.loginUrl) { setUrl(data.loginUrl); return; }
      if (data.errors) { setErrors(data.errors); setStatus("idle"); const first = Object.keys(data.errors)[0]; requestAnimationFrame(() => document.getElementById(`f-${first}`)?.focus()); return; }
      setMessage(data.code === "NOT_CONFIGURED" ? "Instant demos are not switched on yet." : data.message || "We couldn't create your demo just now.");
      setStatus("failed");
    } catch { setMessage("We couldn't reach the server. Check your connection and try again."); setStatus("failed"); }
  };

  return (
    <form className="panel" noValidate onSubmit={submit}>
      {status === "creating" ? <WorkspaceBuilder company={v.company} primary={theme.primary} accent={theme.accent} ready={!!url} onDone={() => window.location.assign(url)} /> : null}
      <div className="fields two">
        <Field id="company" label="Company name" full value={v.company} error={errors.company} onChange={(x) => set("company", x)} autoComplete="organization" placeholder="For example: Blue Lagoon Travel" />
        <Field id="name" label="Your name" value={v.name} error={errors.name} onChange={(x) => set("name", x)} autoComplete="name" />
        <Field id="email" label="Work email" type="email" inputMode="email" value={v.email} error={errors.email} onChange={(x) => set("email", x)} autoComplete="email" />
        <Field id="password" label="Choose a password" type="password" full value={v.password} error={errors.password} onChange={(x) => set("password", x)} autoComplete="new-password" placeholder="At least 8 characters" />
      </div>
      <fieldset className="swatches">
        <legend>Your colours</legend>
        <div>
          {THEMES.map((t) => (
            <label key={t.id} title={t.label}>
              <input type="radio" name="theme" value={t.id} checked={v.theme === t.id} onChange={() => set("theme", t.id)} />
              <span style={{ background: `linear-gradient(135deg, ${t.primary} 0 55%, ${t.accent} 55% 100%)` }} /><b className="sr">{t.label}</b>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="preview" aria-hidden="true" style={{ background: theme.primary }}>
        <span className="pm" style={{ background: theme.accent, color: theme.primary }}>{initials}</span>
        <span className="pn">{v.company.trim() || "Your company"}<small>Staff panel</small></span>
        <span className="pb" style={{ background: theme.accent, color: theme.primary }}>+ New order</span>
      </div>
      <div className="hp" aria-hidden="true"><label>Leave this empty<input tabIndex={-1} autoComplete="off" value={hp} onChange={(x) => setHp(x.target.value)} /></label></div>
      {status === "failed" ? <p className="notice" role="alert" style={{ marginTop: 18 }}>{message} <Link href="/demo">Book a demo instead</Link> and we'll set you up.</p> : null}
      <div className="form-foot">
        <small>No card needed. You can change the name and colours later. See the <Link href="/privacy">Privacy Policy</Link>.</small>
        <button className="btn btn-primary" disabled={status === "creating"}>{status === "creating" ? "Creating your workspace" : "Create my demo"}</button>
      </div>
    </form>
  );
}
