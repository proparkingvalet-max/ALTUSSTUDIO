import { Outlet, useLocation } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CookieBanner } from "./CookieBanner";
import { ViberButton } from "./ViberButton";
import { useEffect, useState } from "react";
import { LanguageProvider } from "@/app/context/LanguageContext";

export function Root() {
  const { pathname } = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#F5F5F0]">
        {/* Global Scroll Progress Bar */}
        <div
          className="fixed top-0 left-0 h-[3px] bg-[#C9A84C] z-[9999] transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
        <CookieBanner />
        <ViberButton />
      </div>
    </LanguageProvider>
  );
}

