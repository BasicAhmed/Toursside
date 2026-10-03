"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [["/#product", "Product"], ["/solutions", "Solutions"], ["/#journey", "How it works"], ["/#pricing", "Pricing"]] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("keydown", key); };
  }, []);
  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="wrap header-in">
        <Link href="/" className="brand" aria-label="Toursside home" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="Toursside" width={410} height={96} priority />
        </Link>
        <button className="menu-btn" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
          <span /><b className="sr">{open ? "Close menu" : "Open menu"}</b>
        </button>
        <nav id="site-nav" className={`nav${open ? " open" : ""}`} aria-label="Main">
          {LINKS.map(([href, label]) => <Link key={href} href={href} className="link" onClick={() => setOpen(false)}>{label}</Link>)}
          <Link href="/demo" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>Book a demo</Link>
        </nav>
      </div>
    </header>
  );
}
