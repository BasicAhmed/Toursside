"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [["/#route", "How it works"], ["/#sell", "What you sell"], ["/#fares", "Pricing"], ["/solutions", "Solutions"]] as const;

export default function Header({ instant = false }: { instant?: boolean }) {
  const [open, setOpen] = useState(false);
  const path = usePathname() || "/";
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => { setOpen(false); }, [path]);
  const close = () => setOpen(false);
  const here = (href: string) => (!href.includes("#") && (path === href || path.startsWith(`${href}/`)) ? "page" : undefined);
  return (
    <header className="header">
      <div className="wrap header-in">
        <Link href="/" className="brand" aria-label="Toursside home" onClick={close}>
          <Image src="/mark.png" alt="" width={182} height={160} priority />
          <Image src="/wordmark-light.png" alt="Toursside" width={253} height={44} priority />
        </Link>
        <button type="button" className="menu-btn" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
          {open
            ? <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            : <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
          <span className="sr">{open ? "Close menu" : "Open menu"}</span>
        </button>
        <nav id="site-nav" className={`nav${open ? " open" : ""}`} aria-label="Main">
          {LINKS.map(([href, label]) => <Link key={href} href={href} className="link" aria-current={here(href)} onClick={close}>{label}</Link>)}
          {instant ? <Link href="/demo" className="link" aria-current={here("/demo")} onClick={close}>Book a demo</Link> : null}
          {instant
            ? <Link href="/start" className="btn btn-primary btn-sm" onClick={close}>Start free demo</Link>
            : <Link href="/demo" className="btn btn-primary btn-sm" onClick={close}>Book a demo</Link>}
        </nav>
      </div>
    </header>
  );
}
