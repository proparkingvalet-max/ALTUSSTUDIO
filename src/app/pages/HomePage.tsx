import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Globe, ShoppingCart, Zap, Smartphone, TrendingUp, HeadphonesIcon, Quote } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { getProjects, Project } from "@/app/utils/projects";

import eshopPreview from "@/assets/eshop_preview.png";
import eshopProduct from "@/assets/eshop_product.png";
import resortPreview from "@/assets/resort_preview.png";
import resortBooking from "@/assets/resort_booking.png";

// Real Pro Parking Valet assets & screenshots
import ppHero from "@/assets/proparking/hero_section.png";
import ppBooking from "@/assets/proparking/booking_section.png";
import ppMarina from "@/assets/proparking/marina.jpg";

import { LightboxModal } from "@/app/components/LightboxModal";

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ t }: { t: (k: string) => any }) {
  return (
    <section className="relative min-h-screen bg-[#0A0F1E] flex items-center overflow-hidden">
      {/* Geometric background */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Large circle accent */}
        <div
          className="absolute top-[-15%] right-[-8%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full border border-white/5"
          style={{ background: "radial-gradient(circle at 60% 40%, rgba(201,168,76,0.06) 0%, transparent 70%)" }}
        />
        <div className="absolute top-[-10%] right-[-4%] w-[42vw] h-[42vw] max-w-[600px] max-h-[600px] rounded-full border border-white/5" />
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Gold accent bar */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-32 bg-[#C9A84C]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left content */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="text-[#C9A84C] text-xs tracking-[0.35em] uppercase mb-8"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Premium Web Design Studio
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#F5F5F0] leading-[1.08]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              fontWeight: 700,
            }}
          >
            {t("home.hero.headline1")}{" "}
            <em style={{ fontStyle: "italic", color: "#C9A84C" }}>{t("home.hero.headline2")}</em>
            <br />
            {t("home.hero.headline3")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#F5F5F0]/55 mt-8 max-w-lg leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.1rem", fontWeight: 300 }}
          >
            {t("home.hero.sub")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4 mt-12"
          >
            <Link
              to="/portfolio"
              className="group px-8 py-4 border border-[#F5F5F0]/30 text-[#F5F5F0] text-sm tracking-wider uppercase hover:border-[#F5F5F0]/70 transition-all duration-300 flex items-center gap-2"
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.1em" }}
            >
              {t("home.hero.ctaSub")}
              <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-[#C9A84C] text-[#0A0F1E] text-sm tracking-wider uppercase hover:bg-[#D4B76A] hover:shadow-[0_0_25px_rgba(201,168,76,0.4)] transition-all duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: "0.1em" }}
            >
              {t("home.hero.cta")}
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-20 flex gap-12 border-t border-white/10 pt-10"
          >
            {(t("home.hero.stats") as { value: string; label: string }[] || [
              { value: "80+", label: "Projects" },
              { value: "5yr", label: "Εμπειρία" },
              { value: "98%", label: "Ικανοποίηση" },
            ]).map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-[#C9A84C]"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700 }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-[#F5F5F0]/40 text-xs tracking-widest uppercase mt-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — decorative browser mockup */}
        <div className="lg:col-span-5 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main card */}
            <div className="bg-[#141929] border border-white/8 overflow-hidden">
              {/* Browser chrome */}
              <div className="bg-[#0D1220] px-4 py-3 flex items-center gap-2 border-b border-white/8">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                </div>
                <div className="flex-1 bg-white/5 rounded-sm h-5 ml-3 flex items-center px-3">
                  <span className="text-white/25 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    altus.studio
                  </span>
                </div>
              </div>
              {/* Hero mockup content */}
              <div className="p-8 space-y-4">
                <div className="h-2 bg-white/8 rounded-sm w-1/3" />
                <div className="h-5 bg-white/12 rounded-sm w-5/6" />
                <div className="h-5 bg-white/8 rounded-sm w-2/3" />
                <div className="h-3 bg-white/5 rounded-sm w-full mt-2" />
                <div className="h-3 bg-white/5 rounded-sm w-4/5" />
                <div className="flex gap-3 mt-6">
                  <div className="h-8 bg-[#C9A84C]/70 rounded-sm w-24" />
                  <div className="h-8 border border-white/15 rounded-sm w-24" />
                </div>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="bg-white/5 rounded-sm aspect-video" />
                  ))}
                </div>
              </div>
            </div>
            {/* Floating accent card */}
            <div className="absolute -bottom-6 -left-6 bg-[#C9A84C] p-4 text-[#0A0F1E]">
              <p className="text-xs tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {t("home.hero.latestProject")}
              </p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem" }}>
                proparkingvalet.gr
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#C9A84C]/50 animate-pulse" />
      </motion.div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

const services = [
  {
    icon: Globe,
    title: "Κατασκευή Ιστοσελίδας",
    description:
      "Φτιάχνουμε μια ιστοσελίδα που αντιπροσωπεύει πραγματικά την επιχείρησή σας — επαγγελματική, γρήγορη και εύκολη στη χρήση από οποιαδήποτε συσκευή.",
    tag: "Σχεδιασμός & Ανάπτυξη",
  },
  {
    icon: ShoppingCart,
    title: "Ανάπτυξη E-Shop",
    description:
      "Ένα ηλεκτρονικό κατάστημα όπου οι πελάτες σας μπορούν να αγοράζουν εύκολα και με ασφάλεια — 24 ώρες το 24ωρο, 7 μέρες την εβδομάδα.",
    tag: "Ηλεκτρονικό Εμπόριο",
  },
  {
    icon: Zap,
    title: "Landing Page",
    description:
      "Μια μικρή, δυνατή σελίδα με έναν στόχο: να κάνει τον επισκέπτη να επικοινωνήσει μαζί σας ή να αγοράσει. Ιδανική για προσφορές και διαφημίσεις.",
    tag: "Αύξηση Πωλήσεων",
  },
];

function ServicesSection() {
  const { t } = useLanguage();
  const icons = [Globe, ShoppingCart, Zap];
  const translatedCards = (t("home.services.cards") as { title: string; description: string; tag: string }[]) || [];

  return (
    <section className="py-32 bg-[#F5F5F0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Label */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-[#C9A84C]" />
              <span
                className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("home.services.label")}
              </span>
            </div>
            <h2
              className="text-[#0A0F1E] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700 }}
            >
              {t("home.services.heading1")}
              <br />
              <em style={{ fontStyle: "italic" }}>{t("home.services.heading2")}</em>
              <br />
              {t("home.services.heading3")}
            </h2>
          </div>

          {/* Cards */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#0A0F1E]/10">
            {translatedCards.map((service, i) => {
              const Icon = icons[i] || Globe;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group bg-[#F5F5F0] p-10 hover:bg-[#0A0F1E] border border-transparent hover:border-[#C9A84C]/20 hover:shadow-[0_20px_50px_rgba(10,15,30,0.3)] transition-all duration-500 cursor-default relative overflow-hidden"
                >
                  <div className="w-10 h-10 border border-[#0A0F1E]/20 group-hover:border-[#C9A84C]/40 flex items-center justify-center mb-8 transition-colors duration-500">
                    <Icon
                      size={18}
                      className="text-[#0A0F1E] group-hover:text-[#C9A84C] transition-colors duration-500"
                    />
                  </div>
                  <p
                    className="text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase mb-3"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {service.tag}
                  </p>
                  <h3
                    className="text-[#0A0F1E] group-hover:text-[#F5F5F0] mb-4 transition-colors duration-500"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 700 }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-[#0A0F1E]/55 group-hover:text-[#F5F5F0]/55 text-sm leading-relaxed transition-colors duration-500"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                  >
                    {service.description}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-xs tracking-wider uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {t("home.about.cta")}
                    </span>
                    <ArrowUpRight size={14} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Why Us ───────────────────────────────────────────────────────────────────

const values = [
  {
    icon: Zap,
    stat: "14",
    unit: "ημέρες",
    title: "Γρήγορη Παράδοση",
    description: "Μέσος χρόνος παράδοσης 14 ημερών χωρίς συμβιβασμούς στην ποιότητα.",
  },
  {
    icon: Smartphone,
    stat: "100",
    unit: "%",
    title: "Mobile-First",
    description: "Κάθε project σχεδιάζεται πρώτα για mobile και μετά για desktop.",
  },
  {
    icon: TrendingUp,
    stat: "98",
    unit: "%",
    title: "Αποτελέσματα",
    description: "Βελτιστοποίηση για ταχύτητα, SEO και μετατροπές. Metrics που έχουν σημασία.",
  },
  {
    icon: HeadphonesIcon,
    stat: "24",
    unit: "/7",
    title: "Ongoing Support",
    description: "Δεν εξαφανιζόμαστε μετά την παράδοση. Είμαστε εδώ για τη συνέχεια.",
  },
];

function WhyUsSection() {
  const { t } = useLanguage();
  const icons = [Zap, Smartphone, TrendingUp, HeadphonesIcon];
  const translatedItems = (t("home.whyUs.items") as { stat: string; unit: string; title: string; description: string }[]) || [];

  return (
    <section className="py-32 bg-[#0A0F1E] relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid2" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid2)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-px bg-[#C9A84C]" />
            <span
              className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("home.whyUs.label")}
            </span>
            <div className="w-8 h-px bg-[#C9A84C]" />
          </div>
          <h2
            className="text-[#F5F5F0]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700 }}
          >
            {t("home.whyUs.heading1")}{" "}
            <em style={{ fontStyle: "italic", color: "#C9A84C" }}>{t("home.whyUs.heading2")}</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {translatedItems.map((v, i) => {
            const Icon = icons[i] || Zap;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-[#0A0F1E] p-10 group hover:bg-[#141929] border border-transparent hover:border-[#C9A84C]/10 hover:shadow-[0_0_30px_rgba(201,168,76,0.05)] transition-all duration-300"
              >
                <Icon size={20} className="text-[#C9A84C] mb-6" />
                <div className="mb-6">
                  <span
                    className="text-[#F5F5F0]"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", fontWeight: 700, lineHeight: 1 }}
                  >
                    {v.stat}
                  </span>
                  <span
                    className="text-[#C9A84C] ml-1"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem" }}
                  >
                    {v.unit}
                  </span>
                </div>
                <h3
                  className="text-[#F5F5F0] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600 }}
                >
                  {v.title}
                </h3>
                <p
                  className="text-[#F5F5F0]/40 text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                >
                  {v.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Process Stepper ──────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Briefing & Στόχοι",
    subtitle: "Κατανόηση & Σχεδιασμός",
    desc: "Αναλύουμε τις ανάγκες σας, προσδιορίζουμε το κοινό-στόχο και σχεδιάζουμε το στρατηγικό πλάνο και τη δομή της ιστοσελίδας.",
  },
  {
    number: "02",
    title: "UI/UX Σχεδιασμός",
    subtitle: "Custom & Μοναδικό",
    desc: "Δημιουργούμε το εικαστικό κομμάτι (mockups) με βάση την ταυτότητα του brand σας, προσφέροντας μια κορυφαία εμπειρία χρήσης.",
  },
  {
    number: "03",
    title: "Ανάπτυξη & SEO",
    subtitle: "Κώδικας & Ταχύτητα",
    desc: "Μετατρέπουμε το design σε κώδικα με χρήση σύγχρονων τεχνολογιών, εστιάζοντας στην ταχύτητα, την ασφάλεια και το SEO.",
  },
  {
    number: "04",
    title: "Παράδοση & Handover",
    subtitle: "Έναρξη & Εκπαίδευση",
    desc: "Μετά από λεπτομερείς ελέγχους, η ιστοσελίδα γίνεται live. Σας εκπαιδεύουμε στη διαχείριση και συνδέουμε τα analytics.",
  },
];

function ProcessSection() {
  const { t } = useLanguage();
  const translatedSteps = (t("home.process.steps") as { num: string; title: string; subtitle: string; desc: string }[]) || [];

  return (
    <section className="py-32 bg-[#F5F5F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-24">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-px bg-[#C9A84C]" />
            <span
              className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("home.process.label")}
            </span>
            <div className="w-8 h-px bg-[#C9A84C]" />
          </div>
          <h2
            className="text-[#0A0F1E]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700 }}
          >
            {t("home.process.heading")}
          </h2>
        </div>

        {/* Desktop Timeline (Horizontal) */}
        <div className="hidden lg:grid grid-cols-4 gap-8 relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#0A0F1E]/10 -translate-y-1/2 z-0" />

          {translatedSteps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative z-10 bg-[#F5F5F0] group flex flex-col items-center text-center px-4"
            >
              {/* Stepper Node */}
              <div className="w-16 h-16 rounded-full border border-[#0A0F1E]/15 group-hover:border-[#C9A84C] bg-[#F5F5F0] flex items-center justify-center mb-6 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] relative">
                <span
                  className="text-[#0A0F1E] group-hover:text-[#C9A84C] font-semibold text-lg transition-colors duration-500"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.num}
                </span>
              </div>

              {/* Text */}
              <span
                className="text-[#C9A84C] text-[10px] tracking-[0.25em] uppercase mb-2 font-medium"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {s.subtitle}
              </span>
              <h3
                className="text-[#0A0F1E] text-base font-bold mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {s.title}
              </h3>
              <p
                className="text-[#0A0F1E]/55 text-xs leading-relaxed font-light"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Timeline (Vertical) */}
        <div className="lg:hidden space-y-12 relative pl-8">
          {/* Connector Line (Vertical) */}
          <div className="absolute top-4 bottom-4 left-4 w-px bg-[#0A0F1E]/10" />

          {translatedSteps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative group"
            >
              {/* Stepper Node (Left Floating) */}
              <div className="absolute -left-12 top-0 w-8 h-8 rounded-full border border-[#0A0F1E]/15 bg-[#F5F5F0] flex items-center justify-center transition-colors duration-500 group-hover:border-[#C9A84C]">
                <span
                  className="text-[#0A0F1E] group-hover:text-[#C9A84C] text-xs font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.num}
                </span>
              </div>

              {/* Content */}
              <div>
                <span
                  className="text-[#C9A84C] text-[9px] tracking-[0.2em] uppercase mb-1 block font-medium"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {s.subtitle}
                </span>
                <h3
                  className="text-[#0A0F1E] text-base font-bold mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-[#0A0F1E]/60 text-xs leading-relaxed font-light"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────

function AboutSection() {
  const { t } = useLanguage();

  return (
    <section className="py-32 bg-[#0A0F1E] relative overflow-hidden border-t border-white/5">
      {/* Abstract gold dust background effect */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="aboutgrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#aboutgrid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left side: Golden statement */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-[#C9A84C]" />
              <span
                className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("home.about.label")}
              </span>
            </div>
            <h2
              className="text-[#F5F5F0] leading-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
              }}
            >
              {t("home.about.heading1")}{" "}
              <br />
              <em style={{ fontStyle: "italic", color: "#C9A84C" }}>{t("home.about.heading2")}</em>,
              <br />
              {t("home.about.heading3")}
            </h2>
          </motion.div>
        </div>

        {/* Right side: Detailed quote & text */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <p
              className="text-[#F5F5F0]/85 text-base md:text-lg leading-relaxed font-light"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("home.about.p1")}
            </p>
            <p
              className="text-[#F5F5F0]/50 text-sm leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
            >
              {t("home.about.p2")}
            </p>
            {/* Signature style */}
            <div className="pt-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-[#C9A84C]/30 flex items-center justify-center bg-[#C9A84C]/5">
                <span className="text-[#C9A84C] font-semibold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                  AS
                </span>
              </div>
              <div>
                <p className="text-[#F5F5F0] text-sm font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t("home.about.team")}
                </p>
                <p className="text-[#C9A84C] text-[10px] tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {t("home.about.location")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Portfolio Preview ─────────────────────────────────────────────────────────

function PortfolioSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    setProjectsList(getProjects());
    const handleStorage = () => {
      setProjectsList(getProjects());
    };
    window.addEventListener("storage", handleStorage);
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="py-32 bg-[#F5F5F0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-[#C9A84C]" />
              <span
                className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("home.portfolio.label")}
              </span>
            </div>
            <h2
              className="text-[#0A0F1E]"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700 }}
            >
              {t("home.portfolio.heading1")}{" "}
              <em style={{ fontStyle: "italic" }}>{t("home.portfolio.heading2")}</em>
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="group flex items-center gap-2 text-[#0A0F1E] text-sm tracking-wider uppercase border-b border-[#0A0F1E]/30 pb-0.5 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {t("home.portfolio.viewAll")}
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projectsList.map((project, i) => (
            <motion.div
              key={project.id || project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative aspect-[4/3] overflow-hidden cursor-pointer group border border-[#0A0F1E]/5 bg-[#0D1220]"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(`/portfolio/${project.id}`)}
            >
              <img
                src={project.img}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:blur-[2px]"
              />
              {/* Dark glassmorphic overlay on hover */}
              <div className="absolute inset-0 bg-[#0A0F1E]/40 group-hover:bg-[#0A0F1E]/85 group-hover:backdrop-blur-[4px] transition-all duration-500" />
              
              {/* Live Project Badge */}
              {project.isLive && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-[#0A0F1E]/80 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Live Project
                  </span>
                </div>
              )}

              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                {/* Category */}
                <div
                  className={`transition-all duration-500 transform ${
                    hovered === i ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                  }`}
                >
                  <p
                    className="text-xs tracking-[0.25em] uppercase mb-2 font-medium"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "#C9A84C" }}
                  >
                    {project.category} {project.tags && project.tags.length > 0 ? `· ${project.tags[0]}` : ""}
                  </p>
                </div>

                {/* Title */}
                <h3
                  className="text-[#F5F5F0] transition-transform duration-500 transform group-hover:-translate-y-1"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700 }}
                >
                  {project.name}
                </h3>

                {/* CTA Link inside Card */}
                <div
                  className={`flex items-center gap-2 mt-4 text-[#C9A84C] transition-all duration-500 transform ${
                    hovered === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                >
                  <span className="text-xs tracking-wider uppercase font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {t("home.portfolio.viewProject")}
                  </span>
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Prominent CTA Button at bottom */}
        <div className="mt-16 text-center">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-3 px-10 py-5 border border-[#0A0F1E]/20 text-[#0A0F1E] text-sm tracking-wider uppercase hover:bg-[#0A0F1E] hover:text-[#F5F5F0] hover:border-[#0A0F1E] transition-all duration-500 group"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: "0.12em" }}
          >
            {t("home.portfolio.viewAllProjects")}
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Immersive Lightbox Modal */}
      <LightboxModal
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        images={selectedProject?.gallery || []}
        projectName={selectedProject?.name || ""}
        projectCategory={selectedProject?.category || ""}
        projectDescription={selectedProject?.description || ""}
        projectResults={selectedProject?.results || ""}
        projectYear={selectedProject?.year || ""}
        projectTags={selectedProject?.tags || []}
        projectIsLive={selectedProject?.isLive || false}
        projectLiveUrl={selectedProject?.liveUrl || ""}
      />
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────────

const testimonials = [
  {
    quote:
      "Η Altus Studio μετέτρεψε την ιστοσελίδα μας από μια απλή παρουσία σε ένα πραγματικό εργαλείο πωλήσεων. Τα αποτελέσματα ήρθαν από τον πρώτο μήνα.",
    name: "Αλέξανδρος Παπαδόπουλος",
    role: "Ιδιοκτήτης · Papadopoulos Interiors",
  },
  {
    quote:
      "Επαγγελματισμός, ταχύτητα και αποτέλεσμα που ξεπέρασε τις προσδοκίες μας. Το e-shop μας είδε 3x αύξηση στις online πωλήσεις.",
    name: "Μαρία Κωνσταντίνου",
    role: "CEO · Elara Cosmetics",
  },
  {
    quote:
      "Τελικά βρήκαμε συνεργάτη που καταλαβαίνει τι θέλουμε. Η landing page που σχεδίασαν μετατρέπει επισκέπτες σε πελάτες με εντυπωσιακή συχνότητα.",
    name: "Νίκος Θεοδωρίδης",
    role: "Founder · TechFlow Solutions",
  },
];

function TestimonialsSection() {
  const { t } = useLanguage();
  const translatedTestimonials = (t("home.testimonials.items") as { quote: string; name: string; role: string }[]) || [];

  return (
    <section className="py-32 bg-[#0A0F1E]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-px bg-[#C9A84C]" />
            <span
              className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("home.testimonials.label")}
            </span>
            <div className="w-8 h-px bg-[#C9A84C]" />
          </div>
          <h2
            className="text-[#F5F5F0]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700 }}
          >
            {t("home.testimonials.heading1")}{" "}
            <em style={{ fontStyle: "italic", color: "#C9A84C" }}>{t("home.testimonials.heading2")}</em> {t("home.testimonials.heading3")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {translatedTestimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-[#141929] border border-white/6 p-10 relative"
            >
              <Quote
                size={32}
                className="text-[#C9A84C] mb-6 opacity-80"
                fill="currentColor"
              />
              <p
                className="text-[#F5F5F0]/75 leading-relaxed mb-8"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.95rem" }}
              >
                "{t.quote}"
              </p>
              <div className="border-t border-white/8 pt-6">
                <p
                  className="text-[#F5F5F0]"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "1rem" }}
                >
                  {t.name}
                </p>
                <p
                  className="text-[#C9A84C]/70 text-xs tracking-wider mt-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {t.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────

function FAQSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const translatedFaqs = (t("home.faq.items") as { q: string; a: string }[]) || [];

  return (
    <section className="py-32 bg-[#0A0F1E] relative overflow-hidden border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-px bg-[#C9A84C]" />
            <span
              className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("home.faq.label")}
            </span>
            <div className="w-8 h-px bg-[#C9A84C]" />
          </div>
          <h2
            className="text-[#F5F5F0]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700 }}
          >
            {t("home.faq.heading1")} <em style={{ fontStyle: "italic", color: "#C9A84C" }}>{t("home.faq.heading2")}</em>
          </h2>
        </div>

        {/* Accordion Layout */}
        <div className="space-y-4">
          {translatedFaqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border border-white/10 bg-[#141929] transition-all duration-300 rounded-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full py-6 px-8 flex items-center justify-between text-left focus:outline-none"
                >
                  <span
                    className="text-[#F5F5F0] text-sm md:text-base font-semibold pr-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {faq.q}
                  </span>
                  <span className={`text-[#C9A84C] text-xl transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className="pb-6 px-8 text-[#F5F5F0]/60 text-xs md:text-sm leading-relaxed font-light border-t border-white/5 pt-4"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ────────────────────────────────────────────────────────────────

function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="py-32 bg-[#F5F5F0] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
          }}
        />
      </div>
      <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-[#C9A84C] text-xs tracking-[0.35em] uppercase mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {t("home.cta.label")}
          </p>
          <h2
            className="text-[#0A0F1E] mb-8"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {t("home.cta.heading1")}
            <br />
            {t("home.cta.heading2")}{" "}
            <em style={{ fontStyle: "italic", color: "#C9A84C" }}>{t("home.cta.heading3")}</em>{t("home.cta.heading4")}
          </h2>
          <p
            className="text-[#0A0F1E]/55 max-w-xl mx-auto mb-12"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "1.05rem" }}
          >
            {t("home.cta.sub")}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#0A0F1E] text-[#F5F5F0] text-sm tracking-wider uppercase hover:bg-[#141929] transition-colors duration-300 group"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: "0.12em" }}
          >
            {t("home.cta.btn")}
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Logo Wall Ticker ──────────────────────────────────────────────────────────

function LogoWallSection() {
  const logos = [
    { name: "PRO PARKING", desc: "VALET SERVICES" },
    { name: "AURA DESIGN", desc: "LUXURY FURNITURE" },
    { name: "AETHERIA RESORT", desc: "HOSPITALITY" },
    { name: "KIPARISSI", desc: "FINE DINING" },
    { name: "VELVET CAFE", desc: "BOUTIQUE COFFEE" },
    { name: "CLAIRES", desc: "BESPOKE FASHION" },
    { name: "EVAS CANDLES", desc: "ARTISAN SCENTS" },
  ];

  const doubleLogos = [...logos, ...logos, ...logos];

  return (
    <section className="py-12 bg-[#0A0F1E] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-4 text-center">
        <p className="text-[#C9A84C]/60 text-[9px] tracking-[0.25em] uppercase font-semibold">
          TRUSTED BY ELITE BRANDS & BUSINESSES
        </p>
      </div>
      <div className="relative w-full flex overflow-x-hidden">
        {/* Gradients to hide edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0A0F1E] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0A0F1E] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-16 py-4">
          {doubleLogos.map((logo, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center min-w-[150px] opacity-35 hover:opacity-100 hover:scale-105 transition-all duration-300 select-none group">
              <span className="text-[#F5F5F0] text-sm font-bold tracking-[0.15em] font-serif uppercase group-hover:text-[#C9A84C] transition-colors">
                {logo.name}
              </span>
              <span className="text-white/40 text-[8px] tracking-widest mt-1 block">
                {logo.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function HomePage() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = "Altus Studio | Premium Web Design Studio";
  }, []);

  return (
    <>
      <HeroSection t={t} />
      <LogoWallSection />
      <ServicesSection />
      <WhyUsSection />
      <ProcessSection />
      <AboutSection />
      <PortfolioSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}

