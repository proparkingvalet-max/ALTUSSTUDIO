import { useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Globe, ShoppingCart, Zap, Palette, BarChart2, RefreshCw, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { QuoteEstimator } from "@/app/components/QuoteEstimator";

const icons = [Globe, ShoppingCart, Zap];
const addonIcons = [Palette, BarChart2, RefreshCw];

export function ServicesPage() {
  const { t } = useLanguage();

  const mainServices = (t("services.cards") as unknown as {
    number: string; title: string; subtitle: string; description: string;
    features: string[]; delivery: string; from: string;
  }[]) ?? [];

  const addOns = (t("services.addons.items") as unknown as { title: string; desc: string }[]) ?? [];

  useEffect(() => {
    document.title = `${t("nav.services")} | Altus Studio`;
  }, [t]);

  return (
    <div className="bg-[#F9FAFB]">
      {/* Hero */}
      <section className="pt-40 pb-24 bg-[#0D0D11] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sgrid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sgrid)" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-[#DFBA73]" />
              <span
                className="text-[#DFBA73] text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("services.hero.label")}
              </span>
            </div>
            <h1
              className="text-[#F9FAFB] max-w-2xl"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {t("services.hero.heading1")}
              <br />
              <em style={{ fontStyle: "italic", color: "#DFBA73" }}>{t("services.hero.heading2")}</em>
              <br />
              {t("services.hero.heading3")}
            </h1>
            <p
              className="text-[#F9FAFB]/50 mt-8 max-w-lg"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "1.05rem", lineHeight: 1.8 }}
            >
              {t("services.hero.sub")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-px">
          {mainServices.map((s, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={s.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-white border border-[#0D0D11]/8 p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12"
              >
                {/* Number */}
                <div className="lg:col-span-1 flex lg:flex-col items-start gap-4">
                  <span
                    className="text-[#DFBA73]/40"
                    style={{ fontFamily: "'Outfit', sans-serif", fontSize: "4rem", fontWeight: 700, lineHeight: 1 }}
                  >
                    {s.number}
                  </span>
                </div>

                {/* Content */}
                <div className="lg:col-span-6">
                  <p
                    className="text-[#DFBA73] text-xs tracking-[0.25em] uppercase mb-3"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {s.subtitle}
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    {Icon && <Icon size={22} className="text-[#0D0D11]/40" />}
                    <h2
                      className="text-[#0D0D11]"
                      style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.8rem", fontWeight: 700 }}
                    >
                      {s.title}
                    </h2>
                  </div>
                  <p
                    className="text-[#0D0D11]/60 leading-relaxed mb-6"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                  >
                    {s.description}
                  </p>

                  {/* Ideal For */}
                  {(s as any).idealFor && (
                    <div className="mb-8 flex items-start gap-3 px-4 py-3 bg-[#DFBA73]/8 border-l-4 border-[#DFBA73] rounded-r-lg">
                      <span className="text-[#DFBA73] text-lg mt-0.5">💡</span>
                      <div>
                        <p className="text-[#0D0D11] text-xs font-bold tracking-widest uppercase mb-1"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          Ιδανικό για:
                        </p>
                        <p className="text-[#0D0D11]/65 text-sm leading-relaxed"
                          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                          {(s as any).idealFor}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {s.features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-[#DFBA73] mt-0.5 shrink-0" />
                        <span
                          className="text-[#0D0D11]/70 text-sm"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info + CTA */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div className="border border-[#0D0D11]/8 p-8 space-y-6">
                    <div>
                      <p
                        className="text-[#0D0D11]/40 text-xs tracking-widest uppercase mb-1"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {t("services.labels.from")}
                      </p>
                      <p
                        className="text-[#0D0D11]"
                        style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2.5rem", fontWeight: 700 }}
                      >
                        {s.from}
                      </p>
                    </div>
                    <div className="h-px bg-[#0D0D11]/8" />
                    <div>
                      <p
                        className="text-[#0D0D11]/40 text-xs tracking-widest uppercase mb-1"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {t("services.labels.delivery")}
                      </p>
                      <p
                        className="text-[#0D0D11]"
                        style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.2rem", fontWeight: 600 }}
                      >
                        {s.delivery}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/contact"
                    className="mt-6 flex items-center justify-center gap-2 px-8 py-4 bg-[#DFBA73] text-[#0D0D11] text-sm tracking-wider uppercase hover:bg-[#E6CE93] transition-colors duration-300 group"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: "0.1em" }}
                  >
                    {t("services.labels.getStarted")}
                    <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-24 bg-[#0D0D11]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p
              className="text-[#DFBA73] text-xs tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("services.addons.label")}
            </p>
            <h2
              className="text-[#F9FAFB]"
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700 }}
            >
              {t("services.addons.heading")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {addOns.map((a, i) => {
              const Icon = addonIcons[i];
              return (
                <div key={a.title} className="bg-[#0D0D11] p-10 hover:bg-[#1C1C24] transition-colors duration-300">
                  {Icon && <Icon size={20} className="text-[#DFBA73] mb-6" />}
                  <h3
                    className="text-[#F9FAFB] mb-3"
                    style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.15rem", fontWeight: 600 }}
                  >
                    {a.title}
                  </h3>
                  <p
                    className="text-[#F9FAFB]/40 text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                  >
                    {a.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote Estimator */}
      <QuoteEstimator />

      {/* CTA */}
      <section className="py-24 bg-[#F9FAFB] text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2
            className="text-[#0D0D11] mb-6"
            style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700 }}
          >
            {t("services.cta.heading")}
          </h2>
          <p
            className="text-[#0D0D11]/55 mb-10"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
          >
            {t("services.cta.sub")}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 bg-[#0D0D11] text-[#F9FAFB] text-sm tracking-wider uppercase hover:bg-[#1C1C24] transition-colors duration-300 group"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: "0.12em" }}
          >
            {t("services.cta.btn")}
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
