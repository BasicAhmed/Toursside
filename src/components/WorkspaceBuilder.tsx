"use client";
import { useEffect, useRef, useState } from "react";

const STAGES = ["Creating your private database", "Adding your name and colours", "Loading sample tours and orders", "Opening your workspace"];
const ROWS = [["Nile cruise, 4 days", "Paid"], ["Desert safari", "Invoiced"], ["City highlights", "New"]];

/** Full-screen "we are building it" film shown while the workspace is created. The mock panel assembles itself in the
 *  company's own colours; the last step waits for the real answer, so it never claims to be ready before it is. */
export default function WorkspaceBuilder({ company, primary = "#102A43", accent = "#16A6A3", ready, onDone }: { company: string; primary?: string; accent?: string; ready: boolean; onDone: () => void }) {
  const [stage, setStage] = useState(0);
  const done = useRef(onDone); done.current = onDone;
  const name = company.trim() || "Your company";
  const initials = name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  useEffect(() => {
    if (stage < 2) { const t = setTimeout(() => setStage((s) => s + 1), 1150); return () => clearTimeout(t); }
    if (stage === 2 && ready) { const t = setTimeout(() => setStage(3), 1000); return () => clearTimeout(t); }
    if (stage === 3) { const t = setTimeout(() => done.current(), 1100); return () => clearTimeout(t); }
  }, [stage, ready]);

  return (
    <div className="wb" role="status" aria-live="polite" style={{ ["--wb-p" as string]: primary, ["--wb-a" as string]: accent }}>
      <div className="wb-in">
        <div className="wb-stage" aria-hidden="true">
          <svg className="wb-route" viewBox="0 0 320 90" fill="none"><path d="M6 78 C 90 -8, 230 -8, 314 78" stroke="currentColor" strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round" /></svg>
          <span className="wb-plane"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 2.5 2.8 9.6c-.7.3-.7 1.2 0 1.5l6.5 2.6 2.6 6.5c.3.7 1.2.7 1.5 0L21.5 2.5Z" /></svg></span>
          <div className={`wb-app s${stage}`}>
            <div className="wb-side"><span className="wb-mark">{initials}</span><i /><i /><i /><i /></div>
            <div className="wb-main">
              <div className="wb-top"><b>{name}</b><span>+ New order</span></div>
              <div className="wb-cards"><em /><em /><em /></div>
              {ROWS.map(([t, s], i) => <div className="wb-row" key={t} style={{ transitionDelay: `${i * 160}ms` }}><u /><p>{t}</p><small>{s}</small></div>)}
            </div>
            <div className="wb-shine" />
          </div>
        </div>
        <h2>{stage === 3 ? `${name} is ready` : "Setting up your workspace"}</h2>
        <div className="wb-bar"><span style={{ width: `${[18, 46, 78, 100][stage]}%` }} /></div>
        <ol className="wb-steps">
          {STAGES.map((s, i) => <li key={s} className={i < stage || stage === 3 ? "ok" : i === stage ? "now" : ""}><span aria-hidden="true">{i < stage || stage === 3 ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 10 17.5 19 7" /></svg> : null}</span>{s}</li>)}
        </ol>
      </div>
    </div>
  );
}
