import { useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Shield, Sparkles, CodeXml, ArrowUpRight, Award, Zap } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

export function AboutPage() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = `${t("nav.about")} | Altus Studio`;
  }, [t]);

  const philosophyIcons = [Sparkles, CodeXml, Shield];

  const teamMembers = [
    {
      name: "Αλέξανδρος Σαμαράς",
      nameEn: "Alexandros Samaras",
      roleKey: "pm",
      initials: "AS",
      descEl: "Με 8+ χρόνια εμπειρίας στον σχεδιασμό διεπαφών, καθοδηγεί το δημιουργικό όραμα κάθε έργου.",
      descEn: "With 8+ years of visual design experience, directing the creative vision of each project."
    },
    {
      name: "Δημήτρης Παππάς",
      nameEn: "Dimitris Pappas",
      roleKey: "dev",
      initials: "DP",
      descEl: "Full-stack developer με πάθος για τον καθαρό κώδικα, την ταχύτητα και το modern web performance.",
      descEn: "Full-stack developer passionate about clean code, high speed, and modern web performance."
    },
    {
      name: "Ελένη Γεωργίου",
      nameEn: "Eleni Georgiou",
      roleKey: "design",
      initials: "EG",
      descEl: "Εξειδικεύεται στη δημιουργία μοναδικών UI/UX Mockups που συνδυάζουν αισθητική και λειτουργικότητα.",
      descEn: "Specializes in crafting unique UI/UX Mockups that balance aesthetics and usability."
    }
  ];

  // Retrieve philosophy list from translations safely
  const philosophyItems = (t("aboutPage.philosophy.items") as unknown as { title: string; desc: string }[]) || [];

  return (
    <div className="bg-[#0D0D11] text-[#F9FAFB]">
      {/* Hero Section */}
      <section className="pt-44 pb-28 relative overflow-hidden">
        {/* Geometric decorations */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="about-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-grid)" />
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-3 mb-6 justify-center lg:justify-start">
              <div className="w-8 h-px bg-[#DFBA73]" />
              <span
                className="text-[#DFBA73] text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("aboutPage.hero.label")}
              </span>
            </div>
            <h1
              className="leading-[1.1] mb-8"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 700,
              }}
            >
              {t("aboutPage.hero.heading1")}{" "}
              <em style={{ fontStyle: "italic", color: "#DFBA73" }}>
                {t("aboutPage.hero.heading2")}
              </em>
            </h1>
            <p
              className="text-[#F9FAFB]/60 text-lg md:text-xl font-light leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("aboutPage.hero.sub")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-[#F9FAFB] text-[#0D0D11]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span
              className="text-[#DFBA73] text-xs tracking-[0.3em] uppercase mb-3 block"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("home.about.label")}
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {t("aboutPage.philosophy.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophyItems.map((item, i) => {
              const Icon = philosophyIcons[i] || Sparkles;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="bg-white border border-[#0D0D11]/5 p-10 hover:shadow-[0_20px_50px_rgba(13, 13, 17,0.06)] hover:border-[#DFBA73]/20 transition-all duration-300 relative group"
                >
                  <div className="w-12 h-12 rounded-full border border-[#0D0D11]/10 flex items-center justify-center mb-6 group-hover:border-[#DFBA73] transition-colors">
                    <Icon size={20} className="text-[#DFBA73]" />
                  </div>
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[#0D0D11]/60 text-sm leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <span
              className="text-[#DFBA73] text-xs tracking-[0.3em] uppercase mb-3 block"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("aboutPage.team.title")}
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold font-serif"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {t("aboutPage.team.title") === "Our Team" ? "The Minds Behind Altus" : "Οι Άνθρωποι της Altus"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-[#1C1C24] border border-white/6 hover:border-[#DFBA73]/45 transition-all duration-300 p-8 flex flex-col justify-between group"
              >
                <div>
                  {/* Monogram placeholder */}
                  <div className="w-16 h-16 rounded-full border border-white/10 bg-[#0D0D11] flex items-center justify-center text-[#DFBA73] text-lg font-bold font-serif mb-8 group-hover:shadow-[0_0_20px_rgba(223, 186, 115,0.3)] transition-all">
                    {member.initials}
                  </div>
                  <h3
                    className="text-lg font-semibold text-[#F9FAFB]"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {t("nav.about") === "About" ? member.nameEn : member.name}
                  </h3>
                  <p
                    className="text-[#DFBA73] text-xs tracking-wider uppercase mt-1 mb-6 font-medium"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t(`aboutPage.team.roles.${member.roleKey}`)}
                  </p>
                  <p
                    className="text-[#F9FAFB]/50 text-sm leading-relaxed font-light"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t("nav.about") === "About" ? member.descEn : member.descEl}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#F9FAFB] text-[#0D0D11] text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2
            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {t("nav.about") === "About" 
              ? "Let's turn your vision into digital reality" 
              : "Ας μετατρέψουμε το όραμά σας σε ψηφιακή πραγματικότητα"}
          </h2>
          <p
            className="text-[#0D0D11]/55 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
          >
            {t("nav.about") === "About"
              ? "Start a discussion with our design and development team to outline your custom platform requirements."
              : "Ξεκινήστε μια συζήτηση με τη δημιουργική και τεχνική μας ομάδα για να σχεδιάσουμε τις δικές σας custom προδιαγραφές."}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#0D0D11] text-[#F9FAFB] text-sm tracking-wider uppercase hover:bg-[#1C1C24] transition-all group"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: "0.12em" }}
          >
            {t("home.cta.btn")}
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
