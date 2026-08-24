import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { initDatabase } from "./init.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "..", "database.sqlite");

// Initialize database first
initDatabase();

const db = new Database(dbPath);

console.log("🌱 Seeding Supun Group database with official hierarchy & product data...");

// 1. Official 10 Companies
const officialCompanies = [
  {
    id: "supun-traders",
    name: "Supun Traders & Distributors (Pvt) Ltd",
    shortName: "Supun Traders",
    description: "The Group's original wholesale and retail business, trusted since 1978.",
    fullDescription: "Supun Traders is where it all started. Founded in 1978 by Mohamed Fareed, it began as a trading business importing and distributing household goods, and grew into the foundation the Group stands on today. In 1999, his son, current Chairman Mr. Kaleel, took on that legacy and built it into what is now the Supun Group of Companies. Today, Supun Traders remains a trusted wholesaler and retailer of imported and locally manufactured household goods, home appliances, and electronics.",
    industry: "Retail & Distribution",
    established: "1978",
    website: "",
    features: [
      "Founded 1978, the original Supun business",
      "Strong, long-standing supplier relationships",
      "Island-wide wholesale distribution network",
      "Wide range of household goods, appliances & electronics"
    ],
    imageUrl: "/uploads/1785481005491-104528024-supun trades.png",
    phone: "0112 433 784",
    email: "info@supungroup.lk",
    sequence: 1,
    googleMapsLink: "https://maps.app.goo.gl/R5d8HLxR5iCWJFGC8"
  },
  {
    id: "supun-super-center",
    name: "Supun Super Centre (Pvt) Ltd",
    shortName: "Supun Super Center",
    description: "Colombo's one-stop retail destination.",
    fullDescription: "Supun Super Center brings together a wide product range under one roof in the heart of Colombo. The company focuses on the right balance of price and quality for every customer. Its newest chapter is digital: Anythingatsupun.lk, the Group's online marketplace, lets customers anywhere in the world order or gift products to anywhere in Sri Lanka.",
    industry: "Retail & Distribution",
    established: "2003",
    website: "https://www.anythingatsupun.lk",
    features: [
      "Wide product range under one roof",
      "Multi-brand retail in Colombo",
      "Online ordering & gifting via Anythingatsupun.lk",
      "Worldwide delivery to anywhere in Sri Lanka"
    ],
    imageUrl: "/uploads/1785482240652-854734715-Untitled design (2).png",
    phone: "0112 504 920",
    email: "anythingatsupun.lk@gmail.com",
    sequence: 2,
    googleMapsLink: "https://maps.google.com/?q=16+R.A.+De+Mel+Mawatha+Colombo+00500"
  },
  {
    id: "supun-arcade-residency",
    name: "Supun Arcade Residency (Pvt) Ltd",
    shortName: "Supun Arcade Residency",
    description: "Luxury serviced apartments and rooftop dining in Colombo.",
    fullDescription: "Supun Arcade Residency offers fully furnished, air-conditioned suites in central Colombo, with panoramic ocean or city views. Guests enjoy a rooftop pool and 5-star hospitality, along with Area 56, the rooftop restaurant named for the property's own address at 56 Galle Road, serving Asian and Western fusion cuisine.",
    industry: "Hospitality",
    established: "2010",
    website: "https://www.supunarcaderesidency.com",
    features: [
      "40 luxury suites across 8 floors",
      "Rooftop pool & Area 56 restaurant",
      "Panoramic ocean and city views",
      "5-star hospitality & central Colombo location"
    ],
    imageUrl: "/uploads/1785481183178-713193515-Screenshot 2026-07-31 122923.png",
    phone: "0112 055 040",
    email: "reservations@supunarcaderesidency.com",
    sequence: 3,
    googleMapsLink: "https://maps.app.goo.gl/B5DoY6ZqhckkcgQbA"
  },
  {
    id: "supun-aerosoft",
    name: "Supun Aerosoft (Pvt) Ltd",
    shortName: "Supun Aerosoft / YMAC Smart",
    description: "Sri Lanka's first PU footwear manufacturer.",
    fullDescription: "Supun Aerosoft was the first to bring PU (Polyurethane) manufacturing technology to Sri Lanka's footwear industry. Producing sandals and shoes for men, women, and children under the YMAC Smart brand, Aerosoft combines local craftsmanship with modern manufacturing in our own factories. In 2025, YMAC Smart became the only Sri Lankan footwear brand featured at the Canton Fair, marking a new chapter of international recognition for the brand.",
    industry: "Manufacturing",
    established: "2011",
    website: "",
    features: [
      "Sri Lanka's first PU footwear manufacturer",
      "Sandals & shoes for men, women, and children",
      "100% made in our own factories",
      "Only Sri Lankan brand featured at the 2025 Canton Fair"
    ],
    imageUrl: "/uploads/1785482138605-676412549-Untitled design (1).png",
    phone: "011 2436390",
    email: "supunaerosoft318@gmail.com",
    sequence: 4,
    googleMapsLink: "https://maps.google.com/?q=Kotahena+Colombo+13"
  },
  {
    id: "aero-star",
    name: "Aerostar Home Appliances (Pvt) Ltd",
    shortName: "Aero Star",
    description: "Chrome plating for Sri Lanka's Camy appliances.",
    fullDescription: "Aero Star's chrome-plating expertise, built to local and international standards, feeds directly into the Camy wall clocks, mixer grinders, and water filters found in homes across Sri Lanka. It's precision manufacturing most customers never see, but touch every day.",
    industry: "Manufacturing",
    established: "2016",
    website: "",
    features: [
      "Chrome & chrome-plating manufacturing",
      "Manufactures Camy wall clocks, mixer grinders & water filters",
      "Precision manufacturing meeting ISO standards",
      "Supplies core internal components across Camy line"
    ],
    imageUrl: "/uploads/1785482634724-751353613-m (2).png",
    phone: "034 2262430",
    email: "aerostarhome@gmail.com",
    sequence: 5,
    googleMapsLink: ""
  },
  {
    id: "camy-smart",
    name: "Camy Smart (Pvt) Ltd",
    shortName: "Camy Smart",
    description: "One of Sri Lanka's largest SLS-certified helmet manufacturers.",
    fullDescription: "Every Camy Smart helmet leaving the factory is SLS certified, meeting Sri Lanka's official safety standard for motorcycle helmets. What started as a single factory is now one of the largest helmet manufacturers in the country, with a distribution network of more than 250 dealers reaching every corner of the island.",
    industry: "Manufacturing",
    established: "2017",
    website: "https://camysmart.lk",
    features: [
      "SLS Certified: Sri Lanka's official safety standard",
      "250+ island-wide distributors",
      "One of Sri Lanka's largest helmet manufacturers",
      "Continuous impact & safety testing laboratory"
    ],
    imageUrl: "/uploads/1785482388651-49277483-camy smart logo.png",
    phone: "+94 112 055 026",
    email: "info@supungroup.lk",
    sequence: 6,
    googleMapsLink: "https://maps.google.com/?q=Horana+Sri+Lanka"
  },
  {
    id: "rodsons",
    name: "Rodsons (Pvt) Ltd",
    shortName: "Rodsons",
    description: "The plastic moulding behind every Camy product.",
    fullDescription: "Rodsons is the plastic moulding plant that makes the body parts the rest of the Camy manufacturing line depends on: the shells of Camy Smart helmets, the bodies of Camy wall clocks and mixer grinders, and components across the wider Camy product range.",
    industry: "Manufacturing",
    established: "2017",
    website: "",
    features: [
      "Plastic injection moulding, in-house tooling",
      "Supplies body parts across the full Camy product range",
      "High-precision polymer die casting",
      "Supports helmet shells, mixer housings & appliance bodies"
    ],
    imageUrl: "/uploads/1785484405677-380967732-m (3).png",
    phone: "+94 112 055 026",
    email: "info@supungroup.lk",
    sequence: 7,
    googleMapsLink: ""
  },
  {
    id: "new-camy-smart",
    name: "New Camy Smart (Pvt) Ltd",
    shortName: "New Camy Smart",
    description: "Non-stick cookware, built with Korean technology.",
    fullDescription: "New Camy Smart manufactures Sri Lanka's leading non-stick cookware, built on highly purified aluminum and finished with ceramic and non-stick coating technology developed in partnership with Korean manufacturing experts.",
    industry: "Manufacturing",
    established: "2018",
    website: "",
    features: [
      "Non-stick & ceramic-coated cookware",
      "Korean technology collaboration",
      "Market-leading local cookware manufacturer",
      "Highly purified aluminum base"
    ],
    imageUrl: "/uploads/1785482583725-725560442-m (1).png",
    phone: "011 2418724",
    email: "info@supungroup.lk",
    sequence: 8,
    googleMapsLink: ""
  },
  {
    id: "fuji-industries",
    name: "Fuji Industries (Pvt) Ltd",
    shortName: "Fuji Industries",
    description: "Camy air conditioners and fans, made in Sri Lanka.",
    fullDescription: "The Group's newest manufacturing venture, Fuji Industries produces Camy air conditioners and Camy fans for residential and commercial customers, made in Sri Lanka.",
    industry: "Manufacturing",
    established: "2023",
    website: "",
    features: [
      "Camy air conditioners, made in Sri Lanka",
      "Camy fans, made in Sri Lanka",
      "Residential & commercial cooling solutions",
      "The Group's newest manufacturing facility"
    ],
    imageUrl: "/uploads/1760357428290-547294273-IMG-20251007-WA0218.jpg",
    phone: "+94 112 055 026",
    email: "info@supungroup.lk",
    sequence: 9,
    googleMapsLink: ""
  },
  {
    id: "camy-global",
    name: "Camy Global",
    shortName: "Camy Global",
    description: "Getting Camy products to every corner of the island.",
    fullDescription: "Camy Global is the distribution engine that gets Camy products, from helmets and cookware to clocks, appliances, air conditioners, and fans, from the factory floor to retail shelves island-wide.",
    industry: "Retail & Distribution",
    established: "2018",
    website: "",
    features: [
      "Islandwide distribution network",
      "Retail outlet & partner network",
      "Distributes the full range of Camy-branded products",
      "Logistics backbone connecting factories to consumers"
    ],
    imageUrl: "/uploads/1785482330197-794007903-m.png",
    phone: "+94 112 055 026",
    email: "info@supungroup.lk",
    sequence: 10,
    googleMapsLink: ""
  }
];

// Insert or replace companies
const insertCompany = db.prepare(`
  INSERT INTO companies (
    id, name, shortName, description, fullDescription,
    industry, established, website, features, imageUrl,
    phone, email, sequence, googleMapsLink, gallery, socialLinks
  ) VALUES (
    @id, @name, @shortName, @description, @fullDescription,
    @industry, @established, @website, @features, @imageUrl,
    @phone, @email, @sequence, @googleMapsLink, @gallery, @socialLinks
  )
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    shortName = excluded.shortName,
    description = excluded.description,
    fullDescription = excluded.fullDescription,
    industry = excluded.industry,
    established = excluded.established,
    website = excluded.website,
    features = excluded.features,
    imageUrl = COALESCE(excluded.imageUrl, companies.imageUrl),
    phone = excluded.phone,
    email = excluded.email,
    sequence = excluded.sequence,
    googleMapsLink = excluded.googleMapsLink
`);

for (const c of officialCompanies) {
  insertCompany.run({
    id: c.id,
    name: c.name,
    shortName: c.shortName,
    description: c.description,
    fullDescription: c.fullDescription,
    industry: c.industry,
    established: c.established,
    website: c.website || "",
    features: JSON.stringify(c.features),
    imageUrl: c.imageUrl || null,
    phone: c.phone || null,
    email: c.email || null,
    sequence: c.sequence || 0,
    googleMapsLink: c.googleMapsLink || null,
    gallery: JSON.stringify([]),
    socialLinks: JSON.stringify([])
  });
}

// 2. Categories
const categories = [
  { name: "Safety & Riding", slug: "safety-riding", description: "SLS Certified motorcycle helmets and protective riding gear" },
  { name: "Cookware", slug: "cookware", description: "Premium Korean-technology non-stick and ceramic-coated cookware" },
  { name: "Appliances", slug: "appliances", description: "Precision chrome water filters, mixer grinders, and gas stoves" },
  { name: "Cooling & Air", slug: "cooling-air", description: "Air conditioners and copper-wound fans made in Sri Lanka" },
  { name: "Home & Electronics", slug: "home-electronics", description: "LED TVs and quartz wall clocks engineered locally" }
];

const insertCategory = db.prepare(`
  INSERT INTO categories (name, slug, description, isActive)
  VALUES (@name, @slug, @description, 1)
  ON CONFLICT(name) DO UPDATE SET
    slug = excluded.slug,
    description = excluded.description
`);

for (const cat of categories) {
  insertCategory.run(cat);
}

// 3. Products
const catMap = {};
for (const cat of db.prepare("SELECT id, name FROM categories").all()) {
  catMap[cat.name] = cat.id;
}

const products = [
  {
    title: "Camy Smart SLS Motorcycle Helmets",
    slug: "camy-smart-sls-motorcycle-helmets",
    shortDescription: "SLS Certified motorcycle riding helmets engineered for aerodynamic safety and comfort.",
    longDescription: "Every Camy Smart helmet is SLS certified, meeting Sri Lanka's official safety standard for motorcycle helmets. Built with high-impact ABS/polycarbonate outer shells moulded by Rodsons with multi-point EPS absorption.",
    price: 6500,
    wholesalePrice: 5200,
    categoryName: "Safety & Riding",
    imageUrl: "/uploads/1785482388651-49277483-camy smart logo.png"
  },
  {
    title: "New Camy Smart Non-Stick Cookware Set",
    slug: "new-camy-smart-non-stick-cookware",
    shortDescription: "Premium non-stick cookware manufactured on purified aluminum with Korean ceramic coating technology.",
    longDescription: "Sri Lanka's leading non-stick cookware, built on heavy-gauge purified aluminum and finished with Korean non-stick coating technology. Ensures even heat retention and long-lasting durability.",
    price: 8900,
    wholesalePrice: 7200,
    categoryName: "Cookware",
    imageUrl: "/uploads/1785482583725-725560442-m (1).png"
  },
  {
    title: "Camy Inverter Air Conditioner",
    slug: "camy-inverter-air-conditioner",
    shortDescription: "Eco-friendly, energy saving air conditioners made in Sri Lanka by Fuji Industries.",
    longDescription: "Assembled in Sri Lanka with anti-corrosive gold-fin condensers, high efficiency R32 refrigerant, and whisper-quiet operation for residential and commercial cooling.",
    price: 135000,
    wholesalePrice: 118000,
    categoryName: "Cooling & Air",
    imageUrl: "/uploads/1760357428290-547294273-IMG-20251007-WA0218.jpg"
  },
  {
    title: "Camy Pure Copper Motor Fans",
    slug: "camy-pure-copper-fans",
    shortDescription: "Durable ceiling and stand fans built with 100% pure copper winding for tropical conditions.",
    longDescription: "Manufactured in Sri Lanka by Fuji Industries, featuring aerodynamic balanced blades, rust-resistant electro-coating, and high air displacement.",
    price: 9500,
    wholesalePrice: 7800,
    categoryName: "Cooling & Air",
    imageUrl: "/uploads/1760357428290-547294273-IMG-20251007-WA0218.jpg"
  },
  {
    title: "Aero Star Multi-Stage Water Filter",
    slug: "aero-star-multi-stage-water-filter",
    shortDescription: "Hygienic multi-stage water purifiers ensuring safe drinking water for Sri Lankan homes.",
    longDescription: "Precision chrome fittings and food-grade body moulding by Rodsons, eliminating contaminants and heavy sediments while retaining essential minerals.",
    price: 7800,
    wholesalePrice: 6200,
    categoryName: "Appliances",
    imageUrl: "/uploads/1785482634724-751353613-m (2).png"
  },
  {
    title: "Aero Star Heavy Duty Mixer Grinder",
    slug: "aero-star-heavy-duty-mixer-grinder",
    shortDescription: "High-torque stainless steel jar mixer grinders for demanding kitchen tasks.",
    longDescription: "Equipped with high-torque copper motors and stainless steel jars designed specifically to handle tough Sri Lankan spices and daily culinary requirements.",
    price: 14500,
    wholesalePrice: 11800,
    categoryName: "Appliances",
    imageUrl: "/uploads/1785482634724-751353613-m (2).png"
  },
  {
    title: "Camy Precision Quartz Wall Clocks",
    slug: "camy-precision-quartz-wall-clocks",
    shortDescription: "Timeless wall clocks with precision quartz sweep movements and chrome-plated accents.",
    longDescription: "Manufactured with Aero Star chrome plating and Rodsons high-finish housing, providing silent and accurate timekeeping for homes and offices.",
    price: 3200,
    wholesalePrice: 2400,
    categoryName: "Home & Electronics",
    imageUrl: "/uploads/1785482634724-751353613-m (2).png"
  },
  {
    title: "Camy Smart HD LED Television",
    slug: "camy-smart-hd-led-tv",
    shortDescription: "High-definition vivid LED televisions with stereo audio and smart streaming connectivity.",
    longDescription: "Assembled by Fuji Industries with energy-efficient LED panels, built-in surge protection, and high contrast picture engine.",
    price: 48000,
    wholesalePrice: 39000,
    categoryName: "Home & Electronics",
    imageUrl: "/uploads/1760357428290-547294273-IMG-20251007-WA0218.jpg"
  }
];

const insertProduct = db.prepare(`
  INSERT INTO products (
    title, slug, shortDescription, longDescription,
    price, wholesalePrice, categoryId, imageUrl, isActive
  ) VALUES (
    @title, @slug, @shortDescription, @longDescription,
    @price, @wholesalePrice, @categoryId, @imageUrl, 1
  )
  ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    shortDescription = excluded.shortDescription,
    longDescription = excluded.longDescription,
    price = excluded.price,
    wholesalePrice = excluded.wholesalePrice,
    categoryId = excluded.categoryId,
    imageUrl = excluded.imageUrl
`);

for (const p of products) {
  insertProduct.run({
    title: p.title,
    slug: p.slug,
    shortDescription: p.shortDescription,
    longDescription: p.longDescription,
    price: p.price,
    wholesalePrice: p.wholesalePrice,
    categoryId: catMap[p.categoryName] || null,
    imageUrl: p.imageUrl
  });
}

// 4. Brands Showcase
const brands = [
  { name: "Camy Smart", logoUrl: "/uploads/1785482388651-49277483-camy smart logo.png", displayOrder: 1 },
  { name: "New Camy Smart", logoUrl: "/uploads/1785482583725-725560442-m (1).png", displayOrder: 2 },
  { name: "Aero Star", logoUrl: "/uploads/1785482634724-751353613-m (2).png", displayOrder: 3 },
  { name: "YMAC Smart (Aerosoft)", logoUrl: "/uploads/1785482138605-676412549-Untitled design (1).png", displayOrder: 4 },
  { name: "Supun Super Center", logoUrl: "/uploads/1785482240652-854734715-Untitled design (2).png", displayOrder: 5 },
  { name: "Supun Traders", logoUrl: "/uploads/1785481005491-104528024-supun trades.png", displayOrder: 6 },
  { name: "Supun Arcade Residency", logoUrl: "/uploads/1785481183178-713193515-Screenshot 2026-07-31 122923.png", displayOrder: 7 },
  { name: "Rodsons", logoUrl: "/uploads/1785484405677-380967732-m (3).png", displayOrder: 8 },
  { name: "Fuji Industries", logoUrl: "/uploads/1760357428290-547294273-IMG-20251007-WA0218.jpg", displayOrder: 9 },
  { name: "Camy Global", logoUrl: "/uploads/1785482330197-794007903-m.png", displayOrder: 10 }
];

db.exec("DELETE FROM brands");
const insertBrand = db.prepare(`
  INSERT INTO brands (name, logoUrl, displayOrder, isActive)
  VALUES (@name, @logoUrl, @displayOrder, 1)
`);

for (const b of brands) {
  insertBrand.run(b);
}

console.log("✅ Database successfully populated with 10 official companies, categories, brands, and products!");
