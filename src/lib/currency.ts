// Prices are set in US dollars and shown in the visitor's own currency, chosen from where they are browsing.
// Gulf currencies are pegged to the dollar, so their rates do not move. The others float: update their rate here
// from time to time (units of that currency for one US dollar).
export const CURRENCIES = {
  USD: { label: "US dollar", prefix: "$", rate: 1, fixed: true },
  QAR: { label: "Qatari riyal", prefix: "QR ", rate: 3.64, fixed: true },
  AED: { label: "UAE dirham", prefix: "AED ", rate: 3.6725, fixed: true },
  SAR: { label: "Saudi riyal", prefix: "SAR ", rate: 3.75, fixed: true },
  BHD: { label: "Bahraini dinar", prefix: "BD ", rate: 0.376, fixed: true },
  OMR: { label: "Omani rial", prefix: "OMR ", rate: 0.3845, fixed: true },
  KWD: { label: "Kuwaiti dinar", prefix: "KD ", rate: 0.307, fixed: false },
  EGP: { label: "Egyptian pound", prefix: "EGP ", rate: 51.5, fixed: false },
  EUR: { label: "Euro", prefix: "€", rate: 0.877, fixed: false },
  GBP: { label: "British pound", prefix: "£", rate: 0.758, fixed: false },
} as const;
export type CurrencyCode = keyof typeof CURRENCIES;
export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];
export const isCurrency = (c: unknown): c is CurrencyCode => typeof c === "string" && c in CURRENCIES;

const EURO = ["AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES"];
const BY_COUNTRY: Record<string, CurrencyCode> = { QA: "QAR", AE: "AED", SA: "SAR", BH: "BHD", OM: "OMR", KW: "KWD", EG: "EGP", GB: "GBP", ...Object.fromEntries(EURO.map((c) => [c, "EUR" as CurrencyCode])) };
export const currencyForCountry = (country: string | null | undefined): CurrencyCode => BY_COUNTRY[(country ?? "").toUpperCase()] ?? "USD";

// A dollar price in another currency, rounded to a clean figure: whole numbers, or one decimal for high-value
// currencies such as the Kuwaiti dinar.
export function localAmount(usd: number, code: CurrencyCode): number {
  const v = usd * CURRENCIES[code].rate;
  return v < 100 ? Math.round(v * 10) / 10 : Math.round(v);
}
export function money(usd: number, code: CurrencyCode): string {
  const v = localAmount(usd, code);
  return CURRENCIES[code].prefix + v.toLocaleString("en-US", { maximumFractionDigits: 1 });
}
// A yearly price is ten times the monthly one. Multiplying the already-rounded monthly figure keeps the two in step
// ("QR 288 a month for ten months" is exactly QR 2,880 a year).
export function moneyYear(monthlyUsd: number, code: CurrencyCode): string {
  const v = Math.round(localAmount(monthlyUsd, code) * 10 * 10) / 10;
  return CURRENCIES[code].prefix + v.toLocaleString("en-US", { maximumFractionDigits: 1 });
}
export const rateNote = (code: CurrencyCode) => code === "USD" ? "" : CURRENCIES[code].fixed
  ? `Shown in ${CURRENCIES[code].label} at the fixed rate of ${CURRENCIES[code].rate} to the US dollar.`
  : `Shown in ${CURRENCIES[code].label} at about ${CURRENCIES[code].rate} to the US dollar. Your invoice confirms the exact amount.`;
