"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// Phones only: once the hero buttons scroll away, keep the main action within reach.
export default function StickyCta({ from = "$39" }: { from?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => { const end = document.documentElement.scrollHeight - window.innerHeight - 500; setShow(window.scrollY > 700 && window.scrollY < end); };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className={`sticky-cta${show ? " show" : ""}`} aria-hidden={!show}>
      <span>Plans from {from} per month</span>
      <Link href="/demo" className="btn btn-primary btn-sm" tabIndex={show ? 0 : -1}>Book a demo</Link>
    </div>
  );
}
