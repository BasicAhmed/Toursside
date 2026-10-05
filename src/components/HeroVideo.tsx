"use client";
import { useEffect, useRef } from "react";
import { HERO } from "@/lib/shots";

// The hero film: 18 seconds, silent, loops. It plays only while it is on screen, and stays on its poster frame for
// visitors who ask for reduced motion.
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { v.pause(); v.removeAttribute("autoplay"); v.controls = true; return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.15 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video ref={ref} className="hero-video" width={HERO.w} height={HERO.h} autoPlay muted loop playsInline preload="metadata" poster={HERO.poster}
      aria-label="A short film of Toursside: bookings from the website, WhatsApp, email, phone and Viator arrive in one orders list, an order is opened to show its five steps, the finance page shows revenue and profit, and the same order is shown on a phone.">
      <source src={HERO.mp4} type="video/mp4" />
      <source src={HERO.webm} type="video/webm" />
    </video>
  );
}
