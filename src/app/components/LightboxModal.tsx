import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, CheckCircle2, Calendar, Target, Globe, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { Link } from "react-router";

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  projectName: string;
  projectCategory: string;
  projectDescription?: string;
  projectResults?: string;
  projectYear?: string;
  projectTags?: string[];
  projectIsLive?: boolean;
  projectLiveUrl?: string;
}

export function LightboxModal({
  isOpen,
  onClose,
  images,
  projectName,
  projectCategory,
  projectDescription = "",
  projectResults = "",
  projectYear = "",
  projectTags = [],
  projectIsLive = false,
  projectLiveUrl = "",
}: LightboxModalProps) {
  const { lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when opening a different project
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen, images]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-[#0A0F1E]/98 backdrop-blur-xl p-4 md:p-8 select-none flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center w-full pb-4 border-b border-white/5 z-10 shrink-0">
            <div>
              <p
                className="text-[#C9A84C] text-[10px] sm:text-xs tracking-[0.25em] uppercase font-semibold mb-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {projectCategory}
              </p>
              <h4
                className="text-[#F5F5F0] text-lg sm:text-xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {projectName}
              </h4>
            </div>

            <button
              onClick={onClose}
              className="p-3 bg-white/5 border border-white/10 text-[#F5F5F0] hover:bg-white/10 hover:text-white rounded-full transition-all duration-300 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Body - Split Layout */}
          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-12 min-h-0 overflow-y-auto lg:overflow-hidden py-6">
            
            {/* Left Column: Image Viewport + controls */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full min-h-[350px] lg:min-h-0">
              
              {/* Main Image Viewport */}
              <div className="relative flex-1 flex items-center justify-center bg-black/20 border border-white/5 rounded-lg overflow-hidden min-h-0 p-4">
                {/* Left Arrow */}
                {images.length > 1 && (
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 p-3 bg-white/5 border border-white/10 text-[#F5F5F0] hover:bg-white/10 hover:text-white rounded-full transition-all duration-300 z-10 cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}

                {/* Slider Image Container */}
                <div className="w-full h-full max-h-[50vh] lg:max-h-[60vh] flex items-center justify-center overflow-hidden">
                  {images.length > 0 ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={images[currentIndex]}
                          alt={`${projectName} Screenshot ${currentIndex + 1}`}
                          className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
                        />
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="text-white/20 text-sm">No preview available</div>
                  )}
                </div>

                {/* Right Arrow */}
                {images.length > 1 && (
                  <button
                    onClick={handleNext}
                    className="absolute right-4 p-3 bg-white/5 border border-white/10 text-[#F5F5F0] hover:bg-white/10 hover:text-white rounded-full transition-all duration-300 z-10 cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>

              {/* Slider Footer Indicators */}
              <div className="flex flex-col items-center gap-3 mt-4 shrink-0">
                <span className="text-white/40 text-xs font-mono">
                  {images.length > 0 ? `${currentIndex + 1} / ${images.length}` : "0 / 0"}
                </span>

                {images.length > 1 && (
                  <div className="flex gap-2 max-w-full overflow-x-auto py-1 px-4 scrollbar-thin">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`relative w-14 h-10 rounded overflow-hidden border transition-all duration-300 cursor-pointer shrink-0 ${
                          currentIndex === idx
                            ? "border-[#C9A84C] scale-105 opacity-100"
                            : "border-white/10 opacity-30 hover:opacity-75"
                        }`}
                      >
                        <img
                          src={img}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Case Study Details */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-white/2 border border-white/5 p-6 md:p-8 rounded-lg h-full overflow-y-auto scrollbar-thin">
              
              <div className="space-y-6">
                
                {/* 🎯 Challenge / Overview */}
                <div>
                  <h5 className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-semibold mb-2 flex items-center gap-1.5">
                    <Target size={12} />
                    {lang === "el" ? "Η ΠΡΟΚΛΗΣΗ" : "THE CHALLENGE"}
                  </h5>
                  <p className="text-[#F5F5F0]/80 text-sm leading-relaxed font-light" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {projectDescription || (lang === "el" 
                      ? "Σχεδιασμός και ανάπτυξη μιας premium ψηφιακής παρουσίας με επίκεντρο την ταχύτητα, την αισθητική και τη βέλτιστη εμπειρία χρήσης."
                      : "Design and development of a premium digital experience focused on speed, aesthetics, and optimal user experience.")}
                  </p>
                </div>

                {/* ✨ Solution */}
                <div className="border-t border-white/5 pt-5">
                  <h5 className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-semibold mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={12} />
                    {lang === "el" ? "Η ΛΥΣΗ ALTUS" : "THE ALTUS SOLUTION"}
                  </h5>
                  <p className="text-[#F5F5F0]/60 text-xs leading-relaxed font-light" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {lang === "el" 
                      ? "Υλοποίηση custom σχεδιασμού (UI/UX) προσαρμοσμένου στις ανάγκες του brand, με χρήση React και Tailwind CSS για κορυφαίες επιδόσεις και βελτιστοποίηση SEO για μέγιστη προβολή."
                      : "Implementation of a bespoke UI/UX custom layout aligned with brand identity, built with React and Tailwind CSS for peak performance and fully SEO optimized."}
                  </p>
                </div>

                {/* 📈 Results & Impact */}
                {projectResults && (
                  <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/15 p-4 rounded-lg">
                    <p className="text-[#C9A84C] text-[9px] tracking-widest uppercase mb-1 font-semibold">
                      {lang === "el" ? "ΑΠΟΤΕΛΕΣΜΑ / IMPACT" : "RESULT / IMPACT"}
                    </p>
                    <p className="text-[#F5F5F0] text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {projectResults}
                    </p>
                  </div>
                )}

                {/* 🛠️ Tech Stack Tags */}
                {projectTags.length > 0 && (
                  <div className="border-t border-white/5 pt-5">
                    <h5 className="text-[#C9A84C] text-[9px] tracking-[0.2em] uppercase font-semibold mb-3">
                      {lang === "el" ? "ΤΕΧΝΟΛΟΓΙΕΣ" : "TECH STACK"}
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {projectTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 border border-white/10 bg-white/2 text-[10px] text-[#F5F5F0]/70 font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Meta Details */}
                <div className="border-t border-white/5 pt-5 grid grid-cols-2 gap-4 text-left">
                  {projectYear && (
                    <div>
                      <span className="text-white/30 text-[9px] tracking-wider uppercase block mb-1 flex items-center gap-1">
                        <Calendar size={11} /> {lang === "el" ? "ΕΤΟΣ" : "YEAR"}
                      </span>
                      <span className="text-[#F5F5F0] text-xs font-semibold">{projectYear}</span>
                    </div>
                  )}
                  {projectIsLive !== undefined && (
                    <div>
                      <span className="text-white/30 text-[9px] tracking-wider uppercase block mb-1 flex items-center gap-1">
                        <Globe size={11} /> STATUS
                      </span>
                      <span className={`text-xs font-semibold ${projectIsLive ? "text-emerald-400" : "text-amber-400"}`}>
                        {projectIsLive ? (lang === "el" ? "Live Ιστοσελίδα" : "Live Website") : (lang === "el" ? "Υπό Ανάπτυξη" : "In Development")}
                      </span>
                    </div>
                  )}
                </div>

              </div>

              {/* Call to Action at bottom */}
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-3">
                {projectIsLive && projectLiveUrl && (
                  <a
                    href={projectLiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#C9A84C] text-[#0A0F1E] text-xs tracking-wider uppercase font-semibold hover:bg-[#D4B76A] transition-colors duration-300 text-center"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {lang === "el" ? "Επισκεψη Ιστοσελιδας" : "Visit Live Website"}
                    <Globe size={14} />
                  </a>
                )}
                <Link
                  to="/contact"
                  onClick={onClose}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 ${
                    projectIsLive && projectLiveUrl
                      ? "bg-white/5 border border-white/10 text-[#F5F5F0] hover:bg-white/10 hover:text-white"
                      : "bg-[#C9A84C] text-[#0A0F1E] hover:bg-[#D4B76A]"
                  } text-xs tracking-wider uppercase font-semibold transition-colors duration-300`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {lang === "el" ? "Συζητηστε για το εργο σας" : "Let's build yours"}
                  <ArrowUpRight size={14} />
                </Link>
              </div>

            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
