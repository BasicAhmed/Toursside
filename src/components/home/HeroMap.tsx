"use client";
import { useEffect, useRef } from "react";
import { PLANE_PATH, angleAt, onLayout, place, still } from "./road";

const ROAD = "M30 690 C 40 520, 520 560, 470 380 S 90 230, 250 120 S 470 40, 560 30";
const STOPS: { at: number; label: string; body: React.ReactNode }[] = [
  { at: 0.14, label: "New order", body: <p><span className="src">WhatsApp</span>BL-FC3FBY, airport transfer</p> },
  { at: 0.4, label: "Invoice sent", body: <p>INV-2026-0142, $1,640</p> },
  { at: 0.63, label: "Payment recorded", body: <><p>Paid $310 of $620</p><div className="bar"><i /></div></> },
  { at: 0.86, label: "Ready to travel", body: <p>Driver Omar Khalil, Toyota HiAce</p> },
];

/** The hero picture: the road from the Toursside mark draws itself, the stops of one booking appear along it, and
 *  the plane flies to the end. It starts hidden in the HTML so nothing jumps when the script takes over. It is a
 *  picture of what the words say, so it is hidden from screen readers. */
export default function HeroMap() {
  const box = useRef<HTMLDivElement>(null), road = useRef<SVGPathElement>(null), lane = useRef<SVGPathElement>(null), plane = useRef<SVGSVGElement>(null);
  const chips = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const map = box.current, r = road.current, l = lane.current, pl = plane.current;
    if (!map || !r || !l || !pl) return;
    const L = l.getTotalLength(); // measured on the lane: the road itself uses pathLength="1" for drawing
    let done = false, raf = 0;
    const at = (t: number) => { const k = map.getBoundingClientRect().width / 600, len = L * t, p = l.getPointAtLength(len); return { x: p.x * k, y: p.y * k, a: angleAt(l, L, len) }; };
    const layout = () => {
      chips.current.forEach((c, i) => { if (!c) return; const p = at(STOPS[i].at); c.style.left = `${p.x}px`; c.style.top = `${p.y}px`; });
      if (done) { const e = at(1); place(pl, e.x, e.y, e.a); }
    };
    const finish = () => {
      done = true; r.style.strokeDashoffset = "0"; l.style.opacity = "1"; pl.style.opacity = "1";
      chips.current.forEach((c) => c?.classList.remove("wait")); layout();
    };
    layout();
    const off = onLayout(layout);
    if (still()) finish();
    else {
      pl.style.opacity = "1"; l.style.transition = "opacity .6s";
      let t0: number | null = null;
      const step = (ts: number) => {
        if (t0 === null) t0 = ts;
        const t = Math.min(1, (ts - t0) / 2200), ease = 1 - Math.pow(1 - t, 3);
        r.style.strokeDashoffset = `${1 - ease}`;
        const p = at(Math.max(ease, 0.001)); place(pl, p.x, p.y, p.a);
        chips.current.forEach((c, i) => { if (c && ease >= STOPS[i].at) c.classList.remove("wait"); });
        if (t < 1) raf = requestAnimationFrame(step); else finish();
      };
      raf = requestAnimationFrame(step);
    }
    return () => { cancelAnimationFrame(raf); off(); };
  }, []);

  return (
    <div className="map" ref={box} aria-hidden="true">
      <svg viewBox="0 0 600 700" fill="none">
        <defs>
          <linearGradient id="road-g" x1="0" y1="700" x2="600" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0B6F6D" /><stop offset=".55" stopColor="#16A6A3" /><stop offset="1" stopColor="#4FD8CA" />
          </linearGradient>
        </defs>
        <path ref={road} d={ROAD} pathLength={1} stroke="url(#road-g)" strokeWidth="64" strokeLinecap="round" style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
        <path ref={lane} d={ROAD} stroke="#071827" strokeOpacity=".55" strokeWidth="2.5" strokeDasharray="16 18" strokeLinecap="round" style={{ opacity: 0 }} />
      </svg>
      {STOPS.map((s, i) => <div key={s.label} className="chip-at wait" ref={(el) => { chips.current[i] = el; }}><small>{s.label}</small>{s.body}</div>)}
      <svg className="plane" ref={plane} viewBox="-24 -24 48 48" style={{ opacity: 0 }}><path d={PLANE_PATH} fill="#FF8A3D" /></svg>
    </div>
  );
}
