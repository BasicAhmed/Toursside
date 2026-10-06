"use client";
import { useRef, useState } from "react";
import { validate, toText, type Kind, type Values } from "@/lib/requests";
import { whatsappLink } from "@/lib/site";

export type Status = "idle" | "sending" | "sent" | "whatsapp";

// Shared by the demo form and the subscribe flow: validates, sends, and if the email can't be delivered from the site
// hands the visitor the same answers as a ready-written WhatsApp message, so a request is never silently lost.
// check and send answer with the first field that needs attention (or null), so a wizard can open the step it is on.
export function useRequest(kind: Kind, initial: Values) {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [redirect, setRedirect] = useState<string | null>(null);
  const lock = useRef(false); // one request at a time, however fast the button is pressed

  const set = (k: string, v: string) => { setValues((s) => ({ ...s, [k]: v })); if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; }); };
  const errorOf = (k: string, vals: Values = values) => validate(kind, vals)[k] ?? "";
  const flag = (k: string) => { const m = errorOf(k); if (m) setErrors((e) => ({ ...e, [k]: m })); };
  const check = (only?: string[], vals: Values = values): string | null => {
    const all = validate(kind, vals);
    const e = only ? Object.fromEntries(Object.entries(all).filter(([k]) => only.includes(k))) : all;
    setErrors(e);
    return Object.keys(e)[0] ?? null;
  };
  const send = async (honeypot = "", vals: Values = values): Promise<string | null> => {
    if (lock.current) return null;
    const bad = check(undefined, vals); if (bad) return bad;
    lock.current = true; setStatus("sending");
    try {
      const res = await fetch("/api/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, values: vals, website_url: honeypot }) });
      const data = await res.json().catch(() => ({}));
      if (res.status === 422 && data.errors) { setErrors(data.errors); setStatus("idle"); return Object.keys(data.errors)[0] ?? null; }
      if (res.ok && data.ok) { if (data.checkout?.mode === "redirect") { setRedirect(data.checkout.url); window.location.assign(data.checkout.url); return null; } setStatus("sent"); return null; }
      setStatus("whatsapp");
    } catch { setStatus("whatsapp"); } finally { lock.current = false; }
    return null;
  };
  return { values, errors, status, redirect, set, setValues, setErrors, errorOf, flag, check, send, setStatus, whatsappUrl: whatsappLink(toText(kind, values)) };
}
