import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoPage from "@/components/SeoPage";
import { SOLUTIONS, REGIONS } from "@/lib/seo-pages";

export const dynamic = "force-dynamic";
const find = (slug: string) => SOLUTIONS.find((s) => s.slug === slug);
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = find((await params).slug); if (!s) return {};
  return { title: { absolute: `${s.title} | Toursside` }, description: s.description, alternates: { canonical: `/solutions/${s.slug}` }, openGraph: { title: s.title, description: s.description, url: `/solutions/${s.slug}`, type: "article" } };
}
export default async function Solution({ params }: { params: Promise<{ slug: string }> }) {
  const s = find((await params).slug); if (!s) notFound();
  return <SeoPage crumbs={[["Toursside", "/"], ["Solutions", "/solutions"], [s.nav, `/solutions/${s.slug}`]]} h1={s.h1} intro={s.intro} shot={{ src: s.shot, alt: s.shotAlt }}
    cardsTitle="What it does" cards={s.points} stepsTitle="How it works" steps={s.steps} faqs={s.faqs}
    moreTitle="More from Toursside" more={[...SOLUTIONS.filter((x) => x.slug !== s.slug).map((x) => [x.nav, `/solutions/${x.slug}`] as [string, string]), ...REGIONS.slice(0, 2).map((r) => [`Tour operator software for ${r.name}`, `/regions/${r.slug}`] as [string, string])]} />;
}
