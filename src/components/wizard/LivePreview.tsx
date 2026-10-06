"use client";
import { useEffect, useRef, useState } from "react";
import { initialsOf, previewSlug } from "@/lib/slug";

export const ROWS = [["Nile cruise, 4 days", "Paid"], ["Desert safari", "Invoiced"], ["City highlights", "New"]] as const;
const Lock = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;

/** The miniature staff panel. The live preview and the setup film draw the very same thing, so one can turn into the other. */
export function MiniApp({ company, state, appRef }: { company: string; state: string; appRef?: React.Ref<HTMLDivElement> }) {
  const name = company.trim() || "Your company", initials = initialsOf(company);
  return (
    <div className={`wb-app ${state}`} ref={appRef}>
      <div className="wb-side"><span className="wb-mark" key={initials}>{initials}</span><i /><i /><i /><i /></div>
      <div className="wb-main">
        <div className="wb-top"><b>{name}</b><span>+ New order</span></div>
        <div className="wb-cards"><em /><em /><em /></div>
        {ROWS.map(([t, s], i) => <div className="wb-row" key={t} style={{ transitionDelay: `${i * 90}ms` }}><u /><p>{t}</p><small>{s}</small></div>)}
      </div>
      <div className="wb-shine" />
    </div>
  );
}

/** Their workspace, building as they type: name, initials mark, address and colours. On a phone it is a slim strip
 *  that opens into the full miniature only on steps with nothing to type. It is a picture of what the form already
 *  says in words, so it is hidden from screen readers. */
export default function LivePreview({ company, primary, accent, address = true, open, typing, gone, appRef, stripRef, extra }: {
  company: string; primary: string; accent: string; address?: boolean; open?: boolean; typing?: boolean; gone?: boolean;
  appRef?: React.Ref<HTMLDivElement>; stripRef?: React.Ref<HTMLDivElement>; extra?: React.ReactNode;
}) {
  const slug = previewSlug(company), name = company.trim() || "Your company";
  // A wash of the new colour spreads across the card each time the theme changes (never on first paint).
  const [wash, setWash] = useState(0), was = useRef(accent);
  useEffect(() => { if (was.current !== accent) { was.current = accent; setWash((n) => n + 1); } }, [accent]);
  const url = <><b data-slug={slug}>{slug || "yourcompany"}</b>.toursside.com</>;
  return (
    <div className={`lp${open ? " open" : ""}${typing ? " typing" : ""}${slug ? "" : " empty"}`} aria-hidden="true" style={{ ["--wb-p" as string]: primary, ["--wb-a" as string]: accent, visibility: gone ? "hidden" : undefined }}>
      {wash ? <i className="lp-wash" key={wash} /> : null}
      <div className="lp-strip" ref={stripRef}>
        <span className="lp-mark" key={initialsOf(company)}>{initialsOf(company)}</span>
        <span className="lp-id"><b>{name}</b>{address ? <small>{url}</small> : null}</span>
        {extra ? <span className="lp-extra">{extra}</span> : null}
      </div>
      <div className="lp-stage"><div>
        {address ? <p className="lp-url"><Lock /><span>{url}</span></p> : null}
        <MiniApp company={company} state="live" appRef={appRef} />
      </div></div>
    </div>
  );
}

/** Where the setup film should start from: the miniature if it is showing, otherwise the phone strip. */
export function handoffBox(app: HTMLElement | null, strip: HTMLElement | null) {
  const a = app?.getBoundingClientRect(), holder = app?.parentElement?.getBoundingClientRect();
  const el = a && holder && holder.height >= a.height * 0.9 ? a : strip?.getBoundingClientRect();
  return el && el.width > 0 ? { left: el.left, top: el.top, width: el.width, height: el.height } : null;
}

/** Book-a-demo version of the live panel: a boarding pass that fills in as they answer. */
export function DemoPass({ name, company, country, sells, team, when, open }: { name: string; company: string; country: string; sells: string; team: string; when: string; open?: boolean }) {
  const first = name.trim().split(/\s+/)[0] || "";
  const cell = (label: string, value: string, wide = false) => <div className={`dp-c${wide ? " wide" : ""}${value ? " in" : ""}`}><dt>{label}</dt><dd key={value}>{value || <i />}</dd></div>;
  return (
    <div className={`dp${open ? " open" : ""}`} aria-hidden="true">
      <div className="dp-top">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.5 2.5 2.8 9.6c-.7.3-.7 1.2 0 1.5l6.5 2.6 2.6 6.5c.3.7 1.2.7 1.5 0L21.5 2.5Z" /></svg>
        <span><b>{company.trim() ? `Demo for ${company.trim()}` : "Your demo"}</b><small>{[sells, team && `${team} people`].filter(Boolean).join(" · ") || (first ? `With ${first}, on your kind of trips` : "A short walkthrough, on your kind of trips")}</small></span>
      </div>
      <div className="dp-body"><dl>
        {cell("Guest", name.trim())}{cell("Agency", company.trim())}
        {cell("Based in", country.trim())}{cell("Team", team)}
        {cell("Sells", sells, true)}
        {cell("When", when, true)}
      </dl></div>
    </div>
  );
}
