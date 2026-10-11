import type { Metadata } from "next";
import Link from "next/link";
import { REGIONS } from "@/lib/seo-pages";
import { pageMeta } from "@/lib/meta";
import Closing from "@/components/Closing";

export const metadata: Metadata = pageMeta({ title: "Tour operator software by country: Egypt, the Middle East and worldwide", fullTitle: "Tour operator software by country: Egypt, the Middle East and worldwide | Toursside", description: "Toursside works for tour operators and travel agencies in any country. See how it fits travel companies in Egypt, the UAE, Saudi Arabia, Jordan, Morocco and Turkey.", path: "/regions" });

export default function Regions() {
  return (
    <>
      <section className="page-hero"><div className="wrap">
        <h1 className="duo"><span className="thin">Wherever your trips are,</span><span className="bold">the same route.</span></h1>
        <p className="lede">Toursside runs in a browser, prices in twelve currencies and needs no country-specific setup, so it works wherever your trips are. It was built from the daily work of a tour operator in Egypt, and these pages show how it fits travel companies across the region.</p>
      </div></section>
      <section className="sec"><div className="wrap">
        <h2 className="sr">Countries and regions</h2>
        <div className="countries">{REGIONS.map((r) => <Link key={r.slug} className="country" href={`/regions/${r.slug}`}><b>{r.nav}</b><span>{r.description}</span></Link>)}</div>
      </div></section>
      <Closing />
    </>
  );
}
