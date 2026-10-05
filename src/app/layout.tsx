import type { Metadata, Viewport } from "next";
import "@fontsource-variable/outfit";
import "@fontsource-variable/hanken-grotesk";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Toursside: tour operator and travel agency software for bookings, CRM and itineraries", template: "%s | Toursside" },
  description: SITE.description,
  keywords: ["tour booking software", "tour operator software Egypt", "travel agency software Middle East", "DMC software", "itinerary builder", "travel agency management software", "tour operator software", "travel booking management system", "tour management software", "travel CRM", "tour operator CRM", "travel agency SaaS", "travel business management software", "group tour management software", "passenger manifest software", "travel agency back office software", "travel agency visa tracking software", "flight ticket management for travel agents", "hotel booking management for travel agencies", "airport transfer management software", "travel invoice templates", "tour operator software UAE", "tour operator software Saudi Arabia"],
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE.name, title: "Toursside: the operating system behind your travel business", description: SITE.description, url: "/", locale: "en" },
  twitter: { card: "summary_large_image", title: "Toursside: the operating system behind your travel business", description: SITE.description },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#102A43", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
