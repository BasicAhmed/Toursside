import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import DemoForm from "@/components/DemoForm";

export const metadata: Metadata = pageMeta({ title: "Book a demo", description: "See Toursside with your own kind of trips. Tell us about your travel business and we'll arrange a short demo.", path: "/demo" });

export default function Demo() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Book a demo</h1>
        <p className="lede">Tell us a little about your travel business. We'll show you Toursside using the kind of trips you actually sell.</p>
      </div>
      <div className="form-grid">
        <DemoForm />
        <aside className="aside">
          <h2>What happens next</h2>
          <ol>
            <li><b>We confirm a time</b><span>By email or WhatsApp, whichever you prefer.</span></li>
            <li><b>A short walkthrough</b><span>An order from first message to invoice, payment and itinerary.</span></li>
            <li><b>Your questions</b><span>Pricing for your team size, and how your current bookings would move over.</span></li>
          </ol>
        </aside>
      </div>
    </div>
  );
}
