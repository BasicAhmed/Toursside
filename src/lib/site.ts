export const SITE = {
  name: "Toursside",
  tagline: "The operating system behind your travel business.",
  description:
    "Toursside is tour operator and travel agency software for Egypt, the Middle East and worldwide. Bookings, customers, itineraries, invoices, payments and partner requests in one connected system.",
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
    features: ["Bookings and customer CRM", "2 users", "Limited monthly bookings", "Invoices and documents", "Mobile access"],
    without: ["No advanced integrations"],
  },
  growth: {
    name: "Growth", monthly: 79, annual: 790, target: "Serious travel agencies",
    intro: "The complete platform.",
    features: ["Unlimited bookings", "Customer CRM", "Tours and products", "Suppliers and service costs", "Corporate requests", "Payments", "Invoices and documents", "Booking-source management", "Admin dashboard", "Mobile access", "Notifications", "Basic reporting"],
    without: [],
  },
  business: {
    name: "Business", monthly: 149, annual: 1490, target: "Larger agencies and DMCs",
    intro: "Everything in Growth, plus:",
    features: ["More users", "Higher or unlimited operational limits", "Advanced reporting", "Advanced integrations", "Priority support", "AI features as they become available"],
    without: [],
  },
} as const;
export type PlanId = keyof typeof PLANS;
export const PLAN_IDS = Object.keys(PLANS) as PlanId[];
export const MAIN_PLAN: PlanId = "growth";
export type Billing = "monthly" | "annual";
export const priceOf = (plan: PlanId, billing: Billing) => PLANS[plan][billing];
export const perOf = (billing: Billing) => (billing === "annual" ? "year" : "month");
