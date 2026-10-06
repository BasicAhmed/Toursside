"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MiniApp } from "./wizard/LivePreview";
import Confetti from "./wizard/Confetti";

const STAGES = ["Creating your private database", "Adding your name and colours", "Loading sample tours and orders", "Opening your workspace"];
export type Box = { left: number; top: number; width: number; height: number };

/** Full-screen "we are building it" film shown while the workspace is created. The mock panel assembles itself in the
 *  company's own colours; the last step waits for the real answer, so it never claims to be ready before it is.
 *  `from` is where the live preview sat in the wizard: the panel starts there and flies to the middle, so the thing
 *  they just built carries on instead of being swapped for another picture. The film moves on as fast as the real
 *  work allows: the first steps are brief, and it only lingers for the "ready" moment. */
export default function WorkspaceBuilder({ company, primary = "#102A43", accent = "#16A6A3", ready, onDone, from, after }: { company: string; primary?: string; accent?: string; ready: boolean; onDone: () => void; from?: Box | null; after?: string }) {
  const [stage, setStage] = useState(0);
  const done = useRef(onDone); done.current = onDone;
  const app = useRef<HTMLDivElement>(null);
  const name = company.trim() || "Your company";

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  useEffect(() => {
    if (stage < 2) { const t = setTimeout(() => setStage((s) => s + 1), 650); return () => clearTimeout(t); }
    if (stage === 2 && ready) { const t = setTimeout(() => setStage(3), 550); return () => clearTimeout(t); }
    if (stage === 3) { const t = setTimeout(() => done.current(), 1250); return () => clearTimeout(t); }
  }, [stage, ready]);
  // The hand-off: start exactly over the preview, then let go.
  useLayoutEffect(() => {
    const el = app.current;
    if (!el || !from || from.width < 40 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const to = el.getBoundingClientRect(), k = from.width / to.width, cut = Math.max(0, 1 - from.height / (to.height * k)) * 100;
    el.style.transition = "none"; el.style.transformOrigin = "0 0";
    el.style.transform = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${k})`;
    el.style.clipPath = `inset(0 0 ${cut}% 0 round 18px)`;
    void el.offsetWidth;
    const raf = requestAnimationFrame(() => { el.style.transition = "transform .52s cubic-bezier(.2,.85,.25,1), clip-path .52s cubic-bezier(.2,.85,.25,1)"; el.style.transform = "none"; el.style.clipPath = "inset(0 0 0% 0 round 18px)"; });
    const t = setTimeout(() => { el.style.transition = ""; el.style.transform = ""; el.style.clipPath = ""; el.style.transformOrigin = ""; }, 620);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [from]);

  // Coming from the wizard the name and colours are already on the panel, so it never falls back to a grey skeleton.
  const look = from ? `s${Math.max(1, stage)}` : `s${stage}`;
  return (
    <div className={`wb${from ? " morph" : ""}`} role="status" aria-live="polite" style={{ ["--wb-p" as string]: primary, ["--wb-a" as string]: accent }}>
      {stage === 3 ? <Confetti colors={[accent, "#16A6A3", "#FF8A3D", "#FFFFFF"]} /> : null}
      <div className="wb-in">
        <div className="wb-stage" aria-hidden="true">
          <svg className="wb-route" viewBox="0 0 320 90" fill="none"><path d="M6 78 C 90 -8, 230 -8, 314 78" stroke="currentColor" strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round" /></svg>
          <span className="wb-plane"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 2.5 2.8 9.6c-.7.3-.7 1.2 0 1.5l6.5 2.6 2.6 6.5c.3.7 1.2.7 1.5 0L21.5 2.5Z" /></svg></span>
          <MiniApp company={company} state={look} appRef={app} />
        </div>
        <h2>{stage === 3 ? `${name} is ready` : "Setting up your workspace"}</h2>
        <p className="wb-after">{stage === 3 ? after || "Opening it now." : " "}</p>
        <div className="wb-bar"><span style={{ width: `${[18, 46, 78, 100][stage]}%` }} /></div>
        <ol className="wb-steps">
          {STAGES.map((s, i) => <li key={s} className={i < stage || stage === 3 ? "ok" : i === stage ? "now" : ""}><span aria-hidden="true">{i < stage || stage === 3 ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 10 17.5 19 7" /></svg> : null}</span>{s}</li>)}
        </ol>
      </div>
    </div>
  );
}
