// Every product screenshot the search pages use, in one place. The admin screens are being restyled: to swap a
// screenshot, replace the file in public/shots (same name) or change its line here. Desktop shots are 1490 wide;
// phone shots are shown inside a phone frame.
export type Shot = { src: string; w: number; h: number; phone?: boolean };
const desk = (name: string, h = 1125): Shot => ({ src: `/shots/${name}.webp`, w: 1490, h });
const phone = (name: string): Shot => ({ src: `/shots/${name}.webp`, w: 600, h: 1215, phone: true });

export const SHOTS = {
  orders: desk("orders"),
  inquiries: desk("inquiries"),
  itinerary: desk("itinerary"),
  finance: desk("finance"),
  corporate: desk("corporate"),
  tours: desk("tours"),
  group: desk("group"),
  docDesigns: desk("doc-designs", 710),
  newOrder: phone("m-new-order"),
  orderTypes: phone("m-order-types"),
  flightOrder: phone("m-flight-order"),
  visaOrder: phone("m-visa-order"),
} as const;
export type ShotKey = keyof typeof SHOTS;

// Alt text for the shots that appear on more than one page.
export const SHOT_ALT = {
  newOrder: "Toursside new order screen on a phone asking what the customer is buying: tour, flight ticket, hotel, visa, transportation or other",
  orderTypes: "Toursside orders list on a phone with hotel, visa, transport and flight orders for the same customer",
  flightOrder: "A flight ticket order in Toursside on a phone, linked into a package, with route, dates, airline, PNR and ticket number",
  visaOrder: "A visa order in Toursside on a phone with visa status, application and appointment dates, reference number and documents received",
  group: "A group departure in Toursside showing passengers, orders, seats left, passports to check, and the money and trip details",
} as const;
