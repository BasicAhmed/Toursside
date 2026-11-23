import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE, PLANS, PLAN_IDS } from "@/lib/site";
import { SHOTS, SHOT_ALT } from "@/lib/shots";
import { AR_PAGES } from "@/lib/seo-ar";
import { pageMeta } from "@/lib/meta";
import { visitorCurrency } from "@/lib/visitor";
import { faqLd } from "@/components/SeoPage";
import { ArCta, ArPrices, ArFaqs } from "@/components/ArSeoPage";

// The Arabic home page: what most travel companies in Egypt and the Gulf search for ("برنامج شركات سياحة").
export const metadata: Metadata = pageMeta({
  title: "برنامج إدارة شركات السياحة والسفر", fullTitle: "Toursside | برنامج إدارة شركات السياحة والسفر بالعربية",
  description: "برنامج شركات السياحة والسفر: الحجوزات من الموقع وواتساب، الطيران والفنادق والتأشيرات، الفواتير وبرامج الرحلات PDF، الرحلات الجماعية والأرباح. لوحة تحكم عربية وتجربة مجانية 14 يومًا.",
  path: "/ar", locale: "ar", languages: { en: "/", ar: "/ar" },
});

const FAQS = [
  { q: "ما هو Toursside؟", a: "Toursside نظام سحابي لإدارة شركات السياحة والسفر: الحجوزات والعملاء والفواتير وبرامج الرحلات والرحلات الجماعية وطلبات الشركاء والأرباح، في مكان واحد، من المتصفح على الكمبيوتر أو الموبايل." },
  { q: "هل لوحة التحكم باللغة العربية؟", a: "نعم. يستطيع كل موظف تشغيل لوحة التحكم بالعربية، مع اتجاه الكتابة من اليمين إلى اليسار، أو بالإنجليزية." },
  { q: "هل توجد تجربة مجانية؟", a: "نعم. مساحة عمل تجريبية لمدة 14 يومًا باسم شركتك وألوانها، فيها أمثلة جاهزة، بدون بطاقة دفع." },
  { q: "هل أحتاج موقعًا إلكترونيًا؟", a: "لا. تحصل على موقع حجز باسم شركتك. وإن كان لديك موقع، تضيف إليه زر حجز أو تعرض رحلاتك عليه." },
  { q: "هل بياناتي آمنة؟", a: "لكل شركة قاعدة بيانات مستقلة خاصة بها، ولا يرى بياناتك إلا فريقك." },
];

export const dynamic = "force-dynamic";
export default async function ArHome() {
  const cur = await visitorCurrency();
  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: SITE.name, applicationCategory: "BusinessApplication", operatingSystem: "Web", inLanguage: ["ar", "en"], url: `${SITE.url}/ar`, description: "برنامج إدارة شركات السياحة والسفر",
      offers: PLAN_IDS.map((id) => ({ "@type": "Offer", name: PLANS[id].name, price: PLANS[id].monthly, priceCurrency: "USD" })) },
    faqLd(FAQS)] };
  const shot = SHOTS.orders;
  return (
    <div className="ar" lang="ar" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="page-hero"><div className="wrap">
        <h1 className="duo"><span className="thin">برنامج إدارة</span><span className="bold">شركات السياحة والسفر</span></h1>
        <p className="lede">كل الحجوزات من موقعك وواتساب والإيميل والتليفون في قائمة واحدة، مع الطيران والفنادق والتأشيرات، الفواتير وبرامج الرحلات PDF بشعارك، الرحلات الجماعية، وأرباحك الحقيقية. <b>بالعربية، من الكمبيوتر أو الموبايل.</b></p>
        <div className="cta-row"><ArCta /><a href="#prices" className="btn btn-ghost">شاهد الأسعار</a></div>
        <figure className="shot"><Image src={shot.src} alt={SHOT_ALT.orders} width={shot.w} height={shot.h} sizes="(min-width: 1240px) 1240px, 100vw" priority /></figure>
      </div></section>

      <section className="sec"><div className="wrap">
        <div className="sec-head"><h2 className="duo sm"><span className="bold">كل ما تحتاجه شركتك</span></h2></div>
        <ul className="stops-list">{AR_PAGES.filter((p) => !["egypt", "saudi-arabia", "uae"].includes(p.slug)).map((p) => <li key={p.slug}><Link href={`/ar/${p.slug}`}><b>{p.nav}</b><span>{p.description}</span><i aria-hidden="true" /></Link></li>)}</ul>
      </div></section>

      <section className="sec"><div className="wrap">
        <div className="sec-head"><h2 className="duo sm"><span className="bold">حسب بلدك</span></h2></div>
        <ul className="tags">{AR_PAGES.filter((p) => ["egypt", "saudi-arabia", "uae"].includes(p.slug)).map((p) => <li key={p.slug}><Link href={`/ar/${p.slug}`}>برنامج شركات السياحة في {p.nav}</Link></li>)}</ul>
      </div></section>

      <ArPrices cur={cur} />

      <section className="sec"><div className="wrap two-col">
        <h2 className="duo sm"><span className="bold">أسئلة شائعة</span></h2>
        <ArFaqs faqs={FAQS} />
      </div></section>
    </div>
  );
}
