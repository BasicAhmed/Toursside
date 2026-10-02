import { NextResponse } from "next/server";
import { validate, toText, type Kind, type Values } from "@/lib/requests";
import { createCheckout } from "@/lib/checkout";
import type { PlanId } from "@/lib/site";

export const runtime = "nodejs";

// Small in-memory limiter: enough to stop a script hammering the form from one address.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 6;
}

export async function POST(req: Request) {
  let body: { kind?: Kind; values?: Values; website_url?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, reason: "BAD_REQUEST" }, { status: 400 }); }
  const kind = body.kind === "subscribe" ? "subscribe" : "demo";
  const values: Values = {};
  for (const [k, v] of Object.entries(body.values || {})) if (typeof v === "string") values[k] = v.slice(0, 2000);

  if (body.website_url) return NextResponse.json({ ok: true }); // honeypot: bots fill it, people never see it
  const errors = validate(kind, values);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, reason: "INVALID", errors }, { status: 422 });

  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  if (limited(ip)) return NextResponse.json({ ok: false, reason: "RATE_LIMITED" }, { status: 429 });

  const key = process.env.RESEND_API_KEY, from = process.env.REQUESTS_FROM, to = process.env.REQUESTS_TO;
  if (!key || !from || !to) return NextResponse.json({ ok: false, reason: "NOT_CONFIGURED" }, { status: 503 });

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: to.split(",").map((x) => x.trim()).filter(Boolean), reply_to: values.email.trim(),
        subject: `${kind === "demo" ? "Demo request" : "Subscription request"}: ${values.company.trim()}`,
        text: toText(kind, values),
      }),
    });
    if (!res.ok) { console.error("Request email failed", res.status, await res.text()); return NextResponse.json({ ok: false, reason: "SEND_FAILED" }, { status: 502 }); }
  } catch (e) {
    console.error("Request email failed", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, reason: "SEND_FAILED" }, { status: 502 });
  }
  if (kind === "subscribe") return NextResponse.json({ ok: true, checkout: await createCheckout({ plan: values.plan as PlanId, email: values.email, company: values.company }) });
  return NextResponse.json({ ok: true });
}
