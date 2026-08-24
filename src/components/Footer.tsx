import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import logo from "@/assets/supun-group-of-companies-logo.png";
import footerEnterpriseVector from "@/assets/footer-enterprise-vector.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white text-gray-900 relative overflow-hidden font-sans border-t border-gray-200">
      {/* Mobile-Only Background Graphic Overlay: Centered Extra Large Placement */}
      <div className="md:hidden absolute inset-x-0 bottom-0 pointer-events-none z-0 overflow-hidden w-full h-full flex items-end justify-center">
        <img
          src={footerEnterpriseVector}
          alt=""
          className="max-w-none w-[780px] h-auto object-contain object-bottom opacity-[0.40] mix-blend-multiply select-none translate-y-4"
        />
      </div>

      {/* Large Screen / Desktop Background Graphic: Original Unchanged Layout */}
      <div className="hidden md:flex absolute right-0 bottom-0 pointer-events-none z-0 overflow-hidden w-full h-full items-end justify-end">
        <div className="relative w-[700px] sm:w-[950px] lg:w-[1350px] xl:w-[1600px] 2xl:w-[1850px] max-h-full opacity-[0.20] lg:opacity-[0.26] select-none translate-x-10 sm:translate-x-16 translate-y-4 sm:translate-y-8 [mask-image:linear-gradient(to_left,black_55%,transparent_98%)]">
          <img
            src={footerEnterpriseVector}
            alt=""
            className="w-full h-auto max-h-[850px] lg:max-h-[950px] object-contain object-right-bottom filter contrast-110"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-20 pb-12">
        {/* Top Hero Statement: Large Editorial Font */}
        <div className="pb-16 border-b border-gray-200 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#1d3f9a] font-bold block font-sans">
              Supun Group of Companies • Since 1978
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-950 tracking-tight leading-[1.08] font-heading">
              Shaping Sri Lanka’s Industrial Horizon.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-[#1d3f9a] hover:bg-[#163077] text-white font-bold text-base px-8 py-4 rounded-none transition-all duration-300 shadow-lg hover:shadow-xl group font-sans"
            >
              <span>Connect With Us</span>
              <ArrowUpRight size={20} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>

        {/* Middle Section: Clean Large Columns with Razor Sharp Contrast */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 border-b border-gray-200">
          {/* Col 1: Brand & Synopsis (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt="Supun Group of Companies"
                className="h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-900 text-base leading-relaxed max-w-md font-medium font-sans">
              A diversified Sri Lankan conglomerate driving manufacturing excellence, commercial innovation, and sustainable multi-sector growth across ten operating enterprises.
            </p>
            <div className="pt-2 text-sm text-gray-800 space-y-1.5 font-sans font-semibold">
              <p>SLS 517 Certified Safety Manufacturing</p>
              <p>6 Production Facilities Across Sri Lanka</p>
            </div>
          </div>

          {/* Col 2: Operating Sectors (3 Cols) */}
          <div className="lg:col-span-3 space-y-5">
            <h3 className="text-xs uppercase tracking-[0.22em] font-extrabold text-[#1d3f9a] font-sans flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#8dc53e] shrink-0" />
              <span>Key Sectors</span>
            </h3>
            <div className="flex flex-col space-y-3.5 text-base font-sans">
              <Link to="/companies" className="text-gray-950 hover:text-[#1d3f9a] font-semibold transition-colors">
                Industrial Manufacturing
              </Link>
              <Link to="/companies/supun-aerosoft" className="text-gray-950 hover:text-[#1d3f9a] font-semibold transition-colors">
                PU Footwear & Molding
              </Link>
              <Link to="/companies/supun-super-center" className="text-gray-950 hover:text-[#1d3f9a] font-semibold transition-colors">
                Retail & Islandwide Distribution
              </Link>
              <Link to="/companies/supun-arcade-residency" className="text-gray-950 hover:text-[#1d3f9a] font-semibold transition-colors">
                Luxury Hospitality & Living
              </Link>
              <Link to="/companies/ymac-technologies" className="text-gray-950 hover:text-[#1d3f9a] font-semibold transition-colors">
                Smart Systems & IoT Energy
              </Link>
            </div>
          </div>

          {/* Col 3: Quick Links & Governance (2 Cols) */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-xs uppercase tracking-[0.22em] font-extrabold text-[#1d3f9a] font-sans flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#8dc53e] shrink-0" />
              <span>Corporate</span>
            </h3>
            <div className="flex flex-col space-y-3.5 text-base font-sans">
              <Link to="/about" className="text-gray-950 hover:text-[#1d3f9a] font-semibold transition-colors">
                About the Group
              </Link>
              <Link to="/about" className="text-gray-950 hover:text-[#1d3f9a] font-semibold transition-colors">
                Leadership
              </Link>
              <Link to="/camy-products" className="text-gray-950 hover:text-[#1d3f9a] font-semibold transition-colors">
                The Camy Brand
              </Link>
              <Link to="/companies" className="text-gray-950 hover:text-[#1d3f9a] font-semibold transition-colors">
                10 Enterprises
              </Link>
              <Link to="/careers" className="text-gray-950 hover:text-[#1d3f9a] font-semibold transition-colors">
                Careers & Culture
              </Link>
              <a
                href="https://anythingatsupun.lk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-950 hover:text-[#1d3f9a] font-semibold transition-colors inline-flex items-center gap-1.5"
              >
                <span>Store</span>
                <ExternalLink size={13} className="text-gray-600" />
              </a>
              <Link to="/contact" className="text-gray-950 hover:text-[#1d3f9a] font-semibold transition-colors">
                Contact Directory
              </Link>
            </div>
          </div>

          {/* Col 4: Corporate Office Direct (3 Cols) */}
          <div className="lg:col-span-3 space-y-5">
            <h3 className="text-xs uppercase tracking-[0.22em] font-extrabold text-[#1d3f9a] font-sans flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#8dc53e] shrink-0" />
              <span>Headquarters</span>
            </h3>
            <div className="space-y-4 text-base text-gray-950 font-sans">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#1d3f9a] mt-1 shrink-0" />
                <span className="leading-relaxed font-medium">
                  Supun Group of Companies,<br />
                  Colombo, Sri Lanka
                </span>
              </div>
              <div className="pt-2 space-y-2.5 border-t border-gray-200">
                <a
                  href="mailto:info@supungroup.lk"
                  className="flex items-center gap-3 text-gray-950 hover:text-[#1d3f9a] transition-colors"
                >
                  <Mail size={16} className="text-[#1d3f9a] shrink-0" />
                  <span className="text-sm font-semibold">info@supungroup.lk</span>
                </a>
                <a
                  href="tel:+94112055026"
                  className="flex items-center gap-3 text-gray-950 hover:text-[#1d3f9a] transition-colors"
                >
                  <Phone size={16} className="text-[#1d3f9a] shrink-0" />
                  <span className="text-sm font-semibold">+94 112 055 026</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 font-sans">
          <p>© {currentYear} Supun Group of Companies. All rights reserved.</p>

          <div className="text-xs text-gray-500">
            Developed by{" "}
            <a
              href="https://www.zenax.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 hover:text-[#1d3f9a] font-bold transition-colors underline inline-flex items-center gap-1"
            >
              <span>Zenax Web Solutions™</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

