export const SITE = {
  name: "Toursside",
  tagline: "The operating system behind your travel business.",
  description:
    "Toursside is travel agency and tour operator software that keeps bookings, customers, itineraries, invoices, payments and partner requests in one connected system.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://toursside.com").replace(/\/$/, ""),
  trustedBy: "Trusted by 40+ travel agents",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "97451131080").replace(/\D/g, ""),
  builder: { name: "Nino Techy" },
};

export const whatsappLink = (text: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const PLANS = {
  monthly: { id: "monthly", label: "Monthly", price: 50, per: "month", note: "Billed every month" },
  annual: { id: "annual", label: "Annual", price: 500, per: "year", note: "Billed once a year, the same as ten months of monthly billing" },
} as const;
export type PlanId = keyof typeof PLANS;
