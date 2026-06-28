import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Globe, ShoppingCart, Zap, Palette, BarChart2, RefreshCw, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { QuoteEstimator } from "@/app/components/QuoteEstimator";
import { supabase, isSupabaseConfigured } from "@/app/utils/supabaseClient";

const icons = [Globe, ShoppingCart, Zap];
const addonIcons = [Palette, BarChart2, RefreshCw];

// ─── Speed Simulator Section ──────────────────────────────────────────────────

function SpeedSimulatorSection() {
  const { lang } = useLanguage();
  const [siteType, setSiteType] = useState<"website" | "eshop" | "landing">("website");
  const [status, setStatus] = useState<"idle" | "auditing" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [wpScore, setWpScore] = useState(100);
  const [altusScore, setAltusScore] = useState(0);

  const tSim = {
    el: {
      label: "Live Speed Auditor",
      heading1: "Εξομοιωτής Ταχύτητας &",
      heading2: "Core Web Vitals",
      desc: "Επιλέξτε έναν τύπο ιστοσελίδας και πατήστε «Έναρξη Test» για να δείτε σε πραγματικό χρόνο τη διαφορά φόρτωσης ανάμεσα σε ένα έτοιμο WordPress template των 300€ και ένα custom React build της Altus Studio.",
      btnStart: "Έναρξη Test Ταχύτητας",
      btnRunning: "Ανάλυση σε εξέλιξη...",
      scoreLabel: "Σκορ Google PageSpeed",
      loadTime: "Χρόνος Φόρτωσης",
      layoutShift: "Μετατόπιση Layout (CLS)",
      seoPen: "Ποινή Google SEO",
      convRate: "Κίνδυνος Εγκατάλειψης",
      wpLabel: "WordPress Template (300€)",
      altusLabel: "Altus Custom React Build",
      typeWebsite: "Εταιρικό Site",
      typeEshop: "E-Shop",
      typeLanding: "Landing Page",
      auditComplete: "Η ανάλυση ολοκληρώθηκε!",
      retest: "Δοκιμάστε ξανά",
      metrics: {
        website: {
          wpTime: "6.2s",
          altusTime: "0.5s",
          wpCls: "0.32 (Κακό)",
          altusCls: "0.00 (Τέλειο)",
          wpSeo: "Υψηλή (Θέσεις 30+)",
          altusSeo: "Μηδενική (Top 3)",
          wpRisk: "+48% Απώλεια Πελατών",
          altusRisk: "0% Βελτιστοποιημένο",
        },
        eshop: {
          wpTime: "8.4s",
          altusTime: "0.7s",
          wpCls: "0.45 (Κακό)",
          altusCls: "0.01 (Τέλειο)",
          wpSeo: "Υψηλή (Θέσεις 40+)",
          altusSeo: "Μηδενική (Top 5)",
          wpRisk: "+65% Απώλεια Πωλήσεων",
          altusRisk: "0% Βελτιστοποιημένο",
        },
        landing: {
          wpTime: "4.8s",
          altusTime: "0.4s",
          wpCls: "0.22 (Κακό)",
          altusCls: "0.00 (Τέλειο)",
          wpSeo: "Υψηλό Ad Cost (Low Score)",
          altusSeo: "Χαμηλό Ad Cost (Quality 10/10)",
          wpRisk: "+35% bounce rate διαφημίσεων",
          altusRisk: "0% Μέγιστη Μετατροπή",
        }
      }
    },
    en: {
      label: "Live Speed Auditor",
      heading1: "Speed &",
      heading2: "Core Web Vitals",
      desc: "Select a website category and click 'Start Speed Test' to compare how a generic 300€ WordPress theme performs compared to a custom React build by Altus Studio.",
      btnStart: "Start Speed Test",
      btnRunning: "Running Audit...",
      scoreLabel: "Google PageSpeed Score",
      loadTime: "Load Time",
      layoutShift: "Layout Shift (CLS)",
      seoPen: "Google SEO Penalty",
      convRate: "Abandonment Risk",
      wpLabel: "WordPress Template (300€)",
      altusLabel: "Altus Custom React Build",
      typeWebsite: "Corporate Website",
      typeEshop: "E-Shop",
      typeLanding: "Landing Page",
      auditComplete: "Audit Complete!",
      retest: "Run Test Again",
      metrics: {
        website: {
          wpTime: "6.2s",
          altusTime: "0.5s",
          wpCls: "0.32 (Poor)",
          altusCls: "0.00 (Perfect)",
          wpSeo: "High (Rank 30+)",
          altusSeo: "None (Top 3 Rankings)",
          wpRisk: "+48% Client Loss",
          altusRisk: "0% Optimised Flow",
        },
        eshop: {
          wpTime: "8.4s",
          altusTime: "0.7s",
          wpCls: "0.45 (Poor)",
          altusCls: "0.01 (Perfect)",
          wpSeo: "High (Rank 40+)",
          altusSeo: "None (Top 5 Rankings)",
          wpRisk: "+65% Sales Drop Risk",
          altusRisk: "0% Optimised Flow",
        },
        landing: {
          wpTime: "4.8s",
          altusTime: "0.4s",
          wpCls: "0.22 (Poor)",
          altusCls: "0.00 (Perfect)",
          wpSeo: "High Ad Cost (Low Score)",
          altusSeo: "Low Ad Cost (10/10 Score)",
          wpRisk: "+35% Ad Bounce Rate",
          altusRisk: "0% Maximum Conversion",
        }
      }
    }
  }[lang as "el" | "en"] || tSim.el;

  const currentMetrics = tSim.metrics[siteType];

  const runTest = () => {
    setStatus("auditing");
    setProgress(0);
    setWpScore(100);
    setAltusScore(0);
  };

  useEffect(() => {
    if (status !== "auditing") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("done");
          setWpScore(siteType === "eshop" ? 28 : siteType === "website" ? 34 : 42);
          setAltusScore(siteType === "eshop" ? 98 : siteType === "website" ? 99 : 100);
          return 100;
        }
        
        const nextProg = prev + 4;
        setWpScore(Math.max(30, Math.round(100 - nextProg * 0.7)));
        setAltusScore(Math.min(99, Math.round(nextProg * 0.99)));
        
        return nextProg;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [status, siteType]);

  return (
    <section className="py-32 bg-white relative overflow-hidden border-t border-[#0D0D11]/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-20">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-[#DFBA73]" />
              <span className="text-[#DFBA73] text-xs tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {tSim.label}
              </span>
            </div>
            <h2 className="text-[#0D0D11] leading-tight" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700 }}>
              {tSim.heading1}
              <br />
              <em style={{ fontStyle: "italic", color: "#DFBA73" }}>{tSim.heading2}</em>
            </h2>
          </div>
          <div className="lg:col-span-8">
            <p className="text-[#0D0D11]/60 text-base md:text-lg leading-relaxed font-light mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {tSim.desc}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              {(["website", "eshop", "landing"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    if (status !== "auditing") setSiteType(type);
                  }}
                  className={`px-6 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                    siteType === type
                      ? "bg-[#0D0D11] text-white"
                      : "border border-[#0D0D11]/10 text-[#0D0D11]/50 hover:border-[#0D0D11]/20 hover:text-[#0D0D11]"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {type === "website" ? tSim.typeWebsite : type === "eshop" ? tSim.typeEshop : type === "landing" ? tSim.typeLanding : ""}
                </button>
              ))}

              <button
                onClick={runTest}
                disabled={status === "auditing"}
                className={`ml-0 sm:ml-4 px-8 py-3 bg-[#DFBA73] text-[#0D0D11] text-xs font-bold tracking-wider uppercase hover:bg-[#E6CE93] transition-all duration-300 shadow-md ${
                  status === "auditing" ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {status === "auditing" ? tSim.btnRunning : status === "done" ? tSim.retest : tSim.btnStart}
              </button>
            </div>
          </div>
        </div>

        {status !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            <div className="lg:col-span-6 bg-[#F9FAFB] border border-[#0D0D11]/8 p-8 flex flex-col justify-between relative overflow-hidden rounded-lg">
              {status === "auditing" && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-500/20">
                  <div
                    className="h-full bg-red-500 transition-all duration-100 ease-out"
                    style={{ width: `${Math.min(100, progress * 0.7)}%` }}
                  />
                </div>
              )}

              <div>
                <span className="text-red-500 text-[10px] tracking-[0.2em] uppercase font-bold mb-4 block">
                  {tSim.wpLabel}
                </span>

                <div className="flex items-center gap-6 mb-8">
                  <div className="relative w-20 h-20 rounded-full border-4 border-red-500/10 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent border-r-transparent animate-spin duration-1000 opacity-30" style={{ display: status === "auditing" ? "block" : "none" }} />
                    <span className="text-2xl font-bold text-red-500 font-mono">
                      {wpScore}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-[#0D0D11]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {tSim.scoreLabel}
                    </p>
                    <p className="text-red-500 text-[10px] uppercase font-semibold mt-1">
                      {status === "auditing" ? "Testing..." : "FAILED AUDIT"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 border-t border-[#0D0D11]/5 pt-6 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#0D0D11]/45">{tSim.loadTime}</span>
                    <span className={status === "done" ? "text-red-500 font-bold" : "text-[#0D0D11]/60 animate-pulse"}>
                      {status === "done" ? currentMetrics.wpTime : "Measuring..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0D0D11]/45">{tSim.layoutShift}</span>
                    <span className={status === "done" ? "text-red-500 font-semibold" : "text-[#0D0D11]/60 animate-pulse"}>
                      {status === "done" ? currentMetrics.wpCls : "Measuring..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0D0D11]/45">{tSim.seoPen}</span>
                    <span className={status === "done" ? "text-red-600 font-semibold" : "text-[#0D0D11]/60 animate-pulse"}>
                      {status === "done" ? currentMetrics.wpSeo : "Measuring..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0D0D11]/45">{tSim.convRate}</span>
                    <span className={status === "done" ? "text-red-500 font-bold" : "text-[#0D0D11]/60 animate-pulse"}>
                      {status === "done" ? currentMetrics.wpRisk : "Measuring..."}
                    </span>
                  </div>
                </div>
              </div>

              {status === "done" && (
                <div className="mt-8 p-4 bg-red-500/5 border-l-4 border-red-500 text-xs text-red-700/80 leading-relaxed font-light" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {lang === "el"
                    ? "Τα έτοιμα templates φορτώνουν δεκάδες περιττά scripts (plugins, sliders, fonts) που καταστρέφουν την ταχύτητα και οδηγούν σε υψηλό bounce rate."
                    : "Pre-made templates bundle heavy script overrides and duplicate CSS frameworks, triggering severe speed lag that directly pushes buyers away."}
                </div>
              )}
            </div>

            <div className="lg:col-span-6 bg-[#0D0D11] border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden rounded-lg">
              {status === "auditing" && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/20">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              <div>
                <span className="text-[#DFBA73] text-[10px] tracking-[0.2em] uppercase font-bold mb-4 block">
                  {tSim.altusLabel}
                </span>

                <div className="flex items-center gap-6 mb-8">
                  <div className="relative w-20 h-20 rounded-full border-4 border-emerald-500/20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent border-r-transparent animate-spin duration-1000 opacity-60" style={{ display: status === "auditing" ? "block" : "none" }} />
                    <span className="text-2xl font-bold text-emerald-400 font-mono">
                      {altusScore}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {tSim.scoreLabel}
                    </p>
                    <p className="text-emerald-400 text-[10px] uppercase font-semibold mt-1">
                      {status === "auditing" ? "Optimizing..." : "PASSED (PERFECT SCORE)"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 border-t border-white/5 pt-6 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/45">{tSim.loadTime}</span>
                    <span className={status === "done" ? "text-emerald-400 font-bold" : "text-white/60"}>
                      {status === "done" ? currentMetrics.altusTime : "Measuring..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/45">{tSim.layoutShift}</span>
                    <span className={status === "done" ? "text-emerald-400 font-semibold" : "text-white/60 animate-pulse"}>
                      {status === "done" ? currentMetrics.altusCls : "Measuring..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/45">{tSim.seoPen}</span>
                    <span className={status === "done" ? "text-emerald-400 font-semibold" : "text-white/60 animate-pulse"}>
                      {status === "done" ? currentMetrics.altusSeo : "Measuring..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/45">{tSim.convRate}</span>
                    <span className={status === "done" ? "text-emerald-400 font-bold" : "text-white/60 animate-pulse"}>
                      {status === "done" ? currentMetrics.altusRisk : "Measuring..."}
                    </span>
                  </div>
                </div>
              </div>

              {status === "done" && (
                <div className="mt-8 p-4 bg-emerald-500/5 border-l-4 border-emerald-500 text-xs text-emerald-400/80 leading-relaxed font-light" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {lang === "el"
                    ? "Ο κώδικάς μας είναι 100% custom, γραμμένος σε React/Vite. Φορτώνει μόνο ό,τι χρειάζεται η σελίδα, εξασφαλίζοντας χρόνο φόρτωσης κάτω από 1s και άριστα Web Vitals."
                    : "Our architecture is 100% custom-written React assets. Only necessary files are served, driving loading speeds under 1 second and securing top Google indexing positions."}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export function ServicesPage() {
  const { t, lang } = useLanguage();
  const [basePrices, setBasePrices] = useState({
    website: 350,
    eshop: 990,
    landing: 250,
  });

  const mainServices = (t("services.cards") as unknown as {
    number: string; title: string; subtitle: string; description: string;
    features: string[]; delivery: string; from: string;
  }[]) ?? [];

  const addOns = (t("services.addons.items") as unknown as { title: string; desc: string }[]) ?? [];

  useEffect(() => {
    document.title = `${t("nav.services")} | Altus Studio`;
  }, [t]);

  useEffect(() => {
    // Load current prices from Supabase
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("settings")
        .select("value")
        .eq("key", "prices")
        .maybeSingle()
        .then(({ data, error }) => {
          if (!error && data && data.value) {
            const val = data.value;
            if (val.landing || val.website || val.eshop) {
              setBasePrices({
                website: val.website ?? 350,
                eshop: val.eshop ?? 990,
                landing: val.landing ?? 250,
              });
            }
          }
        });
    } else {
      const cached = localStorage.getItem("altus_prices");
      if (cached) {
        try {
          const val = JSON.parse(cached);
          if (val.landing || val.website || val.eshop) {
            setBasePrices({
              website: val.website ?? 350,
              eshop: val.eshop ?? 990,
              landing: val.landing ?? 250,
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    // Dynamic storage sync helper
    const handleStorageChange = () => {
      const cached = localStorage.getItem("altus_prices");
      if (cached) {
        try {
          const val = JSON.parse(cached);
          if (val.landing || val.website || val.eshop) {
            setBasePrices({
              website: val.website ?? 350,
              eshop: val.eshop ?? 990,
              landing: val.landing ?? 250,
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
                        {(() => {
                          const priceKey = s.number === "01" ? "website" : s.number === "02" ? "eshop" : "landing";
                          const price = basePrices[priceKey];
                          return `€${price}`;
                        })()}
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

      {/* Speed Simulator Section */}
      <SpeedSimulatorSection />

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
