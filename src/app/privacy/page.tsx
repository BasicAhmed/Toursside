import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = pageMeta({ title: "Privacy Policy", description: "How Toursside handles the information you send through this website.", path: "/privacy" });

export default function Privacy() {
  return (
    <div className="wrap">
      <div className="page-head"><h1>Privacy Policy</h1><p className="lede">Last updated 3 October 2026. This policy covers this website. Each Toursside customer's own workspace is covered by the agreement with that customer.</p></div>
      <div className="prose">
        <h2>What we collect</h2>
        <p>When you request a demo or a subscription, we collect what you type into the form: your name, company, email, phone or WhatsApp number, country, and any optional details you choose to add, such as team size, booking volume and notes.</p>
        <p>This website does not use advertising cookies or third-party trackers. Our hosting provider keeps standard server logs, such as IP address and browser type, for security and reliability.</p>
        <h2>How we use it</h2>
        <ul>
          <li>To reply to your request and arrange a demo</li>
          <li>To prepare an invoice and set up your workspace when you subscribe</li>
          <li>To keep the website secure and working</li>
        </ul>
        <p>We do not sell your information, and we do not add you to a mailing list without asking.</p>
        <h2>Who handles it</h2>
        <p>Form requests are delivered to our team by email through an email delivery provider, or by WhatsApp if you choose to send your request that way. The website is hosted by a cloud hosting provider. These providers process the information only to deliver the service.</p>
        <h2>How long we keep it</h2>
        <p>We keep requests for as long as we are in conversation with you, and for customers, for as long as the account is active and afterwards as the law requires for business records.</p>
        <h2>Your choices</h2>
        <p>You can ask us to show, correct or delete the information you sent us at any time. <a href={whatsappLink("Hello Toursside, I have a privacy request.")} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a> and we will respond.</p>
        <h2>Changes</h2>
        <p>If this policy changes, the new version is published on this page with a new date.</p>
      </div>
    </div>
  );
}
