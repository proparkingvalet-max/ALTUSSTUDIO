import { motion } from "motion/react";
import { useState } from "react";

export function ViberButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 md:right-12 z-40 flex items-center gap-3">
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
        className="hidden md:block bg-[#0A0F1E] border border-white/10 px-4 py-2 text-xs text-[#F5F5F0] tracking-wider uppercase shadow-xl pointer-events-none"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Chat on Viber
      </motion.div>

      {/* Button */}
      <a
        href="viber://chat?number=%2B306970015447"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex items-center justify-center w-14 h-14 bg-[#7309F3] hover:bg-[#6005D7] rounded-full shadow-2xl transition-colors duration-300 group"
        aria-label="Chat on Viber"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-[#7309F3]/30 animate-ping pointer-events-none" />

        {/* Viber SVG Icon */}
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="text-white transition-transform duration-300 group-hover:scale-110"
          fill="currentColor"
        >
          <path d="M19.98 12.06c0-1.84-.52-3.56-1.42-5.02L19.9 3.51a.63.63 0 0 0-.82-.82L15.55 4c-1.46-.9-3.18-1.42-5.02-1.42C5.3 2.58.5 7.38.5 12.06s4.8 9.48 10.03 9.48c1.84 0 3.56-.52 5.02-1.42l3.53 1.31a.63.63 0 0 0 .82-.82l-1.31-3.53c.9-1.46 1.42-3.18 1.42-5.02zm-5.49 4.31c-.34.34-.8.53-1.28.53-.29 0-.58-.07-.84-.21-1.3-.72-2.39-1.81-3.11-3.11a1.8 1.8 0 0 1 .32-2.12c.44-.44 1.05-.62 1.63-.44.25.08.45.28.53.53l.66 2.02c.09.28.02.59-.18.8l-.51.51c.36.72.93 1.29 1.65 1.65l.51-.51c.21-.21.52-.27.8-.18l2.02.66c.25.08.45.28.53.53.18.58 0 1.19-.44 1.63z" />
        </svg>
      </a>
    </div>
  );
}
