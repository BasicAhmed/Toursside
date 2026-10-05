import type { Metadata } from "next";
import Link from "next/link";
import { SOLUTIONS } from "@/lib/seo-pages";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({ title: "Travel agency and tour operator software: what Toursside does", fullTitle: "Travel agency and tour operator software: what Toursside does | Toursside", description: "Tour booking, group tours, flight ticket, hotel, visa and transfer orders, travel CRM, itineraries, invoicing and DMC requests in one system for agencies.", path: "/solutions" });
const List = ({ group }: { group: "core" | "sell" }) => <ul className="seo-index seo-related">{SOLUTIONS.filter((s) => s.group === group).map((s) => <li key={s.slug}><Link href={`/solutions/${s.slug}`}><b>{s.nav}</b><span>{s.description}</span></Link></li>)}</ul>;
export default function Solutions() {
  return (
    <div className="wrap" style={{ paddingBottom: "clamp(64px, 9vw, 110px)" }}><div className="page-head"><h1>One system for the whole travel business</h1><p className="lede">Each part of Toursside does one job well and shares its data with the rest, so a booking is typed once.</p></div>
      <section><h2 className="seo-h2">Run the business</h2><List group="core" /></section>
      <section className="seo-sec"><h2 className="seo-h2">Everything an agency sells</h2><p className="seo-text" style={{ marginBottom: 22 }}>Tours are one kind of order. Flight tickets, hotels, visas and transfers are orders too, with the fields each one needs, and fixed departures are managed as group tours.</p><List group="sell" /></section></div>
  );
}
