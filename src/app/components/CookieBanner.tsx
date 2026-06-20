import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("altus_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (status: "accepted" | "declined") => {
    localStorage.setItem("altus_cookie_consent", status);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 md:max-w-md z-50 p-6 md:p-8 bg-[#0A0F1E]/90 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col gap-5 text-[#F5F5F0]"
        >
          <div className="space-y-2">
            <h4
              className="text-[#C9A84C] text-sm tracking-wider uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Cookies & Ιδιωτικότητα
            </h4>
            <p
              className="text-xs text-[#F5F5F0]/70 leading-relaxed font-light"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σας στην ιστοσελίδα μας. Μάθετε περισσότερα στην{" "}
              <Link to="/privacy-policy" className="underline hover:text-[#C9A84C] transition-colors">
                Πολιτική Απορρήτου
              </Link>
              .
            </p>
          </div>
          <div className="flex gap-3 justify-end text-xs tracking-wider uppercase font-semibold">
            <button
              onClick={() => handleConsent("declined")}
              className="px-5 py-2.5 border border-white/20 text-[#F5F5F0] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Απόρριψη
            </button>
            <button
              onClick={() => handleConsent("accepted")}
              className="px-5 py-2.5 bg-[#C9A84C] text-[#0A0F1E] hover:bg-[#D4B76A] transition-colors duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Αποδοχή
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
