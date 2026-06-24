import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Outer ring spring configuration (delayed, smooth trailing)
  const ringX = useSpring(cursorX, { damping: 28, stiffness: 180, mass: 0.6 });
  const ringY = useSpring(cursorY, { damping: 28, stiffness: 180, mass: 0.6 });

  // Inner dot spring configuration (tighter, fast response)
  const dotX = useSpring(cursorX, { damping: 35, stiffness: 350, mass: 0.25 });
  const dotY = useSpring(cursorY, { damping: 35, stiffness: 350, mass: 0.25 });

  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the device has a hover capable pointer (Desktop)
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mediaQuery.matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener("mousemove", moveCursor);

    // Watch mouseover events to detect interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.tagName === "INPUT" || 
        target.tagName === "SELECT" || 
        target.tagName === "TEXTAREA" || 
        target.closest("a") || 
        target.closest("button") || 
        target.closest("[role='button']") ||
        target.closest(".cursor-pointer");

      setIsHovered(!!isInteractive);
    };

    window.addEventListener("mouseover", handleMouseOver);

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", () => setIsVisible(true));

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#DFBA73]/40 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 hidden lg:block"
        style={{
          x: ringX,
          y: ringY,
          scale: isHovered ? 1.6 : 1,
          backgroundColor: isHovered ? "rgba(223, 186, 115, 0.08)" : "transparent",
          borderColor: isHovered ? "#DFBA73" : "rgba(223, 186, 115, 0.4)",
        }}
      />
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#DFBA73] pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 hidden lg:block"
        style={{
          x: dotX,
          y: dotY,
          scale: isHovered ? 0.3 : 1,
        }}
      />
    </>
  );
}
