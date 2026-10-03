import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { instantEnabled } from "@/lib/instant";
import type { Faq } from "@/lib/seo-pages";

export function Faqs({ faqs }: { faqs: Faq[] }) {
  return <div className="faqs">{faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>;
}
export const faqLd = (faqs: Faq[]) => ({ "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
export const crumbsLd = (trail: [string, string][]) => ({ "@type": "BreadcrumbList", itemListElement: trail.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE.url}${path}` })) });

// Shared shape of a search landing page: what it is, what it does, how it works, questions, next step.
export default function SeoPage({ crumbs, h1, intro, cards, cardsTitle, shot, steps, stepsTitle, faqs, more, moreTitle, note }: {
  crumbs: [string, string][]; h1: string; intro: string; cardsTitle: string; cards: [string, string][]; shot?: { src: string; alt: string };
  stepsTitle?: string; steps?: string[]; faqs: Faq[]; moreTitle: string; more: [string, string][]; note?: string;
}) {
  const instant = instantEnabled();
  const ld = { "@context": "https://schema.org", "@graph": [crumbsLd(crumbs), faqLd(faqs)] };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="wrap">
        <nav aria-label="Breadcrumb" className="crumbs">{crumbs.map(([name, path], i) => i < crumbs.length - 1 ? <span key={path}><Link href={path}>{name}</Link> / </span> : <span key={path} aria-current="page">{name}</span>)}</nav>
        <div className="page-head" style={{ paddingTop: 18 }}>
          <h1 style={{ maxWidth: "22ch" }}>{h1}</h1>
          <p className="lede">{intro}</p>
          <div className="cta-row">
            {instant ? <Link href="/start" className="btn btn-primary">Start your free demo</Link> : <Link href="/demo" className="btn btn-primary">Book a demo</Link>}
            <Link href="/#pricing" className="btn btn-ghost">See pricing</Link>
          </div>
        </div>
        {shot ? <div className="shot seo-shot"><Image src={`/shots/${shot.src}.webp`} alt={shot.alt} width={1490} height={1125} sizes="(min-width: 1180px) 1180px, 100vw" priority /></div> : null}
        <section className="seo-sec"><h2>{cardsTitle}</h2>
          <div className="seo-cards">{cards.map(([t, d]) => <div key={t}><h3>{t}</h3><p>{d}</p></div>)}</div>
          {note ? <p className="seo-note">{note}</p> : null}</section>
        {steps ? <section className="seo-sec"><h2>{stepsTitle}</h2><ol className="seo-steps">{steps.map((s) => <li key={s}>{s}</li>)}</ol></section> : null}
        <section className="seo-sec"><h2>Questions</h2><Faqs faqs={faqs} /></section>
        <section className="seo-sec"><h2>{moreTitle}</h2><ul className="seo-more">{more.map(([name, path]) => <li key={path}><Link href={path}>{name}</Link></li>)}</ul></section>
      </div>
      <section className="closing on-dark" style={{ marginTop: 40 }}><div className="wrap">
        <h2>See it with your own kind of trips.</h2><p>A demo workspace is ready in seconds. Works on a computer and a phone.</p>
        <div className="cta-row">{instant ? <Link href="/start" className="btn btn-primary">Start your free demo</Link> : <Link href="/demo" className="btn btn-primary">Book a demo</Link>}<Link href="/" className="btn btn-ghost">How Toursside works</Link></div>
      </div></section>
    </>
  );
}
