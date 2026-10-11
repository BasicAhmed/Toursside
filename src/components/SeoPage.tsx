import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import type { Faq } from "@/lib/seo-pages";
import { SHOTS, type ShotKey } from "@/lib/shots";
import Closing, { MainCta } from "./Closing";

export function Faqs({ faqs }: { faqs: Faq[] }) {
  return <div className="faq">{faqs.map((f, i) => <details key={f.q} open={i === 0}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>;
}
export const faqLd = (faqs: Faq[]) => ({ "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
export const crumbsLd = (trail: [string, string][]) => ({ "@type": "BreadcrumbList", itemListElement: trail.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE.url}${path}` })) });

/** A headline in the site's two weights: the opening words thin, the rest bold. Split where the sentence turns
 *  ("Tour booking software | that keeps every booking in one list"); a short headline stays bold. */
export function Duo({ text, as: Tag = "h1", size }: { text: string; as?: "h1" | "h2"; size?: "md" | "sm" }) {
  const words = text.split(" ");
  const at = words.findIndex((w, i) => i >= 2 && /^(that|for|built|with|which|where|in|across|from|to|on|and|so|without|instead)$/i.test(w));
  const colon = text.indexOf(": ");
  const [thin, bold] = colon > 0 ? [text.slice(0, colon + 1), text.slice(colon + 2)] : at > 0 && words.length > 4 ? [words.slice(0, at).join(" "), words.slice(at).join(" ")] : ["", text];
  return <Tag className={`duo${size ? ` ${size}` : ""}`}>{thin ? <span className="thin">{thin}</span> : null}<span className="bold">{bold}</span></Tag>;
}

export function Crumbs({ trail }: { trail: [string, string][] }) {
  return <nav aria-label="Breadcrumb" className="crumbs">{trail.map(([name, path], i) => i < trail.length - 1 ? <span key={path}><Link href={path}>{name}</Link> / </span> : <span key={path} aria-current="page">{name}</span>)}</nav>;
}

// Desktop shots stack full width; phone shots stand side by side in handsets.
function Shots({ shots }: { shots: [ShotKey, string][] }) {
  const all = shots.map(([key, alt]) => ({ key, alt, ...SHOTS[key] }));
  const phones = all.filter((s) => "phone" in s && s.phone), desk = all.filter((s) => !("phone" in s && s.phone));
  return (
    <>
      {desk.map((s, i) => <figure key={s.key} className="shot"><Image src={s.src} alt={s.alt} width={s.w} height={s.h} sizes="(min-width: 1240px) 1240px, 100vw" priority={i === 0} /></figure>)}
      {phones.length ? <div className="shot-phones">{phones.map((s, i) => <div key={s.key} className="handset"><Image src={s.src} alt={s.alt} width={s.w} height={s.h} sizes="(min-width: 960px) 250px, 30vw" priority={i === 0 && !desk.length} /></div>)}</div> : null}
    </>
  );
}

// Shared shape of a search landing page: what it is, what it does, how it works, questions, where to go next.
export default function SeoPage({ crumbs, h1, intro, cards, cardsTitle, shots, detail, audience, steps, stepsTitle, faqs, related, relatedTitle, more, moreTitle, note, extra }: {
  crumbs: [string, string][]; h1: string; intro: string; cardsTitle: string; cards: [string, string][]; shots?: [ShotKey, string][];
  detail?: { h: string; p: string }[]; audience?: string[]; stepsTitle?: string; steps?: string[]; faqs: Faq[];
  relatedTitle?: string; related?: [string, string, string][]; moreTitle: string; more: [string, string][]; note?: string;
  extra?: { title: string; text: string; links: [string, string][] };
}) {
  const ld = { "@context": "https://schema.org", "@graph": [crumbsLd(crumbs), faqLd(faqs)] };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="page-hero"><div className="wrap">
        <Crumbs trail={crumbs} />
        <Duo text={h1} />
        <p className="lede">{intro}</p>
        <div className="cta-row"><MainCta /><Link href="/#fares" className="btn btn-ghost">See pricing</Link></div>
        {shots?.length ? <Shots shots={shots} /> : null}
      </div></section>

      <section className="sec"><div className="wrap">
        <div className="sec-head"><Duo text={cardsTitle} as="h2" size="sm" /></div>
        <ul className="points">{cards.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}</ul>
        {note ? <p className="note-line">{note}</p> : null}
      </div></section>

      {extra ? <section className="sec"><div className="wrap two-col">
        <p className="pull-h">{extra.title}</p>
        <div><p className="pull">{extra.text}</p><ul className="tags" style={{ marginTop: 24 }}>{extra.links.map(([name, path]) => <li key={path}><Link href={path}>{name}</Link></li>)}</ul></div>
      </div></section> : null}

      {detail?.map((d) => <section key={d.h} className="sec"><div className="wrap two-col"><p className="pull-h">{d.h}</p><p className="pull">{d.p}</p></div></section>)}

      {audience?.length ? <section className="sec"><div className="wrap">
        <div className="sec-head"><h2 className="duo sm"><span className="thin">Who it is</span><span className="bold">for.</span></h2></div>
        <ul className="who">{audience.map((a) => <li key={a}>{a}</li>)}</ul>
      </div></section> : null}

      {steps?.length ? <section className="sec"><div className="wrap">
        <div className="sec-head">{stepsTitle === "How it works" || !stepsTitle ? <h2 className="duo sm"><span className="thin">How it</span><span className="bold">works.</span></h2> : <Duo text={stepsTitle} as="h2" size="sm" />}</div>
        <ol className="how">{steps.map((s, i) => <li key={s}><span className="n" aria-hidden="true">{i + 1}</span><p>{s}</p></li>)}</ol>
      </div></section> : null}

      <section className="sec"><div className="wrap two-col">
        <h2 className="duo sm"><span className="thin">Questions</span><span className="bold">people ask.</span></h2>
        <Faqs faqs={faqs} />
      </div></section>

      <section className="sec"><div className="wrap">
        {related?.length ? <>
          <div className="group-h"><h2>{relatedTitle}</h2></div>
          <ul className="stops-list">{related.map(([name, text, path]) => <li key={path}><Link href={path}><b>{name}</b><span>{text}</span><i aria-hidden="true" /></Link></li>)}</ul>
          <div className="group-h" style={{ marginTop: 48 }}><h2>{moreTitle}</h2></div>
        </> : <div className="group-h"><h2>{moreTitle}</h2></div>}
        <ul className="tags">{more.map(([name, path]) => <li key={path}><Link href={path}>{name}</Link></li>)}</ul>
      </div></section>

      <Closing />
    </>
  );
}
