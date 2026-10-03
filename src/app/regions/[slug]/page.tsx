import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoPage from "@/components/SeoPage";
import { SOLUTIONS, REGIONS } from "@/lib/seo-pages";

export const dynamic = "force-dynamic";
const find = (slug: string) => REGIONS.find((r) => r.slug === slug);
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const r = find((await params).slug); if (!r) return {};
  return { title: { absolute: `${r.title} | Toursside` }, description: r.description, alternates: { canonical: `/regions/${r.slug}` }, openGraph: { title: r.title, description: r.description, url: `/regions/${r.slug}`, type: "article" } };
}
export default async function Region({ params }: { params: Promise<{ slug: string }> }) {
  const r = find((await params).slug); if (!r) notFound();
  return <SeoPage crumbs={[["Toursside", "/"], ["Regions", "/regions"], [r.nav, `/regions/${r.slug}`]]} h1={r.h1} intro={r.intro} shot={{ src: "orders", alt: "Toursside orders list with bookings from several channels" }}
    cardsTitle={`How it fits travel companies in ${r.name}`} cards={r.fit} note={`Prices, payments and invoices for ${r.name}: ${r.currencies}.`} faqs={r.faqs}
    moreTitle="What Toursside does" more={[...SOLUTIONS.map((x) => [x.nav, `/solutions/${x.slug}`] as [string, string]), ...REGIONS.filter((x) => x.slug !== r.slug).map((x) => [x.nav, `/regions/${x.slug}`] as [string, string])]} />;
}
