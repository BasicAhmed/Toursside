"use client";
import { useEffect, useRef, useState } from "react";

const ITEMS: [string, string, number, number, number][] = [
  ["Bookings split across WhatsApp, email, phone and Viator", "One orders list, every order tagged with its source", -6, 8, -3],
  ["Customer details buried in chats and notebooks", "A customer card on every order", 10, -6, 2.5],
  ["Prices worked out by hand for each guest", "Price set from your cost and profit margin", -4, 12, 3.5],
  ["Invoices typed again in a document", "A branded invoice PDF from the order", 8, 4, -2.5],
  ["Checking the bank app to see who paid", "Paid, balance and payment history on the order", 12, -8, 3],
  ["Guide, driver and pickup kept in someone's head", "Guide, driver, pickup and flights in one tab", -10, 6, -3.5],
  ["Itineraries rebuilt for every customer", "Itinerary templates and import from PDF", 6, -10, 2],
  ["Month-end numbers pulled from a spreadsheet", "Revenue, cost and profit for any month", -8, -4, -2],
];

export default function BeforeWith() {
  const [withTs, setWithTs] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  // Once the scattered version has been seen, tidy it on its own. The switch stays in the visitor's hands after that.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setWithTs(true); return; }
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { timer = setTimeout(() => { if (!touched.current) setWithTs(true); }, 1600); io.disconnect(); }
    }, { threshold: 0.55 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(timer); };
  }, []);
  const pick = (v: boolean) => { touched.current = true; setWithTs(v); };
  return (
    <div>
      <div className="ba-switch" role="group" aria-label="Compare">
        <button type="button" aria-pressed={!withTs} onClick={() => pick(false)}>Before Toursside</button>
        <button type="button" aria-pressed={withTs} onClick={() => pick(true)}>With Toursside</button>
      </div>
      <div ref={ref} className={`ba-board${withTs ? " with" : ""}`} aria-live="polite">
        {ITEMS.map(([before, after, x, y, r]) => (
          <div key={before} className="ba-item" style={{ "--x": `${x}px`, "--y": `${y}px`, "--r": `${r}deg` } as React.CSSProperties}>
            <span>{withTs ? after : before}</span>
          </div>
        ))}
      </div>
      <p className="ba-caption">
        {withTs
          ? "The same eight jobs, in one place. Each one is a screen in Toursside today."
          : "Eight jobs, eight different places. Nothing is linked, so every booking is retyped several times."}
      </p>
    </div>
  );
}
