export interface Leader {
  id: string;
  name: string;
  title: string;
  oneLiner: string;
  roleType: "executive" | "director" | "management";
  description?: string;
}

export const leadershipTeam: Leader[] = [
  {
    id: "mfm-kaleel",
    name: "M. F. M. Kaleel",
    title: "Chairman – Supun Group of Companies",
    oneLiner: "The visionary leader who formalized Supun Group in 1999 and spearheaded its transformation from trading into local manufacturing.",
    roleType: "executive",
    description: "Since taking over the legacy in 1999, Mr. Kaleel has steered the Group with a focus on innovation, technical precision, and Sri Lankan industrial self-reliance."
  },
  {
    id: "rizna-kaleel",
    name: "Rizna Kaleel",
    title: "Non-Executive Director",
    oneLiner: "Provides strategic oversight and governance across Group investments and long-term corporate vision.",
    roleType: "director"
  },
  {
    id: "khalid-kaleel",
    name: "Khalid Kaleel",
    title: "Director",
    oneLiner: "Oversees Fuji Industries and spearheads expansion into domestic cooling and home climate manufacturing.",
    roleType: "director",
    description: "Leads engineering, assembly setup, and market penetration for Camy Air Conditioners and Camy Fans in Sri Lanka."
  },
  {
    id: "raiza-kaleel",
    name: "Raiza Kaleel",
    title: "Director",
    oneLiner: "Oversees Camy brands and Group marketing, brand strategy, and consumer engagement.",
    roleType: "director",
    description: "Drives unified brand architecture, retail placement, digital footprint, and market storytelling for all Camy and Supun consumer lines."
  },
  {
    id: "lasitha-samarasinghe",
    name: "Lasitha Samarasinghe",
    title: "Group Chief Financial Officer",
    oneLiner: "Oversees financial strategy, treasury, compliance, and financial governance across all Supun Group of companies.",
    roleType: "executive",
    description: "Maintains financial resilience, strategic capital allocation, and compliance rigor across all 10 corporate entities."
  },
  {
    id: "mohamed-riaz-farouk",
    name: "Mohamed Riaz Farouk",
    title: "Chief Executive Officer – Rodsons, Aero Star, Camy Smart, and New Camy Smart",
    oneLiner: "Oversees overall operations and performance across Rodsons, Aero Star, Camy Smart, and New Camy Smart.",
    roleType: "executive",
    description: "Drives operational excellence, tooling automation, SLS compliance, and factory productivity across core manufacturing plants."
  },
  {
    id: "jeewantha-perera",
    name: "Jeewantha Perera",
    title: "Head of Hospitality & Operations",
    oneLiner: "Hospitality executive with expertise in hotel operations, sales & marketing, business development, and strategic project management.",
    roleType: "executive",
    description: "Leads luxury serviced living, customer experience, and gastronomic operations at Supun Arcade Residency and Area 56 restaurant."
  },
  {
    id: "eranga-rodrigo",
    name: "Eranga Rodrigo",
    title: "Director, Rodsons",
    oneLiner: "Oversees Rodsons plastic moulding, precision tooling, and components engineering.",
    roleType: "director",
    description: "Manages heavy polymer injection lines supplying core structural components to helmets, clocks, and appliances."
  }
];
