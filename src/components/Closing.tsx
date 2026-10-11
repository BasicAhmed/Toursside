import Link from "next/link";
import { whatsappLink } from "@/lib/site";
import { instantEnabled } from "@/lib/instant";

/** The orange plane used in buttons. */
export const PlaneIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 11.2 21.5 3l-6.3 18-3.6-7.6z" /></svg>;

/** The main action of the site: start a demo workspace once instant demos are on, otherwise book a demo. */
export function MainCta({ label }: { label?: string }) {
  return instantEnabled()
    ? <Link href="/start" className="btn btn-primary"><PlaneIcon />{label ?? "Start your free demo"}</Link>
    : <Link href="/demo" className="btn btn-primary"><PlaneIcon />Book a demo</Link>;
}
export const WhatsAppCta = () => <a className="btn btn-ghost" href={whatsappLink("Hello Toursside, I have a question.")} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>;

/** The landing at the end of a page: the road comes down and the plane lands. */
export default function Closing() {
  const instant = instantEnabled();
  return (
    <section className="closing">
      <svg className="land" viewBox="0 0 620 300" fill="none" aria-hidden="true">
        <defs><linearGradient id="land-g" x1="0" y1="300" x2="620" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0B6F6D" /><stop offset="1" stopColor="#4FD8CA" /></linearGradient></defs>
        <path d="M20 290 C 160 290, 220 170, 360 170 S 520 120, 560 70" stroke="url(#land-g)" strokeWidth="40" strokeLinecap="round" />
        <path d="M20 290 C 160 290, 220 170, 360 170 S 520 120, 560 70" stroke="#071827" strokeOpacity=".55" strokeWidth="2" strokeDasharray="12 14" />
        <path d="M572 28 L612 18 L590 58 L584 42 Z" fill="#FF8A3D" />
      </svg>
      <div className="wrap">
        <h2 className="duo"><span className="thin">Your next booking</span><span className="bold">is already on its way.</span></h2>
        <p>{instant ? "Start a free demo with your company name and colours, filled with sample orders. Or ask us anything on WhatsApp." : "See Toursside with your own kind of trips in a short call. Or ask us anything on WhatsApp."}</p>
        <div className="cta-row"><MainCta /><WhatsAppCta /></div>
      </div>
    </section>
  );
}
