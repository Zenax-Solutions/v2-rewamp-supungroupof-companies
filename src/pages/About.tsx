import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Factory,
  ShoppingBag,
  Building,
  Sparkles,
  Award,
  Users,
  Lightbulb,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Globe2,
  ChevronRight
} from "lucide-react";
import heroCorporate from "@/assets/hero-corporate.jpg";
import heroManufacturing from "@/assets/hero-manufacturing.jpg";
import chairmanImage from "@/assets/Chairman.png";
import sriLankaManufacturingVector from "@/assets/sri-lanka-manufacturing-vector.png";
import camyLogo from "@/assets/camy-logo.png";
import supunLogo from "@/assets/supun-group-of-companies-logo.png";
import { leadershipTeam } from "@/data/leadership";
import { companies as fallbackCompanies } from "@/data/companies";
import { companiesAPI, brandsAPI, type Company, type Brand, getFileUrl } from "@/services/api";
import Seo, { SITE_URL } from "@/components/Seo";

const About = () => {
  const [companiesList, setCompaniesList] = useState<Company[]>(fallbackCompanies as unknown as Company[]);
  const [brandsList, setBrandsList] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compData, brandData] = await Promise.allSettled([
          companiesAPI.getAll(),
          brandsAPI.getAll()
        ]);
        if (compData.status === "fulfilled" && compData.value?.length > 0) {
          setCompaniesList(compData.value);
        }
        if (brandData.status === "fulfilled" && brandData.value?.length > 0) {
          setBrandsList(brandData.value);
        }
      } catch (err) {
        console.warn("About page using fallback data:", err);
      }
    };
    fetchData();
  }, []);

  const getCompanyLogo = (c: Company | any) => {
    if (c.imageUrl) {
      return getFileUrl(c.imageUrl);
    }
    // Match against brands
    const matchedBrand = brandsList.find(b =>
      (b.name && c.consumerBrand && b.name.toLowerCase().includes(c.consumerBrand.toLowerCase())) ||
      (b.name && c.name && c.name.toLowerCase().includes(b.name.toLowerCase())) ||
      (b.name && c.id && c.id.toLowerCase().includes(b.name.toLowerCase()))
    );
    if (matchedBrand?.logoUrl) {
      return getFileUrl(matchedBrand.logoUrl);
    }
    // Fallback based on brand family
    const isCamy = ["camy-smart", "new-camy-smart", "aero-star", "fuji-industries", "rodsons", "camy-global", "supun-aerosoft"].includes(c.id) ||
                   (c.consumerBrand && c.consumerBrand.toLowerCase().includes("camy"));
    if (isCamy) return camyLogo;
    return supunLogo;
  };

  const manufacturingCompanies = companiesList.filter((c) => {
    const s = c.industry || (c as any).sector || "";
    return s.includes("Manufacturing");
  });

  const retailCompanies = companiesList.filter((c) => {
    const s = c.industry || (c as any).sector || "";
    return s.includes("Retail") || s.includes("Wholesale") || s.includes("Distribution");
  });

  const hospitalityCompanies = companiesList.filter((c) => {
    const s = c.industry || (c as any).sector || "";
    return s.includes("Hospitality");
  });

  const camyBrandCompanies = companiesList.filter((c) => {
    return ["camy-smart", "new-camy-smart", "aero-star", "fuji-industries", "rodsons", "camy-global"].includes(c.id) ||
           (c.consumerBrand && c.consumerBrand.toLowerCase().includes("camy"));
  });

  const journeyMilestones = [
    {
      year: "1978",
      title: "Founding of Supun Traders",
      desc: "Mr. Mohamed Fareed establishes Supun Traders in Colombo, pioneering household goods & appliance trading."
    },
    {
      year: "1999",
      title: "Formalization of Supun Group",
      desc: "Chairman Mr. M.F.M. Kaleel takes the helm, setting a new strategic course from trading goods to manufacturing them in Sri Lanka."
    },
    {
      year: "2003",
      title: "Supun Super Center",
      desc: "Supun Super Center opens in Colombo, launching modern multi-category retail and later Anythingatsupun.lk."
    },
    {
      year: "2010",
      title: "Entry into Luxury Hospitality",
      desc: "Supun Arcade Residency opens with 40 serviced apartment suites and rooftop skyline restaurant Area 56 on Galle Road."
    },
    {
      year: "2011",
      title: "Supun Aerosoft (YMAC Smart)",
      desc: "Founded as Sri Lanka's first PU (Polyurethane) footwear direct injection manufacturer, later featured at Canton Fair."
    },
    {
      year: "2016",
      title: "Aero Star Founded",
      desc: "Aero Star established, bringing precision chrome plating and Camy-branded appliance fabrication in-house."
    },
    {
      year: "2017",
      title: "Camy Smart & Rodsons",
      desc: "Camy Smart (SLS 517 motorcycle safety helmets) and Rodsons (in-house plastic injection tooling) founded."
    },
    {
      year: "2018",
      title: "New Camy Smart",
      desc: "New Camy Smart founded, pioneering non-stick and ceramic cookware with advanced Korean technology collaboration."
    },
    {
      year: "2023",
      title: "Fuji Industries",
      desc: "Fuji Industries founded as the Group's newest plant, manufacturing Camy air conditioners and cooling fans locally."
    },
    {
      year: "Today",
      title: "Conglomerate of 10 Companies",
      desc: "10 operating enterprises across manufacturing, wholesale, retail, and hospitality, employing 400+ people."
    }
  ];

  const coreValues = [
    {
      icon: Award,
      title: "Manufacturing Quality",
      desc: "Meeting SLS 517 safety certifications, international ISO standards, and high-precision tooling across all plants."
    },
    {
      icon: Users,
      title: "People First",
      desc: "Empowering 400+ engineers, technicians, and hospitality specialists through stable career growth since 1978."
    },
    {
      icon: Lightbulb,
      title: "Continuous Innovation",
      desc: "Investing in automated injection molds, Korean non-stick ceramic coatings, and smart IoT metering technologies."
    },
    {
      icon: HeartHandshake,
      title: "Sri Lankan Heritage",
      desc: "Building self-reliant domestic manufacturing, strengthening islandwide distribution, and creating local industry value."
    }
  ];

  return (
    <div className="w-full bg-white text-gray-950 font-sans selection:bg-[#1d3f9a] selection:text-white">
      <Seo
        title="About Us | Supun Group of Companies"
        description="A family run Sri Lankan conglomerate since 1978. Discover our heritage, Chairman's message, 10-company structure, and manufacturing milestones."
        canonical={`${SITE_URL}/about`}
      />

      {/* =========================================================================
          HERO BANNER: EDITORIAL LARGE TYPOGRAPHY
         ========================================================================= */}
      <section className="relative w-full pt-36 sm:pt-44 pb-20 lg:pb-32 bg-[#070b16] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroCorporate}
            alt="Supun Group Corporate Headquarters"
            className="w-full h-full object-cover opacity-25 filter brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-[#070b16]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#8dc53e]" />
              <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-[#8dc53e]">
                Our Heritage & Vision • Since 1978
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white font-heading leading-[1.05]">
              Built on Trust. <br />
              <span className="text-[#8dc53e]">Driven by Excellence.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed font-normal">
              From Mohamed Fareed's wholesale trading in 1978 to a national manufacturing conglomerate of ten companies under Chairman M.F.M. Kaleel.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: OUR STORY (EDITORIAL WITH VECTOR ARTWORK OVERLAY)
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 bg-white border-b border-gray-200 relative overflow-hidden">
        {/* Background Subtle Silhouette Vector Art */}
        <div className="absolute right-0 bottom-0 pointer-events-none z-0 opacity-10 select-none w-[600px] lg:w-[850px] translate-x-12 translate-y-8">
          <img
            src={sriLankaManufacturingVector}
            alt=""
            className="w-full h-auto object-contain filter contrast-125"
          />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Sticky Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#1d3f9a] block">
                  Two Generations of Leadership
                </span>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-950 font-heading leading-[1.1]">
                  Our Story
                </h2>
              </div>

              {/* Statistics Counters */}
              <div className="p-8 bg-slate-50 border border-gray-200 space-y-6">
                <div className="space-y-1">
                  <div className="text-xs font-extrabold uppercase tracking-widest text-[#1d3f9a]">
                    Origin
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-950 font-heading">
                    1978 Colombo
                  </div>
                  <div className="text-sm text-gray-600">
                    Founded by Mr. Mohamed Fareed
                  </div>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="space-y-1">
                  <div className="text-xs font-extrabold uppercase tracking-widest text-[#1d3f9a]">
                    Scale
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-950 font-heading">
                    10 Enterprises
                  </div>
                  <div className="text-sm text-gray-600">
                    6 Production Facilities & 400+ Dedicated Workforce
                  </div>
                </div>
              </div>
            </div>

            {/* Right Story Body */}
            <div className="lg:col-span-7 space-y-8 text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
              <p className="text-2xl sm:text-3xl font-bold text-gray-950 leading-snug font-heading">
                A family-run business since 1978, Supun Group of Companies began when Mr. Mohamed Fareed founded Supun Traders in Colombo, trading essential consumer goods for Sri Lankan households.
              </p>
              <p>
                In 1999, his son, current Chairman <strong>Mr. M.F.M. Kaleel</strong>, took over the business and formalized it as the Supun Group of Companies, setting the conglomerate on a transformative new course: <em>from trading goods to manufacturing them in Sri Lanka.</em>
              </p>
              <p>
                Through disciplined growth, the Group now operates across manufacturing, retail, wholesale distribution, smart IoT systems, and luxury hospitality—each held to the highest standard of industrial precision and Sri Lankan craftsmanship.
              </p>
              <p>
                Under the flagship <strong>Camy</strong> brand, Supun manufactures SLS 517 certified motorcycle safety helmets, polyurethane footwear, non-stick cookware, and appliances in its own factories, serving millions of households islandwide.
              </p>
              <div className="border-l-4 border-[#1d3f9a] pl-6 py-4 bg-slate-50 text-gray-900 font-semibold text-lg sm:text-xl italic">
                "With an eye on the future and a continued focus on Sri Lankan industrial excellence, we credit our growth to two generations of family leadership and a shared commitment to quality, innovation, and national pride."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CHAIRMAN'S MESSAGE (EXECUTIVE SHOWCASE)
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 bg-[#070b16] text-white relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#8dc53e]" />
              <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-[#8dc53e]">
                Executive Leadership
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-heading">
              Chairman's Message
            </h2>
            <p className="text-base sm:text-lg text-gray-400 font-normal">
              The Personality & Vision Behind the Success Story of Supun Group
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto bg-white/5 border border-white/10 p-8 sm:p-14">
            {/* Chairman Portrait */}
            <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6">
              <div className="relative border-4 border-[#1d3f9a] p-2 bg-black shadow-2xl">
                <img
                  src={chairmanImage}
                  alt="Mr. M.F.M. Kaleel - Chairman"
                  className="w-64 sm:w-80 h-auto object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-heading">
                  M. F. M. Kaleel
                </h3>
                <p className="text-xs font-bold text-[#8dc53e] uppercase tracking-widest mt-1">
                  Chairman – Supun Group of Companies
                </p>
              </div>
            </div>

            {/* Message Narrative */}
            <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
              <p>
                Since the group company was formalized in 1999, Supun Group of Companies has cultivated its status as a pioneer in domestic manufacturing and commercial distribution. Guided by our corporate creed of <strong>"Innovation & Creativity"</strong>, we challenge ourselves to provide a wide range of products locally and internationally through technology transfers, human commitment, and professionalism.
              </p>
              <p>
                The global business environment has experienced radical changes due to technological advancement. This has helped our enterprises identify new opportunities while building an agile, lean, and forward-thinking manufacturing structure.
              </p>
              <p className="font-semibold text-white">
                "At Supun, I am proud to lead an exceptional team dedicated to the success story of a proud Sri Lankan entity. We strive to nurture business goals through new products and services for the future."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: GROUP ARCHITECTURE (HUB AND SPOKE)
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 bg-slate-50 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#1d3f9a] block">
              Corporate Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-950 font-heading">
              Group & Brand Structure
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Our parent holding company orchestrating four strategic operational divisions.
            </p>
          </div>

          {/* Central Top Hub */}
          <div className="max-w-xl mx-auto mb-12 text-center">
            <div className="bg-[#1d3f9a] text-white p-8 shadow-xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8dc53e]">
                Corporate Parent Holding
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading">
                SUPUN GROUP OF COMPANIES
              </h3>
              <p className="text-xs text-white/90">
                Strategic Governance & Capital Management (Est. 1978 / 1999)
              </p>
            </div>
            <div className="w-1 h-8 bg-[#1d3f9a] mx-auto" />
          </div>

          {/* 4 Pillars Architecture Grid with Large Company Logos & Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {/* Pillar 01: Manufacturing */}
            <div className="bg-white p-7 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-[#1d3f9a] hover:shadow-xl transition-all duration-300 group">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-xs uppercase tracking-[0.22em] font-extrabold text-[#1d3f9a] font-sans flex items-center gap-2">
                    <Factory size={16} />
                    <span>Manufacturing</span>
                  </span>
                  <span className="text-xl font-black text-gray-300 font-heading">01</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-950 font-heading leading-tight">
                    Industrial Facilities
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                    Precision engineering, SLS 517 certified helmet plants, and PU injection molding.
                  </p>
                </div>

                {/* Companies List with LARGE matched logos */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block">
                    Manufacturing Enterprises:
                  </span>
                  <div className="space-y-3">
                    {manufacturingCompanies.map((c) => {
                      const logo = getCompanyLogo(c);
                      return (
                        <Link
                          key={c.id}
                          to={`/companies/${c.id}`}
                          className="flex items-center justify-between p-3 sm:p-3.5 bg-slate-50 hover:bg-white hover:border-[#1d3f9a] border border-gray-200 transition-all duration-200 group/item shadow-xs"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white p-1.5 border border-gray-200 flex items-center justify-center shrink-0 shadow-xs">
                              <img src={logo} alt={c.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm sm:text-base font-bold text-gray-950 font-heading group-hover/item:text-[#1d3f9a] transition-colors truncate">
                                {c.shortName || c.name}
                              </h4>
                              <span className="text-[11px] text-gray-500 font-normal truncate block mt-0.5">
                                {c.consumerBrand || c.description?.slice(0, 28)}
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-gray-400 group-hover/item:text-[#1d3f9a] group-hover/item:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-950 font-sans">{manufacturingCompanies.length} Production Plants</span>
                <Link to="/companies" className="text-xs font-bold text-[#1d3f9a] hover:underline inline-flex items-center gap-1">
                  <span>Explore All</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Pillar 02: Retail & Distribution */}
            <div className="bg-white p-7 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-[#1d3f9a] hover:shadow-xl transition-all duration-300 group">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-xs uppercase tracking-[0.22em] font-extrabold text-[#1d3f9a] font-sans flex items-center gap-2">
                    <ShoppingBag size={16} />
                    <span>Commercial</span>
                  </span>
                  <span className="text-xl font-black text-gray-300 font-heading">02</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-950 font-heading leading-tight">
                    Retail & Network
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                    Supun Traders wholesale network, Supun Super Center, and Anythingatsupun.lk.
                  </p>
                </div>

                {/* Companies List with LARGE matched logos */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block">
                    Commercial Enterprises:
                  </span>
                  <div className="space-y-3">
                    {retailCompanies.map((c) => {
                      const logo = getCompanyLogo(c);
                      return (
                        <Link
                          key={c.id}
                          to={`/companies/${c.id}`}
                          className="flex items-center justify-between p-3 sm:p-3.5 bg-slate-50 hover:bg-white hover:border-[#1d3f9a] border border-gray-200 transition-all duration-200 group/item shadow-xs"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white p-1.5 border border-gray-200 flex items-center justify-center shrink-0 shadow-xs">
                              <img src={logo} alt={c.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm sm:text-base font-bold text-gray-950 font-heading group-hover/item:text-[#1d3f9a] transition-colors truncate">
                                {c.shortName || c.name}
                              </h4>
                              <span className="text-[11px] text-gray-500 font-normal truncate block mt-0.5">
                                {c.consumerBrand || c.description?.slice(0, 28)}
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-gray-400 group-hover/item:text-[#1d3f9a] group-hover/item:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-950 font-sans">250+ Outlets</span>
                <Link to="/companies/supun-super-center" className="text-xs font-bold text-[#1d3f9a] hover:underline inline-flex items-center gap-1">
                  <span>Explore All</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Pillar 03: Hospitality */}
            <div className="bg-white p-7 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-[#1d3f9a] hover:shadow-xl transition-all duration-300 group">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-xs uppercase tracking-[0.22em] font-extrabold text-[#1d3f9a] font-sans flex items-center gap-2">
                    <Building size={16} />
                    <span>Hospitality</span>
                  </span>
                  <span className="text-xl font-black text-gray-300 font-heading">03</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-950 font-heading leading-tight">
                    Suites & Dining
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                    Delivering luxury serviced apartment living and skyline rooftop dining in central Colombo.
                  </p>
                </div>

                {/* Companies List with LARGE matched logos */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block">
                    Hospitality Properties:
                  </span>
                  <div className="space-y-3">
                    {hospitalityCompanies.map((c) => {
                      const logo = getCompanyLogo(c);
                      return (
                        <Link
                          key={c.id}
                          to={`/companies/${c.id}`}
                          className="flex items-center justify-between p-3 sm:p-3.5 bg-slate-50 hover:bg-white hover:border-[#1d3f9a] border border-gray-200 transition-all duration-200 group/item shadow-xs"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white p-1.5 border border-gray-200 flex items-center justify-center shrink-0 shadow-xs">
                              <img src={logo} alt={c.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm sm:text-base font-bold text-gray-950 font-heading group-hover/item:text-[#1d3f9a] transition-colors truncate">
                                {c.shortName || c.name}
                              </h4>
                              <span className="text-[11px] text-gray-500 font-normal truncate block mt-0.5">
                                {c.consumerBrand || "Area 56 Rooftop Lounge"}
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-gray-400 group-hover/item:text-[#1d3f9a] group-hover/item:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-950 font-sans">40 Suites & Pool</span>
                <Link to="/companies/supun-arcade-residency" className="text-xs font-bold text-[#1d3f9a] hover:underline inline-flex items-center gap-1">
                  <span>Explore Property</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Pillar 04: The Camy Brand */}
            <div className="bg-[#070b16] text-white p-7 sm:p-8 border border-gray-800 shadow-sm flex flex-col justify-between hover:border-[#8dc53e] hover:shadow-2xl transition-all duration-300 group">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs uppercase tracking-[0.22em] font-extrabold text-[#8dc53e] font-sans flex items-center gap-2">
                    <Sparkles size={16} />
                    <span>The Camy Brand</span>
                  </span>
                  <span className="text-xl font-black text-gray-700 font-heading">04</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-bold tracking-tight text-white font-heading leading-tight">
                    Consumer Durables
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                    Sri Lanka’s home-grown durables brand—helmets, PU footwear, cookware & appliances.
                  </p>
                </div>

                {/* Companies List with LARGE matched logos */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block">
                    Camy Brand Plants:
                  </span>
                  <div className="space-y-3">
                    {camyBrandCompanies.map((c) => {
                      const logo = getCompanyLogo(c);
                      return (
                        <Link
                          key={c.id}
                          to={`/companies/${c.id}`}
                          className="flex items-center justify-between p-3 sm:p-3.5 bg-white/5 hover:bg-white/15 hover:border-[#8dc53e] border border-white/10 transition-all duration-200 group/item shadow-xs"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                              <img src={logo} alt={c.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm sm:text-base font-bold text-white font-heading group-hover/item:text-[#8dc53e] transition-colors truncate">
                                {c.shortName || c.name}
                              </h4>
                              <span className="text-[11px] text-gray-400 font-normal truncate block mt-0.5">
                                {c.consumerBrand || "Camy Brand"}
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-gray-400 group-hover/item:text-[#8dc53e] group-hover/item:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-[#8dc53e] font-sans">National Brand</span>
                <Link to="/camy-products" className="text-xs font-bold text-[#8dc53e] hover:underline inline-flex items-center gap-1">
                  <span>Explore Camy</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: LEADERSHIP TEAM
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#1d3f9a] block">
                Board of Directors & Executives
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-950 font-heading">
                Leadership Team
              </h2>
            </div>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl font-normal">
              Experienced leaders combining deep technical knowledge, industrial governance, and long-term market vision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadershipTeam.map((leader) => (
              <div
                key={leader.id}
                className="bg-slate-50 p-8 border border-gray-200 flex flex-col justify-between hover:border-[#1d3f9a] hover:bg-white hover:shadow-xl transition-all group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-[#1d3f9a] text-white flex items-center justify-center font-bold text-lg font-heading">
                    {leader.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-950 font-heading group-hover:text-[#1d3f9a] transition-colors">
                      {leader.name}
                    </h3>
                    <p className="text-xs font-bold text-[#1d3f9a] uppercase tracking-wider mt-1">
                      {leader.title}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed font-normal">
                    {leader.oneLiner}
                  </p>
                </div>
                {leader.description && (
                  <div className="pt-4 mt-4 border-t border-gray-200 text-xs text-gray-500 italic">
                    {leader.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: VISION & MISSION
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 bg-slate-50 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-white p-10 sm:p-14 border border-gray-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-[#1d3f9a]/10 text-[#1d3f9a] flex items-center justify-center">
                  <Lightbulb size={28} />
                </div>
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1d3f9a] block">
                    Our Corporate Vision
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-950 font-heading">
                    Innovate. Unleash and Excel.
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
                    To unleash the potential within us to transform markets through innovation and exceed people's expectations for a better tomorrow, through goods and services that empower and enrich the lives of Sri Lankans.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Strategic Creed
              </div>
            </div>

            {/* Mission */}
            <div className="bg-white p-10 sm:p-14 border border-gray-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-[#1d3f9a]/10 text-[#1d3f9a] flex items-center justify-center">
                  <Award size={28} />
                </div>
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1d3f9a] block">
                    Our Corporate Mission
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-950 font-heading">
                    Quality & Sustainability
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
                    To harness superior thinking in the creation of products and services that functionally enhance the livelihood of people, while remaining committed to sustainable practices and delivering exceptional stakeholder value.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Core Purpose
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: OUR JOURNEY (10 MILESTONES)
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1d3f9a] block">
              1978 to Present
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-950 font-heading">
              Our Journey
            </h2>
            <p className="text-base sm:text-lg text-gray-600 font-normal">
              Chronological evolution from Colombo household trading to a diversified national manufacturing powerhouse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {journeyMilestones.map((milestone, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-6 sm:p-7 border border-gray-200 flex flex-col justify-between hover:border-[#1d3f9a] hover:bg-white hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-[#1d3f9a] font-heading">
                    {milestone.year}
                  </div>
                  <h4 className="text-base font-bold text-gray-950 font-heading">
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    {milestone.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Step 0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: CORE VALUES
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 bg-slate-50 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1d3f9a] block">
              Guiding Principles
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-950 font-heading">
              Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="bg-white p-8 sm:p-10 border border-gray-200 shadow-sm flex flex-col justify-between space-y-6 hover:border-[#1d3f9a] transition-all"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-[#1d3f9a]/10 text-[#1d3f9a] flex items-center justify-center">
                    <val.icon size={24} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 font-heading">
                    {val.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                    {val.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Value 0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM CTA (NAVY BRAND STYLE)
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 bg-[#0d235e] text-white text-center">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 max-w-4xl space-y-8">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8dc53e] block">
              The Conglomerate Directory
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-heading">
              Explore Our 10 Subsidiary Enterprises
            </h2>
          </div>
          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto font-normal leading-relaxed">
            View detailed manufacturing capabilities, product ranges, and corporate contacts across all business divisions.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/companies"
              className="inline-flex items-center justify-center gap-3 bg-[#8dc53e] hover:bg-[#7cb332] text-gray-950 font-bold text-base px-10 py-4 rounded-none transition-all shadow-xl"
            >
              <span>View Companies Directory</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-base px-10 py-4 rounded-none transition-all"
            >
              <span>Contact Corporate Office</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
