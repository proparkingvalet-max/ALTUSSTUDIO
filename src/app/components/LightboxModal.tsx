import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  projectName: string;
  projectCategory: string;
}

export function LightboxModal({
  isOpen,
  onClose,
  images,
  projectName,
  projectCategory,
}: LightboxModalProps) {
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
      {isOpen && images.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#0A0F1E]/95 backdrop-blur-md p-4 md:p-8 select-none"
        >
          {/* Header */}
          <div className="flex justify-between items-center w-full z-10">
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
              className="p-3 bg-white/5 border border-white/10 text-[#F5F5F0] hover:bg-white/10 hover:text-white rounded-full transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Content (Image viewport + controls) */}
          <div className="relative flex-1 flex items-center justify-center py-4">
            {/* Left Button */}
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-6 p-3 bg-white/5 border border-white/10 text-[#F5F5F0] hover:bg-white/10 hover:text-white rounded-full transition-all duration-300 z-10"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Main Image Slider */}
            <div className="relative w-full max-w-5xl h-full max-h-[70vh] flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={images[currentIndex]}
                    alt={`${projectName} Screenshot ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-lg border border-white/5 shadow-2xl"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Button */}
            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-6 p-3 bg-white/5 border border-white/10 text-[#F5F5F0] hover:bg-white/10 hover:text-white rounded-full transition-all duration-300 z-10"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Footer (Counter + Thumbnails) */}
          <div className="flex flex-col items-center gap-4 w-full z-10 mb-2">
            <span
              className="text-white/45 text-xs font-mono"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {currentIndex + 1} / {images.length}
            </span>

            {images.length > 1 && (
              <div className="flex gap-2.5 max-w-full overflow-x-auto py-1 px-4 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-14 h-10 md:w-20 md:h-14 rounded-md overflow-hidden border transition-all duration-300 ${
                      currentIndex === idx
                        ? "border-[#C9A84C] scale-105 opacity-100"
                        : "border-white/10 opacity-40 hover:opacity-75"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
