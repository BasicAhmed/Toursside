// Search landing pages. Every claim here describes something Toursside does today; region pages describe how the
// product fits how travel companies in that place work, and never claim customers there.
import type { ShotKey } from "./shots";
import { SELL } from "./seo-pages-sell";
export type Faq = { q: string; a: string };
// group: "core" pages are the parts of the system; "sell" pages are the things an agency sells with it.
// detail: longer sections under the cards. audience: who the page is for. related: slugs of the closest solutions.
export type Solution = { slug: string; nav: string; group: "core" | "sell"; title: string; description: string; h1: string; intro: string; shots: [ShotKey, string][]; points: [string, string][]; detail?: { h: string; p: string }[]; audience: string[]; steps: string[]; faqs: Faq[]; related: string[] };
export type Region = { beyond: string;  slug: string; name: string; nav: string; title: string; description: string; h1: string; intro: string; fit: [string, string][]; currencies: string; faqs: Faq[] };

const CORE: Solution[] = [
  {
    slug: "tour-booking-software", group: "core", nav: "Tour booking software",
    title: "Tour booking software for travel agencies and tour operators", description: "Toursside is tour booking software that puts website, WhatsApp, email, phone and Viator bookings in one orders list, with payments, invoices and itineraries attached.",
    h1: "Tour booking software that keeps every booking in one list", intro: "Bookings reach a travel company from many directions at once. Toursside is a tour booking system that collects them in one place, shows what each one is waiting for, and carries it through to payment and the trip itself.",
    shots: [["orders", "Toursside orders list with bookings from the website, WhatsApp, phone, email and Viator"]],
    points: [["Every channel in one list", "Website bookings arrive on their own. WhatsApp, email, phone and Viator bookings are added in under a minute and tagged with their source."], ["Stages you can filter", "To do, awaiting payment, confirmed and completed, each with a live count."], ["One next step per order", "Price, invoice, payment, itinerary, trip done. The order always shows what to do next and why."], ["Custom trips too", "Sell a one-off trip that is not on your website, priced from its cost and your margin."], ["A tracking page for the customer", "Each customer can follow their booking with their booking ID."], ["Works on a phone", "Check today's orders or record a payment from anywhere."]],
    detail: [{ h: "More than tours on the same list", p: "The orders list is not limited to tours. Staff choose what the customer is buying, so flight tickets, hotels, visas and transfers are orders too, and a customer's bookings can be linked as a package. Fixed departures are handled as group tours, where each party is its own order and the seats left are counted for you." }],
    audience: ["Tour operators selling day tours and multi-day packages", "Travel agencies taking bookings from several channels", "Teams that want one list instead of chats, inboxes and spreadsheets"],
    steps: ["A booking arrives from your website, or your team adds it from WhatsApp, email, phone or Viator.", "The trip is priced, an invoice is sent, and the payment is recorded against the order.", "The itinerary goes to the customer, the guide and driver are assigned, and the trip is marked done."],
    faqs: [{ q: "Can I take bookings on my existing website?", a: "Yes. You can paste a small piece of code that shows your tours on your own site, or link a Book now button to a tour's booking page. Those bookings land in your orders list." }, { q: "Does it handle bookings that come by WhatsApp?", a: "Yes. Your team adds the order in under a minute and tags it as WhatsApp, so it sits in the same list as website bookings and you can see how much business each channel brings." }, { q: "Is Viator supported?", a: "Viator orders are added by your team and recorded as paid through Viator. Toursside does not sync with Viator automatically." }],
    related: ["group-tour-management-software", "travel-agency-back-office", "tour-operator-website-booking", "travel-invoicing-software", "itinerary-builder", "travel-crm"],
  },
  {
    slug: "travel-crm", group: "core", nav: "Travel CRM",
    title: "Travel CRM for tour operators and travel agencies", description: "A travel CRM built into your booking system: inquiries, customer cards, repeat guests, follow-up, reviews and referrals, all linked to the order.",
    h1: "A travel CRM that is part of the booking, not beside it", intro: "Most CRMs are built for selling software. A travel company needs to know who asked, who booked, who paid and who came back. In Toursside the customer record lives on the order, so nothing is copied between tools.",
    shots: [["inquiries", "Toursside inquiries list with open, booked and lost inquiries"]],
    points: [["One inbox for inquiries", "Questions, trip requests and unfinished checkouts from your website, with a count of how many are waiting."], ["A customer card on every order", "Name, contact, country and nationality, editable at any time."], ["Repeat guests recognised", "Returning customers are matched by email or phone, so their history stays together."], ["Email or phone is enough", "Add a customer with whichever you have; fill in the rest later."], ["Reviews after the trip", "Send a review invite when the trip is done."], ["Referral codes", "Happy guests get a code to share, with a reward balance tracked per customer."]],
    audience: ["Agencies with repeat guests and referrals", "Sales teams answering inquiries from the website and WhatsApp", "Owners who want customer history in one place"],
    steps: ["An inquiry arrives and appears in Inquiries with its source.", "Your team replies by WhatsApp, call or email from the same screen, and turns it into an order.", "After the trip, the guest is invited to review and given a referral code."],
    faqs: [{ q: "Is this a separate CRM product?", a: "No. The CRM is part of Toursside. Customers, inquiries and follow-up sit in the same system as orders, payments and itineraries." }, { q: "Can several staff work on the same customers?", a: "Yes. Staff accounts have roles for owner, manager, sales, content and operations, and changes to an order are recorded with who made them." }, { q: "Can I export my customers?", a: "Yes. Orders and customers can be exported as CSV." }],
    related: ["tour-booking-software", "travel-agency-back-office", "visa-application-management", "travel-invoicing-software", "itinerary-builder", "tour-operator-website-booking"],
  },
  {
    slug: "itinerary-builder", group: "core", nav: "Itinerary builder",
    title: "Itinerary builder for tour operators, with branded PDFs", description: "Build day-by-day travel itineraries from templates or an existing PDF, price them from cost and margin, and send a branded PDF to your customer.",
    h1: "An itinerary builder that also sets the price", intro: "An itinerary is the product a tour operator actually sells. Toursside builds it day by day, works out the price from what the trip costs you, and turns it into a PDF with your logo and colours.",
    shots: [["itinerary", "Toursside new itinerary screen with options for a customer, a website tour, a template or a quick PDF"]],
    points: [["Day-by-day builder", "Each day has a headline, location, hotel and the activities, transfers, flights and meals in it."], ["Reusable templates", "Save the trips you sell often and start the next one from them."], ["Import from PDF", "Bring in an itinerary you already have as a PDF instead of retyping it."], ["Price from cost and margin", "Enter what the trip costs and your profit margin; the price per person follows."], ["Branded PDF in three designs", "Bold, Classic or Minimal, with your logo, colours and photos, sent by email or shared on WhatsApp."], ["Publish as a tour", "An itinerary can become a bookable tour on your website."]],
    detail: [{ h: "Three designs, and one itinerary for a whole group", p: "The itinerary PDF comes in three designs, Bold, Classic and Minimal, each in your logo and colours. For a group departure, one shared itinerary is attached to the departure instead of being copied to every passenger's booking." }],
    audience: ["Tour operators selling tailor-made and multi-day trips", "Agencies that send a day-by-day plan with every quote", "Teams retyping the same itinerary into a document each time"],
    steps: ["Start from a template, a PDF, or a blank page, and attach it to the customer's order.", "Fill in the days, then the cost and your margin. The order's price updates.", "Preview the PDF and send it."],
    faqs: [{ q: "Can I use my existing itinerary PDFs?", a: "Yes. Import a PDF and Toursside reads its days into the builder, ready to edit." }, { q: "Which currencies can an itinerary be priced in?", a: "US dollar, euro, British pound, Egyptian pound, UAE dirham, Saudi riyal, Qatari riyal, Kuwaiti dinar, Canadian and Australian dollar, Swiss franc and South African rand." }, { q: "Will the PDF carry my own branding?", a: "Yes. Upload your logo and choose your colours once; every itinerary and invoice uses them." }],
    related: ["travel-documents-and-invoice-templates", "group-tour-management-software", "tour-booking-software", "travel-invoicing-software", "tour-operator-website-booking", "travel-agency-back-office"],
  },
  {
    slug: "travel-invoicing-software", group: "core", nav: "Invoicing and payments",
    title: "Invoicing and payment tracking for travel agencies", description: "Create branded invoice PDFs from the booking, record deposits and balances in twelve currencies, and see revenue, cost and profit by month.",
    h1: "Invoices, deposits and profit, straight from the booking", intro: "Chasing who has paid is one of the most time-consuming jobs in a travel company. In Toursside the invoice is made from the order, each payment is recorded against it, and the month's profit adds itself up.",
    shots: [["finance", "Toursside finance page showing revenue collected, cost, profit and margin for the month"]],
    points: [["Invoice PDF from the order", "With your bank details, payment terms and logo, in a Bold, Classic or Minimal design. Nothing is typed twice."], ["Deposits and balances", "Record each payment; the balance and status update on their own."], ["Twelve currencies", "Price and collect in the customer's currency, with totals converted for your reports."], ["Profit you can trust", "The cost of each booking is saved when it is made, so past profit never shifts."], ["Monthly finance", "Revenue, cost, profit and margin by month, per tour and per partner request, as a PDF."], ["Owner and manager only", "Costs and margins are hidden from other staff roles."]],
    detail: [{ h: "One way to invoice everything you sell", p: "Invoices and payments work the same on every kind of order: a tour, a flight ticket, a hotel, a visa or a transfer. When several orders are linked as a package you see the combined total, paid and balance, while each order keeps its own invoice. Invoice PDFs come in three designs, Bold, Classic and Minimal." }],
    audience: ["Agency owners who want to know who has paid without asking", "Teams taking deposits and balances in several currencies", "Operators who want profit per booking and per month"],
    steps: ["Price the trip from its cost and your margin.", "Create the invoice and send it by email or WhatsApp.", "Record the deposit and the balance as they arrive."],
    faqs: [{ q: "Can my customers pay me by card through Toursside?", a: "Not yet. Payments are recorded by your team as they arrive by bank transfer, cash, link or another method. Online card payment is not connected today." }, { q: "Can I undo a payment recorded by mistake?", a: "Yes. A payment can be removed; it is kept on record as void and the balance is recalculated." }, { q: "Does it replace my accounting software?", a: "No. It tracks what each booking earned and what has been paid. Your accountant's software still does the books." }],
    related: ["travel-documents-and-invoice-templates", "travel-agency-back-office", "flight-ticket-booking-management", "hotel-booking-management", "tour-booking-software", "dmc-software"],
  },
  {
    slug: "dmc-software", group: "core", nav: "DMC and partner requests",
    title: "DMC software for ground handling and partner requests", description: "Software for destination management companies: handle requests from other agencies for transfers, tickets, guides, hotels and cruises, with cost, price and profit per request.",
    h1: "DMC software for the work other agencies send you", intro: "A destination management company arranges services on the ground for other travel companies. That work is priced and paid differently from a direct customer booking, so Toursside keeps it as its own kind of request.",
    shots: [["corporate", "A Toursside partner request showing total cost, price charged, profit, payments and services"]],
    points: [["A request per partner job", "Company, contact, group size, dates and notes, separate from customer orders."], ["Ten kinds of service", "Transfers, transportation, airport services, entrance tickets, permits, felucca, motor boat, tour guides, hotels and Nile cruises, plus your own."], ["Supplier and cost per service", "Record who provides each service, what it costs you and what you charge."], ["Two ways to price", "Price each service, or add one service-fee percentage on top of the total cost."], ["Invoice and payments", "Send a partner invoice and record what has been paid."], ["Counted in finance", "Partner revenue and profit flow into the same monthly report."]],
    audience: ["Destination management companies and ground handlers", "Tour operators who also serve other agencies", "Teams pricing several services into one partner invoice"],
    steps: ["A partner agency sends a request; you create it with the services needed.", "Add each service with its supplier, cost, date and time, and confirm them one by one.", "Send the invoice, record the payment, and mark the request complete."],
    faqs: [{ q: "Is there a supplier database?", a: "Each service on a request records its supplier and cost. There is no separate supplier directory or supplier login yet." }, { q: "Can I mix direct customers and partner work?", a: "Yes. Customer orders and partner requests are separate lists, and both appear in your finance report." }, { q: "Are the service types fixed?", a: "No. Besides the built-in types you can add a service with your own name." }],
    related: ["transfer-and-transportation-management", "group-tour-management-software", "travel-documents-and-invoice-templates", "travel-invoicing-software", "hotel-booking-management", "tour-booking-software"],
  },
  {
    slug: "tour-operator-website-booking", group: "core", nav: "Booking on your website",
    title: "Add tour booking to your travel website", description: "Add a booking engine to an existing travel website with one line of code, or use the booking pages Toursside gives you. WordPress, Wix, Squarespace and custom sites.",
    h1: "Add tour booking to the website you already have", intro: "You do not need a new website to take bookings online. Toursside gives every company booking pages for its tours, and a small piece of code that shows those tours inside an existing site.",
    shots: [["tours", "Toursside tours list with live tours, prices per person and booking counts"]],
    points: [["One line of code", "Paste it into a page and your tours appear as cards with photo, length and price."], ["Always up to date", "Edit a tour once in Toursside; your website shows the change."], ["One tour or all of them", "Show the whole catalogue, the first few, or a single tour on its own page."], ["Or just a link", "Point any Book now button at a tour's booking page."], ["A booking flow built for phones", "Date, travellers, extras and a clear total, then a confirmation with a booking ID."], ["Straight into your orders", "Every website booking lands in your orders list, tagged Website."]],
    audience: ["Tour operators with a website that cannot take bookings yet", "Agencies on WordPress, Wix or Squarespace", "New operators who need booking pages without building a site"],
    steps: ["Add your tours in Toursside with photos, length and price.", "Copy the code from Add to your website and paste it into your site.", "Bookings arrive in your orders list and your team is alerted by email."],
    faqs: [{ q: "Does it work with WordPress?", a: "Yes. Add a Custom HTML block and paste the code. The same code works in Wix, Squarespace, Webflow and hand-built sites." }, { q: "Is there a WordPress plugin?", a: "No plugin is needed and none exists. The embed is one line of code that works in any site builder that allows custom HTML." }, { q: "What if my site builder blocks scripts?", a: "Use a normal link to the tour's booking page. Links work everywhere." }],
    related: ["tour-booking-software", "group-tour-management-software", "itinerary-builder", "travel-crm", "travel-invoicing-software", "travel-agency-back-office"],
  },
];
export const SOLUTIONS: Solution[] = [...CORE, ...SELL];
export const solutionBySlug = (slug: string) => SOLUTIONS.find((s) => s.slug === slug);

const COMMON: Faq[] = [
  { q: "What language is Toursside in?", a: "The staff panel, booking pages and documents are in English today." },
  { q: "How long does it take to start?", a: "A demo workspace with your company name and colours is ready in seconds, with sample orders to try." },
];
export const REGIONS: Region[] = [
  {
    slug: "middle-east", beyond: "Agencies across the region sell far more than tours. Flight tickets, hotels, visas and transfers are each their own kind of order in Toursside, and fixed group departures have capacity, seats left and a passenger manifest.", name: "the Middle East", nav: "Middle East",
    title: "Tour operator software for the Middle East", description: "Tour booking and travel agency management software for tour operators and DMCs across the Middle East: WhatsApp bookings, Gulf currencies, partner requests and branded invoices.",
    h1: "Tour operator software for travel companies in the Middle East", intro: "Travel companies across the region sell the same way: a lot of WhatsApp, a lot of partner agencies, several currencies, and guests arriving from everywhere. Toursside is a booking and management system built around that way of working.",
    fit: [["WhatsApp is a first-class channel", "Orders that start in a chat are added in under a minute and tracked like any website booking, with WhatsApp, call and email one tap away on every order."], ["Gulf and regional currencies", "Price, invoice and record payments in the customer's currency, with totals converted for your reports."], ["Agency-to-agency work", "Requests from partner agencies for transfers, guides, hotels and tickets have their own workflow with cost, price and profit."], ["Guests from many countries", "Nationality, passport details and flight times are kept per traveller, with passport files stored encrypted."]],
    currencies: "US dollar, euro, British pound, Egyptian pound, UAE dirham, Saudi riyal, Qatari riyal and Kuwaiti dinar",
    faqs: [{ q: "Which Middle East currencies are supported?", a: "Egyptian pound, UAE dirham, Saudi riyal, Qatari riyal and Kuwaiti dinar, alongside US dollar, euro and British pound." }, ...COMMON],
  },
  {
    slug: "egypt", beyond: "Alongside tours and cruises, an Egyptian agency can record the domestic flight, the hotel nights in Cairo and the airport transfer as separate orders for the same guest, and link them as one package.", name: "Egypt", nav: "Egypt",
    title: "Tour operator software for Egypt: bookings, itineraries and DMC work", description: "Tour booking and management software for Egyptian tour operators and travel agencies: Nile cruises, day tours, packages, partner requests, EGP and USD invoices.",
    h1: "Tour operator software built from the daily work of an Egyptian tour company", intro: "Toursside grew out of the day-to-day running of a tour operator in Egypt: day tours from Cairo and Luxor, multi-day packages, Nile cruises, airport transfers, and a steady flow of requests from agencies abroad.",
    fit: [["Day tours, packages and cruises", "Sell hour-long transfers, full-day tours and multi-day packages with days and nights, each with its own price."], ["Ground services for other agencies", "Entrance tickets, permits, felucca and motor boat trips, tour guides, hotels and Nile cruises are built-in service types on partner requests."], ["Pounds and dollars", "Price in US dollars, euros or Egyptian pounds and see one combined total in your reports."], ["Guides and drivers", "Assign a guide by language, record driver, vehicle, pickup time and flights on each order."]],
    currencies: "Egyptian pound, US dollar, euro and British pound",
    faqs: [{ q: "Can I price in Egyptian pounds?", a: "Yes. Orders, invoices and itineraries can be in Egyptian pounds, US dollars, euros and other currencies." }, { q: "Does it cover Nile cruise and felucca bookings?", a: "Yes. They can be sold as tours, and they are built-in service types when you arrange them for a partner agency." }, ...COMMON],
  },
  {
    slug: "uae", beyond: "Many UAE agencies handle visas, flight tickets and hotel stays alongside tours. Each is its own kind of order, with a visa status, a PNR or a confirmation number you can search by.", name: "the UAE", nav: "UAE",
    title: "Tour operator and DMC software for the UAE", description: "Booking and management software for tour operators and DMCs in Dubai and Abu Dhabi: desert safaris, city tours, transfers, partner requests and AED invoices.",
    h1: "Tour operator and DMC software for the UAE", intro: "Tour companies in Dubai and Abu Dhabi handle high volumes of short experiences alongside larger groups sent by overseas agencies. Toursside keeps both in one system.",
    fit: [["Short experiences at volume", "Day tours and transfers priced per person or per group, with a fast list that filters by stage and channel."], ["Groups from overseas agencies", "Each partner job is a request with its services, suppliers, cost and price."], ["Invoices in dirhams", "Price and invoice in UAE dirham or in the customer's own currency."], ["Run it from a phone", "The staff panel works in a phone browser, for teams that are rarely at a desk."]],
    currencies: "UAE dirham, US dollar, euro and British pound",
    faqs: [{ q: "Can I invoice in AED?", a: "Yes. UAE dirham is one of the supported currencies for prices, payments and invoices." }, ...COMMON],
  },
  {
    slug: "saudi-arabia", beyond: "Agencies in the Kingdom that arrange visas, flight tickets, hotels and group departures can keep all of them in the same system, each as an order with its own invoice and payments.", name: "Saudi Arabia", nav: "Saudi Arabia",
    title: "Tour operator software for Saudi Arabia", description: "Booking and travel agency management software for tour operators in Saudi Arabia: tours, itineraries, group requests, SAR invoices and payment tracking.",
    h1: "Tour operator software for Saudi Arabia", intro: "Tourism in the Kingdom is growing quickly, and new tour companies need their operations in order from the first season. Toursside gives a new or growing operator one system for bookings, customers, itineraries and money.",
    fit: [["Start organised", "Tours, orders, customers and invoices in one place from day one, instead of a spreadsheet that has to be replaced later."], ["Itineraries with your brand", "Day-by-day plans as PDFs with your logo and colours."], ["Invoices in riyals", "Price and invoice in Saudi riyal or in the customer's own currency."], ["Group and partner work", "Requests from other companies are tracked with their services, cost and price."]],
    currencies: "Saudi riyal, US dollar, euro and British pound",
    faqs: [{ q: "Can I invoice in SAR?", a: "Yes. Saudi riyal is one of the supported currencies for prices, payments and invoices." }, ...COMMON],
  },
  {
    slug: "jordan", beyond: "For a group travelling the same route together, a group departure keeps every party as its own order, shares the cost of the guide and coach across them, and produces one passenger manifest.", name: "Jordan", nav: "Jordan",
    title: "Tour operator software for Jordan", description: "Booking and management software for tour operators and DMCs in Jordan: multi-day itineraries, guides and drivers, partner requests and branded invoices.",
    h1: "Tour operator software for Jordan", intro: "Trips in Jordan are usually multi-day routes with a driver, a guide and several hotels. Toursside is built for that kind of trip: an itinerary by day, the people assigned to it, and the money behind it.",
    fit: [["Multi-day routes", "Build the itinerary day by day with hotels, transfers and activities, and reuse it as a template."], ["Driver and guide on the order", "Assign a guide by language and record the driver, vehicle and pickup time."], ["Work for overseas agencies", "Partner requests carry their own services, suppliers, cost and price."], ["Dollar and euro pricing", "Price and invoice in US dollars, euros or British pounds."]],
    currencies: "US dollar, euro and British pound",
    faqs: [{ q: "Can I price in Jordanian dinar?", a: "Not yet. Prices and invoices can be in US dollars, euros, British pounds and nine other currencies; Jordanian dinar is not one of them today." }, ...COMMON],
  },
  {
    slug: "morocco", beyond: "A tailor-made trip often includes an airport transfer, extra hotel nights or a flight. Each can be its own order for the same traveller, linked to the tour as one package with a combined balance.", name: "Morocco", nav: "Morocco",
    title: "Tour operator software for Morocco", description: "Booking and management software for Moroccan tour operators: private tours, desert trips, multi-day itineraries, WhatsApp bookings and branded invoices.",
    h1: "Tour operator software for Morocco", intro: "Moroccan tour operators sell private, tailor-made trips, often agreed over WhatsApp and email with travellers abroad. Toursside turns those conversations into orders with a price, an invoice and an itinerary.",
    fit: [["Tailor-made trips", "Price each trip from its cost and your margin, with a custom itinerary per customer."], ["From chat to order", "Add a WhatsApp or email booking in under a minute and keep the customer's contact on the order."], ["Itinerary PDFs", "Send a day-by-day plan with your logo, colours and photos."], ["Euro and dollar pricing", "Price and invoice in euros, US dollars or British pounds."]],
    currencies: "euro, US dollar and British pound",
    faqs: [{ q: "Can I price in Moroccan dirham?", a: "Not yet. Prices and invoices can be in euros, US dollars, British pounds and nine other currencies; Moroccan dirham is not one of them today." }, ...COMMON],
  },
  {
    slug: "turkey", beyond: "Operators running scheduled departures can set a capacity per date, see the seats left and publish the departure on their booking website, while flight tickets, hotels and transfers are recorded as their own orders.", name: "Turkey", nav: "Turkey",
    title: "Tour operator software for Turkey", description: "Booking and management software for tour operators and travel agencies in Turkey: day tours, packages, transfers, partner requests and invoices in euro or dollar.",
    h1: "Tour operator software for Turkey", intro: "From day tours in Istanbul and Cappadocia to packages along the coast, Turkish operators run many departures across several cities. Toursside keeps each city's tours, bookings and guides in one system.",
    fit: [["Tours by destination", "Group tours by city and show them on your website with photos and prices."], ["Daily departures", "See who is travelling this week and which orders still need a guide or a payment."], ["Agency partners", "Handle requests from other agencies for transfers, guides and hotels, with profit per request."], ["Euro and dollar pricing", "Price and invoice in euros, US dollars or British pounds."]],
    currencies: "euro, US dollar and British pound",
    faqs: [{ q: "Can I price in Turkish lira?", a: "Not yet. Prices and invoices can be in euros, US dollars, British pounds and nine other currencies; Turkish lira is not one of them today." }, ...COMMON],
  },
];

export const HOME_FAQS: Faq[] = [
  { q: "What is Toursside?", a: "Toursside is tour operator and travel agency software. It keeps bookings, customers, itineraries, invoices, payments and partner requests in one connected system, for tours, group departures, flight tickets, hotels, visas and transfers." },
  { q: "Who is it for?", a: "Tour operators, travel agencies and destination management companies of any size, from a new operator to a larger agency with several staff." },
  { q: "Can I use it with my existing website?", a: "Yes. On the Growth plan and above you can show your tours on your own website with one line of code. On every plan you get booking pages of your own to link to." },
  { q: "Which countries does it work in?", a: "Any. It is used in a browser, prices in twelve currencies, and has no country-specific setup. It was built from the daily work of a tour operator in Egypt." },
  { q: "How much does it cost?", a: "Starter is $39 a month, Growth is $79 a month and Business is $149 a month. Paying yearly costs the same as ten months." },
  { q: "Can I try it first?", a: "Yes. A demo workspace with your company name and colours is ready in seconds, with sample orders to explore." },
  { q: "Can my customers pay me by card through it?", a: "Not yet. Your team records customer payments as they arrive by bank transfer, cash or payment link." },
  { q: "Can I manage flight tickets, hotels and visas as well as tours?", a: "Yes. When staff create an order they choose what the customer is buying: a tour, a flight ticket, a hotel, a visa, transportation or another service. Each has its own fields and steps, and all share the same customer, invoice, payments and history. This is included on every plan." },
  { q: "Is Toursside a flight or hotel booking engine?", a: "No. It manages the bookings your agency makes. It does not connect to airlines, GDS or hotel systems, show live availability or issue tickets. You book with your supplier, then keep the PNR, ticket or confirmation number, the invoice and the payments in Toursside." },
  { q: "Does it handle group tours?", a: "Yes, on the Growth plan and above. A group tour is a fixed departure with dates and capacity. Every passenger or party is a normal order with its own payments and invoice, seats left are counted, shared group costs are spread across the orders, and you can download a passenger manifest as a PDF." },
  { q: "Can one customer buy several things as a package?", a: "Yes. A customer's orders stay together, and you can link them as a package with a combined total, paid amount and balance. Each order keeps its own invoice." },
  { q: "Do I need to install anything?", a: "No. It runs in a browser on a computer or a phone." },
];
