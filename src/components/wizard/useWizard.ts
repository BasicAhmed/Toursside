"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export type Wiz = ReturnType<typeof useWizard>;
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Step state for a wizard: which step, which way it is moving, where focus goes, and the browser's own Back button
 *  (each step forward is a history entry, so Back on a phone goes one step back instead of leaving the page). */
export function useWizard(count: number) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const cur = useRef(0), root = useRef<HTMLFormElement>(null), want = useRef<string | null>(null), first = useRef(true), target = useRef<number | null>(null);

  const focusNow = useCallback((id?: string | null) => {
    const form = root.current; if (!form) return;
    const panel = form.querySelector<HTMLElement>(`[data-step="${cur.current}"]`);
    const el = (id ? document.getElementById(id) : null) ?? panel?.querySelector<HTMLElement>("[data-autofocus]") ?? panel?.querySelector<HTMLElement>("h2");
    if (!el) return;
    el.focus({ preventScroll: true });
    // Keep the step in view without fighting the phone keyboard: only scroll when it is covered or off screen,
    // and then put the top of the form just under the header (and under the sticky preview strip on phones).
    const stick = form.parentElement?.querySelector<HTMLElement>(".lp, .dp");
    const under = 78 + (stick && getComputedStyle(stick).position === "sticky" ? stick.offsetHeight + 10 : 0);
    const top = form.getBoundingClientRect().top, bottom = el.getBoundingClientRect().bottom, h = window.visualViewport?.height ?? window.innerHeight;
    if (top < under - 6 || bottom > h - 16) window.scrollBy({ top: top - under, behavior: reduced() ? "auto" : "smooth" });
  }, []);

  const show = useCallback((n: number) => {
    n = Math.max(0, Math.min(count - 1, n));
    if (n === cur.current) { if (want.current) { const id = want.current; want.current = null; focusNow(id); } return; }
    setDir(n > cur.current ? 1 : -1); cur.current = n; setStep(n);
  }, [count, focusNow]);

  /** Go to a step. focusId: the field to focus once there (used when the server points at a field). */
  const go = useCallback((n: number, focusId?: string) => {
    want.current = focusId ?? null;
    const from = cur.current;
    try {
      const depth = Number(window.history.state?.wzd ?? 0); // how many of this wizard's own entries are behind us
      if (n > from) window.history.pushState({ ...(window.history.state ?? {}), wz: n, wzd: depth + 1 }, "");
      else if (n < from && depth >= from - n) { target.current = n; window.history.go(n - from); return; } // popstate finishes the move
    } catch { /* history not available: steps still work */ }
    show(n);
  }, [show]);
  /** Jump without a history entry (restoring saved answers after a refresh). */
  const restore = useCallback((n: number) => { first.current = true; show(n); }, [show]);

  useEffect(() => {
    const pop = (e: PopStateEvent) => { const t = target.current; target.current = null; const n = t ?? Number((e.state as { wz?: number } | null)?.wz ?? 0); show(Number.isFinite(n) ? n : 0); };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, [show]);

  useEffect(() => {
    // First paint: only take focus where it cannot pop a keyboard over the page (mouse and keyboard devices).
    if (first.current) { first.current = false; if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return; }
    const id = want.current; want.current = null;
    focusNow(id);
  }, [step, focusNow]);

  return { step, dir, count, root, go, restore, next: () => go(cur.current + 1), back: () => go(cur.current - 1) };
}

/** Answers survive a refresh or a trip away and back. Never pass a password in. Storage can be missing or blocked. */
export function useSaved<T>(key: string, data: T, onLoad: (saved: T) => void) {
  const live = useRef(false), load = useRef(onLoad); load.current = onLoad;
  useEffect(() => {
    try { const raw = window.sessionStorage.getItem(key); if (raw) load.current(JSON.parse(raw) as T); } catch { /* nothing saved */ }
    const t = setTimeout(() => { live.current = true; }, 0);
    return () => clearTimeout(t);
  }, [key]);
  useEffect(() => { if (!live.current) return; try { window.sessionStorage.setItem(key, JSON.stringify(data)); } catch { /* private mode */ } });
}
export const forget = (key: string) => { try { window.sessionStorage.removeItem(key); } catch { /* fine */ } };

/** What the browser has actually put in the fields (autofill and password managers do not always tell React). */
export function readFields(form: HTMLFormElement | null, keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  if (!form) return out;
  for (const k of keys) { const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#f-${k}`); if (el && typeof el.value === "string") out[k] = el.value; }
  return out;
}
