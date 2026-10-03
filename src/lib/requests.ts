import { PLANS, priceOf, perOf, type PlanId, type Billing } from "./site";
import { isCurrency, money, moneyYear } from "./currency";

// Field definitions shared by the forms, the server route and the WhatsApp fallback, so all three always agree.
export const DEMO_FIELDS = [
  ["name", "Name"], ["company", "Company"], ["email", "Email"], ["phone", "Phone / WhatsApp"], ["country", "Country"],
  ["team", "Team size"], ["volume", "Bookings per month"], ["current", "Current system"], ["goal", "Wants to improve"], ["time", "Preferred demo time"],
] as const;
export const SUBSCRIBE_FIELDS = [
  ["plan", "Plan"], ["company", "Company"], ["name", "Contact name"], ["email", "Email"], ["phone", "Phone / WhatsApp"],
  ["country", "Country"], ["team", "Team size"], ["website", "Website"], ["notes", "Notes"],
] as const;

export type Kind = "demo" | "subscribe";
export type Values = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(kind: Kind, v: Values): Record<string, string> {
  const e: Record<string, string> = {};
  const need = (k: string, msg: string) => { if (!v[k]?.trim()) e[k] = msg; };
  need("name", "Enter your name");
  need("company", "Enter your company name");
  if (!v.email?.trim()) e.email = "Enter your email address";
  else if (!EMAIL.test(v.email.trim())) e.email = "Enter an email address like name@company.com";
  if (!v.phone?.trim()) e.phone = "Enter a phone or WhatsApp number";
  else if (v.phone.replace(/\D/g, "").length < 7) e.phone = "Enter the full number with country code";
  need("country", "Enter your country");
  if (kind === "subscribe" && !(v.plan in PLANS)) e.plan = "Choose a plan";
  if (kind === "subscribe" && v.billing !== "monthly" && v.billing !== "annual") e.billing = "Choose monthly or annual billing";
  for (const k of Object.keys(v)) if (v[k] && v[k].length > 1200) e[k] = "Shorten this to under 1,200 characters";
  return e;
}

export function planLine(plan: string, billing: string, currency?: string) {
  if (!(plan in PLANS)) return plan;
  const b: Billing = billing === "annual" ? "annual" : "monthly";
  const usd = priceOf(plan as PlanId, b);
  const m = PLANS[plan as PlanId].monthly;
  const local = isCurrency(currency) && currency !== "USD" ? `${b === "annual" ? moneyYear(m, currency) : money(m, currency)} (` : "";
  return `${PLANS[plan as PlanId].name}, ${local}$${usd.toLocaleString("en-US")}${local ? ")" : ""} per ${perOf(b)}`;
}

export function toText(kind: Kind, v: Values) {
  const fields = kind === "demo" ? DEMO_FIELDS : SUBSCRIBE_FIELDS;
  const head = kind === "demo" ? "Toursside demo request" : "Toursside subscription request";
  const lines = fields.map(([k, label]) => [label, k === "plan" ? planLine(v.plan || "", v.billing || "", v.currency) : (v[k] || "").trim()] as const).filter(([, val]) => val);
  return `${head}\n\n${lines.map(([l, val]) => `${l}: ${val}`).join("\n")}`;
}
