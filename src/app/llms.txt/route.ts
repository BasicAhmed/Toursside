import { SITE, PLANS, PLAN_IDS } from "@/lib/site";
import { SOLUTIONS, REGIONS } from "@/lib/seo-pages";

// A plain-text summary of the product and its key pages for AI assistants and crawlers (llmstxt.org format).
// Built from the same data as the pages, so it cannot drift from them.
export const dynamic = "force-static";
export function GET() {
  const u = SITE.url;
  const text = `# ${SITE.name}

> ${SITE.description}

${SITE.name} is web software for travel agencies, tour operators and destination management companies. It runs in a browser on a computer or a phone. Staff record each sale as an order (tour, flight ticket, hotel, visa, transportation or other) and manage the customer, price and cost, invoice, payments and documents on it. Fixed departures are managed as group tours with capacity, seats left and a passenger manifest PDF.

${SITE.name} manages the bookings an agency makes with its own suppliers. It is not a flight or hotel booking engine: it has no connection to airlines, GDS or hotel systems, shows no live availability and does not issue tickets.

## Solutions
${SOLUTIONS.map((s) => `- [${s.nav}](${u}/solutions/${s.slug}): ${s.description}`).join("\n")}

## Regions
${REGIONS.map((r) => `- [${r.title}](${u}/regions/${r.slug}): ${r.description}`).join("\n")}

## Pricing
${PLAN_IDS.map((id) => `- ${PLANS[id].name}: $${PLANS[id].monthly} per month or $${PLANS[id].annual} per year. ${PLANS[id].target}.`).join("\n")}
- Flight, hotel, visa and transport orders are included on every plan. Group tours and passenger manifests are included on Growth and Business.
- [Plans and pricing](${u}/#pricing)

## Get started
- [Home](${u}/): overview of the product with real screens
- [All solutions](${u}/solutions)
- [Start a free demo workspace](${u}/start)
- [Book a demo](${u}/demo)
- [Subscribe](${u}/subscribe)
- [Terms](${u}/terms) and [Privacy Policy](${u}/privacy)
`;
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
