import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { SOLUTIONS, REGIONS } from "@/lib/seo-pages";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [["", 1], ["/start", 0.8], ["/demo", 0.8], ["/solutions", 0.8], ["/regions", 0.8], ...SOLUTIONS.map((x) => [`/solutions/${x.slug}`, 0.9] as [string, number]), ...REGIONS.map((x) => [`/regions/${x.slug}`, 0.9] as [string, number]), ["/subscribe", 0.5], ["/privacy", 0.3], ["/terms", 0.3]];
  return pages.map(([p, priority]) => ({ url: `${SITE.url}${p}`, changeFrequency: "monthly", priority }));
}
