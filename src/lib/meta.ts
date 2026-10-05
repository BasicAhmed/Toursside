import type { Metadata } from "next";
import { SITE } from "./site";

// One place that builds a page's search and sharing tags, so every page has its own title, description, canonical
// address and Open Graph / Twitter text instead of falling back to the site-wide ones.
// The site-wide social preview image (src/app/opengraph-image.png). A page that sets its own Open Graph text would
// otherwise lose it.
const IMAGE = { url: "/opengraph-image.png", width: 1200, height: 630, alt: `${SITE.name}: ${SITE.tagline}` };
export function pageMeta({ title, description, path, type = "website", fullTitle }: { title: string; description: string; path: string; type?: "website" | "article"; fullTitle?: string }): Metadata {
  return {
    title: fullTitle ? { absolute: fullTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type, siteName: SITE.name, locale: "en", title, description, url: path, images: [IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [IMAGE.url] },
  };
}
