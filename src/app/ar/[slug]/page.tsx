import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArSeoPage from "@/components/ArSeoPage";
import { arPageBySlug } from "@/lib/seo-ar";
import { pageMeta } from "@/lib/meta";
import { visitorCurrency } from "@/lib/visitor";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = arPageBySlug((await params).slug); if (!p) return {};
  return pageMeta({ title: p.title, fullTitle: `${p.title} | Toursside`, description: p.description, path: `/ar/${p.slug}`, type: "article", locale: "ar", languages: { en: p.en, ar: `/ar/${p.slug}` } });
}
export default async function ArSolution({ params }: { params: Promise<{ slug: string }> }) {
  const p = arPageBySlug((await params).slug); if (!p) notFound();
  return <ArSeoPage p={p} cur={await visitorCurrency()} />;
}
