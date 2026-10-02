"use client";
import { useEffect, useRef, useState } from "react";
import Plane from "./Plane";

const STOPS: [string, string][] = [
  ["An inquiry arrives", "A website form, a trip request or a message. It lands in Inquiries with a count on the menu."],
  ["The order is created", "Website bookings create it themselves. For WhatsApp, email, phone or Viator, your team adds it and picks the source."],
  ["The trip is priced", "The itinerary's cost and your profit margin set the price per person, in the customer's currency."],
  ["The invoice goes out", "One button makes the invoice PDF with your bank details. Send it by email or WhatsApp."],
  ["Payment is recorded", "Deposit or full amount. The balance updates, and the team is alerted when the order is fully paid."],
  ["The itinerary is sent", "A day-by-day PDF for the guest, who can follow the booking on their own tracking page."],
  ["The trip is prepared", "Travelers, passports, guide, driver, pickup time and flights, all on the same order."],
  ["The trip is done", "Mark it completed. Its revenue, cost and profit are already in that month's finance."],
  ["Review and referral", "Send the review link. A referral code unlocks, so happy guests bring the next booking."],
];
const N = STOPS.length;
const fx = (i: number) => (i % 2 === 0 ? 0.22 : 0.78);
// The line is built in real pixels from the size of its box, so its length, the plane and the dots always agree.
function buildPath(w: number, h: number) {
  const row = h / N;
  let d = `M ${w / 2} 0`;
  for (let i = 0; i < N; i++) {
    const y = i * row + row / 2, x = fx(i) * w, px = i === 0 ? w / 2 : fx(i - 1) * w, py = i === 0 ? 0 : y - row;
    d += ` C ${px} ${py + row / 2}, ${x} ${y - row / 2}, ${x} ${y}`;
  }
  return d + ` C ${fx(N - 1) * w} ${h - row * 0.2}, ${w / 2} ${h - row * 0.2}, ${w / 2} ${h}`;
}

export default function Journey() {
  const grid = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const draw = useRef<SVGPathElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 260, h: N * 150 });
  const [reached, setReached] = useState(-1);

  useEffect(() => {
    const s = svg.current;
    if (!s) return;
    const measure = () => { const r = s.getBoundingClientRect(); setBox((b) => (Math.abs(b.w - r.width) < 1 && Math.abs(b.h - r.height) < 1 ? b : { w: r.width, h: r.height })); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(s);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const g = grid.current, s = svg.current, p = draw.current, pl = plane.current;
    if (!g || !s || !p || !pl) return;
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { p.style.strokeDashoffset = "0"; pl.style.display = "none"; setReached(N); return; }
    let raf = 0, last = -2;
    const tick = () => {
      raf = 0;
      const r = g.getBoundingClientRect(), sr = s.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (window.innerHeight * 0.62 - r.top) / r.height));
      p.style.strokeDashoffset = `${len * (1 - t)}`;
      const a = p.getPointAtLength(len * t), b = p.getPointAtLength(Math.min(len, len * t + 6));
      const ang = t >= 1 ? 135 : (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 45;
      pl.style.transform = `translate(${sr.left - r.left + a.x}px, ${a.y}px) rotate(${ang}deg)`;
      pl.style.opacity = t <= 0 || t >= 1 ? "0" : "1";
      const row = box.h / N, n = Math.floor((a.y + 10 - row / 2) / row);
      if (n !== last) { last = n; setReached(n); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [box]);

  const d = buildPath(box.w, box.h);
  return (
    <div className="j-grid" ref={grid}>
      <svg ref={svg} className="j-svg" viewBox={`0 0 ${box.w} ${box.h}`} preserveAspectRatio="none" aria-hidden="true">
        <path className="base" d={d} />
        <path className="draw" ref={draw} d={d} />
      </svg>
      <div className="j-plane" ref={plane} style={{ opacity: 0 }}><Plane /></div>
      <ol style={{ display: "contents", listStyle: "none" }}>
        {STOPS.map(([title, text], i) => (
          <li key={title} className={`j-stop ${i % 2 === 0 ? "l" : "r"}${i <= reached ? " on" : ""}`} style={{ gridRow: i + 1 }}>
            <span className="n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
      {STOPS.map((_, i) => <JDot key={i} i={i} on={i <= reached} />)}
    </div>
  );
}

// Dots sit on the line. Their horizontal position follows the line's own box, which is narrow on phones and wide on desktop.
function JDot({ i, on }: { i: number; on: boolean }) {
  return <span className={`j-dot j-dot-${i % 2 === 0 ? "a" : "b"}${on ? " on" : ""}`} style={{ top: `${((i + 0.5) / N) * 100}%` }} aria-hidden="true" />;
}
