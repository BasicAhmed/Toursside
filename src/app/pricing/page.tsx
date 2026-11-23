import type { Metadata } from "next";
import Link from "next/link";
import Pricing from "@/components/Pricing";
import { Faqs, faqLd, crumbsLd, Crumbs } from "@/components/SeoPage";
import Closing, { MainCta } from "@/components/Closing";
import { SITE, PLANS, PLAN_IDS } from "@/lib/site";
import { LOCAL_PRICE } from "@/lib/currency";
import { pageMeta } from "@/lib/meta";
import { visitorCurrency } from "@/lib/visitor";
import { instantEnabled, cardPayments, TRIAL_DAYS } from "@/lib/instant";

// A page of its own for "travel agency software pricing" searches, which the home page's pricing section cannot rank for.
export const metadata: Metadata = pageMeta({
  title: "Travel agency software pricing", fullTitle: "Travel agency software pricing: plans from $39 a month | Toursside",
  description: "Toursside plans for travel agencies and tour operators: Starter, Growth and Business, monthly or yearly with two months free. Free 14-day demo, no card needed. Local prices in Egypt.",
  path: "/pricing",
});

const FAQS = [
  { q: "Is there a free trial?", a: `Yes. A ${TRIAL_DAYS}-day demo workspace with your company name and colours, filled with sample orders. No card is needed to start.` },
  { q: "What do I get when I pay yearly?", a: "Yearly plans cost ten months' price for twelve months, and include free setup: we add your tours, your logo and your first customers. On Growth and Business, a redesign of your website with SEO is included too." },
  { q: "Can I change plan or cancel?", a: "Yes, any time from your workspace. Moving to a smaller plan never deletes anything: sections outside that plan are locked until you move back up." },
  { q: "Which plan do most agencies choose?", a: "Growth. It adds group tours with passenger manifests, partner requests, finance and reports, and your tours on your own website, for up to 5 staff." },
  { q: "Do you have prices in Egyptian pounds?", a: "Yes. In Egypt, plans have fixed prices in pounds: Starter EGP 999, Growth EGP 1,999 and Business EGP 3,999 a month, paid by card in pounds or by InstaPay, wallet or bank transfer." },
  { q: "How many staff accounts are included?", a: "Starter includes 2, Growth 5 and Business 15. Enterprise plans are tailored for larger teams." },
];

export const dynamic = "force-dynamic";
export default async function PricingPage() {
  const cur = await visitorCurrency();
  const instant = instantEnabled();
  const crumbs: [string, string][] = [["Toursside", "/"], ["Pricing", "/pricing"]];
  const ld = { "@context": "https://schema.org", "@graph": [crumbsLd(crumbs), faqLd(FAQS), {
    "@type": "SoftwareApplication", name: SITE.name, applicationCategory: "BusinessApplication", operatingSystem: "Web", url: `${SITE.url}/pricing`,
    offers: [
      ...PLAN_IDS.map((id) => ({ "@type": "Offer", name: `${PLANS[id].name}, monthly`, price: PLANS[id].monthly, priceCurrency: "USD" })),
      ...PLAN_IDS.map((id) => ({ "@type": "Offer", name: `${PLANS[id].name}, yearly`, price: PLANS[id].annual, priceCurrency: "USD" })),
      ...PLAN_IDS.map((id) => ({ "@type": "Offer", name: `${PLANS[id].name}, monthly (Egypt)`, price: LOCAL_PRICE.EGP?.[PLANS[id].monthly] ?? PLANS[id].monthly, priceCurrency: "EGP", eligibleRegion: { "@type": "Country", name: "Egypt" } })),
    ] }] };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="page-hero"><div className="wrap">
        <Crumbs trail={crumbs} />
        <h1 className="duo"><span className="thin">Travel agency software</span><span className="bold">pricing.</span></h1>
        <p className="lede">Three plans for travel agencies, tour operators and DMCs. Pay monthly, or yearly and get two months free plus free setup. <b>Start with a free {TRIAL_DAYS}-day demo, no card needed.</b></p>
        <div className="cta-row"><MainCta /><Link href="/ar#prices" className="btn btn-ghost lang-link" hrefLang="ar" lang="ar">الأسعار بالعربية</Link></div>
      </div></section>
      <section className="fares" id="fares"><div className="wrap">
        <Pricing currency={cur} card={instant && (await cardPayments())} />
      </div></section>
      <section className="sec"><div className="wrap two-col">
        <h2 className="duo sm"><span className="thin">Questions</span><span className="bold">about plans.</span></h2>
        <Faqs faqs={FAQS} />
      </div></section>
      <Closing />
    </>
  );
}
