import { NextResponse } from "next/server";
import { PRODUCT_API_URL, PROVISION_SECRET, instantEnabled, THEMES } from "@/lib/instant";

export const runtime = "nodejs";
export const maxDuration = 60;

// One address can start a few demos an hour: enough for a real person, not for a script.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now(); const recent = (hits.get(ip) || []).filter((t) => now - t < 60 * 60_000);
  recent.push(now); hits.set(ip, recent); return recent.length > 4;
}
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let b: Record<string, unknown>; try { b = await req.json(); } catch { return NextResponse.json({ ok: false, code: "INVALID" }, { status: 400 }); }
  const s = (k: string) => (typeof b[k] === "string" ? (b[k] as string).trim() : "");
  if (s("website_url")) return NextResponse.json({ ok: false, code: "FAILED", message: "We couldn't create your demo just now." }, { status: 400 }); // honeypot
  const errors: Record<string, string> = {};
  if (s("company").length < 2) errors.company = "Enter your company name";
  else if (s("company").length > 80) errors.company = "Keep it under 80 characters"; // the product cuts names at 80, so say so instead of shortening it silently
  if (!s("name")) errors.name = "Enter your name";
  if (!EMAIL.test(s("email"))) errors.email = "Enter an email address like name@company.com";
  if ((typeof b.password === "string" ? b.password : "").length < 8) errors.password = "Use at least 8 characters";
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, code: "INVALID", errors }, { status: 422 });
  if (!instantEnabled()) return NextResponse.json({ ok: false, code: "NOT_CONFIGURED" }, { status: 503 });
  const ip = (req.headers.get("x-vercel-forwarded-for") || req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "local").split(",")[0].trim().slice(0, 64);
  if (limited(ip)) return NextResponse.json({ ok: false, code: "RATE_LIMITED", message: "You've started several demos in the last hour. Try again later, or book a demo with us." }, { status: 429 });

  try {
    const res = await fetch(`${PRODUCT_API_URL}/api/provision`, {
      method: "POST", cache: "no-store",
      headers: { Authorization: `Bearer ${PROVISION_SECRET}`, "Content-Type": "application/json" },
      body: JSON.stringify({ company: s("company"), name: s("name"), email: s("email"), password: b.password, theme: THEMES.some((t) => t.id === s("theme")) ? s("theme") : "ocean", phone: s("phone").slice(0, 40),
        // Coming from the pricing page: the chosen plan travels with the sign-up, so the workspace opens on "how to pay".
        ...(["starter", "growth", "business"].includes(s("plan").toLowerCase()) ? { plan: s("plan"), billing: s("billing") === "annual" ? "annual" : "monthly", currency: s("currency").slice(0, 3) } : {}) }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) return NextResponse.json({ ok: true, loginUrl: data.loginUrl, url: data.url });
    if (res.status === 422 || res.status === 409) return NextResponse.json({ ok: false, code: data.code, message: data.message }, { status: res.status });
    console.error("Instant demo failed", res.status, data?.code);
    return NextResponse.json({ ok: false, code: data.code === "FULL" ? "FULL" : "FAILED", message: data.message || "We couldn't create your demo just now." }, { status: 503 });
  } catch (e) {
    console.error("Instant demo failed", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, code: "FAILED", message: "We couldn't create your demo just now." }, { status: 503 });
  }
}
