import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Sun, Moon } from "lucide-react";
import altusLogo from "@/assets/new_logo.png";
import logoDark from "@/assets/logo_dark.png";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.services"), to: "/services" },
    { label: "Portfolio", to: "/portfolio" },
    { label: t("nav.about"), to: "/about" },
    { label: t("nav.blog"), to: "/blog" },
    { label: t("nav.contact"), to: "/contact" },
  ];

  const isDarkPage =
    location.pathname === "/" ||
    location.pathname === "/portfolio" ||
    location.pathname === "/about" ||
    location.pathname.startsWith("/blog") ||
    location.pathname === "/contact";

  const isVisualDark = theme === "dark" && isDarkPage;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navBg = scrolled
    ? "bg-[#0A0F1E]/95 backdrop-blur-md shadow-lg shadow-black/20"
    : isVisualDark
    ? "bg-transparent"
    : "bg-[#F5F5F0]/95 backdrop-blur-md shadow-sm shadow-black/5";

  const textColor = isVisualDark || scrolled ? "text-[#F5F5F0]" : "text-[#0A0F1E]";
  const activeLogo = theme === "light" && !scrolled ? logoDark : altusLogo;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img src={activeLogo} alt="Altus Studio Logo" className="h-10 md:h-11 w-auto object-contain" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${textColor} text-sm tracking-wider uppercase transition-all duration-300 relative group hover:text-[#C9A84C]`}
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, letterSpacing: "0.1em" }}
            >
              {link.label}
              <span
                className={`absolute -bottom-0.5 left-0 h-px bg-[#C9A84C] transition-all duration-300 ${
                  location.pathname === link.to ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}

          {/* Language Toggle */}
          <div
            className="flex items-center gap-0 rounded-full border overflow-hidden"
            style={{ borderColor: isVisualDark || scrolled ? "rgba(255,255,255,0.15)" : "rgba(10,15,30,0.15)" }}
          >
            {(["el", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="transition-all duration-200"
                style={{
                  padding: "5px 12px",
                  fontSize: 11,
                  fontWeight: lang === l ? 700 : 400,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: lang === l ? "#C9A84C" : "transparent",
                  color: lang === l ? "#0A0F1E" : (isVisualDark || scrolled ? "rgba(255,255,255,0.5)" : "rgba(10,15,30,0.4)"),
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme Toggle (Desktop) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all duration-300 cursor-pointer ${
              isVisualDark || scrolled
                ? "border-white/10 text-[#F5F5F0] hover:bg-white/5"
                : "border-black/10 text-[#0A0F1E] hover:bg-black/5"
            }`}
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <Link
            to="/contact"
            className="px-6 py-2.5 bg-[#C9A84C] text-[#0A0F1E] text-sm tracking-wider uppercase hover:bg-[#D4B76A] transition-colors duration-300"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: "0.1em" }}
          >
            {t("nav.cta")}
          </Link>
        </div>

        {/* Mobile: lang toggle + theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <div className="flex items-center rounded-full overflow-hidden border" style={{ borderColor: isVisualDark || scrolled ? "rgba(255,255,255,0.15)" : "rgba(10,15,30,0.15)" }}>
            {(["el", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: "4px 10px",
                  fontSize: 10,
                  fontWeight: lang === l ? 700 : 400,
                  background: lang === l ? "#C9A84C" : "transparent",
                  color: lang === l ? "#0A0F1E" : (isVisualDark || scrolled ? "rgba(255,255,255,0.5)" : "rgba(10,15,30,0.4)"),
                  border: "none",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme Toggle (Mobile) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all duration-300 cursor-pointer ${
              isVisualDark || scrolled
                ? "border-white/10 text-[#F5F5F0] hover:bg-white/5"
                : "border-black/10 text-[#0A0F1E] hover:bg-black/5"
            }`}
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
          >
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <button
            className={`${textColor} transition-colors`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-[#0A0F1E] border-t border-white/10`}
      >
        <div className="px-6 py-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-base tracking-wider uppercase transition-colors ${
                location.pathname === link.to ? "text-[#C9A84C]" : "text-[#F5F5F0] hover:text-[#C9A84C]"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.12em" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="mt-2 px-6 py-3 bg-[#C9A84C] text-[#0A0F1E] text-sm tracking-wider uppercase text-center hover:bg-[#D4B76A] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
          >
            {t("nav.ctaMobile")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
