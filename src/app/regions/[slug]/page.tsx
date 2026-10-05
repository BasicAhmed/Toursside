import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoPage from "@/components/SeoPage";
import { SOLUTIONS, REGIONS } from "@/lib/seo-pages";
import { pageMeta } from "@/lib/meta";
import { SHOT_ALT } from "@/lib/shots";

export const dynamic = "force-dynamic";
const find = (slug: string) => REGIONS.find((r) => r.slug === slug);
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const r = find((await params).slug); if (!r) return {};
  return pageMeta({ title: r.title, fullTitle: `${r.title} | Toursside`, description: r.description, path: `/regions/${r.slug}`, type: "article" });
}
export default async function Region({ params }: { params: Promise<{ slug: string }> }) {
  const r = find((await params).slug); if (!r) notFound();
  return <SeoPage crumbs={[["Toursside", "/"], ["Regions", "/regions"], [r.nav, `/regions/${r.slug}`]]} h1={r.h1} intro={r.intro} shots={[["orders", SHOT_ALT.orders]]}
    cardsTitle={`How it fits travel companies in ${r.name}`} cards={r.fit} note={`Prices, payments and invoices for ${r.name}: ${r.currencies}.`} faqs={r.faqs}
    extra={{ title: "Flights, hotels, visas and group departures", text: r.beyond, links: [["Travel agency back office software", "/solutions/travel-agency-back-office"], ["Group tour management software", "/solutions/group-tour-management-software"], ["Visa tracking for travel agencies", "/solutions/visa-application-management"], ["Flight ticket management", "/solutions/flight-ticket-booking-management"]] }}
    moreTitle="What Toursside does" more={[...SOLUTIONS.filter((x) => !["travel-agency-back-office", "group-tour-management-software", "visa-application-management", "flight-ticket-booking-management"].includes(x.slug)).map((x) => [x.nav, `/solutions/${x.slug}`] as [string, string]), ...REGIONS.filter((x) => x.slug !== r.slug).map((x) => [x.nav, `/regions/${x.slug}`] as [string, string])]} />;
}
