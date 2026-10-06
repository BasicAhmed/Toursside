"use client";
import { useEffect, useRef } from "react";

/** A short burst of paper in the given colours, drawn on one canvas. Nothing is drawn for people who ask for less motion. */
export default function Confetti({ colors, ms = 1200 }: { colors: string[]; ms?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    cv.dataset.on = "1";
    const dpr = Math.min(2, window.devicePixelRatio || 1), w = window.innerWidth, h = window.innerHeight;
    cv.width = w * dpr; cv.height = h * dpr; ctx.scale(dpr, dpr);
    const n = w < 600 ? 70 : 110, cx = w / 2, cy = Math.min(h * 0.42, 360);
    const bits = Array.from({ length: n }, (_, i) => {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.25, v = 5 + Math.random() * 9;
      return { x: cx, y: cy, vx: Math.cos(a) * v * (w < 600 ? 0.75 : 1.25), vy: Math.sin(a) * v, s: 5 + Math.random() * 6, r: Math.random() * 6.3, vr: (Math.random() - 0.5) * 0.5, c: colors[i % colors.length], round: i % 4 === 0 };
    });
    let raf = 0; const t0 = performance.now(); let last = t0;
    const tick = (now: number) => {
      const k = (now - t0) / ms, dt = Math.min(2.2, (now - last) / 16.7); last = now;
      ctx.clearRect(0, 0, w, h);
      if (k >= 1) return;
      ctx.globalAlpha = k < 0.65 ? 1 : Math.max(0, 1 - (k - 0.65) / 0.35);
      for (const b of bits) {
        b.vy += 0.34 * dt; b.vx *= 0.985; b.x += b.vx * dt; b.y += b.vy * dt; b.r += b.vr * dt;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.fillStyle = b.c;
        if (b.round) { ctx.beginPath(); ctx.arc(0, 0, b.s / 2.4, 0, 6.3); ctx.fill(); } else ctx.fillRect(-b.s / 2, -b.s / 3.2, b.s, b.s / 1.6 * Math.abs(Math.cos(b.r * 1.7)) + 1);
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <canvas ref={ref} className="confetti" aria-hidden="true" data-confetti="" />;
}
