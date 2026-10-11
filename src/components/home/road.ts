// Small helpers shared by the homepage's roads: put the plane on a path, facing the way the path runs.
export const PLANE_PATH = "M-14 -13 L22 0 L-14 13 L-6 0 Z";
export const still = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export function angleAt(path: SVGPathElement, len: number, at: number) {
  const a = path.getPointAtLength(Math.max(0, at - 1)), b = path.getPointAtLength(Math.min(len, at + 1));
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}
export function place(el: Element | null, x: number, y: number, a: number) {
  if (el) (el as SVGElement).style.transform = `translate(${x}px,${y}px) rotate(${a}deg)`;
}
/** The length along `path` where the point reaches `v` on one axis (the path must keep moving that way). */
export function lengthAt(path: SVGPathElement, total: number, v: number, axis: "x" | "y") {
  let lo = 0, hi = total;
  for (let k = 0; k < 24; k++) { const mid = (lo + hi) / 2; if (path.getPointAtLength(mid)[axis] < v) lo = mid; else hi = mid; }
  return lo;
}
/** Run `fn` again whenever the layout may have moved: resize, fonts loaded, page loaded. Returns a cleanup. */
export function onLayout(fn: () => void) {
  window.addEventListener("resize", fn); window.addEventListener("load", fn);
  let live = true;
  document.fonts?.ready.then(() => { if (live) fn(); });
  return () => { live = false; window.removeEventListener("resize", fn); window.removeEventListener("load", fn); };
}
