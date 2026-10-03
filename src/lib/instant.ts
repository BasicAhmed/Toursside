// Instant demo: the website asks the Toursside product to create a workspace. Both values are server-only.
export const PRODUCT_API_URL = (process.env.PRODUCT_API_URL ?? "").trim().replace(/\/$/, "");
export const PROVISION_SECRET = (process.env.PROVISION_SECRET ?? "").trim();
export const instantEnabled = () => PRODUCT_API_URL.length > 0 && PROVISION_SECRET.length >= 24;
export const TRIAL_DAYS = Math.max(1, Number(process.env.TRIAL_DAYS) || 14);

// The same colour pairs the product accepts (src/lib/brand.ts in Toursystem-Saas).
export const THEMES = [
  { id: "ocean", label: "Ocean", primary: "#102A43", accent: "#FF8A3D" },
  { id: "nile", label: "Nile", primary: "#0F3B3A", accent: "#3CC9A7" },
  { id: "desert", label: "Desert", primary: "#141010", accent: "#F0B050" },
  { id: "sunset", label: "Sunset", primary: "#2B1638", accent: "#FF7A59" },
  { id: "forest", label: "Forest", primary: "#14301F", accent: "#B7D94C" },
  { id: "sky", label: "Sky", primary: "#14254A", accent: "#5CB8FF" },
  { id: "rose", label: "Rose", primary: "#3A1226", accent: "#FF8FA3" },
  { id: "slate", label: "Slate", primary: "#1B2430", accent: "#FFC857" },
] as const;
