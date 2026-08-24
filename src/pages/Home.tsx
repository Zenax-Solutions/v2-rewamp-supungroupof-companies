import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Factory,
  ShoppingBag,
  Building,
  Sparkles,
  Award,
  Users,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { BrandShowcase } from "@/components/BrandShowcase";
import { companiesAPI, brandsAPI, type Brand, type Company, getFileUrl } from "@/services/api";
import { companies as fallbackCompanies } from "@/data/companies";
import heroManufacturing from "@/assets/hero-manufacturing.jpg";

import sriLankaManufacturingVector from "@/assets/sri-lanka-manufacturing-vector.png";
import sectorManufacturingIllustration from "@/assets/sector-manufacturing-illustration.jpg";
import sectorHospitalityIllustration from "@/assets/sector-hospitality-illustration.jpg";
import sectorRetailIllustration from "@/assets/sector-retail-illustration.jpg";
import sectorCamyIllustration from "@/assets/sector-camy-illustration.jpg";
import partnerHandshakeVector from "@/assets/partner-handshake-vector.png";
import Seo, { SITE_URL } from "@/components/Seo";

const Home = () => {
  const [companiesList, setCompaniesList] = useState<Company[]>(fallbackCompanies as unknown as Company[]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sector Highlights Carousel Configuration
  const sectorCards = [
    {
      id: "manufacturing",
      badge: "SLS 517 Certified Plants",
      title: "Industrial Manufacturing",
      description: "Building Sri Lanka’s consumer durables in our own factories—from national SLS 517 certified motorcycle safety helmets to PU footwear and non-stick cookware.",
      image: sectorManufacturingIllustration,
      metric: "6 Production Facilities",
      linkText: "Explore Plants",
      link: "/companies"
    },
    {
      id: "retail",
      badge: "Established 1978 Wholesale Hub",
      title: "Retail & Distribution",
      description: "Connecting Sri Lankan households to essential consumer products, from Supun Traders’ wholesale heritage to Supun Super Center’s extensive commercial network.",
      image: sectorRetailIllustration,
      metric: "250+ Islandwide Outlets",
      linkText: "Explore Retail",
      link: "/companies/supun-super-center"
    },
    {
      id: "hospitality",
      badge: "Central Colombo Serviced Living",
      title: "Hospitality & Dining",
      description: "Delivering premium serviced apartment suites and skyline rooftop dining in central Colombo, across Supun Arcade Residency and Area 56 Lounge.",
      image: sectorHospitalityIllustration,
      metric: "40 Suites & Lounge",
      linkText: "Explore Stays",
      link: "/companies/supun-arcade-residency"
    },
    {
      id: "camy",
      badge: "Sri Lanka’s Consumer Durables",
      title: "The Camy Brand",
      description: "Manufacturing Sri Lanka's own consumer durables brand, from motorcycle helmets to home appliances, all designed and built in-house.",
      image: sectorCamyIllustration,
      metric: "National Brand Range",
      linkText: "Explore Camy",
      link: "/camy-products"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(3);

  // Responsive Cards Per View (1 on Mobile, 2 on Tablet, 3 on Desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Automatic Continuous Loop Carousel (Advances Every 3.8 seconds, pauses on user hover)
  useEffect(() => {
    if (isCarouselHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sectorCards.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isCarouselHovered, sectorCards.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sectorCards.length) % sectorCards.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sectorCards.length);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [companiesData, brandsData] = await Promise.allSettled([
        companiesAPI.getAll(),
        brandsAPI.getAll()
      ]);
      if (companiesData.status === "fulfilled" && companiesData.value.length > 0) {
        setCompaniesList(companiesData.value);
      }
      if (brandsData.status === "fulfilled" && brandsData.value.length > 0) {
        setBrands(brandsData.value);
      }
    } catch (error) {
      console.error("Failed to load database data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white text-gray-900 font-sans selection:bg-[#1d3f9a] selection:text-white">
      <Seo
        title="Supun Group of Companies | Built in Sri Lanka. Built to Last."
        description="Across our own factories and 400+ employees, Supun Group manufactures consumer durables, runs retail and distribution, and delivers hospitality throughout Sri Lanka."
        keywords="Supun Group of Companies, Built in Sri Lanka, Camy Smart, SLS Helmets, Non-Stick Cookware, Sri Lanka manufacturing, Supun Traders, Supun Arcade Residency, Fuji Industries"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Supun Group of Companies",
          url: SITE_URL,
          logo: `${SITE_URL}/assets/supun-group-of-companies-logo.png`,
          description: "Across our own factories and 400+ employees, we manufacture consumer durables, run retail and distribution, and deliver hospitality throughout Sri Lanka.",
          foundingDate: "1978",
          numberOfEmployees: "400+",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+94-112-055-026",
            contactType: "Customer Service",
            email: "info@supungroup.lk",
          },
        }}
      />

      {/* =========================================================================
          HERO SECTION: BUILT IN SRI LANKA. BUILT TO LAST. (FULL BACKGROUND VIDEO)
         ========================================================================= */}
      <section className="relative w-full h-[70vh] min-h-[480px] max-h-[640px] md:h-screen md:min-h-[600px] md:max-h-none flex flex-col justify-center items-center bg-black text-white border-b-2 border-gray-900 overflow-hidden pt-20 sm:pt-24 md:pt-36 lg:pt-40 pb-8 sm:pb-10 md:pb-14">
        {/* Full Background Video (Edge-to-Edge, 100% Full Clarity & High Brightness) */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-100"
          autoPlay
          loop
          muted
          playsInline
          poster={heroManufacturing}
          preload="auto"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Minimal Transparent Overlay (Ultra bright video clarity) */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15 pointer-events-none" />

        {/* Hero Content Overlay (Full Width, Centered with Breathing Room) */}
        <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 text-center my-auto">
          <div className="max-w-4xl lg:max-w-5xl mx-auto space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Main Headline with solid #1d3f9a blue only (Proportionately scaled for laptop displays) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white font-heading uppercase leading-[1.1]">
              BUILT IN SRI LANKA. <br />
              <span className="text-[#1d3f9a]">
                BUILT TO LAST.
              </span>
            </h1>

            {/* Subhead from Doc */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-medium">
              Across our own factories and 400+ employees, we manufacture consumer durables, run retail and distribution, and deliver hospitality throughout Sri Lanka.
            </p>

            {/* CTA Buttons: Primary "Explore Our Companies" (filled) + Secondary "Get In Touch" (outlined) side by side */}
            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center pt-2 sm:pt-3">
              <Link to="/companies">
                <button className="w-full sm:w-auto bg-[#1d3f9a] hover:bg-[#163077] active:scale-95 text-white font-bold text-xs sm:text-sm md:text-base px-8 sm:px-10 py-3 sm:py-3.5 rounded-none transition-all uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer border border-[#1d3f9a]">
                  <span>Explore Our Companies</span>
                  <ArrowRight size={18} />
                </button>
              </Link>
              <Link to="/contact">
                <button className="w-full sm:w-auto bg-black/60 hover:bg-white text-white hover:text-gray-900 border-2 border-white font-bold text-xs sm:text-sm md:text-base px-8 sm:px-10 py-3 sm:py-3.5 rounded-none backdrop-blur-md transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer">
                  <span>Get In Touch</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: ABOUT SUPUN GROUP (LARGE EDITORIAL TYPOGRAPHY & HERITAGE)
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 bg-white text-gray-900 border-b border-gray-200 font-sans relative overflow-hidden">
        {/* Background Vector Art Overlay: Full Original Color with Smooth Fade Mask */}
        <div className="absolute right-0 bottom-0 pointer-events-none z-0 translate-x-12 translate-y-10 opacity-30 lg:opacity-35 w-[600px] sm:w-[800px] lg:w-[1100px] xl:w-[1300px] select-none [mask-image:linear-gradient(to_left,black_45%,transparent_98%)]">
          <img
            src={sriLankaManufacturingVector}
            alt=""
            className="w-full h-auto object-contain filter contrast-105"
          />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          {/* Super Headline: Bold Editorial Typography */}
          <div className="max-w-5xl space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#1d3f9a] block font-sans">
              Supun Group of Companies — Established 1978
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-950 tracking-tight leading-[1.08] font-heading">
              Four decades of domestic manufacturing, nationwide commerce, and self-reliant enterprise.
            </h2>
          </div>

          {/* Editorial Split: Big Narrative Paragraphs + Hairline Metric Dividers */}
          <div className="pt-20 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
            {/* Left Story Column (7 Cols) - Razor Sharp Contrast */}
            <div className="lg:col-span-7 space-y-8">
              <p className="text-xl sm:text-2xl text-gray-950 font-bold leading-relaxed font-heading">
                From trusted wholesale roots in Colombo in 1978, Supun Group has expanded across two generations of leadership into a diversified conglomerate operating ten market-leading enterprises.
              </p>
              <p className="text-base sm:text-lg text-gray-800 font-medium leading-relaxed">
                Rather than relying on imported goods, we engineered self-reliant production lines across six domestic factories—manufacturing SLS 517 certified motorcycle helmets, non-stick cookware, PU footwear, and smart energy infrastructure that power Sri Lanka.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-6">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 bg-[#1d3f9a] hover:bg-[#163077] text-white font-bold text-base px-8 py-4 rounded-none transition-all duration-200 shadow-lg hover:shadow-xl group"
                >
                  <span>About The Group</span>
                  <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/companies"
                  className="text-gray-950 hover:text-[#1d3f9a] font-bold text-base transition-colors underline underline-offset-8"
                >
                  View 10 Enterprises
                </Link>
              </div>
            </div>

            {/* Right Metric Column (5 Cols) - High Contrast Architectural Dividers with subtle backdrop protection */}
            <div className="lg:col-span-5 divide-y divide-gray-300 border-t border-b border-gray-300 bg-white/70 backdrop-blur-[2px] p-2 sm:p-4 -mx-2 sm:-mx-4">
              <div className="py-7 grid grid-cols-12 items-baseline gap-4">
                <span className="col-span-5 text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 font-heading tracking-tight">
                  1978
                </span>
                <div className="col-span-7 space-y-1">
                  <div className="text-sm font-bold uppercase tracking-wider text-gray-950">
                    Founded in Colombo
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    45+ years of continuous Sri Lankan enterprise heritage.
                  </div>
                </div>
              </div>

              <div className="py-7 grid grid-cols-12 items-baseline gap-4">
                <span className="col-span-5 text-4xl sm:text-5xl lg:text-6xl font-black text-[#1d3f9a] font-heading tracking-tight">
                  10
                </span>
                <div className="col-span-7 space-y-1">
                  <div className="text-sm font-bold uppercase tracking-wider text-gray-950">
                    Operating Companies
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    Holdings across manufacturing, retail, hospitality & tech.
                  </div>
                </div>
              </div>

              <div className="py-7 grid grid-cols-12 items-baseline gap-4">
                <span className="col-span-5 text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 font-heading tracking-tight">
                  06
                </span>
                <div className="col-span-7 space-y-1">
                  <div className="text-sm font-bold uppercase tracking-wider text-gray-950">
                    Production Plants
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    SLS 517 certified safety standard manufacturing facilities.
                  </div>
                </div>
              </div>

              <div className="py-7 grid grid-cols-12 items-baseline gap-4">
                <span className="col-span-5 text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 font-heading tracking-tight">
                  400+
                </span>
                <div className="col-span-7 space-y-1">
                  <div className="text-sm font-bold uppercase tracking-wider text-gray-950">
                    Dedicated Workforce
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    Engineers, craftsmen, technicians, and commercial staff.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: SECTOR HIGHLIGHT CAROUSEL (CONTINUOUS SMOOTH INFINITE LOOP)
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 bg-slate-50 border-b border-gray-200 font-sans overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#1d3f9a] block font-sans">
                Four Strategic Core Pillars
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-950 font-heading">
                What We Do
              </h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 max-w-xl font-normal leading-relaxed">
              From high-precision factory floors to Sri Lanka’s consumer durables, islandwide retail channels, and luxury hospitality suites.
            </p>
          </div>
        </div>

        {/* Continuous Smooth Infinite Loop Marquee Track */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)] py-4">
          <div className="animate-continuous-carousel gap-6 sm:gap-8 px-4">
            {[...sectorCards, ...sectorCards, ...sectorCards, ...sectorCards].map((card, idx) => (
              <div
                key={`${card.id}-${idx}`}
                className="w-[300px] sm:w-[360px] md:w-[400px] lg:w-[420px] xl:w-[440px] flex-shrink-0"
              >
                <div className="bg-white border border-gray-200 shadow-sm flex flex-col justify-between h-full overflow-hidden group hover:border-[#1d3f9a] hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden bg-white border-b border-gray-100">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-52 sm:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2.5">
                      <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-extrabold text-[#1d3f9a] block font-sans">
                        {card.badge}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 font-heading leading-snug">
                        {card.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal font-sans">
                        {card.description}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-gray-900 font-sans">
                        {card.metric}
                      </span>
                      <Link
                        to={card.link}
                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#1d3f9a] hover:underline"
                      >
                        <span>{card.linkText}</span>
                        <ChevronRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: COMPANIES TEASER GRID (10 COMPANIES FROM DOC TABLE)
         ========================================================================= */}
      <section className="w-full py-20 sm:py-28 bg-white border-b-2 border-gray-200">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 bg-[#1d3f9a]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#1d3f9a]">
                  Ten Subsidiary Enterprises
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900 font-heading uppercase">
                Our Companies
              </h2>
            </div>
            <Link to="/companies">
              <button className="bg-gray-900 hover:bg-[#1d3f9a] text-white font-bold text-sm px-8 py-4 rounded-none transition-colors uppercase tracking-wider flex items-center gap-2 cursor-pointer">
                <span>View Full Directory</span>
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          {/* Companies Teaser Cards Grid (Exact copy from Document / Database) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companiesList.map((company, index) => {
              const sectorName = company.industry || (company as any).sector || "Subsidiary";
              const imgUrl = getFileUrl(company.imageUrl);
              const oneLiner = (company as any).tagline || company.description;
              const brandName = (company as any).consumerBrand || company.shortName || company.name;

              return (
                <div
                  key={company.id}
                  className="bg-[#F4F5F7] p-8 border-2 border-gray-200 flex flex-col justify-between hover:border-[#1d3f9a] hover:bg-white transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1d3f9a] bg-[#1d3f9a]/10 px-3 py-1 uppercase tracking-wider">
                        {sectorName}
                      </span>
                      <span className="text-xs font-extrabold text-gray-400">
                        {company.established ? `Est. ${company.established}` : `0${index + 1}`}
                      </span>
                    </div>

                    {/* Left-Aligned Transparent Large Logo */}
                    {imgUrl && (
                      <div className="pt-1 pb-1 flex items-center justify-start">
                        <img
                          src={imgUrl}
                          alt={company.name}
                          className="h-16 sm:h-20 w-auto max-w-[240px] object-contain object-left transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 font-heading group-hover:text-[#1d3f9a] transition-colors">
                        {company.shortName || company.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {company.name}
                      </p>
                    </div>

                    <p className="text-base text-gray-700 font-semibold leading-snug">
                      {oneLiner}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t-2 border-gray-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {brandName}
                    </span>
                    <Link
                      to={`/companies/${company.id}`}
                      className="text-xs font-bold text-[#1d3f9a] uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Details</span>
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: BRAND PORTFOLIO SHOWCASE
         ========================================================================= */}
      {!isLoading && brands.length > 0 && (
        <section className="w-full py-20 sm:py-28 bg-[#FAFAFC] border-b-2 border-gray-200">
          <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="w-3 h-3 bg-[#1d3f9a]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#1d3f9a]">
                  Trusted by Millions
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900 font-heading uppercase">
                Brand Portfolio
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mt-4 font-normal">
                Discover the diverse market-leading consumer brands produced and distributed under the Supun Group umbrella.
              </p>
            </div>
            <BrandShowcase brands={brands} />
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 5: PARTNER WITH SUPUN GROUP (WITH PARTNERSHIP ARTWORK OVERLAY)
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 bg-[#0d235e] text-white relative overflow-hidden font-sans border-t border-white/10">
        {/* Mobile-Only Background Vector Art: Centered Extra Large Overlay */}
        <div className="md:hidden absolute inset-x-0 bottom-0 pointer-events-none z-0 overflow-hidden w-full h-full flex items-end justify-center">
          <img
            src={partnerHandshakeVector}
            alt=""
            className="max-w-none w-[680px] h-auto object-contain object-bottom opacity-30 select-none translate-y-4 filter brightness-125 contrast-110"
          />
        </div>

        {/* Desktop/Tablet Background Vector Art: Original Layout */}
        <div className="hidden md:block absolute right-0 bottom-0 pointer-events-none z-0 translate-x-6 translate-y-12 opacity-25 w-[700px] lg:w-[900px] xl:w-[1050px] select-none [mask-image:linear-gradient(to_left,black_50%,transparent_98%)]">
          <img
            src={partnerHandshakeVector}
            alt=""
            className="w-full h-auto object-contain filter brightness-110 contrast-110"
          />
        </div>

        {/* Ambient Subtle Radial Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d235e] via-[#0d235e]/90 to-[#0d235e]/60 pointer-events-none z-0" />

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 text-center space-y-8 max-w-5xl">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8dc53e] block font-sans">
              Strategic Commercial & Industrial Alliances
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-heading">
              Partner With Supun Group
            </h2>
          </div>

          <p className="text-base sm:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto font-normal">
            Whether for domestic contract manufacturing, wholesale distribution partnerships, retail dealer networks, or joint ventures, we welcome forward-looking collaborations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-3 bg-[#8dc53e] hover:bg-[#7cb332] text-[#060a16] font-bold text-base px-10 py-4 rounded-none transition-all duration-300 shadow-xl group"
            >
              <span>Contact Corporate Office</span>
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/companies"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-base px-10 py-4 rounded-none transition-all duration-300"
            >
              <span>Explore 10 Enterprises</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
