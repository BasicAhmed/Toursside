import Link from "next/link";
import HeroMap from "@/components/home/HeroMap";
import BookingScene from "@/components/home/BookingScene";
import TripStops from "@/components/home/TripStops";
import Pricing from "@/components/Pricing";
import Closing, { MainCta, WhatsAppCta } from "@/components/Closing";
import { SITE, PLANS, PLAN_IDS } from "@/lib/site";
import { instantEnabled, cardPayments } from "@/lib/instant";
import { visitorCurrency } from "@/lib/visitor";
import { money } from "@/lib/currency";
import { Faqs, faqLd } from "@/components/SeoPage";
import { HOME_FAQS, SOLUTIONS, REGIONS } from "@/lib/seo-pages";

// What the product does today, for search engines. Keep in step with the solution pages.
const FEATURES = ["Orders from website, WhatsApp, email, phone and Viator in one list", "Order types: tour, flight ticket, hotel, visa, transportation and other", "Flight orders with airline, route, PNR and ticket number", "Hotel orders with check-in, check-out, rooms, board and confirmation number", "Visa orders with applicants, application and appointment dates, reference and status", "Transport orders with pickup, drop-off, vehicle and driver", "Orders linked as a package with combined total, paid and balance", "Group tours with fixed departures, capacity and seats left", "Passenger manifest PDF", "Bulk actions on orders, tours, itineraries, inquiries and partner requests", "Customer records, inquiries, reviews and referral codes", "Day-by-day itinerary builder with PDF import", "Invoices, deposits and balances in twelve currencies", "Three document designs: Bold, Classic and Minimal", "Partner requests for destination management companies", "Finance and reports by month", "Tours and group departures on your own booking website", "Staff accounts with roles"];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE.url}/#org`, name: SITE.name, url: SITE.url, logo: `${SITE.url}/icon.png`, slogan: SITE.tagline },
    { "@type": "WebSite", "@id": `${SITE.url}/#site`, url: SITE.url, name: SITE.name, publisher: { "@id": `${SITE.url}/#org` } },
    {
      "@type": "SoftwareApplication", name: SITE.name, applicationCategory: "BusinessApplication", operatingSystem: "Web", url: SITE.url, description: SITE.description, featureList: FEATURES,
      offers: PLAN_IDS.map((id) => ({ "@type": "Offer", name: PLANS[id].name, price: PLANS[id].monthly, priceCurrency: "USD", description: `${PLANS[id].target}. Billed monthly, or $${PLANS[id].annual} per year.` })),
    },
    faqLd(HOME_FAQS),
  ],
};

export const dynamic = "force-dynamic";
export default async function Home() {
  const instant = instantEnabled();
  const cur = await visitorCurrency();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="hero">
        <div className="wrap hero-in">
          <div>
            <h1><span className="thin">First message,</span><span className="thin">final review,</span><span className="bold">one route.</span></h1>
            <p className="hero-lede">Toursside runs a travel business on one connected route. <b>Tours, flights, hotels, visas and transfers</b>, each order with its invoice, payments, guide and driver, from the first WhatsApp to the review after the trip.</p>
            <div className="cta-row"><MainCta /><WhatsAppCta /></div>
            <p className="hero-note">{SITE.trustedBy}. From <b>{money(PLANS.starter.monthly, cur)}</b> a month. Works in the browser, on any phone.</p>
          </div>
          <HeroMap />
        </div>
      </section>

      <BookingScene />

      <section className="trip" id="sell">
        <div className="wrap">
          <div className="trip-head">
            <h2 className="duo md"><span className="thin">Everything you sell,</span><span className="bold">on one trip.</span></h2>
            <p>Sarah's week in Egypt is <b>five orders of five kinds</b>, each with its own details, invoice and status, linked as one package. Tap a stop to see it.</p>
          </div>
          <TripStops />
        </div>
      </section>

      <section className="fares" id="fares">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="duo md"><span className="thin">Pick a fare.</span><span className="bold">Board today.</span></h2>
            <p>Growth is the complete platform and the one most agencies choose. Pay yearly and get two months free.</p>
          </div>
          <Pricing currency={cur} card={instant && (await cardPayments())} />
        </div>
      </section>

      <section className="sec" id="faq">
        <div className="wrap two-col">
          <h2 className="duo md"><span className="thin">Before</span><span className="bold">you board.</span></h2>
          <Faqs faqs={HOME_FAQS} />
        </div>
      </section>

      <section className="sec" aria-label="Explore Toursside">
        <div className="wrap">
          <div className="group-h"><h2>Explore by what you need</h2></div>
          <ul className="tags">{SOLUTIONS.filter((x) => x.group === "core").map((x) => <li key={x.slug}><Link href={`/solutions/${x.slug}`}>{x.nav}</Link></li>)}</ul>
          <div className="group-h" style={{ marginTop: 40 }}><h2>Explore by what you sell</h2></div>
          <ul className="tags">{SOLUTIONS.filter((x) => x.group === "sell").map((x) => <li key={x.slug}><Link href={`/solutions/${x.slug}`}>{x.nav}</Link></li>)}</ul>
          <div className="group-h" style={{ marginTop: 40 }}><h2>Explore by where you work</h2></div>
          <ul className="tags">{REGIONS.map((x) => <li key={x.slug}><Link href={`/regions/${x.slug}`}>{x.nav}</Link></li>)}<li><Link href="/regions">All countries</Link></li></ul>
        </div>
      </section>

      <Closing />
    </>
  );
}
