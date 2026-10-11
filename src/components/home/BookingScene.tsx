"use client";
import { useEffect, useRef, useState } from "react";
import { PLANE_PATH, angleAt, lengthAt, onLayout, place } from "./road";

// One booking, start to finish. The page holds still while the order builds itself, one stop per sixth of the scroll.
const TITLES: [string, string][] = [["A message", "on WhatsApp."], ["Priced", "in a minute."], ["An invoice", "in your brand."], ["Half paid,", "nothing forgotten."], ["Ready", "on the day."], ["Reviewed,", "and back again."]];
const DESCS: React.ReactNode[] = [
  <>Sarah asks about Luxor for two. Your team adds the order in <b>under a minute</b>, tagged WhatsApp. Website bookings create their own.</>,
  <>The cost is $446. Add your margin and the price is <b>$620</b>. Build the itinerary day by day, or import the PDF you already have.</>,
  <>The confirmation and invoice go out <b>in your logo and colours</b>, in the Bold, Classic or Minimal design.</>,
  <>Record the deposit the moment it arrives. The order shows <b>$310 left</b> and keeps it in front of your team until it is paid.</>,
  <>Guide, driver, vehicle and pickup are on the order your team opens at the airport. <b>Passports are collected per traveler.</b></>,
  <>After the trip Sarah is <b>invited to review it</b> and gets a referral code for friends. The next booking starts here.</>,
];
const MARGIN = "Cost $446, profit $174 (28% of the price)";
const GUIDE = "Mariam, English and Spanish", DRIVER = "Omar Khalil, Toyota HiAce", PICKUP = "Hotel lobby, 07:30";
type State = { pill: [string, string]; done: number; total: number; paid: number; margin: string; label: string; next: string; btn: string; guide: string; driver: string; pickup: string; log: string };
const STATES: State[] = [
  { pill: ["New order", "new"], done: 0, total: 0, paid: 0, margin: "", label: "Next step", next: "Set the price for 2 travelers.", btn: "Set price", guide: "", driver: "", pickup: "", log: "Added from WhatsApp by Layla, 09:12" },
  { pill: ["New order", "new"], done: 1, total: 620, paid: 0, margin: MARGIN, label: "Next step", next: "Send Sarah the invoice.", btn: "Create invoice", guide: "", driver: "", pickup: "", log: "Price set from the itinerary: $620" },
  { pill: ["Invoiced", "inv"], done: 2, total: 620, paid: 0, margin: MARGIN, label: "Next step", next: "$620 is still to be paid.", btn: "Record a payment", guide: "", driver: "", pickup: "", log: "INV-2026-0142 emailed to Sarah" },
  { pill: ["Partly paid", "part"], done: 2, total: 620, paid: 310, margin: MARGIN, label: "Next step", next: "$310 is still to be paid.", btn: "Record a payment", guide: "", driver: "", pickup: "", log: "$310 received by bank transfer" },
  { pill: ["Paid / confirmed", "paid"], done: 4, total: 620, paid: 620, margin: MARGIN, label: "All set", next: "Everything is in place for this trip.", btn: "", guide: GUIDE, driver: DRIVER, pickup: PICKUP, log: "Driver Omar Khalil assigned" },
  { pill: ["Completed", "done"], done: 5, total: 620, paid: 620, margin: MARGIN, label: "After the trip", next: "Sarah rated the trip 5 stars.", btn: "", guide: GUIDE, driver: DRIVER, pickup: PICKUP, log: "Referral code SARAH4F2A sent to Sarah" },
];
const STEPS = ["Price", "Invoice", "Payment", "Itinerary", "Trip done"];
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function BookingScene() {
  const [i, setI] = useState(0);
  const sec = useRef<HTMLElement>(null), lane = useRef<HTMLDivElement>(null);
  const bed = useRef<SVGPathElement>(null), lit = useRef<SVGPathElement>(null), dash = useRef<SVGPathElement>(null), dots = useRef<SVGGElement>(null), plane = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const s = sec.current, box = lane.current, b = bed.current, l = lit.current, d = dash.current, g = dots.current;
    if (!s || !box || !b || !l || !d || !g) return;
    let LL = 0, stops: number[] = [], raf = 0;
    const build = () => {
      const w = box.clientWidth, h = box.clientHeight;
      if (!w || !h) { LL = 0; return; }
      const cx = w / 2, amp = Math.min(34, w * 0.35), n = 6;
      let path = `M${cx} 0`, py = 0;
      stops = [];
      for (let k = 0; k < n; k++) {
        const y = (h * (k + 0.5)) / n, sw = k % 2 ? -amp : amp;
        path += ` C${cx + sw} ${py + (y - py) / 2} ${cx + sw} ${y - (y - py) / 2} ${cx} ${y}`;
        py = y; stops.push(y);
      }
      path += ` C${cx - amp} ${py + (h - py) / 2} ${cx - amp} ${h} ${cx} ${h}`;
      [b, l, d].forEach((p) => p.setAttribute("d", path));
      g.innerHTML = stops.map((y) => `<circle cx="${cx}" cy="${y}" r="7" fill="#071827" stroke="rgba(233,238,240,.35)" stroke-width="3"/>`).join("");
      LL = l.getTotalLength(); l.style.strokeDasharray = `${LL}`;
    };
    const onScroll = () => {
      raf = 0;
      const r = s.getBoundingClientRect(), span = r.height - window.innerHeight;
      const t = span > 0 ? Math.max(0, Math.min(0.9999, -r.top / span)) : 0;
      setI(Math.floor(t * 6));
      if (!LL) return;
      const y = t * box.clientHeight, len = lengthAt(l, LL, y, "y"), p = l.getPointAtLength(len);
      l.style.strokeDashoffset = `${LL - len}`;
      place(plane.current, p.x, p.y, angleAt(l, LL, len));
      Array.from(g.children).forEach((c, k) => c.setAttribute("stroke", stops[k] <= y + 1 ? "#4FD8CA" : "rgba(233,238,240,.35)"));
    };
    const tick = () => { if (!raf) raf = requestAnimationFrame(onScroll); };
    const relayout = () => { build(); onScroll(); };
    relayout();
    window.addEventListener("scroll", tick, { passive: true });
    const off = onLayout(relayout);
    return () => { window.removeEventListener("scroll", tick); off(); cancelAnimationFrame(raf); };
  }, []);

  const st = STATES[i];
  const field = (v: string, empty: string) => <span className={v ? "" : "empty"}>{v || empty}</span>;
  return (
    <section className="journey" id="route" ref={sec} aria-label="How one booking moves through Toursside">
      <div className="scene">
        <div className="wrap scene-in">
          <div className="scene-copy">
            <p className="scene-kicker"><span>One booking, start to finish</span><span className="count">{i + 1} / 6</span></p>
            <div className="pips" aria-hidden="true">{TITLES.map((_, k) => <i key={k} className={k <= i ? "on" : ""} />)}</div>
            <div className="titles">{TITLES.map(([a, b], k) => <h2 key={a} className={`duo${k === i ? " on" : ""}`} aria-hidden={k === i ? undefined : true}><span className="thin">{a}</span><span className="bold">{b}</span></h2>)}</div>
            <div className="descs">{DESCS.map((d, k) => <p key={k} className={k === i ? "on" : ""} aria-hidden={k === i ? undefined : true}>{d}</p>)}</div>
          </div>

          <div className="lane" ref={lane} aria-hidden="true">
            <svg>
              <defs><linearGradient id="lane-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#16A6A3" /><stop offset="1" stopColor="#4FD8CA" /></linearGradient></defs>
              <path ref={bed} stroke="rgba(233,238,240,.09)" strokeWidth="26" strokeLinecap="round" fill="none" />
              <path ref={lit} stroke="url(#lane-g)" strokeWidth="26" strokeLinecap="round" fill="none" />
              <path ref={dash} stroke="#071827" strokeOpacity=".55" strokeWidth="2" strokeDasharray="10 12" fill="none" />
              <g ref={dots} />
            </svg>
            <svg className="plane" ref={plane} viewBox="-24 -24 48 48"><path d={PLANE_PATH} fill="#FF8A3D" /></svg>
          </div>

          <article className="order" aria-label="Example order BL-D5ZCA6">
            <div className="o-head">
              <div><p className="o-ref">BL-D5ZCA6</p><p className="o-sub">Luxor East and West Bank Day Tour, Sarah Mitchell, 2 travelers</p></div>
              <span className={`pill ${st.pill[1]}`}>{st.pill[0]}</span>
            </div>
            <div className="o-src"><span>WhatsApp</span><span>Tour</span><span>10 Oct</span></div>
            <ol className="o-steps">{STEPS.map((n, k) => <li key={n} className={k < st.done ? "ok" : k === st.done ? "now" : ""}><i>{k < st.done ? "✓" : k + 1}</i>{n}</li>)}</ol>
            <div className="money">
              <div className="money-top"><span>{st.total ? <>Paid <b>{usd(st.paid)}</b> of {usd(st.total)}</> : "Not priced yet"}</span><span className="left">{st.total ? (st.paid >= st.total ? "Paid in full" : `${usd(st.total - st.paid)} left`) : ""}</span></div>
              <div className="mbar"><i style={{ width: st.total ? `${(st.paid / st.total) * 100}%` : 0 }} /></div>
              <p className="margin">{st.margin}</p>
            </div>
            <div className={`o-next${st.btn ? "" : " calm"}`}><div><small>{st.label}</small><p>{st.next}</p></div>{st.btn ? <span className="b" aria-hidden="true">{st.btn}</span> : null}</div>
            <div className="ops">
              <div><span>Guide</span>{field(st.guide, "Not assigned")}</div>
              <div><span>Driver</span>{field(st.driver, "Not assigned")}</div>
              <div><span>Pickup</span>{field(st.pickup, "Not set")}</div>
            </div>
            <p className="log">{st.log}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
