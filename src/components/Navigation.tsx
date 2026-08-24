import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  ArrowRight,
  Building2,
  ExternalLink,
  ShieldCheck,
  Factory,
  Sparkles
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { companiesAPI, type Company } from "@/services/api";
import logo from "@/assets/supun-group-of-companies-logo.png";
import helmetManufacturing from "@/assets/helmet-manufacturing.jpg";
import navBgPattern from "@/assets/nav-bg-pattern.png";
import camyPuFootwear from "@/assets/camy-pu-footwear.jpg";
import smartMeteringIot from "@/assets/smart-metering-iot.jpg";
import retailStore from "@/assets/retail-store.jpg";
import hotelInterior from "@/assets/hotel-interior.jpg";
import heroCorporate from "@/assets/hero-corporate.jpg";
import heroManufacturing from "@/assets/hero-manufacturing.jpg";
import chairmanImg from "@/assets/Chairman.png";
import camyHelmetShowcase from "@/assets/camy-helmet-showcase.jpg";
import cookwarePremiumRange from "@/assets/cookware-premium-range.jpg";
import area56RooftopLounge from "@/assets/area56-rooftop-lounge.jpg";
import supunTradersHub from "@/assets/supun-traders-hub.jpg";

interface MegaItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  link: string;
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<"about" | "sectors" | "camy" | null>(null);
  const location = useLocation();

  const aboutItems: MegaItem[] = [
    {
      id: "overview",
      title: "Group Overview & Heritage",
      desc: "Founded in 1978 in Colombo, Supun Group of Companies has grown across two generations into a diversified conglomerate of ten operating enterprises.",
      image: heroCorporate,
      link: "/about"
    },
    {
      id: "leadership",
      title: "Chairman & Leadership",
      desc: "Under the stewardship of Chairman Mr. Jagath Premadasa and executive directors, leading Sri Lanka's domestic industrial manufacturing powerhouse.",
      image: chairmanImg,
      link: "/about"
    },
    {
      id: "vision",
      title: "Vision, Mission & Values",
      desc: "Committed to self-reliant manufacturing excellence, building trusted brands, and delivering world-class hospitality.",
      image: heroManufacturing,
      link: "/about"
    },
    {
      id: "plants",
      title: "Factories & Infrastructure",
      desc: "Operating 6 modern production plants and advanced injection molding facilities across the island.",
      image: helmetManufacturing,
      link: "/about"
    }
  ];

  const sectorCol1: MegaItem[] = [
    {
      id: "mfg-sector",
      title: "Manufacturing Sector",
      desc: "Pioneering domestic production of SLS-certified motorcycle helmets, polyurethane footwear, cookware, and precision injection molds.",
      image: camyHelmetShowcase,
      link: "/companies"
    },
    {
      id: "footwear-sector",
      title: "PU Footwear & Molding",
      desc: "Supun Aerosoft: Sri Lanka's first high-comfort direct injection polyurethane footwear manufacturer.",
      image: camyPuFootwear,
      link: "/companies/supun-aerosoft"
    },
    {
      id: "retail-sector",
      title: "Retail & Distribution",
      desc: "Connecting millions of consumers through Supun Super Center retail branches and islandwide dealer networks.",
      image: supunTradersHub,
      link: "/companies/supun-super-center"
    },
    {
      id: "hospitality-sector",
      title: "Hospitality & Living",
      desc: "Supun Arcade Residency: 40 luxury 5-star serviced suites & Area 56 Rooftop Lounge in central Colombo.",
      image: area56RooftopLounge,
      link: "/companies/supun-arcade-residency"
    },
    {
      id: "tech-sector",
      title: "Smart Systems & IoT",
      desc: "YMAC Technologies: Next-generation smart electricity meters, automated billing systems, and IoT energy infrastructure.",
      image: smartMeteringIot,
      link: "/companies/ymac-technologies"
    }
  ];

  const sectorCol2: MegaItem[] = [
    {
      id: "camy-smart",
      title: "Camy Smart (Helmets)",
      desc: "SLS 517 certified motorcycle safety helmets engineered for ultimate rider protection.",
      image: camyHelmetShowcase,
      link: "/companies/camy-smart"
    },
    {
      id: "camy-poly",
      title: "Camy Poly Products",
      desc: "Extensive industrial plastic manufacturing, packaging, and high-precision components.",
      image: cookwarePremiumRange,
      link: "/companies/camy-poly-products"
    },
    {
      id: "camy-ind",
      title: "Camy Industries",
      desc: "Pioneering injection molding, tooling, and durable consumer appliance fabrication.",
      image: heroManufacturing,
      link: "/companies/camy-industries"
    },
    {
      id: "supun-traders",
      title: "Supun Traders (1978)",
      desc: "Our founding enterprise since 1978: Trusted wholesale and islandwide distribution.",
      image: supunTradersHub,
      link: "/companies/supun-traders"
    },
    {
      id: "area56",
      title: "Area 56 Rooftop Lounge",
      desc: "Premier rooftop dining and lounge with panoramic Colombo city and ocean views.",
      image: area56RooftopLounge,
      link: "/companies/area-56"
    },
    {
      id: "all-companies",
      title: "View All 10 Enterprises →",
      desc: "Explore the comprehensive directory of all 10 subsidiary companies in Supun Group.",
      image: heroCorporate,
      link: "/companies"
    }
  ];

  const camyItems: MegaItem[] = [
    {
      id: "camy-helmets",
      title: "SLS Certified Helmets",
      desc: "Camy Smart: Sri Lanka's leading certified motorcycle helmet brand, combining safety, aerodynamics, and comfort.",
      image: camyHelmetShowcase,
      link: "/camy-products"
    },
    {
      id: "camy-footwear",
      title: "PU Footwear & Sandals",
      desc: "Lightweight, shock-absorbing polyurethane daily footwear designed for tropical durability.",
      image: camyPuFootwear,
      link: "/camy-products"
    },
    {
      id: "camy-cookware",
      title: "Non-Stick Cookware & Plastics",
      desc: "New Camy Smart: Premium non-stick pots, pans, and kitchenware built for every home.",
      image: cookwarePremiumRange,
      link: "/camy-products"
    },
    {
      id: "camy-electrical",
      title: "Cooling & Electrical Durables",
      desc: "Fuji Industries: Domestic cooling fans, blenders, and consumer durables engineered to last.",
      image: smartMeteringIot,
      link: "/camy-products"
    },
    {
      id: "camy-all",
      title: "Explore Full Camy Range →",
      desc: "100% Made in Sri Lanka consumer durables and appliances with islandwide warranty.",
      image: camyHelmetShowcase,
      link: "/camy-products"
    }
  ];

  const [activeAboutItem, setActiveAboutItem] = useState<MegaItem>(aboutItems[0]);
  const [activeSectorItem, setActiveSectorItem] = useState<MegaItem>(sectorCol1[0]);
  const [activeCamyItem, setActiveCamyItem] = useState<MegaItem>(camyItems[0]);

  useEffect(() => {
    loadCompanies();
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    setActiveMegaMenu(null);
  }, [location.pathname]);

  const loadCompanies = async () => {
    try {
      const data = await companiesAPI.getAll();
      if (data && data.length > 0) {
        setCompanies(data);
      }
    } catch (error) {
      console.error("Failed to load companies for navigation:", error);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderMegaMenu = () => {
    if (!activeMegaMenu) return null;

    let itemsCol1: MegaItem[] = [];
    let itemsCol2: MegaItem[] | null = null;
    let activeItem: MegaItem = activeAboutItem;
    let setActiveFunc: (item: MegaItem) => void = setActiveAboutItem;
    let menuTitle = "";

    if (activeMegaMenu === "about") {
      menuTitle = "About Supun Group";
      itemsCol1 = aboutItems;
      activeItem = activeAboutItem;
      setActiveFunc = setActiveAboutItem;
    } else if (activeMegaMenu === "sectors") {
      menuTitle = "Our Strategic Sectors & Enterprises";
      itemsCol1 = sectorCol1;
      itemsCol2 = sectorCol2;
      activeItem = activeSectorItem;
      setActiveFunc = setActiveSectorItem;
    } else if (activeMegaMenu === "camy") {
      menuTitle = "The Camy Brand Portfolio";
      itemsCol1 = camyItems;
      activeItem = activeCamyItem;
      setActiveFunc = setActiveCamyItem;
    }

    return (
      <>
        {/* Full-screen backdrop dim overlay for page below */}
        <div
          className="fixed inset-0 top-0 bg-black/60 backdrop-blur-md -z-20 transition-opacity duration-300 pointer-events-none"
        />

        <div
          key={activeMegaMenu}
          className="hidden lg:block absolute top-full left-0 right-0 w-full border-none shadow-none z-10 animate-in fade-in-0 slide-in-from-top-6 duration-400 ease-out bg-transparent"
          onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
          onMouseLeave={() => setActiveMegaMenu(null)}
        >
          <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8">
            <div className="flex items-start justify-between gap-6 xl:gap-12 max-w-[1600px] mx-auto">
              {/* Left Multi-Column Links Section (Hayleys exact style) */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 xl:gap-16 pt-2">
                {/* Column 1 */}
                <div className="flex flex-col">
                  {itemsCol1.map((item) => {
                    const isHovered = activeItem.id === item.id;
                    return (
                      <Link
                        key={item.id}
                        to={item.link}
                        onMouseEnter={() => setActiveFunc(item)}
                        onClick={() => setActiveMegaMenu(null)}
                        className={`block py-2.5 pl-6 sm:pl-7 transition-all duration-200 group cursor-pointer border-l-2 ${
                          isHovered
                            ? "border-white text-white"
                            : "border-white/20 text-gray-300 hover:text-white hover:border-white/50"
                        }`}
                      >
                        <span className={`text-[15px] xl:text-[16px] 2xl:text-[17px] tracking-wide whitespace-nowrap transition-colors ${
                          isHovered ? "text-white font-medium" : "text-gray-300 group-hover:text-white"
                        }`}>
                          {item.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* Column 2 (if present, like Sectors) */}
                {itemsCol2 && (
                  <div className="flex flex-col">
                    {itemsCol2.map((item) => {
                      const isHovered = activeItem.id === item.id;
                      return (
                        <Link
                          key={item.id}
                          to={item.link}
                          onMouseEnter={() => setActiveFunc(item)}
                          onClick={() => setActiveMegaMenu(null)}
                          className={`block py-2.5 pl-6 sm:pl-7 transition-all duration-200 group cursor-pointer border-l-2 ${
                            isHovered
                              ? "border-white text-white"
                              : "border-white/20 text-gray-300 hover:text-white hover:border-white/50"
                          }`}
                        >
                          <span className={`text-[15px] xl:text-[16px] 2xl:text-[17px] tracking-wide whitespace-nowrap transition-colors ${
                            isHovered ? "text-white font-medium" : "text-gray-300 group-hover:text-white"
                          }`}>
                            {item.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Featured Preview Card (Themed to Brand, Borderless, Shadowless, Restarts on link switch) */}
              <Link
                key={activeItem.id}
                to={activeItem.link}
                onClick={() => setActiveMegaMenu(null)}
                className="w-[290px] lg:w-[330px] xl:w-[400px] shrink-0 bg-[#0c1630]/90 hover:bg-[#101d40] border border-white/10 shadow-none overflow-hidden flex flex-col group cursor-pointer transition-all duration-300 animate-in fade-in-0 slide-in-from-top-2 duration-200"
              >
                {/* Upper Text Block */}
                <div className="p-5 xl:p-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#8dc53e] rounded-full inline-block" />
                    <span className="text-[10px] xl:text-[11px] font-bold uppercase tracking-widest text-[#8dc53e]">
                      Corporate Preview
                    </span>
                  </div>
                  <h3 className="text-xl xl:text-2xl 2xl:text-3xl font-semibold text-white tracking-tight font-heading">
                    {activeItem.title}
                  </h3>
                  <p className="text-[13px] xl:text-[14px] 2xl:text-[15px] text-gray-200 leading-relaxed font-normal line-clamp-3">
                    {activeItem.desc}
                  </p>
                </div>

                {/* Lower Edge-to-Edge Flush Image */}
                <div className="w-full h-44 xl:h-56 overflow-hidden relative border-t border-white/10">
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <header
        onMouseLeave={() => setActiveMegaMenu(null)}
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-in-out ${
          activeMegaMenu
            ? "bg-transparent py-2.5 border-none shadow-none"
            : isScrolled
            ? "bg-[#070b16]/80 backdrop-blur-xl border-b border-white/10 shadow-lg py-2.5"
            : "bg-transparent py-4 border-none shadow-none"
        }`}
      >
        {/* Unified Single Background Layer - ONLY active when Mega-Menu is open */}
        {activeMegaMenu && (
          <div className="absolute inset-x-0 top-0 pointer-events-none z-0 overflow-hidden transition-all duration-400 ease-out h-[620px] shadow-[0_35px_100px_rgba(0,0,0,0.95)]">
            <img
              src={navBgPattern}
              alt=""
              className="w-full h-full object-cover object-right-bottom filter brightness-135 contrast-110 transition-transform duration-700 ease-out"
            />
            {/* Subtle soft gradient fade on left for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent transition-opacity duration-300" />
          </div>
        )}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-18">
          <div className="flex items-center justify-between">
            {/* Desktop Left Nav Links */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-7 2xl:space-x-10 flex-1 justify-end pr-3 xl:pr-6 2xl:pr-10">
              <Link
                to="/"
                onMouseEnter={() => setActiveMegaMenu(null)}
                className="relative text-[14px] xl:text-[16px] 2xl:text-[17px] font-semibold text-white hover:text-white transition-colors py-2 group cursor-pointer whitespace-nowrap"
              >
                <span>Home</span>
                {isActive("/") && <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-white transition-all shadow-sm" />}
              </Link>
              <div className="relative py-2" onMouseEnter={() => setActiveMegaMenu("about")}>
                <button
                  type="button"
                  className="relative flex items-center gap-1 text-[14px] xl:text-[16px] 2xl:text-[17px] font-semibold text-white hover:text-white transition-colors outline-none cursor-pointer group whitespace-nowrap"
                >
                  <span>About Us</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeMegaMenu === "about" ? "rotate-180 text-[#8dc53e]" : "opacity-80"}`} />
                </button>
              </div>
              <div className="relative py-2" onMouseEnter={() => setActiveMegaMenu("sectors")}>
                <button
                  type="button"
                  className="relative flex items-center gap-1 text-[14px] xl:text-[16px] 2xl:text-[17px] font-semibold text-white hover:text-white transition-colors outline-none cursor-pointer group whitespace-nowrap"
                >
                  <span>Our Sectors</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeMegaMenu === "sectors" ? "rotate-180 text-[#8dc53e]" : "opacity-80"}`} />
                </button>
              </div>
              <div className="relative py-2" onMouseEnter={() => setActiveMegaMenu("camy")}>
                <button
                  type="button"
                  className="relative flex items-center gap-1 text-[14px] xl:text-[16px] 2xl:text-[17px] font-semibold text-white hover:text-white transition-colors outline-none cursor-pointer group whitespace-nowrap"
                >
                  <span>Camy Brand</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeMegaMenu === "camy" ? "rotate-180 text-[#8dc53e]" : "opacity-80"}`} />
                </button>
              </div>
            </nav>

            {/* Mobile Left Search Button */}
            <div className="flex items-center lg:hidden w-12 justify-start">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white p-2 hover:text-[#8dc53e] transition-colors cursor-pointer"
                aria-label="Open Search"
              >
                <Search size={24} />
              </button>
            </div>

            {/* Centered Corporate Logo */}
            <div className="flex items-center justify-center shrink-0 px-2 sm:px-4 xl:px-6 mx-auto lg:mx-0">
              <Link to="/" onMouseEnter={() => setActiveMegaMenu(null)} className="flex flex-col items-center text-center group">
                <img
                  src={logo}
                  alt="Supun Group of Companies"
                  className={`${
                    isScrolled
                      ? "h-12 sm:h-14 md:h-15 xl:h-16 2xl:h-18 max-w-[170px] sm:max-w-[210px]"
                      : "h-20 sm:h-24 md:h-28 lg:h-32 2xl:h-36 max-w-[260px] sm:max-w-[320px] lg:max-w-[380px]"
                  } w-auto object-contain transition-all duration-300 ease-in-out group-hover:scale-105 filter drop-shadow-md`}
                />
              </Link>
            </div>

            {/* Desktop Right Nav Links */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-7 2xl:space-x-10 flex-1 justify-start pl-3 xl:pl-6 2xl:pl-10">
              <Link
                to="/companies/ymac-technologies"
                onMouseEnter={() => setActiveMegaMenu(null)}
                className="relative text-[14px] xl:text-[16px] 2xl:text-[17px] font-semibold text-white hover:text-white transition-colors py-2 group cursor-pointer whitespace-nowrap"
              >
                <span>YMAC Smart</span>
                {isActive("/companies/ymac-technologies") && <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-white transition-all shadow-sm" />}
              </Link>
              <a
                href="https://www.anythingatsupun.lk"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setActiveMegaMenu(null)}
                className="relative text-[14px] xl:text-[16px] 2xl:text-[17px] font-semibold text-white hover:text-white transition-colors py-2 flex items-center gap-1.5 group cursor-pointer whitespace-nowrap"
              >
                <span>Store</span>
                <ExternalLink size={13} className="opacity-80" />
              </a>
              <Link
                to="/careers"
                onMouseEnter={() => setActiveMegaMenu(null)}
                className="relative text-[14px] xl:text-[16px] 2xl:text-[17px] font-semibold text-white hover:text-white transition-colors py-2 group cursor-pointer whitespace-nowrap"
              >
                <span>Careers</span>
                {isActive("/careers") && <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-white transition-all shadow-sm" />}
              </Link>
              <Link
                to="/contact"
                onMouseEnter={() => setActiveMegaMenu(null)}
                className="relative text-[14px] xl:text-[16px] 2xl:text-[17px] font-semibold text-white hover:text-white transition-colors py-2 group cursor-pointer whitespace-nowrap"
              >
                <span>Contact Us</span>
                {isActive("/contact") && <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-white transition-all shadow-sm" />}
              </Link>
            </div>

            {/* Mobile / Tablet Right Hamburger Menu Button */}
            <div className="flex items-center lg:hidden w-12 justify-end">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-2 hover:text-[#8dc53e] transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Render Desktop Mega Menu */}
        {renderMegaMenu()}

        {/* =========================================================================
            MOBILE NAVIGATION MENU DRAWER
           ========================================================================= */}
        {isOpen && (
          <div className="xl:hidden bg-[#0A0A0C] border-t border-white/10 px-6 py-8 space-y-6 animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col space-y-4 text-lg font-semibold text-white">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`py-2 border-b border-white/10 ${isActive("/") ? "text-[#0038FF]" : ""}`}
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className={`py-2 border-b border-white/10 ${isActive("/about") ? "text-[#0038FF]" : ""}`}
              >
                About Us & Leadership
              </Link>
              <Link
                to="/companies"
                onClick={() => setIsOpen(false)}
                className={`py-2 border-b border-white/10 ${isActive("/companies") ? "text-[#0038FF]" : ""}`}
              >
                Our 10 Companies
              </Link>
              <Link
                to="/camy-products"
                onClick={() => setIsOpen(false)}
                className={`py-2 border-b border-white/10 ${isActive("/camy-products") ? "text-[#0038FF]" : ""}`}
              >
                The Camy Product Portfolio
              </Link>
              <Link
                to="/careers"
                onClick={() => setIsOpen(false)}
                className={`py-2 border-b border-white/10 ${isActive("/careers") ? "text-[#0038FF]" : ""}`}
              >
                Careers & Opportunities
              </Link>
              <a
                href="https://www.anythingatsupun.lk"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 border-b border-white/10 flex items-center justify-between text-gray-300"
              >
                <span>Anythingatsupun.lk (Store)</span>
                <ExternalLink size={16} />
              </a>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={`py-2 ${isActive("/contact") ? "text-[#0038FF]" : ""}`}
              >
                Contact & Directory
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* =========================================================================
          GLOBAL SEARCH MODAL
         ========================================================================= */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-2xl bg-[#0A0A0C] border-2 border-white/20 text-white rounded-none p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-white font-heading">
              Search Supun Group Enterprise Directory
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by company name, sector (e.g. helmets, cookware, residency)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-none h-12 text-sm focus:border-[#0038FF]"
                autoFocus
              />
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pt-2">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <Link
                    key={company.id}
                    to={`/companies/${company.id}`}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="block p-4 bg-white/5 hover:bg-[#0038FF] border border-white/10 hover:border-[#0038FF] transition-all group rounded-none"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base font-heading">
                            {company.shortName || company.name}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-gray-300 bg-white/10 px-2 py-0.5">
                            {company.industry}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 group-hover:text-white/90 mt-1 line-clamp-1">
                          {company.description}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-white shrink-0 ml-4" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No company matching "{searchQuery}" found.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navigation;
