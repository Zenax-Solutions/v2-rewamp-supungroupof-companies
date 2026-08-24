import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Factory,
  ShoppingBag,
  Building,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Loader2
} from "lucide-react";
import { companiesAPI, brandsAPI, type Company, type Brand, getFileUrl } from "@/services/api";
import { companies as fallbackCompanies } from "@/data/companies";
import camyLogo from "@/assets/camy-logo.png";
import supunLogo from "@/assets/supun-group-of-companies-logo.png";
import heroCorporate from "@/assets/hero-corporate.jpg";
import Seo, { SITE_URL } from "@/components/Seo";

const Companies = () => {
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [companiesList, setCompaniesList] = useState<Company[]>(fallbackCompanies as unknown as Company[]);
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
      console.warn("Using fallback companies data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCompanyLogo = (company: Company | any) => {
    if (company.imageUrl) {
      return getFileUrl(company.imageUrl);
    }
    const matchedBrand = brandsList.find(b =>
      (b.name && company.consumerBrand && b.name.toLowerCase().includes(company.consumerBrand.toLowerCase())) ||
      (b.name && company.name && company.name.toLowerCase().includes(b.name.toLowerCase())) ||
      (b.name && company.id && company.id.toLowerCase().includes(b.name.toLowerCase()))
    );
    if (matchedBrand?.logoUrl) {
      return getFileUrl(matchedBrand.logoUrl);
    }
    const isCamy = ["camy-smart", "new-camy-smart", "aero-star", "fuji-industries", "rodsons", "camy-global", "supun-aerosoft"].includes(company.id) ||
                   (company.consumerBrand && company.consumerBrand.toLowerCase().includes("camy"));
    if (isCamy) return camyLogo;
    return supunLogo;
  };

  const sectors = ["All", "Manufacturing", "Retail & Distribution", "Hospitality"];

  const filteredCompanies = selectedSector === "All"
    ? companiesList
    : companiesList.filter((c) => {
        const sector = c.industry || (c as any).sector || "";
        if (selectedSector === "Manufacturing") {
          return sector.includes("Manufacturing");
        }
        if (selectedSector === "Retail & Distribution") {
          return sector.includes("Retail") || sector.includes("Wholesale") || sector.includes("Distribution");
        }
        if (selectedSector === "Hospitality") {
          return sector.includes("Hospitality");
        }
        return sector === selectedSector;
      });

  return (
    <div className="w-full bg-white text-gray-950 font-sans selection:bg-[#1d3f9a] selection:text-white">
      <Seo
        title="Our Companies | 10 Subsidiaries of Supun Group"
        description="Explore the 10 subsidiary enterprises of Supun Group spanning industrial manufacturing, nationwide distribution, retail, and luxury hospitality."
        canonical={`${SITE_URL}/companies`}
      />

      {/* =========================================================================
          HERO BANNER: EDITORIAL LARGE TYPOGRAPHY
         ========================================================================= */}
      <section className="relative w-full pt-36 sm:pt-44 pb-20 lg:pb-32 bg-[#070b16] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroCorporate}
            alt="Corporate Enterprises"
            className="w-full h-full object-cover opacity-20 filter brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-[#070b16]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#8dc53e]" />
              <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-[#8dc53e]">
                Ten Subsidiary Enterprises • Established 1978
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white font-heading leading-[1.05]">
              Group & Brand <br />
              <span className="text-[#8dc53e]">Hierarchy.</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed font-normal">
              A diversified industrial portfolio spanning heavy manufacturing, precision tooling, nationwide retail distribution, and luxury hospitality.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTOR FILTER TABS & COMPANY GRID
         ========================================================================= */}
      <section className="w-full py-20 sm:py-28 bg-slate-50 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          {/* Sector Filter Tabs */}
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-4 mb-10 sm:mb-14 border-b border-gray-200">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-5 sm:px-8 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedSector === sector
                    ? "bg-[#1d3f9a] text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {sector} {sector === "All" ? `(${companiesList.length})` : ""}
              </button>
            ))}
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-10">
            {filteredCompanies.map((company, index) => {
              const features = Array.isArray(company.features)
                ? company.features
                : typeof company.features === "string"
                ? JSON.parse(company.features)
                : [];

              const logo = getCompanyLogo(company);

              return (
                <div
                  key={company.id}
                  className="bg-white p-6 sm:p-8 md:p-9 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-[#1d3f9a] hover:shadow-xl transition-all duration-300 group overflow-hidden"
                >
                  <div className="space-y-6">
                    {/* Header Bar */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <span className="text-xs font-bold text-[#1d3f9a] bg-[#1d3f9a]/10 px-3 py-1 uppercase tracking-wider font-sans">
                        {company.industry}
                      </span>
                      <span className="text-sm font-extrabold text-gray-400 font-heading">
                        {company.established ? `Est. ${company.established}` : `0${index + 1}`}
                      </span>
                    </div>

                    {/* Prominent Large Logo Box */}
                    <div className="flex items-center gap-4 sm:gap-5 pt-1 min-w-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 border border-gray-200 p-2 sm:p-2.5 flex items-center justify-center shrink-0 group-hover:border-[#1d3f9a]/40 transition-colors shadow-xs overflow-hidden">
                        <img
                          src={logo}
                          alt={company.name}
                          className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 font-heading group-hover:text-[#1d3f9a] transition-colors leading-tight">
                          {company.shortName || company.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-semibold truncate">
                          {(company as any).consumerBrand || company.name}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed font-normal line-clamp-3">
                      {company.description}
                    </p>

                    {/* Key Highlights List */}
                    {features.length > 0 && (
                      <div className="pt-4 border-t border-gray-100 space-y-2.5">
                        <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest block">
                          Key Capabilities
                        </span>
                        {features.slice(0, 3).map((feature: string, i: number) => (
                          <div key={i} className="text-xs text-gray-700 flex items-start gap-2.5 font-medium">
                            <span className="w-1.5 h-1.5 bg-[#8dc53e] mt-1.5 shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Contact Snippet */}
                    {(company.phone || (company as any).location) && (
                      <div className="pt-3 text-xs text-gray-500 space-y-1.5">
                        {company.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={13} className="text-[#1d3f9a] shrink-0" />
                            <span>{company.phone}</span>
                          </div>
                        )}
                        {(company as any).location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={13} className="text-[#1d3f9a] shrink-0" />
                            <span className="truncate">{(company as any).location}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Link */}
                  <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {company.website ? "Digital Hub" : "Subsidiary"}
                    </span>
                    <Link
                      to={`/companies/${company.id}`}
                      className="inline-flex items-center gap-1.5 bg-[#1d3f9a] hover:bg-[#152e72] text-white text-xs font-bold px-5 py-2.5 rounded-none uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                    >
                      <span>View Profile</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM SECTION: DIRECTORY ASSISTANCE
         ========================================================================= */}
      <section className="w-full py-20 sm:py-28 bg-[#0d235e] text-white text-center">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 max-w-3xl space-y-6">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8dc53e] block">
              Corporate Contacts & Factory Locations
            </span>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-heading">
              Need Division Direct Contacts?
            </h3>
          </div>
          <p className="text-base sm:text-lg text-white/80 font-normal leading-relaxed">
            Access our complete contact directory including factory addresses, commercial inquiries, and executive desk connections.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#8dc53e] hover:bg-[#7cb332] text-gray-950 font-bold text-sm px-9 py-4 rounded-none uppercase tracking-wider transition-all shadow-xl"
            >
              <span>View Contact & Division Directory</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Companies;
