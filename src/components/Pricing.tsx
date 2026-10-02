"use client";
import Link from "next/link";
import { useState } from "react";
import { PLANS, type PlanId } from "@/lib/site";

const INCLUDED = [
  "Orders from website, WhatsApp, email, phone and Viator", "Customers, inquiries and follow-up",
  "Tours, itineraries and PDF import", "Invoices and itinerary PDFs with your brand",
  "Payments, finance and reports", "Partner requests for other companies",
  "Staff accounts with roles", "Your booking website and customer tracking page",
];

export default function Pricing() {
  const [plan, setPlan] = useState<PlanId>("annual");
  const p = PLANS[plan];
  return (
    <div className="price-grid">
      <div className="price-card">
        <div className="bill" role="group" aria-label="Billing period">
          {(Object.keys(PLANS) as PlanId[]).map((id) => (
            <button key={id} type="button" aria-pressed={plan === id} onClick={() => setPlan(id)}>{PLANS[id].label}</button>
          ))}
        </div>
        <p className="amount" aria-live="polite">
          <span className="from">Starting from</span>
          <b>${p.price}</b><span>per {p.per}</span>
        </p>
        <p className="price-note">{p.note}</p>
        <ul className="ticks">{INCLUDED.map((x) => <li key={x}>{x}</li>)}</ul>
        <div className="cta-row" style={{ marginTop: 0 }}>
          <Link href={`/subscribe?plan=${plan}`} className="btn btn-primary">Get started</Link>
          <Link href="/demo" className="btn btn-ghost">Book a demo</Link>
        </div>
      </div>
      <div className="price-side">
        <h3>Need something larger?</h3>
        <p>Custom plans are available for growing travel companies and larger operations. The starting price can change with:</p>
        <ul>
          <li>The size of your business and team</li>
          <li>How many bookings you handle</li>
          <li>The features you need</li>
          <li>Custom work for your company</li>
        </ul>
        <Link href="/demo" className="btn btn-ghost" style={{ borderColor: "rgba(255,255,255,.3)", color: "#fff" }}>Talk to us about a custom plan</Link>
      </div>
    </div>
  );
}
