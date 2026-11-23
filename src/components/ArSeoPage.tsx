// The Arabic search pages (/ar): the same shape as SeoPage, right to left, with Arabic headings and actions.
import Image from "next/image";
import Link from "next/link";
import { SITE, PLANS, PLAN_IDS, MAIN_PLAN } from "@/lib/site";
import { SHOTS } from "@/lib/shots";
import { AR_PAGES, type ArPage } from "@/lib/seo-ar";
import { faqLd, crumbsLd } from "./SeoPage";
import { instantEnabled } from "@/lib/instant";
import { money, moneyYear, LOCAL_PRICE, type CurrencyCode } from "@/lib/currency";
import type { Faq } from "@/lib/seo-pages";

export function ArCta() {
  return instantEnabled()
    ? <Link href="/start" className="btn btn-primary">ابدأ تجربتك المجانية 14 يومًا</Link>
    : <Link href="/demo" className="btn btn-primary">احجز عرضًا توضيحيًا</Link>;
}

const AR_PLAN: Record<string, { who: string; has: string[] }> = {
  starter: { who: "للشركات الصغيرة والجديدة", has: ["الطلبات والعملاء والاستفسارات", "الرحلات وبرامج الرحلات والفواتير PDF", "موظفان", "يعمل على الموبايل"] },
  growth: { who: "لشركات السياحة الجادة", has: ["كل ما في Starter", "الرحلات الجماعية وقوائم الركاب", "طلبات الشركاء والمالية والتقارير", "رحلاتك على موقعك الحالي", "5 موظفين"] },
  business: { who: "للشركات الكبيرة وشركات DMC", has: ["كل ما في Growth", "15 موظفًا", "دعم أولوية"] },
};

// Prices in the visitor's currency: fixed pounds in Egypt (Test 1), converted from dollars elsewhere.
export function ArPrices({ cur }: { cur: CurrencyCode }) {
  return (
    <section className="sec" id="prices"><div className="wrap">
      <div className="sec-head"><h2 className="duo sm"><span className="bold">الأسعار</span></h2></div>
      <p className="lede">الاشتراك السنوي بسعر 10 شهور فقط، ويشمل إعدادًا مجانيًا (نضيف رحلاتك وشعارك وأول عملائك)، وفي باقتي Growth وBusiness إعادة تصميم موقعك مع SEO مجانًا.</p>
      <div className="price-cards">
        {PLAN_IDS.map((id) => (
          <div key={id} className={`price-card${id === MAIN_PLAN ? " main" : ""}`}>
            <h3>{PLANS[id].name}</h3>
            <p className="note-line" style={{ margin: "4px 0 0" }}>{AR_PLAN[id]?.who}</p>
            <p className="amt" dir="ltr" style={{ textAlign: "right" }}>{money(PLANS[id].monthly, cur)}</p>
            <p>شهريًا، أو <span dir="ltr">{moneyYear(PLANS[id].monthly, cur)}</span> سنويًا</p>
            <ul>{AR_PLAN[id]?.has.map((h) => <li key={h}>{h}</li>)}</ul>
          </div>
        ))}
      </div>
      <p className="note-line">{LOCAL_PRICE[cur] ? "الأسعار بالجنيه المصري ثابتة. الدفع بالبطاقة أو إنستاباي أو المحفظة أو التحويل البنكي." : cur === "USD" ? "الأسعار بالدولار الأمريكي." : "الأسعار محوّلة تقريبيًا من الدولار الأمريكي."} يمكنك تغيير الباقة أو الإلغاء في أي وقت.</p>
      <div className="cta-row" style={{ marginTop: 24 }}><ArCta /><Link href="/#fares" className="btn btn-ghost" hrefLang="en">Pricing in English</Link></div>
    </div></section>
  );
}

export function ArFaqs({ faqs }: { faqs: Faq[] }) {
  return <div className="faq">{faqs.map((f, i) => <details key={f.q} open={i === 0}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>;
}

export function ArMore({ skip }: { skip?: string }) {
  return (
    <section className="sec"><div className="wrap">
      <div className="group-h"><h2>المزيد عن Toursside</h2></div>
      <ul className="tags">{AR_PAGES.filter((p) => p.slug !== skip).map((p) => <li key={p.slug}><Link href={`/ar/${p.slug}`}>{p.nav}</Link></li>)}<li><Link href="/ar">الصفحة الرئيسية بالعربية</Link></li></ul>
    </div></section>
  );
}

export default function ArSeoPage({ p, cur }: { p: ArPage; cur: CurrencyCode }) {
  const crumbs: [string, string][] = [["Toursside", "/ar"], [p.nav, `/ar/${p.slug}`]];
  const ld = { "@context": "https://schema.org", "@graph": [crumbsLd(crumbs), faqLd(p.faqs), { "@type": "WebPage", name: p.title, description: p.description, inLanguage: "ar", url: `${SITE.url}/ar/${p.slug}` }] };
  const shot = p.shots[0] ? { ...SHOTS[p.shots[0][0]], alt: p.shots[0][1] } : null;
  return (
    <div className="ar" lang="ar" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="page-hero"><div className="wrap">
        <nav aria-label="مسار الصفحة" className="crumbs"><Link href="/ar">Toursside</Link> / <span aria-current="page">{p.nav}</span></nav>
        <h1 className="duo"><span className="bold">{p.h1}</span></h1>
        <p className="lede">{p.intro}</p>
        <div className="cta-row"><ArCta /><a href="#prices" className="btn btn-ghost">شاهد الأسعار</a></div>
        {shot ? <figure className="shot"><Image src={shot.src} alt={shot.alt} width={shot.w} height={shot.h} sizes="(min-width: 1240px) 1240px, 100vw" priority /></figure> : null}
      </div></section>

      <section className="sec"><div className="wrap">
        <div className="sec-head"><h2 className="duo sm"><span className="bold">ماذا يقدم لك</span></h2></div>
        <ul className="points">{p.points.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}</ul>
      </div></section>

      <section className="sec"><div className="wrap">
        <div className="sec-head"><h2 className="duo sm"><span className="bold">لمن هذا البرنامج</span></h2></div>
        <ul className="who">{p.audience.map((a) => <li key={a}>{a}</li>)}</ul>
      </div></section>

      <section className="sec"><div className="wrap">
        <div className="sec-head"><h2 className="duo sm"><span className="bold">كيف يعمل</span></h2></div>
        <ol className="how">{p.steps.map((s, i) => <li key={s}><span className="n" aria-hidden="true">{i + 1}</span><p>{s}</p></li>)}</ol>
      </div></section>

      <ArPrices cur={cur} />

      <section className="sec"><div className="wrap two-col">
        <h2 className="duo sm"><span className="bold">أسئلة شائعة</span></h2>
        <ArFaqs faqs={p.faqs} />
      </div></section>

      <ArMore skip={p.slug} />
    </div>
  );
}
