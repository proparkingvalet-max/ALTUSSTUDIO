import { Outlet, useLocation } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CookieBanner } from "./CookieBanner";
import { useEffect, useState } from "react";
import { LanguageProvider } from "@/app/context/LanguageContext";
import { AltusAssistant } from "./AltusAssistant";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { CustomCursor } from "./CustomCursor";
import { MaintenancePage } from "./MaintenancePage";
import { supabase, isSupabaseConfigured } from "@/app/utils/supabaseClient";

export function Root() {
  const { pathname } = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dynamic maintenance mode states
  const [maintenanceActive, setMaintenanceActive] = useState(false);
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);

  const isAdminLoggedIn = localStorage.getItem("altus_admin") === "true";

  useEffect(() => {
    // Dynamic settings loading (Maintenance & Contact Info)
    if (isSupabaseConfigured && supabase) {
      // 1. Fetch Maintenance Mode
      supabase
        .from("settings")
        .select("value")
        .eq("key", "maintenance_mode")
        .maybeSingle()
        .then(({ data, error }) => {
          if (!error && data) {
            setMaintenanceActive(!!data.value?.enabled);
          }
          setLoadingMaintenance(false);
        });

      // 2. Fetch Contact Info
      supabase
        .from("settings")
        .select("value")
        .eq("key", "contact_info")
        .maybeSingle()
        .then(({ data, error }) => {
          if (!error && data && data.value) {
            localStorage.setItem("altus_contact_info", JSON.stringify({
              phone: data.value.phone,
              email: data.value.email
            }));
            window.dispatchEvent(new Event("storage"));
          }
        });
    } else {
      // Local fallback
      const localMode = localStorage.getItem("altus_maintenance") === "true";
      setMaintenanceActive(localMode);
      setLoadingMaintenance(false);
    }
  }, [isAdminLoggedIn, pathname]);

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

  if (loadingMaintenance) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A84C]/40 border-t-[#C9A84C] rounded-full animate-spin" />
      </div>
    );
  }

  if (maintenanceActive && !isAdminLoggedIn) {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <MaintenancePage />
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-[#F5F5F0]">
          <CustomCursor />
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
          <AltusAssistant />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

