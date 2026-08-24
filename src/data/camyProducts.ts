export interface CamyProduct {
  id: string;
  name: string;
  madeBy: string;
  companyId: string;
  category: "Safety & Riding" | "Cookware" | "Appliances" | "Cooling & Air" | "Home & Electronics";
  note: string;
  description: string;
  buyUrl: string;
  features: string[];
}

export const camyProducts: CamyProduct[] = [
  {
    id: "motorcycle-helmets",
    name: "Motorcycle Helmets",
    madeBy: "Camy Smart",
    companyId: "camy-smart",
    category: "Safety & Riding",
    note: "SLS Certified",
    description: "High-impact SLS-certified motorcycle riding helmets engineered for maximum rider safety, aerodynamics, and comfort.",
    buyUrl: "https://www.anythingatsupun.lk",
    features: [
      "SLS Certified (Sri Lanka Standard)",
      "High-impact ABS / Polycarbonate shell",
      "Quick-release retention system",
      "UV-protected anti-scratch visor",
      "Optimized multi-vent airflow"
    ]
  },
  {
    id: "non-stick-cookware",
    name: "Non-Stick Cookware",
    madeBy: "New Camy Smart",
    companyId: "new-camy-smart",
    category: "Cookware",
    note: "Made in Sri Lanka (Korean Technology)",
    description: "Premium non-stick cookware manufactured on highly purified aluminum with Korean ceramic non-stick coating technology.",
    buyUrl: "https://www.anythingatsupun.lk",
    features: [
      "Korean technology collaboration",
      "Highly purified heavy-gauge aluminum",
      "PFOA-free multi-layer non-stick coating",
      "Stay-cool ergonomic Bakelite handles",
      "Even heat distribution for energy efficiency"
    ]
  },
  {
    id: "air-conditioners",
    name: "Air Conditioners",
    madeBy: "Fuji Industries",
    companyId: "fuji-industries",
    category: "Cooling & Air",
    note: "Made in Sri Lanka",
    description: "Energy-efficient inverter and fixed-speed air conditioners manufactured in Sri Lanka for residential and commercial cooling.",
    buyUrl: "https://www.anythingatsupun.lk",
    features: [
      "Assembled and tested in Sri Lanka",
      "High-efficiency eco-friendly refrigerant",
      "Rapid turbo cooling technology",
      "Gold-fin anti-corrosive condenser",
      "Low noise quiet operation"
    ]
  },
  {
    id: "fans",
    name: "Camy Fans",
    madeBy: "Fuji Industries",
    companyId: "fuji-industries",
    category: "Cooling & Air",
    note: "Made in Sri Lanka",
    description: "Durable ceiling, stand, and wall fans built with 100% copper wound motors for long-lasting cooling performance in tropical climates.",
    buyUrl: "https://www.anythingatsupun.lk",
    features: [
      "100% pure copper motor wire",
      "High aerodynamic air delivery",
      "Rust-resistant electrostatic coating",
      "Whisper-quiet blade balancing",
      "Energy saving design"
    ]
  },
  {
    id: "water-filters",
    name: "Water Filters",
    madeBy: "Aero Star",
    companyId: "aero-star",
    category: "Appliances",
    note: "Made in Sri Lanka",
    description: "Multi-stage hygienic water purifiers ensuring safe, clean, mineral-rich drinking water for households across Sri Lanka.",
    buyUrl: "https://www.anythingatsupun.lk",
    features: [
      "Multi-stage filtration technology",
      "Removes bacteria, heavy metals & sediments",
      "Food-grade durable plastic housing (Rodsons moulding)",
      "Easy maintenance cartridge design",
      "Zero power gravity operation available"
    ]
  },
  {
    id: "mixer-grinders",
    name: "Mixer Grinders",
    madeBy: "Aero Star",
    companyId: "aero-star",
    category: "Appliances",
    note: "Made in Sri Lanka",
    description: "Heavy-duty kitchen mixer grinders with stainless steel jars and chrome finishes built to handle tough Sri Lankan spices.",
    buyUrl: "https://www.anythingatsupun.lk",
    features: [
      "High-torque pure copper motor",
      "Stainless steel food-grade jars",
      "Overload protection sensor",
      "Chrome-plated precision dials",
      "3-speed control with pulse mode"
    ]
  },
  {
    id: "wall-clocks",
    name: "Camy Wall Clocks",
    madeBy: "Aero Star",
    companyId: "aero-star",
    category: "Home & Electronics",
    note: "Made in Sri Lanka",
    description: "Timeless, elegant wall clocks with precision quartz movements and chrome-plated accents found in homes across the island.",
    buyUrl: "https://www.anythingatsupun.lk",
    features: [
      "Precision quartz sweep movement",
      "Aero Star chrome-plated bezel & detailing",
      "High-clarity glass crystal",
      "Silent smooth second hand motion",
      "Various elegant modern and classic dial designs"
    ]
  },
  {
    id: "tvs",
    name: "Camy LED TVs",
    madeBy: "Fuji Industries",
    companyId: "fuji-industries",
    category: "Home & Electronics",
    note: "Made in Sri Lanka",
    description: "High-definition and Smart LED televisions engineered with vivid color displays and stereo sound.",
    buyUrl: "https://www.anythingatsupun.lk",
    features: [
      "Vivid Full HD / 4K UHD LED panels",
      "Smart TV OS with streaming apps",
      "Multiple HDMI & USB connectivity",
      "Built-in surge protection",
      "Energy star rated low power consumption"
    ]
  },
  {
    id: "electric-kettles",
    name: "Electric Kettles",
    madeBy: "Group factories",
    companyId: "aero-star",
    category: "Appliances",
    note: "Made in Sri Lanka",
    description: "Fast-boiling stainless steel and heat-resistant polymer electric kettles with automatic shut-off safety.",
    buyUrl: "https://www.anythingatsupun.lk",
    features: [
      "Food-grade 304 stainless steel interior",
      "Automatic boil-dry shutoff protection",
      "360-degree cordless swivel base",
      "Concealed heating element",
      "Cool-touch exterior handle"
    ]
  },
  {
    id: "gas-cookers",
    name: "Gas Cookers & Stoves",
    madeBy: "Group factories",
    companyId: "aero-star",
    category: "Appliances",
    note: "Made in Sri Lanka",
    description: "Toughened glass and stainless steel gas stoves with auto-ignition burners designed for high thermal efficiency.",
    buyUrl: "https://www.anythingatsupun.lk",
    features: [
      "High-efficiency brass burners",
      "Toughened scratch-proof tempered glass top",
      "Piezo automatic pulse ignition",
      "Heavy-duty pan support for Sri Lankan cooking pots",
      "Low gas consumption design"
    ]
  }
];
