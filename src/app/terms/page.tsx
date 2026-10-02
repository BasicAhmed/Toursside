import type { Metadata } from "next";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Terms", description: "Terms for using the Toursside website and requesting a subscription.", alternates: { canonical: "/terms" } };

export default function Terms() {
  return (
    <div className="wrap">
      <div className="page-head"><h1>Terms</h1><p className="lede">Last updated 3 October 2026. These terms cover this website and how subscriptions begin.</p></div>
      <div className="prose">
        <h2>This website</h2>
        <p>The website describes Toursside as it works today. Screens are shown with sample data. Features described as planned are not available yet and may change.</p>
        <h2>Prices</h2>
        <p>Prices shown are starting prices in US dollars. Your price depends on the size of your business, the number of users, your booking volume and any custom work. We confirm the price in writing before you pay.</p>
        <h2>Subscribing</h2>
        <p>Sending a subscription request does not charge you and is not yet a contract. A subscription begins when you pay the invoice we send. It then runs for the period you chose, monthly or annual, and renews when the next invoice is paid.</p>
        <h2>Your data</h2>
        <p>Each customer has a separate workspace and database. The bookings, customers and documents you put in your workspace remain yours. If you stop using Toursside you can ask for an export of your data.</p>
        <h2>Fair use</h2>
        <p>Do not misuse this website, for example by sending automated requests through the forms or trying to disrupt the service.</p>
        <h2>Liability</h2>
        <p>The website is provided as it is. To the extent the law allows, Toursside is not liable for indirect losses that result from using this website. The service itself is covered by the agreement made with each customer.</p>
        <h2>Contact</h2>
        <p>Questions about these terms? <a href={whatsappLink("Hello Toursside, I have a question about your terms.")} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>.</p>
      </div>
    </div>
  );
}
