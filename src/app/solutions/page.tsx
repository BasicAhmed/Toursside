import type { Metadata } from "next";
import Link from "next/link";
import { SOLUTIONS } from "@/lib/seo-pages";

export const metadata: Metadata = { title: { absolute: "Travel agency and tour operator software: what Toursside does | Toursside" }, description: "Tour booking, travel CRM, itinerary builder, invoicing, DMC requests and website booking, in one system for travel agencies and tour operators.", alternates: { canonical: "/solutions" } };
export default function Solutions() {
  return (
    <div className="wrap"><div className="page-head"><h1>One system for the whole travel business</h1><p className="lede">Each part of Toursside does one job well and shares its data with the rest, so a booking is typed once.</p></div>
      <ul className="seo-index">{SOLUTIONS.map((s) => <li key={s.slug}><Link href={`/solutions/${s.slug}`}><b>{s.nav}</b><span>{s.description}</span></Link></li>)}</ul></div>
  );
}
