# Toursside website

Marketing site for Toursside, the operating system behind your travel business. Next.js 15 (App Router), React 19, TypeScript, plain CSS, no UI or animation libraries.

## Run it
```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck && npm run build
```

## Pages
`/` home, `/demo` demo request, `/subscribe` three-step subscription request, `/privacy`, `/terms`, plus `sitemap.xml`, `robots.txt` and the social preview image.

## Settings (`.env.example`)
- `NEXT_PUBLIC_SITE_URL`: the live address, used for canonical links, sitemap and previews.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: where WhatsApp requests go.
- `RESEND_API_KEY`, `REQUESTS_FROM`, `REQUESTS_TO`: email delivery for both forms. Until these are set, the forms give the visitor a ready-written WhatsApp message instead, so nothing is lost and nothing is faked.

## Where things live
- `src/lib/site.ts`: name, prices, contact number.
- `src/lib/checkout.ts`: the single place to connect a payment provider. Return `{ mode: "redirect", url }` and the subscribe flow sends the customer to checkout. Today it returns `manual` (invoice by hand); no payment is ever confirmed on the site.
- `src/components/Explorer.tsx`: the feature list. Every point describes something the product does today.
- `public/shots/`: real screenshots of the product (Toursystem-Saas) running with sample data and the Toursside colours. Retake them after a product redesign.

## Before launch
Have a lawyer review the Privacy Policy and Terms, and set the real domain in `NEXT_PUBLIC_SITE_URL`.
