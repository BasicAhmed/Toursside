import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { SOLUTIONS, REGIONS } from "@/lib/seo-pages";
import { AR_PAGES, arFor } from "@/lib/seo-ar";
// Every page, with its Arabic or English twin where there is one (hreflang), so each language is indexed separately.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [["", 1], ["/pricing", 0.9], ["/start", 0.8], ["/demo", 0.8], ["/solutions", 0.8], ["/regions", 0.8], ...SOLUTIONS.map((x) => [`/solutions/${x.slug}`, 0.9] as [string, number]), ...REGIONS.map((x) => [`/regions/${x.slug}`, 0.9] as [string, number]), ["/ar", 0.9], ...AR_PAGES.map((x) => [`/ar/${x.slug}`, 0.9] as [string, number]), ["/subscribe", 0.5], ["/privacy", 0.3], ["/terms", 0.3]];
  const twin = (p: string): { en: string; ar: string } | null => {
    if (p === "" || p === "/ar") return { en: "", ar: "/ar" };
    const a = AR_PAGES.find((x) => `/ar/${x.slug}` === p); if (a) return { en: a.en, ar: p };
    const ar = arFor(p); return ar ? { en: p, ar } : null;
  };
  return pages.map(([p, priority]) => { const t = twin(p); return { url: `${SITE.url}${p}`, changeFrequency: "monthly", priority, ...(t ? { alternates: { languages: { en: `${SITE.url}${t.en}`, ar: `${SITE.url}${t.ar}` } } } : {}) }; });
}
