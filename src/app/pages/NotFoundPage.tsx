import { useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Home, ArrowLeft, Send } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

export function NotFoundPage() {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = "404 - Η σελίδα δεν βρέθηκε | Altus Studio";
  }, []);

  const content = {
    el: {
      code: "404",
      label: "Σφάλμα Πλοήγησης",
      title: "Η σελίδα δεν βρέθηκε",
      description:
        "Η διεύθυνση που πληκτρολογήσατε δεν υπάρχει ή έχει μετακινηθεί. Μπορείτε να επιστρέψετε στην αρχική σελίδα ή να επικοινωνήσετε μαζί μας.",
      homeBtn: "Επιστροφή στην Αρχική",
      contactBtn: "Επικοινωνία",
    },
    en: {
      code: "404",
      label: "Navigation Error",
      title: "Page Not Found",
      description:
        "The URL you requested does not exist or has been moved. You can return to the homepage or reach out to us directly.",
      homeBtn: "Back to Home",
      contactBtn: "Contact Us",
    },
  }[lang as "el" | "en"] || {
    code: "404",
    label: "Navigation Error",
    title: "Page Not Found",
    description:
      "The URL you requested does not exist or has been moved. You can return to the homepage or reach out to us directly.",
    homeBtn: "Back to Home",
    contactBtn: "Contact Us",
  };

  return (
    <section className="min-h-screen bg-[#0D0D11] flex items-center justify-center relative overflow-hidden px-6 py-24">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(223,186,115,0.15) 0%, transparent 70%)" }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid404" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid404)" />
        </svg>
      </div>

      <div className="relative max-w-2xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-[#DFBA73] text-xs tracking-[0.35em] uppercase mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {content.label}
          </p>

          {/* 404 Large Display */}
          <h1
            className="text-transparent bg-clip-text bg-gradient-to-b from-[#DFBA73] via-[#E6CE93] to-white/20 select-none leading-none mb-4"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(6rem, 15vw, 12rem)",
              fontWeight: 800,
            }}
          >
            {content.code}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2
            className="text-[#F9FAFB] text-2xl md:text-3xl font-bold mb-4"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {content.title}
          </h2>

          <p
            className="text-[#F9FAFB]/60 text-sm md:text-base leading-relaxed mb-10 max-w-lg mx-auto font-light"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {content.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#DFBA73] text-[#0D0D11] text-xs md:text-sm tracking-wider uppercase font-semibold hover:bg-[#E6CE93] transition-all duration-300 shadow-[0_0_25px_rgba(223,186,115,0.25)]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Home size={16} />
              {content.homeBtn}
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-[#F9FAFB] text-xs md:text-sm tracking-wider uppercase hover:border-[#DFBA73] hover:text-[#DFBA73] transition-all duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Send size={16} />
              {content.contactBtn}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
