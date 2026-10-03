import type { Metadata } from "next";
import Link from "next/link";
import { REGIONS } from "@/lib/seo-pages";

export const metadata: Metadata = { title: { absolute: "Tour operator software by country: Egypt, the Middle East and worldwide | Toursside" }, description: "Toursside works for tour operators and travel agencies in any country. See how it fits travel companies in Egypt, the UAE, Saudi Arabia, Jordan, Morocco and Turkey.", alternates: { canonical: "/regions" } };
export default function Regions() {
  return (
    <div className="wrap"><div className="page-head"><h1>Tour operator software for any country</h1><p className="lede">Toursside runs in a browser, prices in twelve currencies and needs no country-specific setup, so it works wherever your trips are. It was built from the daily work of a tour operator in Egypt, and these pages show how it fits travel companies across the region.</p></div>
      <ul className="seo-index">{REGIONS.map((r) => <li key={r.slug}><Link href={`/regions/${r.slug}`}><b>{r.nav}</b><span>{r.description}</span></Link></li>)}</ul></div>
  );
}
