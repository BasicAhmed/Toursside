import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoPage from "@/components/SeoPage";
import { SOLUTIONS, REGIONS, solutionBySlug } from "@/lib/seo-pages";
import { pageMeta } from "@/lib/meta";
import { instantEnabled } from "@/lib/instant";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = solutionBySlug((await params).slug); if (!s) return {};
  return pageMeta({ title: s.title, fullTitle: `${s.title} | Toursside`, description: s.description, path: `/solutions/${s.slug}`, type: "article" });
}
export default async function Solution({ params }: { params: Promise<{ slug: string }> }) {
  const s = solutionBySlug((await params).slug); if (!s) notFound();
  const related = s.related.map(solutionBySlug).filter((x) => !!x).map((x) => [x.nav, x.description, `/solutions/${x.slug}`] as [string, string, string]);
  const rest = SOLUTIONS.filter((x) => x.slug !== s.slug && !s.related.includes(x.slug)).map((x) => [x.nav, `/solutions/${x.slug}`] as [string, string]);
  return <SeoPage crumbs={[["Toursside", "/"], ["Solutions", "/solutions"], [s.nav, `/solutions/${s.slug}`]]} h1={s.h1} intro={s.intro} shots={s.shots}
    cardsTitle="What it does" cards={s.points} detail={s.detail} audience={s.audience} stepsTitle="How it works" steps={s.steps} faqs={s.faqs}
    relatedTitle="Related parts of Toursside" related={related}
    moreTitle="More from Toursside" more={[...rest, ...REGIONS.slice(0, 4).map((r) => [`Tour operator software for ${r.name}`, `/regions/${r.slug}`] as [string, string]), ["Plans and pricing", "/#pricing"], instantEnabled() ? ["Start a free demo workspace", "/start"] : ["Book a demo", "/demo"]]} />;
}
