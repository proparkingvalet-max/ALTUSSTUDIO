import { motion } from "motion/react";
import { Mail, Phone, Send, Lock, Construction } from "lucide-react";

export function MaintenancePage() {
  return (
    <div
      className="min-h-screen bg-[#0A0F1E] flex flex-col justify-between items-center px-6 py-12 relative overflow-hidden text-[#F5F5F0]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Decorative background gradients */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] sm:w-[50vw] sm:h-[50vw] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(33,150,243,0.03) 0%, transparent 70%)" }}
        />
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mgrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mgrid)" />
        </svg>
      </div>

      {/* Top Section - Brand */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex items-center gap-3 mt-6"
      >
        <span
          className="text-lg font-bold tracking-[0.25em] text-[#C9A84C]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          ALTUS STUDIO
        </span>
      </motion.div>

      {/* Main Content - Maintenance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="z-10 w-full max-w-xl bg-white/[0.02] border border-white/5 backdrop-blur-md p-8 md:p-12 text-center rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] my-auto relative"
      >
        {/* Animated Construction / Wrench icon */}
        <div className="mx-auto w-16 h-16 bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center rounded-2xl mb-8 relative">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Construction className="text-[#C9A84C]" size={28} />
          </motion.div>
          <span className="absolute -inset-1 rounded-2xl bg-[#C9A84C] opacity-10 blur-sm animate-pulse" />
        </div>

        {/* Greek Content */}
        <div className="mb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-[#F5F5F0]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Υπό Συντήρηση
          </h1>
          <p className="text-[#F5F5F0]/60 text-sm leading-relaxed max-w-md mx-auto font-light">
            Η ιστοσελίδα μας αναβαθμίζεται για να σας προσφέρει μια ακόμη καλύτερη και πιο σύγχρονη εμπειρία. Θα είμαστε ξανά κοντά σας πολύ σύντομα.
          </p>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-[#C9A84C]/20 mx-auto mb-8" />

        {/* English Content */}
        <div className="mb-10">
          <h2
            className="text-2xl font-bold tracking-tight mb-3 text-[#F5F5F0]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Under Maintenance
          </h2>
          <p className="text-[#F5F5F0]/50 text-sm leading-relaxed max-w-md mx-auto font-light">
            Our website is currently undergoing scheduled updates to deliver a premium service experience. We will be back online shortly.
          </p>
        </div>

        {/* Contact info list */}
        <div className="pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {[
            { icon: Mail, label: "EMAIL", val: "info@altus-studio.gr", href: "mailto:info@altus-studio.gr" },
            { icon: Phone, label: "PHONE", val: "6970015447", href: "tel:6970015447" },
            { icon: Send, label: "TELEGRAM", val: "@altus_studio", href: "https://t.me/altus_studio" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={idx}
                href={item.href}
                target={item.label === "TELEGRAM" ? "_blank" : undefined}
                rel={item.label === "TELEGRAM" ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#C9A84C]/40 group-hover:bg-[#C9A84C]/10 transition-colors">
                  <Icon size={14} className="text-[#C9A84C] group-hover:scale-110 transition-transform" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[9px] tracking-wider text-[#C9A84C] font-semibold">
                    {item.label}
                  </span>
                  <span className="block text-xs text-[#F5F5F0]/70 truncate font-mono">
                    {item.val}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </motion.div>

      {/* Footer - Lock icon gateway */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 mt-6"
      >
        <a
          href="/admin"
          className="flex items-center gap-1.5 text-xs text-[#F5F5F0]/40 hover:text-[#C9A84C] transition-colors duration-300 font-mono tracking-wider"
          title="Admin Login Gateway"
        >
          <Lock size={12} />
          <span>secure area</span>
        </a>
      </motion.div>
    </div>
  );
}
