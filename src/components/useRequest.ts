"use client";
import { useState } from "react";
import { validate, toText, type Kind, type Values } from "@/lib/requests";
import { whatsappLink } from "@/lib/site";

export type Status = "idle" | "sending" | "sent" | "whatsapp";

// Shared by the demo form and the subscribe flow: validates, sends, and if the email can't be delivered from the site
// hands the visitor the same answers as a ready-written WhatsApp message, so a request is never silently lost.
export function useRequest(kind: Kind, initial: Values) {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [redirect, setRedirect] = useState<string | null>(null);

  const set = (k: string, v: string) => { setValues((s) => ({ ...s, [k]: v })); if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; }); };
  const check = (only?: string[]) => {
    const all = validate(kind, values);
    const e = only ? Object.fromEntries(Object.entries(all).filter(([k]) => only.includes(k))) : all;
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) requestAnimationFrame(() => document.getElementById(`f-${first}`)?.focus());
    return !first;
  };
  const send = async (honeypot = "") => {
    if (!check()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, values, website_url: honeypot }) });
      const data = await res.json().catch(() => ({}));
      if (res.status === 422 && data.errors) { setErrors(data.errors); setStatus("idle"); return; }
      if (res.ok && data.ok) { if (data.checkout?.mode === "redirect") { setRedirect(data.checkout.url); window.location.assign(data.checkout.url); return; } setStatus("sent"); return; }
      setStatus("whatsapp");
    } catch { setStatus("whatsapp"); }
  };
  return { values, errors, status, redirect, set, check, send, setStatus, whatsappUrl: whatsappLink(toText(kind, values)) };
}
