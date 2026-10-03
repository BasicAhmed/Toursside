import Image from "next/image";
import Link from "next/link";
import BeforeWith from "@/components/BeforeWith";
import Explorer from "@/components/Explorer";
import Journey from "@/components/Journey";
import Pricing from "@/components/Pricing";
import Plane from "@/components/Plane";
import HeroVideo from "@/components/HeroVideo";
import CountUp from "@/components/CountUp";
import StickyCta from "@/components/StickyCta";
import { SITE, PLANS, PLAN_IDS, whatsappLink } from "@/lib/site";
import { instantEnabled, cardPayments } from "@/lib/instant";
import { visitorCurrency } from "@/lib/visitor";
import { money } from "@/lib/currency";
import { Faqs, faqLd } from "@/components/SeoPage";
import { HOME_FAQS, SOLUTIONS, REGIONS } from "@/lib/seo-pages";

const SOURCES: [string, string, boolean][] = [
  ["Website", "Booked by the customer. The order creates itself.", true],
  ["WhatsApp", "Added by your team in New order, tagged WhatsApp.", false],
  ["Email", "Added by your team, tagged Email.", false],
  ["Phone", "Added by your team, tagged Phone.", false],
  ["Viator", "Added by your team and recorded as paid through Viator.", false],
];
const TODAY = ["A Next step button on every order that says what to do and why", "Email alerts to staff for new orders, inquiries, full payments and cancellations", "Itineraries imported from PDFs you already have", "Prices worked out from cost and profit margin", "Review invites and referral codes after each trip"];
const NEXT = ["Booking assistance", "Suggested replies to customers", "Automatic follow-ups", "Demand and revenue insights", "Itinerary suggestions", "Supplier and cost optimisation", "Reports written for you", "Workflow automation"];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE.url}/#org`, name: SITE.name, url: SITE.url, logo: `${SITE.url}/icon.png`, slogan: SITE.tagline },
    { "@type": "WebSite", "@id": `${SITE.url}/#site`, url: SITE.url, name: SITE.name, publisher: { "@id": `${SITE.url}/#org` } },
    {
      "@type": "SoftwareApplication", name: SITE.name, applicationCategory: "BusinessApplication", operatingSystem: "Web", url: SITE.url, description: SITE.description,
      offers: PLAN_IDS.map((id) => ({ "@type": "Offer", name: PLANS[id].name, price: PLANS[id].monthly, priceCurrency: "USD", description: `${PLANS[id].target}. Billed monthly, or $${PLANS[id].annual} per year.` })),
    },
    faqLd(HOME_FAQS),
  ],
};

export const dynamic = "force-dynamic";
export default async function Home() {
  // Once instant demos are switched on, "start now" becomes the main action and "book a demo" the second one.
  const instant = instantEnabled();
  const cur = await visitorCurrency();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <p className="trust-pill"><i aria-hidden="true" />Trusted by 40+ travel agents</p>
            <h1>The operating system <span className="l2">behind your travel business.</span></h1>
            <p className="lede">Toursside is software for travel agencies and tour operators. Manage bookings, customers, itineraries, invoices, payments and partner requests in one connected system, instead of five separate tools.</p>
            <div className="cta-row">
              {instant ? <Link href="/start" className="btn btn-primary">Start your free demo</Link> : <Link href="/demo" className="btn btn-primary">Book a demo</Link>}
              {instant ? <a href={whatsappLink("Hello Toursside, I have a question.")} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5.1 5.2-1.4A9.9 9.9 0 1 0 12.04 2zm5.8 14.1c-.2.7-1.4 1.300-2 1.400-.5.1-1.200.1-1.900-.1-.4-.1-1-.3-1.700-.6-3-1.300-5-4.300-5.100-4.500-.2-.2-1.200-1.600-1.200-3.100s.8-2.200 1-2.500c.3-.3.600-.4.800-.4h.6c.2 0 .4-.1.7.5l1 2.300c.1.200.1.400 0 .600l-.4.600-.5.500c-.2.200-.3.400-.1.700.2.300.8 1.300 1.700 2.100 1.200 1 2.100 1.400 2.400 1.500.3.200.5.100.700-.1l.9-1.100c.2-.300.4-.200.7-.100l2.200 1c.3.200.5.200.6.400.1.100.1.700-.100 1.400z" /></svg>Contact us on WhatsApp</a> : <a href="#product" className="btn btn-ghost">Explore Toursside</a>}
            </div>
            <p className="hero-note">Plans from {money(PLANS.starter.monthly, cur)} per month. Works on desktop and phone.</p>
          </div>
          <div className="hero-stage">
            <Plane className="hero-plane" />
            <div className="hero-frame"><HeroVideo /></div>
          </div>
        </div>
      </section>

      <section className="facts" aria-label="Toursside in numbers">
        <div className="wrap">
          <div className="facts-in">
            <div className="fact"><b><CountUp to={40} suffix="+" /></b><span>travel agents trust Toursside with their bookings</span></div>
            <div className="fact"><b><CountUp to={5} /></b><span>booking channels in one orders list</span></div>
            <div className="fact"><b><CountUp to={12} /></b><span>currencies for prices, payments and invoices</span></div>
            <div className="fact"><b><CountUp to={10} /></b><span>kinds of service you can arrange for partner companies</span></div>
          </div>
        </div>
      </section>

      <section className="section" id="why">
        <div className="wrap">
          <div className="section-head">
            <h2>A booking should not live in five places.</h2>
            <p className="lede">Most travel businesses run on chats, inboxes, spreadsheets and memory. It works until the season gets busy. Switch the view to see what changes.</p>
          </div>
          <BeforeWith />
        </div>
      </section>

      <section className="section" id="product" style={{ background: "#fff", borderBlock: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="section-head">
            <h2>See the product, not a drawing of it.</h2>
            <p className="lede">These are real Toursside screens with sample data. Pick an area to look inside.</p>
          </div>
          <Explorer />
        </div>
      </section>

      <section className="section dark journey" id="journey">
        <div className="wrap">
          <div className="section-head">
            <h2>One booking, one connected journey.</h2>
            <p className="lede">Toursside is more than a booking form. The same order carries the trip from the first message to the review, and every step knows what came before it.</p>
          </div>
          <Journey />
        </div>
      </section>

      <section className="section" id="phone">
        <div className="wrap phones-grid">
          <div>
            <h2>Your travel business doesn't stop when you leave the desk.</h2>
            <p className="lede" style={{ marginTop: 16 }}>The staff panel is built for phones as well as desktops, with nothing to install. Open it in the browser at the airport, in the van or at the hotel.</p>
            <ul className="ticks" style={{ marginTop: 22, gridTemplateColumns: "minmax(0,1fr)" }}>
              <li>Check today's orders and who is travelling this week</li>
              <li>Record a payment the moment it arrives</li>
              <li>Assign a guide or change a pickup time</li>
              <li>WhatsApp, call or email the customer from the order</li>
            </ul>
          </div>
          <div className="phones">
            <div className="phone"><Image src="/shots/m-orders-all.webp" alt="Orders list on a phone" width={600} height={1298} sizes="(min-width: 960px) 210px, 30vw" /></div>
            <div className="phone"><Image src="/shots/m-order-payment.webp" alt="An order's payment tab on a phone, showing cost, profit and balance" width={600} height={1298} sizes="(min-width: 960px) 210px, 30vw" /></div>
            <div className="phone"><Image src="/shots/m-order-operations.webp" alt="An order's operations tab on a phone, with the assigned guide and language" width={600} height={1298} sizes="(min-width: 960px) 210px, 30vw" /></div>
          </div>
        </div>
      </section>

      <section className="section" id="sources" style={{ background: "#fff", borderBlock: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="section-head">
            <h2>Wherever the booking comes from, it ends up in the same place.</h2>
            <p className="lede">Website bookings arrive on their own. For every other channel your team adds the order in under a minute and picks its source, so you can filter by channel and see where your business comes from.</p>
          </div>
          <div className="src">
            <ul className="src-list">
              {SOURCES.map(([name, how, auto]) => (
                <li key={name} className={`src-item${auto ? " auto" : ""}`}><i aria-hidden="true" /><b>{name}</b><span>{how}</span></li>
              ))}
            </ul>
            <svg className="src-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {[10, 30, 50, 70, 90].map((y) => <path key={y} className="d" d={`M0 ${y} C 50 ${y}, 50 50, 100 50`} />)}
              <path className="m" d="M50 0 V100" />
            </svg>
            <div className="src-hub">
              <Image src="/wordmark-light.png" alt="Toursside" width={253} height={44} />
              <p>One order, with everything attached to it.</p>
              <ul className="ticks on-dark-ticks">
                <li>Customer and travelers</li>
                <li>Price, invoice and payments</li>
                <li>Itinerary and documents</li>
                <li>Guide, driver and pickup</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="next">
        <div className="wrap">
          <div className="section-head">
            <h2>The future of travel operations is intelligent.</h2>
            <p className="lede">Toursside does not sell AI it has not built. Here is what the system does for you today, and what its design is being prepared for.</p>
          </div>
          <div className="ai-grid">
            <div className="ai-col ai-now">
              <span className="pill">Available today</span>
              <h3>Automation that already saves time</h3>
              <ul className="ticks">{TODAY.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div className="ai-col ai-next">
              <span className="pill">Planned, not live yet</span>
              <h3>AI features we are designing for</h3>
              <ul className="ticks">{NEXT.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="pricing" style={{ background: "#fff", borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="section-head">
            <h2>Pick the plan that fits your agency.</h2>
            <p className="lede">Growth is the complete platform and the plan we recommend. Pay yearly and get two months free.</p>
          </div>
          <Pricing currency={cur} card={instant && (await cardPayments())} />
        </div>
      </section>

      <section className="section" id="faq">
        <div className="wrap">
          <div className="section-head"><h2>Questions travel companies ask.</h2></div>
          <Faqs faqs={HOME_FAQS} />
          <h3 style={{ marginTop: 44, marginBottom: 14 }}>Explore by what you need</h3>
          <ul className="seo-more">{SOLUTIONS.map((x) => <li key={x.slug}><Link href={`/solutions/${x.slug}`}>{x.nav}</Link></li>)}</ul>
          <h3 style={{ marginTop: 30, marginBottom: 14 }}>Explore by where you work</h3>
          <ul className="seo-more">{REGIONS.map((x) => <li key={x.slug}><Link href={`/regions/${x.slug}`}>{x.nav}</Link></li>)}<li><Link href="/regions">All countries</Link></li></ul>
        </div>
      </section>

      <section className="closing on-dark">
        <svg className="closing-route" viewBox="0 0 700 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d="M-20 380C120 380 160 250 300 250S470 330 540 210 600 60 720 30" /></svg>
        <div className="wrap">
          <h2>Your tours are growing. Your systems should grow with them.</h2>
          <p>See Toursside with your own kind of trips in a short call, or start with a plan today.</p>
          <div className="cta-row">
            {instant ? <Link href="/start" className="btn btn-primary">Start your free demo</Link> : <Link href="/demo" className="btn btn-primary">Book a demo</Link>}
            {instant ? <a href={whatsappLink("Hello Toursside, I have a question.")} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5.1 5.2-1.4A9.9 9.9 0 1 0 12.04 2zm5.8 14.1c-.2.7-1.4 1.300-2 1.400-.5.1-1.200.1-1.900-.1-.4-.1-1-.3-1.700-.6-3-1.300-5-4.300-5.100-4.500-.2-.2-1.200-1.600-1.200-3.100s.8-2.200 1-2.500c.3-.3.600-.4.800-.4h.6c.2 0 .4-.1.7.5l1 2.300c.1.200.1.400 0 .600l-.4.600-.5.500c-.2.200-.3.400-.1.700.2.300.8 1.300 1.700 2.100 1.200 1 2.100 1.400 2.400 1.500.3.200.5.100.700-.1l.9-1.100c.2-.300.4-.200.7-.100l2.200 1c.3.200.5.200.6.400.1.100.1.700-.100 1.400z" /></svg>Contact us on WhatsApp</a> : <a href="#product" className="btn btn-ghost">Explore the platform</a>}
          </div>
        </div>
      </section>
      <StickyCta from={money(PLANS.starter.monthly, cur)} />
    </>
  );
}
