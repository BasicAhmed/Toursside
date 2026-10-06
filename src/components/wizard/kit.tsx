"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Wiz } from "./useWizard";

// The shared wizard: one form, one question (or one tight group) per step. Every step stays in the page so browsers
// and password managers can fill all of it at once; the steps that are not showing are simply out of reach of
// pointer, Tab and screen readers.
const Active = createContext(true);
const tab = (active: boolean) => (active ? undefined : -1);

const Tick = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5 10 17.5 19 7" /></svg>;
export const TickIcon = Tick;

export function Wizard({ wz, names, onSubmit, label, busy, ready, side, note, after, children }: {
  wz: Wiz; names: string[]; onSubmit: () => void; label: string; busy?: boolean; ready?: boolean;
  side?: React.ReactNode; note?: React.ReactNode; after?: React.ReactNode; children: React.ReactNode;
}) {
  const n = names.length, step = wz.step;
  return (
    <div className="wz">
      {side}
      <form ref={wz.root} className="wz-form panel" noValidate onSubmit={(e) => { e.preventDefault(); if (!busy) onSubmit(); }}>
        <div className="wz-head">
          <button type="button" className="wz-back" onClick={wz.back} disabled={step === 0 || busy} aria-label="Back to the previous step">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5 8 12l7 7" /></svg><span>Back</span>
          </button>
          <div className="wz-prog" role="progressbar" aria-label="Progress" aria-valuemin={1} aria-valuemax={n} aria-valuenow={step + 1} aria-valuetext={`Step ${step + 1} of ${n}: ${names[step]}`}>
            {names.map((s, i) => <i key={s} className={i < step ? "done" : i === step ? "now" : ""} />)}
          </div>
          <span className="wz-count" aria-hidden="true"><b key={step}>{step + 1}</b> of {n}</span>
        </div>
        <div className="wz-steps">{children}</div>
        {after}
        <div className="wz-foot">
          <button className={`btn btn-primary wz-next${ready ? " ready" : ""}`} disabled={busy} data-ready={ready ? "1" : "0"}>
            {label}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
          <span className="wz-enter" aria-hidden="true">or press <kbd>Enter</kbd></span>
        </div>
        {note ? <div className="wz-note">{note}</div> : null}
      </form>
    </div>
  );
}

export function Step({ wz, index, title, sub, children }: { wz: Wiz; index: number; title: React.ReactNode; sub?: React.ReactNode; children: React.ReactNode }) {
  const active = wz.step === index;
  return (
    <section className={`wz-step ${active ? "on" : index < wz.step ? "before" : "after"}`} data-step={index} aria-hidden={active ? undefined : true}>
      <Active.Provider value={active}>
        <h2 className="wz-q" tabIndex={-1}>{title}</h2>
        {sub ? <p className="wz-sub">{sub}</p> : null}
        {children}
      </Active.Provider>
    </section>
  );
}

type FieldProps = {
  id: string; label: string; value: string; onChange: (v: string) => void; error?: string; ok?: boolean; hint?: React.ReactNode; optional?: boolean;
  type?: string; autoComplete?: string; placeholder?: string; inputMode?: "tel" | "email" | "text" | "url"; maxLength?: number; textarea?: boolean;
  lead?: boolean; onBlur?: () => void; capitalize?: "words" | "none" | "sentences"; enter?: "next" | "go" | "done" | "send"; children?: React.ReactNode;
};
/** A big input with a real label, a tick the moment the answer is good, and an error that is announced and tied to it. */
export function Field({ id, label, value, onChange, error, ok, hint, optional, type = "text", autoComplete, placeholder, inputMode, maxLength, textarea, lead, onBlur, capitalize, enter = "next", children }: FieldProps) {
  const active = useContext(Active);
  const [show, setShow] = useState(false);
  const pw = type === "password";
  // Checking a field as it is left must never move the button out from under a finger that is already pressing it:
  // leaving for a button skips the check (the button runs it anyway), and otherwise it waits a moment.
  const blur = onBlur ? (e: React.FocusEvent) => { if ((e.relatedTarget as HTMLElement | null)?.closest?.("button")) return; window.setTimeout(onBlur, 160); } : undefined;
  const describedBy = [error ? `e-${id}` : "", hint ? `h-${id}` : ""].filter(Boolean).join(" ") || undefined;
  const common = {
    id: `f-${id}`, name: id, value, placeholder, maxLength, tabIndex: tab(active), onBlur: blur, "data-autofocus": lead ? "" : undefined,
    "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, autoComplete, autoCapitalize: capitalize, enterKeyHint: enter,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
  } as const;
  return (
    <div className={`wf${ok && !error ? " ok" : ""}${error ? " bad" : ""}`}>
      <label htmlFor={`f-${id}`}>{label}{optional ? <em> (optional)</em> : null}</label>
      <div className="wf-box">
        {textarea ? <textarea {...common} rows={3} enterKeyHint={undefined} /> : <input {...common} type={pw && show ? "text" : type} inputMode={inputMode} spellCheck={type === "text" && !autoComplete ? undefined : false} />}
        {pw ? <button type="button" className="wf-eye" tabIndex={tab(active)} aria-pressed={show} onClick={() => setShow((s) => !s)}>{show ? "Hide" : "Show"}<span className="sr"> password</span></button> : null}
        <span className="wf-tick" aria-hidden="true"><Tick /></span>
      </div>
      {children}
      {hint ? <p className="wf-hint" id={`h-${id}`}>{hint}</p> : null}
      <p className="err" id={`e-${id}`} aria-live="polite">{error || ""}</p>
    </div>
  );
}

/** Tappable answers. One choice (tap again to clear) or several; the value is the text that gets sent. */
export function Chips({ id, label, options, value, onChange, multi, optional, small }: { id: string; label: string; options: readonly string[]; value: string; onChange: (v: string) => void; multi?: boolean; optional?: boolean; small?: boolean }) {
  const active = useContext(Active);
  const picked = multi ? value.split(", ").filter(Boolean) : value ? [value] : [];
  const toggle = (o: string) => {
    if (!multi) return onChange(picked[0] === o ? "" : o);
    onChange(options.filter((x) => (x === o ? !picked.includes(o) : picked.includes(x))).join(", "));
  };
  return (
    <fieldset className={`chips${small ? " small" : ""}`} id={`f-${id}`} tabIndex={-1}>
      <legend>{label}{optional ? <em> (optional)</em> : null}</legend>
      <div>
        {options.map((o) => (
          <label key={o} className="chip">
            <input type="checkbox" name={id} value={o} checked={picked.includes(o)} tabIndex={tab(active)} onChange={() => toggle(o)} />
            <span><Tick />{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** One-tap suggestions under a field (a likely country, the rest of an email address). Never required. */
export function Suggest({ label, items, onPick }: { label: string; items: { text: string; value: string }[]; onPick: (value: string) => void }) {
  const active = useContext(Active);
  if (!items.length) return null;
  return (
    <div className="suggest" role="group" aria-label={label}>
      {items.map((s) => <button key={s.text} type="button" tabIndex={tab(active)} onClick={() => onPick(s.value)}>{s.text}</button>)}
    </div>
  );
}

const variety = (p: string) => [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(p)).length;
/** Length first, then variety. It only informs: the one rule is still eight characters. */
export function strength(p: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  if (!p) return { score: 0, label: "" };
  if (p.length < 8) return { score: 0, label: `${8 - p.length} more to go` };
  const s = (1 + (p.length >= 12 ? 1 : 0) + (variety(p) >= 3 ? 1 : 0) + (p.length >= 16 || variety(p) === 4 ? 1 : 0)) as 1 | 2 | 3 | 4;
  return { score: s, label: ["", "Okay", "Good", "Strong", "Very strong"][s] };
}
export function Strength({ value }: { value: string }) {
  const { score, label } = strength(value);
  return (
    <div className={`pw s${score}${value ? " on" : ""}`}>
      <div className="pw-bars" aria-hidden="true"><i /><i /><i /><i /></div>
      <span aria-live="polite">{label}</span>
    </div>
  );
}

/** A number that rolls to its new value. `text` formats it; people who ask for less motion get the value at once. */
export function Count({ value, text }: { value: number; text: (n: number) => string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const a = from.current; from.current = value;
    if (a === value || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(value); return; }
    const t0 = performance.now(), dec = Number.isInteger(value) ? 1 : 10; let raf = 0;
    const step = (now: number) => { const k = Math.min(1, (now - t0) / 320), e = 1 - Math.pow(1 - k, 3); setShown(k === 1 ? value : Math.round((a + (value - a) * e) * dec) / dec); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); from.current = value; };
  }, [value]);
  return <span className="count"><span aria-hidden="true">{text(shown)}</span><span className="sr">{text(value)}</span></span>;
}

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DOMAINS = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com", "icloud.com"];
const TYPOS: Record<string, string> = { "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gmail.con": "gmail.com", "gmail.co": "gmail.com", "gnail.com": "gmail.com", "gamil.com": "gmail.com", "hotmial.com": "hotmail.com", "hotmail.con": "hotmail.com", "outlok.com": "outlook.com", "outlook.con": "outlook.com", "yaho.com": "yahoo.com", "yahoo.con": "yahoo.com" };
/** Finish the address in one tap while it is being typed, and catch the common slips once it is. */
export function emailHelp(email: string): { text: string; value: string }[] {
  const v = email.trim(), at = v.indexOf("@");
  if (at < 1 || v.indexOf("@", at + 1) > -1) return [];
  const user = v.slice(0, at), dom = v.slice(at + 1).toLowerCase();
  if (TYPOS[dom]) return [{ text: `Did you mean ${user}@${TYPOS[dom]}?`, value: `${user}@${TYPOS[dom]}` }];
  if (dom.includes(".") && !DOMAINS.some((d) => d.startsWith(dom))) return [];
  return DOMAINS.filter((d) => d.startsWith(dom) && d !== dom).slice(0, 4).map((d) => ({ text: `@${d}`, value: `${user}@${d}` }));
}
