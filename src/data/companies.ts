export interface Company {
  id: string;
  name: string;
  shortName: string;
  consumerBrand: string;
  tagline: string;
  description: string;
  fullDescription: string;
  industry: "Manufacturing" | "Retail & Distribution" | "Hospitality" | "Manufacturing (Footwear)";
  sector: "Manufacturing" | "Retail & Distribution" | "Hospitality";
  established: string;
  website?: string;
  phone?: string;
  email?: string;
  location?: string;
  features: string[];
}

export const companies: Company[] = [
  {
    id: "supun-traders",
    name: "Supun Traders & Distributors (Pvt) Ltd",
    shortName: "Supun Traders",
    consumerBrand: "Supun Traders",
    tagline: "The Group's original wholesale and retail business, trusted since 1978.",
    description: "Where the Group Began: Imports and distributes household goods, appliances, and electronics across Sri Lanka.",
    fullDescription: "Supun Traders is where it all started. Founded in 1978 by Mohamed Fareed, it began as a trading business importing and distributing household goods, and grew into the foundation the Group stands on today. In 1999, his son, current Chairman Mr. Kaleel, took on that legacy and built it into what is now the Supun Group of Companies. Today, Supun Traders remains a trusted wholesaler and retailer of imported and locally manufactured household goods, home appliances, and electronics.",
    industry: "Retail & Distribution",
    sector: "Retail & Distribution",
    established: "1978",
    phone: "0112 433 784",
    location: "2nd Cross Street, Colombo 11",
    features: [
      "Founded 1978, the original Supun business",
      "Strong, long-standing supplier relationships",
      "Island-wide wholesale distribution network",
      "Wide range of household goods, appliances & electronics"
    ]
  },
  {
    id: "supun-super-center",
    name: "Supun Super Centre (Pvt) Ltd",
    shortName: "Supun Super Center",
    consumerBrand: "Supun Super Center",
    tagline: "Colombo's one-stop retail destination.",
    description: "Colombo's Retail Destination: Multi-category retail store in Colombo, parent of Anythingatsupun.lk.",
    fullDescription: "Supun Super Center brings together a wide product range under one roof in the heart of Colombo. The company focuses on the right balance of price and quality for every customer. Its newest chapter is digital: Anythingatsupun.lk, the Group's online marketplace, lets customers anywhere in the world order or gift products to anywhere in Sri Lanka.",
    industry: "Retail & Distribution",
    sector: "Retail & Distribution",
    established: "2003",
    website: "https://www.anythingatsupun.lk",
    phone: "0112 504 920",
    location: "16 R.A. De Mel Mawatha, Colombo 00500",
    features: [
      "Wide product range under one roof",
      "Multi-brand retail destination in Colombo",
      "Online ordering & gifting via Anythingatsupun.lk",
      "Worldwide delivery to anywhere in Sri Lanka"
    ]
  },
  {
    id: "supun-arcade-residency",
    name: "Supun Arcade Residency (Pvt) Ltd",
    shortName: "Supun Arcade Residency",
    consumerBrand: "Supun Arcade Residency",
    tagline: "Luxury serviced apartments and rooftop dining in Colombo.",
    description: "Luxury Serviced Living in Colombo: 40 suites across 8 floors, rooftop pool, and home to Area 56 restaurant.",
    fullDescription: "Supun Arcade Residency offers fully furnished, air-conditioned suites in central Colombo, with panoramic ocean or city views. Guests enjoy a rooftop pool and 5-star hospitality, along with Area 56, the rooftop restaurant named for the property's own address at 56 Galle Road, serving Asian and Western fusion cuisine.",
    industry: "Hospitality",
    sector: "Hospitality",
    established: "2010",
    website: "https://www.supunarcaderesidency.com",
    phone: "0112 055 040",
    email: "reservations@supunarcaderesidency.com",
    location: "56 Galle Road, Colombo 00600",
    features: [
      "40 luxury suites across 8 floors",
      "Rooftop pool & Area 56 restaurant",
      "Panoramic ocean and city views",
      "5-star hospitality & central Colombo location"
    ]
  },
  {
    id: "supun-aerosoft",
    name: "Supun Aerosoft (Pvt) Ltd",
    shortName: "Supun Aerosoft / YMAC Smart",
    consumerBrand: "YMAC Smart",
    tagline: "Sri Lanka's first PU footwear manufacturer.",
    description: "Sri Lanka's First PU Footwear Manufacturer: Combining local craftsmanship with modern PU manufacturing in our own factories.",
    fullDescription: "Supun Aerosoft was the first to bring PU (Polyurethane) manufacturing technology to Sri Lanka's footwear industry. Producing sandals and shoes for men, women, and children under the YMAC Smart brand, Aerosoft combines local craftsmanship with modern manufacturing in our own factories. In 2025, YMAC Smart became the only Sri Lankan footwear brand featured at the Canton Fair, marking a new chapter of international recognition for the brand.",
    industry: "Manufacturing (Footwear)",
    sector: "Manufacturing",
    established: "2011",
    phone: "011 2436390 / 077 0038414",
    email: "supunaerosoft318@gmail.com",
    location: "Kotahena, Colombo 13",
    features: [
      "Sri Lanka's first PU footwear manufacturer",
      "Sandals & shoes for men, women, and children",
      "100% made in our own factories",
      "Only Sri Lankan brand featured at the 2025 Canton Fair"
    ]
  },
  {
    id: "aero-star",
    name: "Aerostar Home Appliances (Pvt) Ltd",
    shortName: "Aero Star",
    consumerBrand: "Camy (appliances)",
    tagline: "Chrome plating for Sri Lanka's Camy appliances.",
    description: "Precision Chrome Plating for Camy Appliances: Chrome-plating expertise feeding into Camy wall clocks, mixer grinders, and water filters.",
    fullDescription: "Aero Star's chrome-plating expertise, built to local and international standards, feeds directly into the Camy wall clocks, mixer grinders, and water filters found in homes across Sri Lanka. It's precision manufacturing most customers never see, but touch every day.",
    industry: "Manufacturing",
    sector: "Manufacturing",
    established: "2016",
    phone: "034 2262430",
    email: "aerostarhome@gmail.com",
    features: [
      "Chrome & chrome-plating manufacturing",
      "Manufactures Camy wall clocks, mixer grinders & water filters",
      "Precision manufacturing meeting ISO standards",
      "Supplies core internal components across Camy line"
    ]
  },
  {
    id: "camy-smart",
    name: "Camy Smart (Pvt) Ltd",
    shortName: "Camy Smart",
    consumerBrand: "Camy Smart",
    tagline: "One of Sri Lanka's largest SLS-certified helmet manufacturers.",
    description: "One of Sri Lanka's Largest Helmet Manufacturers: SLS-certified motorcycle helmets with 250+ distributors islandwide.",
    fullDescription: "Every Camy Smart helmet leaving the factory is SLS certified, meeting Sri Lanka's official safety standard for motorcycle helmets. What started as a single factory is now one of the largest helmet manufacturers in the country, with a distribution network of more than 250 dealers reaching every corner of the island.",
    industry: "Manufacturing",
    sector: "Manufacturing",
    established: "2017",
    location: "Horana, Sri Lanka",
    features: [
      "SLS Certified: Sri Lanka's official safety standard",
      "250+ island-wide distributors",
      "One of Sri Lanka's largest helmet manufacturers",
      "Continuous impact & safety testing laboratory"
    ]
  },
  {
    id: "rodsons",
    name: "Rodsons (Pvt) Ltd",
    shortName: "Rodsons",
    consumerBrand: "Rodsons",
    tagline: "The plastic moulding behind every Camy product.",
    description: "The Plastic Moulding Behind Every Camy Product: Makes body parts, helmet shells, and clock housings across the Camy range.",
    fullDescription: "Rodsons is the plastic moulding plant that makes the body parts the rest of the Camy manufacturing line depends on: the shells of Camy Smart helmets, the bodies of Camy wall clocks and mixer grinders, and components across the wider Camy product range.",
    industry: "Manufacturing",
    sector: "Manufacturing",
    established: "2017",
    features: [
      "Plastic injection moulding, in-house tooling",
      "Supplies body parts across the full Camy product range",
      "High-precision polymer die casting",
      "Supports helmet shells, mixer housings & appliance bodies"
    ]
  },
  {
    id: "new-camy-smart",
    name: "New Camy Smart (Pvt) Ltd",
    shortName: "New Camy Smart",
    consumerBrand: "New Camy Smart",
    tagline: "Non-stick cookware, built with Korean technology.",
    description: "Non-Stick Cookware, Korean Technology: Sri Lanka's leading non-stick cookware on highly purified aluminum with ceramic coating.",
    fullDescription: "New Camy Smart manufactures Sri Lanka's leading non-stick cookware, built on highly purified aluminum and finished with ceramic and non-stick coating technology developed in partnership with Korean manufacturing experts.",
    industry: "Manufacturing",
    sector: "Manufacturing",
    established: "2018",
    phone: "011 2418724",
    features: [
      "Non-stick & ceramic-coated cookware",
      "Korean technology collaboration",
      "Market-leading local cookware manufacturer",
      "Highly purified aluminum base"
    ]
  },
  {
    id: "fuji-industries",
    name: "Fuji Industries (Pvt) Ltd",
    shortName: "Fuji Industries",
    consumerBrand: "Camy AC / Camy Fans",
    tagline: "Camy air conditioners and fans, made in Sri Lanka.",
    description: "Camy Air Conditioners and Fans: The Group's newest manufacturing venture, producing residential & commercial cooling solutions.",
    fullDescription: "The Group's newest manufacturing venture, Fuji Industries produces Camy air conditioners and Camy fans for residential and commercial customers, made in Sri Lanka.",
    industry: "Manufacturing",
    sector: "Manufacturing",
    established: "2023",
    features: [
      "Camy air conditioners, made in Sri Lanka",
      "Camy fans, made in Sri Lanka",
      "Residential & commercial cooling solutions",
      "The Group's newest manufacturing facility"
    ]
  },
  {
    id: "camy-global",
    name: "Camy Global",
    shortName: "Camy Global",
    consumerBrand: "Camy Global",
    tagline: "Getting Camy products to every corner of the island.",
    description: "Distributing Camy Across Sri Lanka: Islandwide distribution engine for all Camy-branded products from factory floor to retail shelves.",
    fullDescription: "Camy Global is the distribution engine that gets Camy products, from helmets and cookware to clocks, appliances, air conditioners, and fans, from the factory floor to retail shelves island-wide.",
    industry: "Retail & Distribution",
    sector: "Retail & Distribution",
    established: "2018",
    features: [
      "Islandwide distribution network",
      "Retail outlet & partner network",
      "Distributes the full range of Camy-branded products",
      "Logistics backbone connecting factories to consumers"
    ]
  }
];
