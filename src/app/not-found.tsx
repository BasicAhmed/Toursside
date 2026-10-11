import Link from "next/link";
import { PlaneIcon } from "@/components/Closing";

export default function NotFound() {
  return (
    <section className="page-hero"><div className="wrap">
      <h1 className="duo"><span className="thin">This page</span><span className="bold">is off the route.</span></h1>
      <p className="lede">The address may have changed, or the page was moved. Start again from the homepage.</p>
      <div className="cta-row">
        <Link href="/" className="btn btn-primary"><PlaneIcon />Go to the homepage</Link>
        <Link href="/solutions" className="btn btn-ghost">See what Toursside does</Link>
      </div>
      <svg className="lost-road" viewBox="0 0 900 220" fill="none" aria-hidden="true">
        <defs><linearGradient id="nf-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0B6F6D" /><stop offset="1" stopColor="#4FD8CA" /></linearGradient></defs>
        <path d="M10 170 C 140 170, 180 90, 320 90 S 470 150, 540 150" stroke="url(#nf-g)" strokeWidth="34" strokeLinecap="round" />
        <path d="M10 170 C 140 170, 180 90, 320 90 S 470 150, 540 150" stroke="#071827" strokeOpacity=".55" strokeWidth="2" strokeDasharray="12 14" />
        <path d="M600 150 C 660 150, 700 120, 760 80" stroke="rgba(233,238,240,.18)" strokeWidth="3" strokeDasharray="4 12" strokeLinecap="round" />
        <g transform="translate(800 56) rotate(-28)"><path d="M-14 -13 L22 0 L-14 13 L-6 0 Z" fill="#FF8A3D" /></g>
      </svg>
    </div></section>
  );
}
