export const SITE = {
  name: "Toursside",
  tagline: "The operating system behind your travel business.",
  description:
    "Tour operator and travel agency software for Egypt, the Middle East and worldwide: tours, group tours, flight, hotel and visa orders, invoices and payments.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://toursside.com").replace(/\/$/, ""),
  trustedBy: "Trusted by 40+ travel agents",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "97451131080").replace(/\D/g, ""),
  builder: { name: "Nino Techy" },
};

export const whatsappLink = (text: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const PLANS = {
  starter: {
    name: "Starter", monthly: 39, annual: 390, target: "Small agencies and new operators",
    intro: "The essentials, with smaller limits.",
    features: ["Orders, customers and inquiries", "Flight, hotel, visa and transport orders", "Tours and itineraries", "Invoices and documents", "2 staff accounts", "Mobile access"],
    without: ["No group tours, partner requests, finance or reports", "No tours on your own website"],
  },
  growth: {
    name: "Growth", monthly: 79, annual: 790, target: "Serious travel agencies",
    intro: "The complete platform.",
    features: ["Unlimited bookings", "Flight, hotel, visa and transport orders", "Group tours and passenger manifests", "Customer CRM", "Tours and products", "Suppliers and service costs", "Partner requests", "Payments", "Invoices and documents", "Booking-source management", "Finance and reports", "Reviews and referrals", "Tours on your own website", "Notifications", "5 staff accounts"],
    without: [],
  },
  business: {
    name: "Business", monthly: 149, annual: 1490, target: "Larger agencies and DMCs",
    intro: "Everything in Growth, plus:",
    features: ["15 staff accounts", "Higher or unlimited operational limits", "Advanced reporting", "Advanced integrations", "Priority support", "AI features as they become available"],
    without: [],
  },
} as const;
export type PlanId = keyof typeof PLANS;
export const PLAN_IDS = Object.keys(PLANS) as PlanId[];
export const MAIN_PLAN: PlanId = "growth";
export type Billing = "monthly" | "annual";
export const priceOf = (plan: PlanId, billing: Billing) => PLANS[plan][billing];
export const perOf = (billing: Billing) => (billing === "annual" ? "year" : "month");
