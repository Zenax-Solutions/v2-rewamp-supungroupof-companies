import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Filter,
  Package,
  Layers,
  Factory,
  HelpCircle,
  Loader2,
  ChevronRight
} from "lucide-react";
import { productsAPI, categoriesAPI, type Product, type Category, getFileUrl } from "@/services/api";
import { camyProducts as fallbackProducts, type CamyProduct } from "@/data/camyProducts";
import camyLogo from "@/assets/camy-logo.png";
import heroManufacturing from "@/assets/hero-manufacturing.jpg";
import Seo, { SITE_URL } from "@/components/Seo";

const CamyProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<CamyProduct[]>(fallbackProducts);
  const [categoriesList, setCategoriesList] = useState<string[]>([
    "All",
    "Safety & Riding",
    "Cookware",
    "Appliances",
    "Cooling & Air",
    "Home & Electronics"
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDatabaseProducts();
  }, []);

  const loadDatabaseProducts = async () => {
    try {
      const [dbProducts, dbCategories] = await Promise.allSettled([
        productsAPI.getAll(),
        categoriesAPI.getAll()
      ]);

      if (dbCategories.status === "fulfilled" && dbCategories.value.length > 0) {
        const catNames = ["All", ...dbCategories.value.map((c: Category) => c.name)];
        setCategoriesList(catNames);
      }

      if (dbProducts.status === "fulfilled" && dbProducts.value.length > 0) {
        const mapped: CamyProduct[] = dbProducts.value.map((p: Product) => ({
          id: p.slug || String(p.id),
          name: p.title,
          madeBy: p.categoryName?.includes("Cooling") ? "Fuji Industries" : p.categoryName?.includes("Safety") ? "Camy Smart" : p.categoryName?.includes("Cookware") ? "New Camy Smart" : "Aero Star",
          companyId: "camy-smart",
          category: (p.categoryName || "Appliances") as any,
          note: p.categoryName?.includes("Safety") ? "SLS 517 Certified" : "100% Sri Lankan",
          description: p.shortDescription || p.longDescription || "Quality consumer durable product manufactured in Sri Lanka.",
          buyUrl: "https://www.anythingatsupun.lk",
          features: [
            "100% Made in Sri Lanka",
            "Backed by Supun Group Warranty",
            "Islandwide service support"
          ]
        }));
        setProducts(mapped);
      }
    } catch (err) {
      console.warn("Using fallback Camy products data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="w-full bg-white text-gray-950 font-sans selection:bg-[#1d3f9a] selection:text-white">
      <Seo
        title="Camy Products | 100% Made in Sri Lanka Consumer Durables"
        description="Explore the Camy family portfolio: SLS 517 certified motorcycle safety helmets, non-stick cookware, air conditioners, fans, and home appliances."
        canonical={`${SITE_URL}/camy-products`}
      />

      {/* =========================================================================
          HERO BANNER: EDITORIAL LARGE TYPOGRAPHY
         ========================================================================= */}
      <section className="relative w-full pt-36 sm:pt-44 pb-20 lg:pb-32 bg-[#070b16] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroManufacturing}
            alt="Manufacturing Facility"
            className="w-full h-full object-cover opacity-20 filter brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-[#070b16]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#8dc53e]" />
              <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-[#8dc53e]">
                100% Manufactured in Sri Lanka
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white font-heading leading-[1.05]">
              The Camy <br />
              <span className="text-[#8dc53e]">Product Portfolio.</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed font-normal">
              Manufacturing Sri Lanka's trusted consumer durables—from SLS 517 certified motorcycle helmets to non-stick cookware and cooling appliances built in dedicated domestic factories.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider">
              <span className="bg-white/10 px-4 py-2 border border-white/20 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#8dc53e]" /> SLS 517 Certified Safety
              </span>
              <span className="bg-white/10 px-4 py-2 border border-white/20 flex items-center gap-2">
                <Factory size={16} className="text-[#8dc53e]" /> In-House Tooling & Casting
              </span>
              <span className="bg-white/10 px-4 py-2 border border-white/20 flex items-center gap-2">
                <ExternalLink size={16} className="text-[#8dc53e]" /> Available on Anythingatsupun.lk
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: THE CAMY STORY NARRATIVE
         ========================================================================= */}
      <section className="w-full py-20 sm:py-24 bg-slate-50 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#1d3f9a] block">
                The Camy Family Story
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-950 font-heading">
                Self-Reliance Through Domestic Engineering
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
                What began as specialized plastic moulding and precision chrome plating has evolved into an integrated family of consumer durables. Under the Camy brand, Supun Group unites <strong>Rodsons</strong> (tooling & polymer injection), <strong>Aero Star</strong> (chrome & appliances), <strong>Camy Smart</strong> (helmets), <strong>New Camy Smart</strong> (cookware), <strong>Fuji Industries</strong> (cooling systems), and <strong>Camy Global</strong> (islandwide logistics).
              </p>
            </div>

            <div className="lg:col-span-4 p-8 bg-white border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <img src={camyLogo} alt="Camy" className="h-6 w-auto object-contain" />
                <h3 className="text-base font-bold text-gray-950 font-heading">
                  Direct Online Ordering
                </h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                Every genuine Camy product is available for islandwide delivery or gifting via the Group's official e-commerce store.
              </p>
              <a
                href="https://www.anythingatsupun.lk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#1d3f9a] hover:bg-[#152e72] text-white text-xs font-bold px-6 py-3.5 rounded-none uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Visit Anythingatsupun.lk</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CATEGORY FILTER TABS & PRODUCT LISTINGS
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-14 border-b border-gray-200">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#1d3f9a] text-white shadow-lg"
                    : "bg-slate-50 text-gray-700 hover:bg-slate-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 p-8 sm:p-9 shadow-sm flex flex-col justify-between hover:border-[#1d3f9a] hover:shadow-xl transition-all duration-300 group"
              >
                <div className="space-y-5">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-xs font-bold text-[#1d3f9a] bg-[#1d3f9a]/10 px-3 py-1 uppercase tracking-wider font-sans">
                      {product.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle size={12} /> {product.note}
                    </span>
                  </div>

                  {/* Product Title */}
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-gray-950 font-heading group-hover:text-[#1d3f9a] transition-colors leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-semibold">
                      Manufactured by: <span className="text-gray-950 font-bold">{product.madeBy}</span>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed font-normal line-clamp-3">
                    {product.description}
                  </p>

                  {/* Feature Highlights */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    {product.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="text-xs text-gray-700 flex items-center gap-2.5 font-medium">
                        <span className="w-1.5 h-1.5 bg-[#8dc53e] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase Button CTA */}
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <a
                    href={product.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gray-950 hover:bg-[#1d3f9a] text-white text-xs font-bold py-3.5 px-4 rounded-none transition-colors uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Purchase on Anythingatsupun.lk</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: CERTIFICATION & MANUFACTURING STANDARDS
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 bg-slate-50 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 text-center max-w-4xl space-y-6">
          <div className="w-16 h-16 bg-[#1d3f9a]/10 text-[#1d3f9a] flex items-center justify-center mx-auto">
            <ShieldCheck size={36} />
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-950 font-heading">
            Quality You Can Rely On
          </h2>
          <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-normal max-w-3xl mx-auto">
            Every product bearing the Camy seal undergoes multi-point impact testing, non-stick surface thermal durability analysis, and precision quality validation.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#1d3f9a] hover:bg-[#152e72] text-white font-bold text-sm px-10 py-4.5 rounded-none uppercase tracking-wider transition-all shadow-xl"
            >
              <span>Inquire for Wholesale Distributorship</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CamyProducts;
