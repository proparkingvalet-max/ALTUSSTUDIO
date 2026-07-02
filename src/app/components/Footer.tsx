import { Link } from "react-router";
import { Linkedin } from "lucide-react";
import altusLogo from "@/assets/new_logo.png";
import logoDark from "@/assets/logo_dark.png";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import { useContactInfo } from "@/app/utils/supabaseClient";

export function Footer() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const contactInfo = useContactInfo();

  const navLinks = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.services"), to: "/services" },
    { label: "Portfolio", to: "/portfolio" },
    { label: t("nav.about"), to: "/about" },
    { label: t("nav.blog"), to: "/blog" },
    { label: t("nav.contact"), to: "/contact" },
  ];

  const activeLogo = theme === "light" ? logoDark : altusLogo;

  return (
    <footer className="bg-[#0D0D11] border-t border-white/8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Main Row */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-6">
              <img src={activeLogo} alt="Altus Studio Logo" className="h-10 w-auto object-contain" />
            </div>
            <p
              className="text-[#F9FAFB]/50 text-sm leading-relaxed max-w-xs"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("footer.tagline")}
            </p>
            <p
              className="text-[#DFBA73] text-xs mt-4 font-light tracking-wider"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("footer.coverage")}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4 md:items-center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[#F9FAFB]/60 text-sm tracking-wider uppercase hover:text-[#DFBA73] transition-colors duration-300"
                style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.1em" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social + Contact */}
          <div className="md:text-right">
            <p
              className="text-[#F9FAFB]/50 text-sm mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {contactInfo.email}
            </p>
            <div className="flex gap-4 md:justify-end">
              {[
                { Icon: Linkedin, label: "LinkedIn", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-white/15 flex items-center justify-center text-[#F9FAFB]/50 hover:border-[#DFBA73] hover:text-[#DFBA73] transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-[#F9FAFB]/30 text-xs tracking-wider"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {t("footer.rights")}
          </p>
          <div className="flex gap-4">
            <Link
              to="/privacy-policy"
              className="text-[#F9FAFB]/30 hover:text-[#DFBA73] text-xs tracking-wider transition-colors duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("footer.privacy")}
            </Link>
            <span className="text-[#F9FAFB]/10 text-xs">•</span>
            <Link
              to="/terms-of-use"
              className="text-[#F9FAFB]/30 hover:text-[#DFBA73] text-xs tracking-wider transition-colors duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
