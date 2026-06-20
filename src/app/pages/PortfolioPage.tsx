import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { LightboxModal } from "@/app/components/LightboxModal";
import { getProjects, Project } from "@/app/utils/projects";

export function PortfolioPage() {
  const { t } = useLanguage();
  const [projectsList, setProjectsList] = useState<Project[]>([]);

  const allLabel = t("portfolio.filter.all");
  const categories = [allLabel, "Website", "E-Shop"];

  useEffect(() => {
    document.title = `Portfolio | Altus Studio`;
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
  }, [allLabel]);

  const [activeCategory, setActiveCategory] = useState(allLabel);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = projectsList.filter((p) => {
    const matchesCategory = activeCategory === allLabel || p.category === activeCategory;
    const matchesTag = !selectedTag || p.tags.includes(selectedTag);
    return matchesCategory && matchesTag;
  });

  return (
    <div className="bg-[#0A0F1E]">
      {/* Hero */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pgrid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pgrid)" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-[#C9A84C]" />
              <span
                className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Portfolio
              </span>
            </div>
            <h1
              className="text-[#F5F5F0]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {t("portfolio.hero.heading1")}
              <br />
              <em style={{ fontStyle: "italic", color: "#C9A84C" }}>{t("portfolio.hero.heading2")}</em>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-12 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedTag(null); // Reset tag filter on category change
              }}
              className={`px-6 py-2 text-xs tracking-wider uppercase transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-[#C9A84C] text-[#0A0F1E]"
                  : "border border-white/15 text-[#F5F5F0]/50 hover:border-white/30 hover:text-[#F5F5F0]"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.1em" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {selectedTag && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-4 py-2 text-xs text-[#C9A84C]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span>Tag: <strong className="text-[#F5F5F0]">{selectedTag}</strong></span>
            <button
              onClick={() => setSelectedTag(null)}
              className="ml-2 text-[#F5F5F0]/40 hover:text-[#F5F5F0] font-bold cursor-pointer text-sm leading-none"
              aria-label="Clear tag"
            >
              ×
            </button>
          </motion.div>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                layout
                key={project.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative group cursor-pointer bg-[#0A0F1E]"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelectedProject(project)}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={project.img}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/20 to-transparent group-hover:from-[#0A0F1E]/95 transition-all duration-500" />
                  
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
                </div>

                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  {/* Tags */}
                  <div
                    className={`flex flex-wrap gap-2 mb-4 transition-all duration-500 ${
                      hovered === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent lightbox modal trigger
                          setSelectedTag(tag === selectedTag ? null : tag);
                        }}
                        className={`px-3 py-1 border text-xs tracking-wide cursor-pointer transition-all duration-300 ${
                          selectedTag === tag
                            ? "bg-[#C9A84C] border-[#C9A84C] text-[#0A0F1E] font-medium"
                            : "border-white/20 text-[#F5F5F0]/70 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                        }`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p
                        className="text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase mb-1"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {project.category} · {project.year}
                      </p>
                      <h3
                        className="text-[#F5F5F0]"
                        style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}
                      >
                        {project.name}
                      </h3>
                    </div>
                    <div
                      className={`transition-all duration-500 ${
                        hovered === i ? "opacity-100 scale-100" : "opacity-0 scale-90"
                      }`}
                    >
                      <div className="w-10 h-10 bg-[#C9A84C] flex items-center justify-center">
                        <ArrowUpRight size={16} className="text-[#0A0F1E]" />
                      </div>
                    </div>
                  </div>

                  {/* Description + result */}
                  <div
                    className={`mt-4 transition-all duration-500 ${
                      hovered === i ? "opacity-100 max-h-24" : "opacity-0 max-h-0"
                    } overflow-hidden`}
                  >
                    <p
                      className="text-[#F5F5F0]/55 text-sm mb-3"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                    >
                      {project.description}
                    </p>
                    <p
                      className="text-[#C9A84C] text-xs tracking-wider"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      ↑ {project.results}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* CTA */}
      <section className="py-24 bg-[#F5F5F0] text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2
            className="text-[#0A0F1E] mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700 }}
          >
            {t("portfolio.cta.heading")}
          </h2>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 bg-[#0A0F1E] text-[#F5F5F0] text-sm tracking-wider uppercase hover:bg-[#141929] transition-colors duration-300 group"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: "0.12em" }}
          >
            {t("portfolio.cta.btn")}
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </section>

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
      />
    </div>
  );
}
