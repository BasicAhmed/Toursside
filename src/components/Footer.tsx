import Image from "next/image";
import Link from "next/link";
import { SITE, whatsappLink } from "@/lib/site";
import { SOLUTIONS, REGIONS } from "@/lib/seo-pages";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <span className="lockup">
              <Image src="/mark.png" alt="" width={182} height={160} />
              <Image src="/wordmark-light.png" alt="Toursside" width={253} height={44} />
            </span>
            <p style={{ maxWidth: "38ch" }}>One connected system for travel agencies and tour operators: tours, group departures, flight, hotel and visa orders, customers, itineraries, invoices and payments.</p>
          </div>
          <nav aria-label="Product">
            <h3>Product</h3>
            <ul>
              <li><Link href="/#product">Features</Link></li>
              <li><Link href="/#sells">Everything you sell</Link></li>
              <li><Link href="/#journey">How a booking moves</Link></li>
              <li><Link href="/#phone">On your phone</Link></li>
              <li><Link href="/#next">What's next</Link></li>
            </ul>
          </nav>
          <nav aria-label="Solutions">
            <h3>Solutions</h3>
            <ul>{SOLUTIONS.filter((x) => x.group === "core").map((x) => <li key={x.slug}><Link href={`/solutions/${x.slug}`}>{x.nav}</Link></li>)}</ul>
          </nav>
          <nav aria-label="What you sell">
            <h3>What you sell</h3>
            <ul>{SOLUTIONS.filter((x) => x.group === "sell").map((x) => <li key={x.slug}><Link href={`/solutions/${x.slug}`}>{x.nav}</Link></li>)}</ul>
          </nav>
          <nav aria-label="Regions">
            <h3>Regions</h3>
            <ul>{REGIONS.map((x) => <li key={x.slug}><Link href={`/regions/${x.slug}`}>{x.nav}</Link></li>)}<li><Link href="/regions">All countries</Link></li></ul>
          </nav>
          <nav aria-label="Get started">
            <h3>Get started</h3>
            <ul>
              <li><Link href="/#pricing">Pricing</Link></li>
              <li><Link href="/demo">Book a demo</Link></li>
              <li><Link href="/start">Start a free demo</Link></li>
              <li><Link href="/subscribe">Subscribe</Link></li>
            </ul>
          </nav>
          <nav aria-label="Company">
            <h3>Company</h3>
            <ul>
              <li><a href={whatsappLink("Hello Toursside, I have a question.")} target="_blank" rel="noopener noreferrer">Contact us on WhatsApp</a></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
            </ul>
          </nav>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} Toursside</span>
          <span>Built by {SITE.builder.name}</span>
        </div>
      </div>
    </footer>
  );
}
