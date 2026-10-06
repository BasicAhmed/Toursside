// The address a new workspace gets, worked out exactly as the product does it (provisionTenant and slugify in
// Toursystem-Saas src/lib/provision.ts, RESERVED in src/lib/tenant.ts), so the live preview never shows an address
// the product would not try first. Whether that address is still free is only known when the workspace is created:
// if it is taken the product adds a number, and the preview says so instead of claiming it is available.
const RESERVED = new Set(["www", "app", "api", "admin", "mail", "demo", "start", "status", "help", "support", "docs", "blog", "cdn", "static", "assets", "template", "control", "toursside"]);
export const COMPANY_MAX = 80;
export const cleanCompany = (name: string) => name.trim().replace(/\s+/g, " ").slice(0, COMPANY_MAX);
export const slugify = (name: string) => name.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32).replace(/-+$/g, "");
/** First address the product will try for this company name. Empty while there is no name yet. */
export function previewSlug(company: string): string {
  const name = cleanCompany(company);
  if (!name) return "";
  let base = slugify(name);
  if (base.length < 3) base = `${base || "co"}-tours`;
  return RESERVED.has(base) ? `${base.slice(0, 28)}-2` : base;
}
export const initialsOf = (company: string) => (company.trim() || "Your company").split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
export const validCompany = (company: string) => cleanCompany(company).length >= 2 && /[\p{L}\p{N}]/u.test(company);
