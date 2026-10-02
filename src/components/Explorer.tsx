"use client";
import Image from "next/image";
import { useRef, useState } from "react";

type Tab = { id: string; label: string; hint: string; shot: string; alt: string; title: string; text: string; points: string[] };

const TABS: Tab[] = [
  { id: "orders", label: "Orders", hint: "Every booking, every channel", shot: "orders", alt: "Toursside orders list showing orders from WhatsApp, the website, phone, email and Viator with travel dates, payment progress and next actions",
    title: "One list for every booking", text: "Website bookings arrive by themselves. Your team adds the rest in seconds, and each order shows where it came from, what has been paid and what to do next.",
    points: ["Website, WhatsApp, email, phone and Viator orders together", "Stages that count and filter: to do, awaiting payment, confirmed, completed", "Search by name, booking ID, phone or tour", "Custom trips that are not on your website", "A five-step flow with one Next step button", "A tracking page for the customer, with their booking ID"] },
  { id: "order", label: "Inside an order", hint: "The whole trip on one screen", shot: "order", alt: "An open Toursside order with the customer, trip, amount paid, the five-step progress bar and the next step",
    title: "Everything about a trip, on one screen", text: "Open an order and you see the customer, the trip, the money and the step it is waiting on. WhatsApp, call and email are one tap away.",
    points: ["Price, Invoice, Payment, Itinerary, Trip done, ticked from real data", "A list of what is still missing, such as passports or the arrival flight", "Customer details fully editable", "Welcome message, customer link and review link ready to send", "Notes and a history of who changed what", "Warns before closing with unsaved changes"] },
  { id: "customers", label: "Customers and inquiries", hint: "From first question to repeat guest", shot: "inquiries", alt: "Toursside inquiries list with open, booked and lost inquiries",
    title: "Inquiries that turn into orders", text: "Questions, trip requests and unfinished checkouts from your website land in one inbox, with a count of how many are waiting.",
    points: ["Inquiry, trip request and contact forms in one list", "Open, booked and lost, with search", "Returning customers recognised by email or phone", "Email or phone is enough to add a customer", "Review invite after the trip", "Referral codes with a reward balance per customer"] },
  { id: "tours", label: "Tours and itineraries", hint: "What you sell, and each guest's plan", shot: "tours", alt: "Toursside tours list with live tours, price per person and booking counts",
    title: "Your tours, and a plan for each guest", text: "Manage the tours on your website, then build a day-by-day itinerary for each customer from a template, a PDF you already have, or a blank page.",
    points: ["Tours with photos, days and nights, and destinations", "Price from cost plus profit margin, per person", "Day-by-day itinerary builder", "Reusable templates", "Import an itinerary from an existing PDF", "Publish an itinerary as a bookable tour, or import tours from CSV"] },
  { id: "partners", label: "Partner requests", hint: "Services for other companies", shot: "corporate", alt: "A Toursside partner request showing total cost, price charged, profit, payments and the list of services",
    title: "Requests from other travel companies", text: "When another agency asks you to arrange services on the ground, it gets its own request, separate from customer orders, with cost, price and profit visible at once.",
    points: ["Transfers, transportation and airport services", "Entrance tickets and permits", "Felucca and motor boat", "Tour guides, hotels and Nile cruises", "Supplier, cost, price, date, time and status for each service", "Price each service or add one service fee, then invoice and record payments"] },
  { id: "money", label: "Payments and finance", hint: "Who paid, and what you earned", shot: "finance", alt: "Toursside finance page with revenue collected, cost, profit and margin for the month, per tour and per partner request",
    title: "Know what is paid and what you made", text: "Record each payment against the order and the balance updates. Finance adds it up by month, in the currency you choose, for owners and managers only.",
    points: ["Deposits and full payments, with a running balance", "Undo a mistyped payment, kept on record", "Twelve currencies, converted for totals", "Cost saved at booking time, so past profit never shifts", "Revenue, cost, profit and margin by month", "Download the month as a PDF"] },
  { id: "docs", label: "Documents", hint: "Invoices and itineraries as PDF", shot: "order-payment", alt: "The payment and documents tab of a Toursside order showing cost, profit, amount paid and the balance left",
    title: "Invoices and itineraries, made from the order", text: "Documents are generated from what is already on the order, so nothing is typed twice. Each PDF is kept exactly as it was sent.",
    points: ["Invoice PDF with your bank details", "Itinerary PDF with your logo and photos", "A PDF for every tour on your website", "Send by email, or mark as sent on WhatsApp", "Earlier versions kept unchanged", "Booking confirmation email to the customer"] },
  { id: "ops", label: "Trip operations", hint: "Guides, drivers, travelers", shot: "order-operations", alt: "The operations tab of a Toursside order with the assigned tour guide, preferred language, driver and vehicle",
    title: "Ready before the guest lands", text: "Assign the guide and driver, record flights and pickup, and collect traveler details in the same order the sales team worked on.",
    points: ["Assign a guide, with a warning if the language does not match", "Driver, vehicle, pickup time and hotel", "Arrival and departure flights", "A card per traveler: adult, child or infant", "Passport and visa files stored encrypted", "A guide sheet for the day"] },
  { id: "team", label: "Alerts and reports", hint: "Stay informed without asking", shot: "reports", alt: "Toursside reports with orders this month, average order, top tours by revenue, revenue by destination and where inquiries come from",
    title: "The right people hear about it", text: "Staff get an email when something needs them, and the reports show how the business is doing without building a spreadsheet.",
    points: ["Email alerts for new orders and new inquiries", "Alerts when an order is fully paid or cancelled", "A log of every alert sent", "Waiting counts on the menu", "Top tours, revenue by destination, inquiry sources", "Staff accounts with roles for owner, manager, sales, content and operations"] },
];

export default function Explorer() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const t = TABS[active];
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (active + d + TABS.length) % TABS.length;
    setActive(n);
    refs.current[n]?.focus();
  };
  return (
    <div className="ex">
      <div className="ex-tabs" role="tablist" aria-label="Toursside features" onKeyDown={onKey}>
        {TABS.map((x, i) => (
          <button key={x.id} ref={(el) => { refs.current[i] = el; }} role="tab" id={`tab-${x.id}`} aria-selected={i === active} aria-controls="ex-panel" tabIndex={i === active ? 0 : -1} className="ex-tab" onClick={() => setActive(i)}>
            {x.label}<small>{x.hint}</small>
          </button>
        ))}
      </div>
      <div className="ex-panel" role="tabpanel" id="ex-panel" aria-labelledby={`tab-${t.id}`} tabIndex={0}>
        <div className="ex-shot">
          {TABS.map((x, i) => (
            <Image key={x.id} src={`/shots/${x.shot}.webp`} alt={i === active ? x.alt : ""} aria-hidden={i !== active} width={1490} height={1125} sizes="(min-width: 1000px) 860px, 100vw" className={i === active ? "on" : ""} loading={i === 0 ? "eager" : "lazy"} />
          ))}
        </div>
        <div className="ex-body">
          <h3>{t.title}</h3>
          <p>{t.text}</p>
          <ul className="ticks">{t.points.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
