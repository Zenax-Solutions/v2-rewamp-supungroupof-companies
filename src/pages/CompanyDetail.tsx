import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Factory,
  ShoppingBag,
  Building,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  FileText,
  Download,
  Image as ImageIcon
} from "lucide-react";
import { companiesAPI, brandsAPI, type Company, type Brand, getFileUrl } from "@/services/api";
import { companies as fallbackCompanies } from "@/data/companies";
import { camyProducts } from "@/data/camyProducts";
import camyLogo from "@/assets/camy-logo.png";
import supunLogo from "@/assets/supun-group-of-companies-logo.png";
import heroCorporate from "@/assets/hero-corporate.jpg";
import Seo, { SITE_URL } from "@/components/Seo";

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCompanyData(id);
    }
  }, [id]);

  const loadCompanyData = async (companyId: string) => {
    try {
      const [compData, brandData] = await Promise.allSettled([
        companiesAPI.getById(companyId),
        brandsAPI.getAll()
      ]);
      if (compData.status === "fulfilled" && compData.value) {
        setCompany(compData.value);
      } else {
        const found = fallbackCompanies.find((c) => c.id === companyId);
        if (found) {
          setCompany(found as unknown as Company);
        }
      }
      if (brandData.status === "fulfilled" && brandData.value) {
        setBrandsList(brandData.value);
      }
    } catch (err) {
      console.warn("Backend getById fallback:", err);
      const found = fallbackCompanies.find((c) => c.id === companyId);
      if (found) {
        setCompany(found as unknown as Company);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getCompanyLogo = (comp: Company | any) => {
    if (comp.imageUrl) {
      return getFileUrl(comp.imageUrl);
    }
    const matchedBrand = brandsList.find(b =>
      (b.name && comp.consumerBrand && b.name.toLowerCase().includes(comp.consumerBrand.toLowerCase())) ||
      (b.name && comp.name && comp.name.toLowerCase().includes(b.name.toLowerCase())) ||
      (b.name && comp.id && comp.id.toLowerCase().includes(b.name.toLowerCase()))
    );
    if (matchedBrand?.logoUrl) {
      return getFileUrl(matchedBrand.logoUrl);
    }
    const isCamy = ["camy-smart", "new-camy-smart", "aero-star", "fuji-industries", "rodsons", "camy-global", "supun-aerosoft"].includes(comp.id) ||
                   (comp.consumerBrand && comp.consumerBrand.toLowerCase().includes("camy"));
    if (isCamy) return camyLogo;
    return supunLogo;
  };

  if (!company) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 font-heading mb-4">
          Company Profile Not Found
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          The requested subsidiary company profile could not be located in our directory.
        </p>
        <Link
          to="/companies"
          className="bg-[#1d3f9a] hover:bg-[#152e72] text-white font-bold px-8 py-3.5 rounded-none uppercase tracking-wider text-xs transition-colors"
        >
          Return to Companies Directory
        </Link>
      </div>
    );
  }

  const features = Array.isArray(company.features)
    ? company.features
    : typeof company.features === "string"
    ? JSON.parse(company.features)
    : [];

  const gallery = Array.isArray(company.gallery)
    ? company.gallery
    : typeof company.gallery === "string"
    ? JSON.parse(company.gallery)
    : [];

  const logoUrl = getCompanyLogo(company);
  const catalogPdfUrl = getFileUrl(company.catalogPdf);
  const relatedProducts = camyProducts.filter((p) => p.companyId === company.id);

  return (
    <div className="w-full bg-white text-gray-950 font-sans selection:bg-[#1d3f9a] selection:text-white">
      <Seo
        title={`${company.name} | Supun Group of Companies`}
        description={company.description}
        canonical={`${SITE_URL}/companies/${company.id}`}
      />

      {/* =========================================================================
          HERO BANNER: EDITORIAL LARGE TYPOGRAPHY
         ========================================================================= */}
      <section className="relative w-full pt-36 sm:pt-44 pb-20 lg:pb-28 bg-[#070b16] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroCorporate}
            alt="Company Background"
            className="w-full h-full object-cover opacity-15 filter brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-[#070b16]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="max-w-4xl space-y-6">
            <Link
              to="/companies"
              className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#8dc53e] hover:underline transition-colors"
            >
              <ArrowLeft size={14} /> Back to Companies Directory
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-[#1d3f9a] text-white text-xs font-bold px-3.5 py-1.5 uppercase tracking-wider font-sans">
                {company.industry}
              </span>
              {company.established && (
                <span className="bg-white/10 text-gray-300 text-xs font-bold px-3.5 py-1.5 border border-white/20 uppercase tracking-wider">
                  Est. {company.established}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-heading leading-[1.08]">
              {company.name}
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-normal leading-relaxed">
              "{company.description}"
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN CONTENT & METADATA GRID
         ========================================================================= */}
      <section className="w-full py-20 sm:py-28 bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Full Description & Features */}
            <div className="lg:col-span-8 space-y-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#1d3f9a] block mb-2">
                  Executive Overview
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-950 font-heading mb-6">
                  About {company.shortName}
                </h2>
                <div className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed space-y-6 font-normal">
                  <p>{company.fullDescription}</p>
                </div>
              </div>

              {/* Key Features / Capabilities */}
              {features.length > 0 && (
                <div className="p-8 sm:p-10 bg-slate-50 border border-gray-200 space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#8dc53e]" />
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-950 font-heading">
                      Key Capabilities & Operations
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 bg-white p-5 border border-gray-200 shadow-xs">
                        <CheckCircle size={18} className="text-[#1d3f9a] shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-gray-800 leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Facility & Operations Gallery */}
              {gallery.length > 0 && (
                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#8dc53e]" />
                    <h3 className="text-2xl font-bold text-gray-950 font-heading">
                      Facility & Production Gallery
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {gallery.map((img: string, idx: number) => {
                      const src = getFileUrl(img);
                      return (
                        <div key={idx} className="aspect-square bg-slate-100 border border-gray-200 overflow-hidden group">
                          <img
                            src={src || ""}
                            alt={`${company.name} Gallery ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Product Catalog PDF */}
              {catalogPdfUrl && (
                <div className="p-7 bg-[#1d3f9a]/5 border border-[#1d3f9a]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1d3f9a] text-white flex items-center justify-center shrink-0">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-950 text-base font-heading">Official Product Catalog</h4>
                      <p className="text-xs text-gray-600">Download official specifications and product catalog</p>
                    </div>
                  </div>
                  <a
                    href={catalogPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#1d3f9a] hover:bg-[#152e72] text-white text-xs font-bold px-6 py-3.5 rounded-none uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <Download size={14} /> Download PDF
                  </a>
                </div>
              )}

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="space-y-6 pt-6">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-950 font-heading">
                    Manufactured Product Lines
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedProducts.map((product) => (
                      <div key={product.id} className="p-7 bg-slate-50 border border-gray-200 space-y-3 hover:border-[#1d3f9a] transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1d3f9a] uppercase">{product.category}</span>
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5">{product.note}</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-950 font-heading">{product.name}</h4>
                        <p className="text-xs text-gray-600 font-normal leading-relaxed">{product.description}</p>
                        <a
                          href={product.buyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d3f9a] hover:underline uppercase pt-2"
                        >
                          <span>Buy on Anythingatsupun.lk</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Company Info & Contact Card */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-[#070b16] text-white p-8 sm:p-9 border border-gray-800 shadow-xl space-y-6">
                {/* Large Logo Showcase */}
                <div className="p-4 bg-white/5 border border-white/10 flex items-center justify-center">
                  <img
                    src={logoUrl}
                    alt={company.name}
                    className="h-20 sm:h-24 w-auto max-w-[240px] object-contain"
                  />
                </div>

                <div className="border-b border-white/10 pb-4">
                  <span className="text-xs font-bold text-[#8dc53e] uppercase tracking-widest block">
                    Enterprise Profile
                  </span>
                  <h3 className="text-2xl font-bold text-white font-heading mt-1">
                    {company.shortName}
                  </h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-gray-400 font-bold uppercase tracking-wider block">Legal Entity</span>
                    <span className="text-white font-semibold text-sm">{company.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold uppercase tracking-wider block">Sector</span>
                    <span className="text-white font-semibold text-sm">{company.industry}</span>
                  </div>
                  {company.established && (
                    <div>
                      <span className="text-gray-400 font-bold uppercase tracking-wider block">Established Year</span>
                      <span className="text-white font-semibold text-sm">{company.established}</span>
                    </div>
                  )}
                </div>

                {/* Direct Contact Details */}
                {(company.phone || company.hotline || company.email || company.website || company.googleMapsLink) && (
                  <div className="pt-4 border-t border-white/10 space-y-3 text-xs">
                    <span className="text-xs font-bold text-[#8dc53e] uppercase tracking-widest block">
                      Direct Inquiries
                    </span>
                    {(company.phone || company.hotline) && (
                      <div className="flex items-center gap-2 text-gray-200">
                        <Phone size={14} className="text-[#8dc53e]" />
                        <span>{company.phone || company.hotline}</span>
                      </div>
                    )}
                    {company.email && (
                      <div className="flex items-center gap-2 text-gray-200">
                        <Mail size={14} className="text-[#8dc53e]" />
                        <span>{company.email}</span>
                      </div>
                    )}
                    {company.googleMapsLink && (
                      <div className="pt-1">
                        <a
                          href={company.googleMapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8dc53e] hover:underline flex items-center gap-1 font-bold"
                        >
                          <MapPin size={14} /> View Location on Maps
                        </a>
                      </div>
                    )}
                    {company.website && (
                      <div className="pt-2">
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#1d3f9a] hover:bg-[#152e72] text-white text-xs font-bold px-4 py-3 rounded-none uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                          <span>Visit Digital Store</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* General Inquiries */}
              <div className="p-7 bg-slate-50 border border-gray-200 space-y-4">
                <h4 className="text-base font-bold text-gray-950 font-heading">
                  Have a Business Inquiry?
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Contact our group corporate headquarters for partnerships, dealership inquiries, or corporate orders.
                </p>
                <Link
                  to="/contact"
                  className="block w-full text-center bg-gray-950 hover:bg-[#1d3f9a] text-white text-xs font-bold py-3.5 rounded-none uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Contact Corporate Office
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyDetail;
