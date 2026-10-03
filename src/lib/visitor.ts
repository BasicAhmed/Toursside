import { headers } from "next/headers";
import { currencyForCountry, isCurrency, type CurrencyCode } from "./currency";

// The visitor's currency: their own choice if they made one (?currency=QAR), otherwise from the country the hosting
// provider reports for their connection.
export async function visitorCurrency(chosen?: string): Promise<CurrencyCode> {
  const pick = (chosen ?? "").toUpperCase();
  if (isCurrency(pick)) return pick;
  try { return currencyForCountry((await headers()).get("x-vercel-ip-country")); } catch { return "USD"; }
}
