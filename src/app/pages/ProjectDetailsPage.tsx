import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Calendar, Tag, Compass, LineChart, Globe } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { getProjects, Project } from "@/app/utils/projects";

export function ProjectDetailsPage() {
  const { projectId } = useParams();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);

  useEffect(() => {
    const list = getProjects();
    const index = list.findIndex((p) => p.id === projectId);
    
    if (index === -1) {
      // If not found by ID, try finding by matching name/slug
      const foundByName = list.find(p => p.name.toLowerCase().replace(/\s+/g, "-") === projectId);
      if (foundByName) {
        setProject(foundByName);
        const idx = list.indexOf(foundByName);
        const nextIdx = (idx + 1) % list.length;
        setNextProject(list[nextIdx]);
      } else {
        navigate("/portfolio");
      }
      return;
    }

    setProject(list[index]);
    const nextIndex = (index + 1) % list.length;
    setNextProject(list[nextIndex]);
  }, [projectId, navigate]);

  useEffect(() => {
    if (project) {
      document.title = `${project.name} | Case Study`;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [project]);

  if (!project) return null;

  return (
    <div className="bg-[#0A0F1E] text-[#F5F5F0] min-h-screen">
      {/* Back button header */}
      <div className="absolute top-28 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-[#F5F5F0]/60 hover:text-[#C9A84C] transition-colors group cursor-pointer text-xs tracking-wider uppercase font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {t("projectDetails.backToPortfolio")}
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-end pt-40 pb-20 overflow-hidden">
        {/* Cover image background */}
        <div className="absolute inset-0 z-0">
          <img
            src={project.img}
            alt={project.name}
            className="w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/60 to-[#0A0F1E]/90" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4 block"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {project.category} · Case Study
            </span>
            <h1
              className="font-bold leading-none mb-8 text-left"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              }}
            >
              {project.name}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Meta Grid Section */}
      <section className="border-y border-white/10 bg-[#0C1224] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Year */}
          <div className="flex gap-3.5 items-start">
            <Calendar size={18} className="text-[#C9A84C] shrink-0 mt-0.5" />
            <div>
              <p className="text-white/40 text-[10px] tracking-widest uppercase mb-1">{t("projectDetails.year")}</p>
              <p className="text-[#F5F5F0] text-sm font-medium">{project.year}</p>
            </div>
          </div>

          {/* Category */}
          <div className="flex gap-3.5 items-start">
            <Compass size={18} className="text-[#C9A84C] shrink-0 mt-0.5" />
            <div>
              <p className="text-white/40 text-[10px] tracking-widest uppercase mb-1">{t("projectDetails.category")}</p>
              <p className="text-[#F5F5F0] text-sm font-medium">{project.category}</p>
            </div>
          </div>

          {/* Results */}
          <div className="flex gap-3.5 items-start">
            <LineChart size={18} className="text-[#C9A84C] shrink-0 mt-0.5" />
            <div>
              <p className="text-white/40 text-[10px] tracking-widest uppercase mb-1">{t("projectDetails.results")}</p>
              <p className="text-[#C9A84C] text-sm font-semibold">{project.results}</p>
            </div>
          </div>

          {/* Live Link */}
          <div className="flex gap-3.5 items-start">
            <Globe size={18} className="text-[#C9A84C] shrink-0 mt-0.5" />
            <div>
              <p className="text-white/40 text-[10px] tracking-widest uppercase mb-1">Live URL</p>
              {project.isLive && project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F5F5F0] hover:text-[#C9A84C] text-sm font-medium flex items-center gap-1 transition-colors group cursor-pointer"
                >
                  {project.liveUrl.replace("https://", "")}
                  <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              ) : (
                <p className="text-white/20 text-sm font-light">Internal Showcase</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Details Section */}
      <section className="py-24 bg-[#F5F5F0] text-[#0A0F1E] relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main narrative */}
          <div className="lg:col-span-8 space-y-12">
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t("projectDetails.challenge")}
              </h2>
              <p
                className="text-[#0A0F1E]/70 leading-relaxed text-base font-light"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {lang === "el"
                  ? `Στόχος του project "${project.name}" ήταν η δημιουργία μιας ψηφιακής παρουσίας που θα αντικατοπτρίζει απόλυτα την ποιότητα και το premium προφίλ της επιχείρησης. Η κύρια πρόκληση ήταν να συνδυαστεί η αισθητική υπεροχή με την κορυφαία ταχύτητα φόρτωσης και την εύκολη πλοήγηση για τον χρήστη, ενισχύοντας ταυτόχρονα το brand awareness.`
                  : `The primary objective for "${project.name}" was building a digital storefront reflecting the premium status of the brand. The challenge involved combining rich custom layout options and responsive assets with fast loading metrics, optimized search engine results, and clean conversion goals.`}
              </p>
            </div>

            <div>
              <h2
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t("projectDetails.solution")}
              </h2>
              <p
                className="text-[#0A0F1E]/70 leading-relaxed text-base font-light"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {project.description}. {lang === "el"
                  ? "Σχεδιάσαμε μια custom μακέτα στο Figma από το μηδέν και στη συνέχεια την αναπτύξαμε χρησιμοποιώντας σύγχρονες τεχνολογίες React, προσφέροντας μια εξαιρετικά γρήγορη και απρόσκοπτη εμπειρία πλοήγησης (Core Web Vitals Optimized) με micro-interactions και responsive layouts."
                  : "We created custom design layouts from scratch and engineered a React application layout that functions smoothly under mobile, tablet, and widescreen viewports with fast interactions."}
              </p>
            </div>
          </div>

          {/* Sidebar / Technologies */}
          <div className="lg:col-span-4 lg:pl-8">
            <div className="border border-[#0A0F1E]/10 p-8 bg-white">
              <div className="flex items-center gap-2 mb-6">
                <Tag size={16} className="text-[#C9A84C]" />
                <h3
                  className="text-sm font-bold tracking-widest uppercase"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {t("projectDetails.tags")}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 border border-[#0A0F1E]/10 text-[#0A0F1E]/70 text-xs tracking-wide hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="py-24 border-t border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h2
              className="text-2xl md:text-3xl font-bold mb-16 text-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t("projectDetails.gallery")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.gallery.map((imgUrl, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="border border-white/5 overflow-hidden aspect-[16/10] bg-[#141929]"
                >
                  <img
                    src={imgUrl}
                    alt={`${project.name} screenshot ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Next Project Footer CTA */}
      {nextProject && (
        <Link
          to={`/portfolio/${nextProject.id}`}
          className="block py-32 bg-[#10162A] text-center border-t border-white/5 relative z-10 group cursor-pointer hover:bg-[#141B33] transition-colors duration-500"
        >
          <span
            className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4 block"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {t("projectDetails.nextProject")}
          </span>
          <h2
            className="text-[#F5F5F0] text-3xl md:text-5xl font-bold font-serif group-hover:text-[#C9A84C] transition-colors inline-flex items-center gap-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {nextProject.name}
            <ArrowUpRight size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </h2>
        </Link>
      )}
    </div>
  );
}
