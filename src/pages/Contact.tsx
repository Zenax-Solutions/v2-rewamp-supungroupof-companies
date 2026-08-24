import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Building2,
  CheckCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import heroCorporate from "@/assets/hero-corporate.jpg";
import Seo, { SITE_URL } from "@/components/Seo";

interface DirectoryItem {
  company: string;
  phone?: string;
  email?: string;
  location?: string;
  link?: string;
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const directory: DirectoryItem[] = [
    {
      company: "Supun Group (Corporate Headquarters)",
      phone: "+94 112 055 026",
      email: "info@supungroup.lk",
      location: "Colombo, Sri Lanka",
      link: "/about"
    },
    {
      company: "Supun Traders & Distributors",
      phone: "0112 433 784",
      location: "2nd Cross Street, Colombo 11",
      link: "/companies/supun-traders"
    },
    {
      company: "Supun Super Center",
      phone: "0112 504 920",
      location: "16 R.A. De Mel Mawatha, Colombo 00500",
      link: "/companies/supun-super-center"
    },
    {
      company: "Supun Arcade Residency",
      phone: "0112 055 040",
      email: "reservations@supunarcaderesidency.com",
      location: "56 Galle Road, Colombo 00600",
      link: "/companies/supun-arcade-residency"
    },
    {
      company: "Supun Aerosoft / YMAC Smart",
      phone: "011 2436390 / 077 0038414",
      email: "supunaerosoft318@gmail.com",
      location: "Kotahena, Colombo 13",
      link: "/companies/supun-aerosoft"
    },
    {
      company: "Aero Star (Home Appliances)",
      phone: "034 2262430",
      email: "aerostarhome@gmail.com",
      location: "Industrial Zone, Sri Lanka",
      link: "/companies/aero-star"
    },
    {
      company: "Camy Smart (SLS Safety Helmets)",
      location: "Horana Manufacturing Plant, Sri Lanka",
      link: "/companies/camy-smart"
    },
    {
      company: "Rodsons (Plastic Injection Tooling)",
      location: "In-house Tooling Facility, Sri Lanka",
      link: "/companies/rodsons"
    },
    {
      company: "New Camy Smart (Non-Stick Cookware)",
      phone: "011 2418724",
      location: "Advanced Korean Coating Facility, Sri Lanka",
      link: "/companies/new-camy-smart"
    },
    {
      company: "Fuji Industries (AC & Cooling Systems)",
      location: "Air Conditioning Plant, Sri Lanka",
      link: "/companies/fuji-industries"
    },
    {
      company: "Camy Global (Distribution Network)",
      location: "Islandwide Logistics Network",
      link: "/companies/camy-global"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields (Name, Email, Message)");
      return;
    }

    const subject = `Corporate Inquiry from ${formData.name} - ${formData.company || "General"}`;
    const body = `
Full Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}
Company Name: ${formData.company || "Not provided"}

Message:
${formData.message}

---
Sent via Supun Group of Companies Contact Portal
    `.trim();

    const mailtoLink = `mailto:info@supungroup.lk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    setIsSubmitted(true);
    toast.success("Opening your email client to send your message...");

    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: ""
      });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="w-full bg-white text-gray-950 font-sans selection:bg-[#1d3f9a] selection:text-white">
      <Seo
        title="Contact Us | Supun Group of Companies"
        description="Connect with Supun Group corporate office and individual subsidiary enterprises. Direct phone lines, addresses, and commercial inquiry portal."
        canonical={`${SITE_URL}/contact`}
      />

      {/* =========================================================================
          HERO BANNER: EDITORIAL LARGE TYPOGRAPHY
         ========================================================================= */}
      <section className="relative w-full pt-36 sm:pt-44 pb-20 lg:pb-32 bg-[#070b16] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroCorporate}
            alt="Corporate Offices"
            className="w-full h-full object-cover opacity-20 filter brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-[#070b16]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#8dc53e]" />
              <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-[#8dc53e]">
                Corporate Headquarters & Inquiries
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white font-heading leading-[1.05]">
              Contact <br />
              <span className="text-[#8dc53e]">Supun Group.</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed font-normal">
              Whether you are looking for manufacturing partnerships, wholesale dealership opportunities, or corporate inquiries, our team is at your service.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: CENTRAL CONTACT INFO & CONTACT FORM
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Central Contact Info Block */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#1d3f9a] block">
                  Headquarters
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-950 font-heading">
                  Corporate Office
                </h2>
                <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed">
                  Connect directly with our executive desk in Colombo for conglomerate-level inquiries.
                </p>
              </div>

              {/* Information Cards */}
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 border border-gray-200 flex items-start gap-5 hover:border-[#1d3f9a] transition-all">
                  <div className="w-12 h-12 bg-[#1d3f9a] text-white flex items-center justify-center shrink-0">
                    <Mail size={22} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Desk</div>
                    <a href="mailto:info@supungroup.lk" className="text-lg font-bold text-gray-950 hover:text-[#1d3f9a] transition-colors font-heading block mt-0.5">
                      info@supungroup.lk
                    </a>
                    <div className="text-xs text-gray-500 mt-0.5">Direct response within 24 business hours</div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border border-gray-200 flex items-start gap-5 hover:border-[#1d3f9a] transition-all">
                  <div className="w-12 h-12 bg-[#1d3f9a] text-white flex items-center justify-center shrink-0">
                    <Phone size={22} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Telephone Line</div>
                    <a href="tel:+94112055026" className="text-lg font-bold text-gray-950 hover:text-[#1d3f9a] transition-colors font-heading block mt-0.5">
                      +94 112 055 026
                    </a>
                    <div className="text-xs text-gray-500 mt-0.5">Central corporate telephone line</div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border border-gray-200 flex items-start gap-5 hover:border-[#1d3f9a] transition-all">
                  <div className="w-12 h-12 bg-[#1d3f9a] text-white flex items-center justify-center shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Head Office Location</div>
                    <div className="text-lg font-bold text-gray-950 font-heading mt-0.5">
                      Colombo, Sri Lanka
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">Primary Governance & Executive Center</div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border border-gray-200 flex items-start gap-5 hover:border-[#1d3f9a] transition-all">
                  <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center shrink-0">
                    <Clock size={22} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Operational Hours</div>
                    <div className="text-sm font-bold text-gray-950 mt-1">
                      Monday to Friday: 9:00 AM – 6:00 PM
                    </div>
                    <div className="text-xs font-semibold text-gray-700 mt-0.5">
                      Saturday: 9:00 AM – 1:00 PM • Sunday Closed
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7 bg-slate-50 p-8 sm:p-12 lg:p-14 border border-gray-200 shadow-sm">
              <div className="mb-8 space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#1d3f9a] block">
                  Send a Message
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-950 font-heading">
                  Corporate Inquiry Form
                </h3>
                <p className="text-sm text-gray-600 font-normal">
                  Please submit your inquiry and our corporate liaison desk will route it to the appropriate subsidiary.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ruwan Silva"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-gray-300 focus:border-[#1d3f9a] outline-none px-4 py-3.5 text-sm font-medium rounded-none transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ruwan@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-gray-300 focus:border-[#1d3f9a] outline-none px-4 py-3.5 text-sm font-medium rounded-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +94 77 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-gray-300 focus:border-[#1d3f9a] outline-none px-4 py-3.5 text-sm font-medium rounded-none transition-colors"
                    />
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Commercial Retailer / Partner"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-white border border-gray-300 focus:border-[#1d3f9a] outline-none px-4 py-3.5 text-sm font-medium rounded-none transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your requirements, manufacturing interest, wholesale inquiries, or partnership proposals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-gray-300 focus:border-[#1d3f9a] outline-none p-4 text-sm font-medium rounded-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1d3f9a] hover:bg-[#152e72] active:scale-[0.99] text-white font-bold text-sm py-4 px-8 rounded-none uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send size={18} />
                  <span>Send Message to Supun Group</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: PER-COMPANY DIRECTORY TABLE
         ========================================================================= */}
      <section className="w-full py-24 sm:py-32 bg-slate-50 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="max-w-3xl mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#1d3f9a] block">
              Complete Division Directory
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-950 font-heading">
              Per-Company Directory
            </h2>
            <p className="text-base sm:text-lg text-gray-600 font-normal">
              Direct contact coordinates for each operational plant, retail hub, and subsidiary under Supun Group.
            </p>
          </div>

          {/* Directory Table */}
          <div className="border border-gray-200 bg-white overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#070b16] text-white text-xs uppercase tracking-widest font-bold">
                  <th className="p-5">Company / Entity</th>
                  <th className="p-5">Phone</th>
                  <th className="p-5">Email</th>
                  <th className="p-5">Location</th>
                  <th className="p-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {directory.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-5 font-bold text-gray-950 font-heading">
                      {item.company}
                    </td>
                    <td className="p-5 text-gray-700 font-medium whitespace-nowrap">
                      {item.phone ? (
                        <a href={`tel:${item.phone.replace(/[^0-9+]/g, '')}`} className="text-[#1d3f9a] hover:underline font-semibold">
                          {item.phone}
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-5 text-gray-700 font-medium">
                      {item.email ? (
                        <a href={`mailto:${item.email}`} className="text-[#1d3f9a] hover:underline">
                          {item.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-5 text-gray-700 font-medium">
                      {item.location || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="p-5 text-right">
                      {item.link && (
                        <Link
                          to={item.link}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#1d3f9a] hover:underline uppercase tracking-wider"
                        >
                          <span>Profile</span>
                          <ChevronRight size={14} />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
