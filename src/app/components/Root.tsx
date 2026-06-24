import { Outlet, useLocation, Link } from "react-router";
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

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

function getReferrer() {
  const ref = document.referrer;
  if (!ref) return "Direct";
  try {
    const url = new URL(ref);
    if (url.hostname === window.location.hostname) return "Internal";
    return url.hostname;
  } catch (e) {
    return "Other";
  }
}

export function Root() {
  const { pathname } = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dynamic maintenance mode states
  const [maintenanceActive, setMaintenanceActive] = useState(false);
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);

  // Stateful admin status
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("altus_admin") === "true");

  // 1. Check for ?preview=true on mount to bypass maintenance mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === "true") {
      localStorage.setItem("altus_admin", "true");
      setIsAdmin(true);
      
      // Clean query parameters from URL
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
      
      // Dispatch storage event so other tabs and components sync up
      window.dispatchEvent(new Event("storage"));
    }
  }, []);

  // 2. Sync admin status via storage event listener
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdmin(localStorage.getItem("altus_admin") === "true");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
  }, [isAdmin, pathname]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // 3. Track real page views in Supabase & localStorage (skip admin routes & admin sessions)
  useEffect(() => {
    if (isAdmin) return; // Don't count admin previews
    if (pathname.startsWith("/admin")) return; // Don't count admin page

    const device = getDeviceType();
    const referrer = getReferrer();
    const date = new Date().toISOString().split("T")[0];
    const viewPayload = { path: pathname, date, device, referrer };

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("page_views")
        .insert(viewPayload)
        .then(({ error }) => {
          if (error) console.warn("Page view tracking error:", error.message);
        });
    }

    // Fallback/Testing cache always logged locally
    try {
      const cached = localStorage.getItem("altus_page_views");
      const list = cached ? JSON.parse(cached) : [];
      list.push({
        id: "view-" + Date.now() + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        ...viewPayload
      });
      if (list.length > 1000) list.shift();
      localStorage.setItem("altus_page_views", JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to write page view to localStorage:", e);
    }
  }, [pathname, isAdmin]);

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
      <div className="min-h-screen bg-[#0D0D11] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#DFBA73]/40 border-t-[#DFBA73] rounded-full animate-spin" />
      </div>
    );
  }

  if (maintenanceActive && !isAdmin) {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <MaintenancePage />
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  const renderAdminFloat = () => {
    if (!isAdmin || pathname.startsWith("/admin")) return null;

    return (
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 99999,
          background: "rgba(13, 13, 17, 0.95)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(223, 186, 115, 0.3)",
          borderRadius: 16,
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 8px #22c55e",
            display: "inline-block"
          }} />
          <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Admin Session
          </span>
        </div>

        <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.15)" }} />

        <Link
          to="/admin"
          style={{
            color: "#DFBA73",
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "color 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ebd083")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#DFBA73")}
        >
          <span>Dashboard</span>
          <span style={{ fontSize: 12 }}>→</span>
        </Link>
      </div>
    );
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-[#F9FAFB]">
          <CustomCursor />
          {/* Global Scroll Progress Bar */}
          <div
            className="fixed top-0 left-0 h-[3px] bg-[#DFBA73] z-[9999] transition-all duration-75 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
          <Navbar />
          <main>
            <Outlet />
          </main>
          <Footer />
          <CookieBanner />
          <AltusAssistant />
          {renderAdminFloat()}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

