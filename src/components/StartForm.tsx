"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { THEMES } from "@/lib/instant";
import { COMPANY_MAX, previewSlug, validCompany } from "@/lib/slug";
import WorkspaceBuilder, { type Box } from "./WorkspaceBuilder";
import LivePreview, { handoffBox } from "./wizard/LivePreview";
import { Wizard, Step, Field, Suggest, Strength, TickIcon, EMAIL, emailHelp } from "./wizard/kit";
import { useWizard, useSaved, forget, readFields } from "./wizard/useWizard";

type Status = "idle" | "creating" | "failed";
const KEY = "ts-wizard-start";
const NAMES = ["Company", "Colours", "You", "Password"];
const STEP_OF: Record<string, number> = { company: 0, theme: 1, name: 2, email: 2, password: 3 };
const TEXT = ["company", "name", "email"];
// The same rules the server applies (src/app/api/start/route.ts), so a tick here means the server will agree.
const RULES: Record<string, (x: string) => string> = {
  company: (x) => (!validCompany(x) ? "Enter your company name" : x.trim().length > COMPANY_MAX ? `Keep it under ${COMPANY_MAX} characters` : ""),
  name: (x) => (x.trim() ? "" : "Enter your name"),
  email: (x) => (EMAIL.test(x.trim()) ? "" : x.trim() ? "Enter an email address like name@company.com" : "Enter your email address"),
  password: (x) => (x.length >= 8 ? "" : "Use at least 8 characters"),
};

export default function StartForm({ trialDays = 14 }: { trialDays?: number }) {
  const [v, setV] = useState({ company: "", name: "", email: "", theme: "ocean" });
  const [password, setPassword] = useState(""); // never saved anywhere
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); const [url, setUrl] = useState(""); const [from, setFrom] = useState<Box | null>(null);
  const wz = useWizard(NAMES.length);
  const lock = useRef(false), app = useRef<HTMLDivElement>(null), strip = useRef<HTMLDivElement>(null);
  const all: Record<string, string> = { ...v, password };

  const clear = (k: string) => { if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; }); };
  const set = (k: string, x: string) => { setV((s) => ({ ...s, [k]: x })); clear(k); };
  const blur = (k: string) => () => { const x = all[k]; if (x && RULES[k](x)) setErrors((e) => ({ ...e, [k]: RULES[k](x) })); };
  const theme = THEMES.find((t) => t.id === v.theme) ?? THEMES[0];
  const slug = previewSlug(v.company);

  useSaved(KEY, { v, step: wz.step }, (saved) => {
    const got = { ...v, ...Object.fromEntries(Object.entries(saved?.v ?? {}).filter(([k, x]) => k in v && typeof x === "string")) };
    if (!THEMES.some((t) => t.id === got.theme)) got.theme = "ocean";
    setV(got);
    // Back to where they were, but never past an answer that is missing (the password is not kept, so at most its step).
    const firstBad = !RULES.company(got.company) ? (!RULES.name(got.name) && !RULES.email(got.email) ? 3 : 2) : 0;
    wz.restore(Math.min(Number(saved?.step) || 0, firstBad));
  });
  // Anything the browser filled in before the page woke up.
  useEffect(() => { const dom = readFields(wz.root.current, TEXT); setV((s) => { const n = { ...s }; for (const k of TEXT) if (dom[k] && !n[k as keyof typeof n]) (n as Record<string, string>)[k] = dom[k]; return n; }); }, [wz.root]);

  const fields = [["company"], [], ["name", "email"], ["password"]][wz.step];
  const ready = fields.every((k) => !RULES[k](all[k]));

  const submit = async () => {
    if (lock.current) return;
    // Trust the fields themselves over our copy: a password manager may have filled them without saying so.
    const dom = readFields(wz.root.current, [...TEXT, "password"]);
    const now: Record<string, string> = { ...all, ...Object.fromEntries(Object.entries(dom).filter(([k, x]) => x && x !== all[k])) };
    if (now.password !== password) setPassword(now.password);
    if (TEXT.some((k) => now[k] !== all[k])) setV((s) => ({ ...s, company: now.company, name: now.name, email: now.email }));
    const bad = Object.fromEntries(fields.map((k) => [k, RULES[k](now[k])]).filter(([, m]) => m));
    if (Object.keys(bad).length) { setErrors((e) => ({ ...e, ...bad })); wz.go(wz.step, `f-${Object.keys(bad)[0]}`); return; }
    if (wz.step < NAMES.length - 1) { wz.next(); return; }
    // Last step: check everything once more, then create.
    const allBad = Object.fromEntries(Object.keys(RULES).map((k) => [k, RULES[k](now[k])]).filter(([, m]) => m));
    if (Object.keys(allBad).length) { setErrors(allBad); const k = Object.keys(allBad)[0]; wz.go(STEP_OF[k], `f-${k}`); return; }
    lock.current = true;
    setFrom(handoffBox(app.current, strip.current));
    setStatus("creating"); setMessage(""); (document.activeElement as HTMLElement | null)?.blur?.();
    const fail = (m: string) => { setMessage(m); setStatus("failed"); };
    try {
      const res = await fetch("/api/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ company: now.company, name: now.name, email: now.email, password: now.password, theme: v.theme, website_url: hp }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok && data.loginUrl) { forget(KEY); setUrl(data.loginUrl); return; } // stay locked: the film is playing
      if (data.errors) { setErrors(data.errors); setStatus("idle"); const k = Object.keys(data.errors)[0]; wz.go(STEP_OF[k] ?? wz.step, `f-${k}`); }
      else if ((res.status === 422 || res.status === 409) && data.message) {
        // The product's own answer (name already in use, this email already has three demos...): show it on the field it is about.
        const k = data.code === "TAKEN" || /company|name is already/i.test(data.message) ? "company" : /password/i.test(data.message) ? "password" : /email/i.test(data.message) ? "email" : "";
        if (k) { setErrors({ [k]: data.message }); setStatus("idle"); wz.go(STEP_OF[k], `f-${k}`); } else fail(data.message);
      }
      else fail(data.code === "NOT_CONFIGURED" ? "Instant demos are not switched on yet." : data.message || "We couldn't create your demo just now.");
    } catch { fail("We couldn't reach the server. Check your connection and try again."); }
    lock.current = false;
  };

  const creating = status === "creating";
  const side = (
    <div className="wz-side">
      <LivePreview company={v.company} primary={theme.primary} accent={theme.accent} open={wz.step === 1} typing={wz.step === 0} gone={creating} appRef={app} stripRef={strip} />
      <p className="wz-cap">Your workspace, taking shape as you answer.</p>
    </div>
  );
  return (
    <>
      {creating ? <WorkspaceBuilder company={v.company} primary={theme.primary} accent={theme.accent} ready={!!url} from={from} onDone={() => window.location.assign(url)} /> : null}
      <Wizard wz={wz} names={NAMES} onSubmit={submit} busy={creating} ready={ready} side={side}
        label={wz.step === 3 ? (creating ? "Creating your workspace" : "Create my demo") : wz.step === 1 ? `Use ${theme.label}` : "Next"}
        after={<>
          <div className="hp" aria-hidden="true"><label>Leave this empty<input tabIndex={-1} autoComplete="off" value={hp} onChange={(x) => setHp(x.target.value)} /></label></div>
          {status === "failed" ? <p className="notice" role="alert">{message} <Link href="/demo">Book a demo instead</Link> and we'll set you up.</p> : null}
        </>}
        note={<small>No card needed. You can change the name and colours later. See the <Link href="/privacy">Privacy Policy</Link>.</small>}>

        <Step wz={wz} index={0} title="What's your company called?" sub="It goes on your workspace, your invoices and your address.">
          <Field id="company" label="Company name" lead value={v.company} error={errors.company} ok={!RULES.company(v.company)} onChange={(x) => set("company", x)} onBlur={blur("company")} autoComplete="organization" capitalize="words" maxLength={COMPANY_MAX} placeholder="Blue Lagoon Travel"
            hint={slug ? <>Your address will be <b className="addr">{slug}.toursside.com</b>. If someone already has it, we add a number.</> : "Type it and watch your workspace appear."} />
        </Step>

        <Step wz={wz} index={1} title="Pick your colours" sub="Tap one and see it on your workspace. You can change it any time.">
          <fieldset className="swatches" id="f-theme" tabIndex={-1}>
            <legend className="sr">Your colours</legend>
            <div>
              {THEMES.map((t) => (
                <label key={t.id} title={t.label}>
                  <input type="radio" name="theme" value={t.id} checked={v.theme === t.id} tabIndex={wz.step === 1 ? undefined : -1} data-autofocus={v.theme === t.id ? "" : undefined} onChange={() => set("theme", t.id)} />
                  <span style={{ background: `linear-gradient(135deg, ${t.primary} 0 55%, ${t.accent} 55% 100%)` }} /><b>{t.label}</b>
                </label>
              ))}
            </div>
          </fieldset>
        </Step>

        <Step wz={wz} index={2} title="Who's signing in?" sub="You'll be the owner. Add your team once you're inside.">
          <div className="wf-pair">
            <Field id="name" label="Your name" lead value={v.name} error={errors.name} ok={!RULES.name(v.name)} onChange={(x) => set("name", x)} onBlur={blur("name")} autoComplete="name" capitalize="words" />
            <Field id="email" label="Work email" type="email" inputMode="email" value={v.email} error={errors.email} ok={!RULES.email(v.email)} onChange={(x) => set("email", x)} onBlur={blur("email")} autoComplete="email" capitalize="none">
              <Suggest label="Finish your email address" items={emailHelp(v.email)} onPick={(x) => { set("email", x); document.getElementById("f-email")?.focus(); }} />
            </Field>
          </div>
        </Step>

        <Step wz={wz} index={3} title="Last thing: a password" sub={<>You sign in with {EMAIL.test(v.email.trim()) ? <b>{v.email.trim()}</b> : "your email"} and this password.</>}>
          <Field id="password" label="Choose a password" type="password" lead value={password} error={errors.password} ok={password.length >= 8} onChange={(x) => { setPassword(x); clear("password"); }} autoComplete="new-password" placeholder="At least 8 characters" enter="go">
            <Strength value={password} />
          </Field>
          <ul className={`wz-ready${password.length >= 8 ? " go" : ""}`} aria-label="What you get">
            <li><TickIcon /><span>Your own workspace at <b>{slug || "yourcompany"}.toursside.com</b></span></li>
            <li><TickIcon /><span>Your name and <b>{theme.label}</b> colours on every screen</span></li>
            <li><TickIcon /><span>Sample orders, inquiries and a partner request to try</span></li>
            <li><TickIcon /><span>Free for {trialDays} days. No card.</span></li>
          </ul>
        </Step>
      </Wizard>
    </>
  );
}
