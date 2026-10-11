import type { Metadata } from "next";
import Link from "next/link";
import { SOLUTIONS } from "@/lib/seo-pages";
import { pageMeta } from "@/lib/meta";
import Closing from "@/components/Closing";

export const metadata: Metadata = pageMeta({ title: "Travel agency and tour operator software: what Toursside does", fullTitle: "Travel agency and tour operator software: what Toursside does | Toursside", description: "Tour booking, group tours, flight ticket, hotel, visa and transfer orders, travel CRM, itineraries, invoicing and DMC requests in one system for agencies.", path: "/solutions" });

// Each part of the product is a stop on the road.
const Stops = ({ group }: { group: "core" | "sell" }) => (
  <ul className="stops-list">{SOLUTIONS.filter((s) => s.group === group).map((s) => <li key={s.slug}><Link href={`/solutions/${s.slug}`}><b>{s.nav}</b><span>{s.description}</span><i aria-hidden="true" /></Link></li>)}</ul>
);
const count = (group: "core" | "sell") => SOLUTIONS.filter((s) => s.group === group).length;

export default function Solutions() {
  return (
    <>
      <section className="page-hero"><div className="wrap">
        <h1 className="duo"><span className="thin">One system,</span><span className="bold">every part of the trip.</span></h1>
        <p className="lede">Each part of Toursside does one job well and shares its data with the rest, so a booking is typed once.</p>
      </div></section>
      <section className="sec"><div className="wrap">
        <div className="group-h"><h2>Run the business</h2><span>{count("core")} parts</span></div>
        <Stops group="core" />
      </div></section>
      <section className="sec"><div className="wrap">
        <div className="group-h"><h2>Everything an agency sells</h2><span>{count("sell")} kinds of order</span></div>
        <p className="lede" style={{ margin: "0 0 18px" }}>Tours are one kind of order. Flight tickets, hotels, visas and transfers are orders too, with the fields each one needs, and fixed departures are managed as group tours.</p>
        <Stops group="sell" />
      </div></section>
      <Closing />
    </>
  );
}
