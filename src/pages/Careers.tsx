import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Building2,
  Factory,
  Send
} from "lucide-react";
import Seo, { SITE_URL } from "@/components/Seo";
import heroCorporate from "@/assets/hero-corporate.jpg";
import helmetManufacturing from "@/assets/helmet-manufacturing.jpg";

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

const openings: JobOpening[] = [
  {
    id: "prod-eng",
    title: "Production & Tooling Engineer",
    department: "Industrial Manufacturing (Camy Smart / Aerosoft)",
    location: "Plant Operations, Sri Lanka",
    type: "Full-Time",
    description: "Oversee high-precision injection molding tooling, SLS 517 standard testing quality cycles, and polyurethane molding operations.",
    requirements: [
      "B.Sc. in Mechanical, Manufacturing, or Production Engineering",
      "2+ years experience in plastic injection molding or polyurethane footwear",
      "Strong background in ISO/SLS quality management"
    ]
  },
  {
    id: "sales-exec",
    title: "Area Sales Manager – Wholesale Distribution",
    department: "Commercial & Retail (Supun Traders / Super Center)",
    location: "Islandwide Regional Networks",
    type: "Full-Time",
    description: "Drive islandwide dealer growth, retail distribution channels, and wholesale key account operations across consumer durables.",
    requirements: [
      "Proven track record in FMCG or consumer durable distribution",
      "Strong dealer relationship management and market analytics",
      "Fluency in Sinhala and English, Tamil is an advantage"
    ]
  },
  {
    id: "iot-dev",
    title: "Embedded Systems & Firmware Engineer",
    department: "Smart Energy Systems (YMAC Technologies)",
    location: "Colombo Headquarters & Tech Labs",
    type: "Full-Time",
    description: "Develop IoT telemetry firmware and backend cloud communication protocols for automated smart electricity meters.",
    requirements: [
      "B.Sc. in Electronics, Mechatronics, or Computer Engineering",
      "Hands-on C/C++ embedded programming and IoT protocols (MQTT, LoRa)",
      "Experience with smart metering or industrial sensors"
    ]
  },
  {
    id: "hosp-sup",
    title: "Guest Relations & Operations Executive",
    department: "Hospitality (Supun Arcade Residency / Area 56)",
    location: "Colombo 06",
    type: "Full-Time",
    description: "Deliver 5-star guest services across 40 serviced apartment suites and rooftop skyline lounge dining operations.",
    requirements: [
      "Diploma or Degree in Hospitality / Tourism Management",
      "Excellent customer handling and verbal communication skills",
      "Passionate about guest satisfaction and upscale hospitality"
    ]
  }
];

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "General Application",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full min-h-screen bg-white text-gray-950 font-sans selection:bg-[#1d3f9a] selection:text-white">
      <Seo
        title="Careers at Supun Group | Join Sri Lanka's Manufacturing Powerhouse"
        description="Explore rewarding career opportunities across manufacturing, wholesale retail distribution, smart IoT energy systems, and luxury hospitality at Supun Group of Companies."
        canonical={`${SITE_URL}/careers`}
      />

      {/* =========================================================================
          HERO SECTION: EDITORIAL HIGH-IMPACT BANNER
         ========================================================================= */}
      <section className="relative w-full pt-36 sm:pt-44 pb-20 sm:pb-28 bg-[#070b16] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroCorporate}
            alt="Careers at Supun Group"
            className="w-full h-full object-cover opacity-25 filter brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-[#070b16]/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#8dc53e]" />
              <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-[#8dc53e]">
                Grow With Sri Lanka's Pioneer
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white font-heading leading-[1.08]">
              Build Your Legacy at Supun Group.
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 font-normal leading-relaxed">
              From advanced manufacturing plants and smart tech labs to national retail networks and premier hospitality, join over 400 dedicated professionals shaping Sri Lanka’s future.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PILLARS OF WORK CULTURE
         ========================================================================= */}
      <section className="w-full py-20 sm:py-28 bg-slate-50 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="max-w-2xl space-y-4 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#1d3f9a] block">
              Why Join Supun Group
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-950 font-heading">
              A Dynamic Ecosystem for Ambitious Talent
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 sm:p-10 border border-gray-200 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-[#1d3f9a]/10 text-[#1d3f9a] flex items-center justify-center font-bold">
                <Factory size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-950 font-heading">
                Industrial Innovation
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Work with national SLS 517 certified testing facilities, automated injection tooling, and cutting-edge IoT manufacturing systems.
              </p>
            </div>

            <div className="bg-white p-8 sm:p-10 border border-gray-200 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-[#1d3f9a]/10 text-[#1d3f9a] flex items-center justify-center font-bold">
                <Briefcase size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-950 font-heading">
                Multi-Sector Mobility
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Gain diverse exposure across ten operating enterprises spanning consumer durables, retail trade, high-tech energy, and luxury hospitality.
              </p>
            </div>

            <div className="bg-white p-8 sm:p-10 border border-gray-200 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-[#1d3f9a]/10 text-[#1d3f9a] flex items-center justify-center font-bold">
                <Award size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-950 font-heading">
                Long-Term Growth
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                We invest in our people through structured leadership pathways, technical training, and stable career development since 1978.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          OPEN VACANCIES SECTION
         ========================================================================= */}
      <section className="w-full py-20 sm:py-28 bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#1d3f9a] block">
                Current Opportunities
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-950 font-heading">
                Explore Open Positions
              </h2>
            </div>
            <p className="text-base sm:text-lg text-gray-600 max-w-md">
              Don't see an exact match? We invite spontaneous applications from talented professionals across all disciplines.
            </p>
          </div>

          <div className="space-y-6">
            {openings.map((job) => (
              <div
                key={job.id}
                className="p-8 sm:p-10 border border-gray-200 bg-white hover:border-[#1d3f9a] hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider bg-[#1d3f9a]/10 text-[#1d3f9a] px-3 py-1">
                        {job.department}
                      </span>
                      <span className="text-xs font-semibold text-gray-600">
                        {job.location} • {job.type}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-950 font-heading">
                      {job.title}
                    </h3>
                  </div>

                  <a
                    href="#apply-form"
                    onClick={() => {
                      setSelectedJob(job.title);
                      setFormData((prev) => ({ ...prev, position: job.title }));
                    }}
                    className="inline-flex items-center gap-2 bg-[#1d3f9a] hover:bg-[#163077] text-white font-bold text-sm px-6 py-3.5 rounded-none transition-colors shrink-0"
                  >
                    <span>Apply Now</span>
                    <ArrowRight size={16} />
                  </a>
                </div>

                <div className="pt-6 space-y-4">
                  <p className="text-gray-700 text-base leading-relaxed">
                    {job.description}
                  </p>
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-950 block">
                      Key Qualifications:
                    </span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      {job.requirements.map((req, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-[#8dc53e] shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          APPLICATION FORM
         ========================================================================= */}
      <section id="apply-form" className="w-full py-20 sm:py-28 bg-slate-900 text-white">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8dc53e] block">
                Submit Your Application
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-heading">
                Take the Next Step in Your Career
              </h2>
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
                Send your CV directly to our Group Human Resources Department. We review all applications confidentially.
              </p>
            </div>

            {submitted ? (
              <div className="p-10 bg-white/10 border border-[#8dc53e] text-center space-y-4">
                <div className="w-16 h-16 bg-[#8dc53e]/20 text-[#8dc53e] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white font-heading">
                  Application Received!
                </h3>
                <p className="text-gray-300 max-w-md mx-auto">
                  Thank you for your interest in joining Supun Group. Our Human Resources team will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 sm:p-12 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-gray-300 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Ruwan Silva"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-3.5 focus:outline-none focus:border-[#8dc53e]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-gray-300 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. ruwan@example.com"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-3.5 focus:outline-none focus:border-[#8dc53e]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-gray-300 block">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +94 77 123 4567"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-3.5 focus:outline-none focus:border-[#8dc53e]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-gray-300 block">
                      Position Applied For *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Position name or General Application"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-3.5 focus:outline-none focus:border-[#8dc53e]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-gray-300 block">
                    Brief Summary / Cover Note
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your experience, qualifications, and why you would like to join Supun Group..."
                    className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 p-4 focus:outline-none focus:border-[#8dc53e]"
                  />
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-gray-400">
                    You can also email your CV directly to <a href="mailto:careers@supungroup.lk" className="text-[#8dc53e] hover:underline font-bold">careers@supungroup.lk</a>
                  </p>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#8dc53e] hover:bg-[#7cb332] text-gray-950 font-bold text-base px-10 py-4 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>Submit Application</span>
                    <Send size={18} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
