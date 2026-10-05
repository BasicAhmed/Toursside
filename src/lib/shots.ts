// Every product screenshot the site uses, in one place. To swap a screenshot, replace the file in public/shots
// (same name) or change its line here. Desktop shots are captured from the staff panel at 1440 x 1087 and saved at
// 2360 x 1782; phone shots are 390 x 790 at 2x and are shown inside a phone frame. The hero film is in public/video.
export type Shot = { src: string; w: number; h: number; phone?: boolean };
const desk = (name: string, w = 2360, h = 1782): Shot => ({ src: `/shots/${name}.webp`, w, h });
const phone = (name: string): Shot => ({ src: `/shots/${name}.webp`, w: 780, h: 1580, phone: true });

export const SHOTS = {
  orders: desk("orders"),
  order: desk("order"),
  orderDocuments: desk("order-documents"),
  orderOperations: desk("order-operations"),
  inquiries: desk("inquiries"),
  itinerary: desk("itinerary"),
  finance: desk("finance"),
  reports: desk("reports"),
  partnerRequest: desk("partner-request"),
  tours: desk("tours"),
  group: desk("group"),
  docDesigns: desk("doc-designs", 1490, 710),
  phoneOrders: phone("m-orders"),
  phonePayment: phone("m-order-payment"),
  phoneOperations: phone("m-order-operations"),
  newOrder: phone("m-new-order"),
  orderTypes: phone("m-order-types"),
  flightOrder: phone("m-flight-order"),
  visaOrder: phone("m-visa-order"),
  hotelOrder: phone("m-hotel-order"),
} as const;
export type ShotKey = keyof typeof SHOTS;

// The hero film and its poster frame (1600 x 1000).
export const HERO = { mp4: "/video/hero.mp4", webm: "/video/hero.webm", poster: "/video/hero-poster.webp", w: 1600, h: 1000 } as const;

// Alt text for the shots that appear on more than one page.
export const SHOT_ALT = {
  orders: "Toursside orders list with tour, hotel, visa, transport and flight orders in one table, showing travel dates, payment progress, status and the next step for each",
  phoneOrders: "Toursside orders list on a phone with stage tabs, search, counts for to do, awaiting payment, confirmed and travelling this week, and the first order",
  phonePayment: "The payment and documents tab of an order on a phone, showing cost, profit, the amount paid and the balance left",
  phoneOperations: "The operations tab of an order on a phone, with the assigned guide, language, driver, vehicle and arrival flight",
  newOrder: "Toursside new order screen on a phone asking what the customer is buying: tour, flight ticket, hotel, visa, transportation or other",
  orderTypes: "Toursside orders list on a phone with visa, transport and flight orders for the same customer",
  flightOrder: "A flight ticket order in Toursside on a phone, paid in full, with its steps Price, Invoice, Payment, Ticketed and Done, and the package it belongs to",
  visaOrder: "A visa order in Toursside on a phone with the applicants, payment, and its steps Price, Invoice, Payment, Submitted and Decision",
  hotelOrder: "A hotel order in Toursside on a phone with the hotel name, guests, the amount paid and left, and its steps Price, Invoice, Payment, Confirmed and Done",
  group: "A group departure in Toursside showing passengers, orders, seats left, passports to check, and the money and trip details",
} as const;
