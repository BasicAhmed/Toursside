"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PLANE_PATH, angleAt, lengthAt, onLayout, place, still } from "./road";

type Leg = { id: string; kind: string; day: string; status: [string, string]; title: string; facts: [string, string][]; amount: string; paid: string; img: string; alt: string; icon: React.ReactNode };
const ic = { fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", "aria-hidden": true } as const;
// Sarah's week in Egypt: five orders of five kinds. Each opens the real phone screen for that kind of order.
const LEGS: Leg[] = [
  { id: "visa", kind: "Visa", day: "1 Oct", status: ["Approved", "ok"], title: "Egypt e-visa", facts: [["Applicants", "2"], ["Reference", "EV-58213"]], amount: "$50", paid: "Paid", img: "m-visa-order", alt: "A visa order on a phone with its applicants and status",
    icon: <svg {...ic}><rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="12" cy="10" r="3" /><path d="M9 17h6" /></svg> },
  { id: "flight", kind: "Flight", day: "9 Oct", status: ["Ticketed", "ok"], title: "London to Luxor", facts: [["PNR", "K7Q2LM"], ["Passengers", "2"]], amount: "$1,280", paid: "Paid", img: "m-flight-order", alt: "A flight order on a phone, paid in full and ticketed",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z" /></svg> },
  { id: "transfer", kind: "Transfer", day: "9 Oct", status: ["New order", "new"], title: "Airport to hotel", facts: [["Driver", "Omar Khalil"], ["Pickup", "21:40"]], amount: "$60", paid: "Not paid yet", img: "m-order-types", alt: "An airport transfer order on a phone among other orders",
    icon: <svg {...ic}><rect x="3" y="7" width="18" height="10" rx="2" /><circle cx="7.5" cy="17.5" r="1.5" /><circle cx="16.5" cy="17.5" r="1.5" /><path d="M3 12h18" /></svg> },
  { id: "hotel", kind: "Hotel", day: "9 to 12 Oct", status: ["Partly paid", "part"], title: "Nile view, Luxor", facts: [["Stay", "3 nights, 1 room"], ["Board", "Half board"]], amount: "$540", paid: "$260 paid", img: "m-hotel-order", alt: "A hotel order on a phone with check-in, nights, rooms and board",
    icon: <svg {...ic}><path d="M3 20V9l9-5 9 5v11" /><path d="M9 20v-6h6v6" /></svg> },
  { id: "tour", kind: "Tour", day: "10 Oct", status: ["Partly paid", "part"], title: "Luxor East and West Bank", facts: [["Guide", "Mariam"], ["Travelers", "2"]], amount: "$620", paid: "$310 paid", img: "m-order-operations", alt: "A tour order's operations tab on a phone with guide, driver, vehicle and arrival flight",
    icon: <svg {...ic}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg> },
];

/** Everything you sell: a road through one trip's orders. Pick a stop and the plane flies there and the phone shows
 *  that kind of order. Works as tabs for keyboards and screen readers. */
export default function TripStops() {
  const [now, setNow] = useState(LEGS.length - 1);
  const box = useRef<HTMLDivElement>(null), road = useRef<SVGPathElement>(null), dash = useRef<SVGPathElement>(null), plane = useRef<SVGSVGElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const geo = useRef({ len: 0, stops: [] as number[], at: 0, raf: 0 });
  const nowRef = useRef(now); nowRef.current = now;
  const put = (len: number) => { const r = road.current, g = geo.current; if (!r || !g.len) return; const p = r.getPointAtLength(len); place(plane.current, p.x, p.y, angleAt(r, g.len, len)); g.at = len; };

  // Lay the road through the pins (across on wide screens, down the side on narrow ones).
  useEffect(() => {
    const legs = box.current, r = road.current, d = dash.current;
    if (!legs || !r || !d) return;
    const build = () => {
      const b = legs.getBoundingClientRect();
      const pts = cards.current.map((c) => { const q = c!.querySelector(".pin")!.getBoundingClientRect(); return { x: q.left + q.width / 2 - b.left, y: q.top + q.height / 2 - b.top }; });
      if (!pts.length) return;
      const last = pts[pts.length - 1], across = Math.abs(last.x - pts[0].x) > Math.abs(last.y - pts[0].y), amp = across ? 22 : 18;
      const start = across ? { x: 0, y: pts[0].y } : { x: pts[0].x, y: Math.max(0, pts[0].y - 40) };
      const all = [start, ...pts];
      let path = `M${start.x} ${start.y}`;
      for (let k = 1; k < all.length; k++) {
        const a = all[k - 1], p = all[k], s = (k % 2 ? 1 : -1) * amp;
        path += across ? ` C${a.x + (p.x - a.x) / 2} ${a.y + s} ${p.x - (p.x - a.x) / 2} ${p.y + s} ${p.x} ${p.y}` : ` C${a.x + s} ${a.y + (p.y - a.y) / 2} ${p.x + s} ${p.y - (p.y - a.y) / 2} ${p.x} ${p.y}`;
      }
      r.setAttribute("d", path); d.setAttribute("d", path); r.setAttribute("stroke-width", across ? "22" : "12");
      const g = geo.current;
      g.len = r.getTotalLength();
      g.stops = pts.map((p) => lengthAt(r, g.len, across ? p.x : p.y, across ? "x" : "y"));
      put(g.stops[nowRef.current] ?? 0);
    };
    build();
    return onLayout(build);
  }, []);

  const pick = (i: number) => {
    setNow(i);
    const g = geo.current, to = g.stops[i];
    if (to === undefined) return;
    cancelAnimationFrame(g.raf);
    if (still()) { put(to); return; }
    const from = g.at; let t0: number | null = null;
    const step = (ts: number) => {
      if (t0 === null) t0 = ts;
      const t = Math.min(1, (ts - t0) / 700), e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      put(from + (to - from) * e);
      if (t < 1) g.raf = requestAnimationFrame(step);
    };
    g.raf = requestAnimationFrame(step);
  };
  const key = (i: number) => (e: React.KeyboardEvent) => {
    const j = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : null;
    if (j === null) return;
    e.preventDefault(); const n = (j + LEGS.length) % LEGS.length; cards.current[n]?.focus(); pick(n);
  };
  const leg = LEGS[now];

  return (
    <>
      <div className="legs" ref={box} role="tablist" aria-label="The orders in Sarah's trip">
        <svg aria-hidden="true">
          <defs><linearGradient id="legs-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0B6F6D" /><stop offset=".5" stopColor="#16A6A3" /><stop offset="1" stopColor="#4FD8CA" /></linearGradient></defs>
          <path ref={road} stroke="url(#legs-g)" strokeWidth="22" strokeLinecap="round" fill="none" />
          <path ref={dash} stroke="#071827" strokeOpacity=".55" strokeWidth="2" strokeDasharray="10 12" fill="none" />
        </svg>
        <svg className="plane" ref={plane} viewBox="-24 -24 48 48" aria-hidden="true"><path d={PLANE_PATH} fill="#FF8A3D" /></svg>
        {LEGS.map((l, i) => (
          <button key={l.id} type="button" ref={(el) => { cards.current[i] = el; }} className={`leg-card${i < now ? " past" : ""}`} role="tab" id={`leg-${l.id}`} aria-selected={i === now} aria-controls="leg-screen" tabIndex={i === now ? 0 : -1} onClick={() => pick(i)} onKeyDown={key(i)}>
            <span className="pin" aria-hidden="true" /><span className="day" aria-hidden="true">{l.day}</span>
            <span className="kind"><span data-day={`· ${l.day}`}>{l.icon}{l.kind}</span><span className={`tpill ${l.status[1]}`}>{l.status[0]}</span></span>
            <h3>{l.title}</h3>
            <dl>{l.facts.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}</dl>
            <span className="amt"><b>{l.amount}</b><small>{l.paid}</small></span>
          </button>
        ))}
      </div>

      <div className="package">
        <div className="pkg">
          <small>Sold as one package, 5 orders</small>
          <h3>Sarah Mitchell, Egypt, 1 to 12 October</h3>
          <div className="pkg-nums">
            <div><span>Total</span><b>$2,550</b></div>
            <div><span>Paid</span><b>$1,900</b></div>
            <div className="due"><span>Left to pay</span><b>$650</b></div>
          </div>
          <div className="mbar"><i /></div>
          <p>Each order keeps its own invoice and steps. The package adds them up, so you always know what the whole trip still owes.</p>
          <div className="pkg-more">
            <span>Running fixed departures? <a href="/solutions/group-tour-management-software">Group tours</a> count seats left and print a passenger manifest.</span>
            <span>Toursside keeps the bookings you make with your suppliers. It does not connect to airlines or hotel systems.</span>
          </div>
        </div>
        <figure className="screen-side" id="leg-screen" role="tabpanel" aria-labelledby={`leg-${leg.id}`}>
          <div className="handset"><Image key={leg.img} src={`/shots/${leg.img}.webp`} width={780} height={1580} alt={leg.alt} sizes="270px" /></div>
          <figcaption>The real {leg.kind.toLowerCase()} order screen, with sample data</figcaption>
        </figure>
      </div>
    </>
  );
}
