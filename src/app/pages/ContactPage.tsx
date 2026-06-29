import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Mail, Send, ArrowUpRight, CheckCircle2, Phone } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { BookingCalendar } from "@/app/components/BookingCalendar";
import { supabase, isSupabaseConfigured, useContactInfo } from "@/app/utils/supabaseClient";
import { sendTelegramNotification } from "@/app/utils/telegram";
import emailjs from "@emailjs/browser";

type FormState = "idle" | "sending" | "sent";

export function ContactPage() {
  const { t } = useLanguage();
  const contactInfo = useContactInfo();

  useEffect(() => {
    document.title = `${t("nav.contact")} | Altus Studio`;
  }, [t]);

  const [activeTab, setActiveTab] = useState<"message" | "booking">("message");
  const [formState, setFormState] = useState<FormState>("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });

  const sendEmailConfirmation = (payload: { name: string; email: string; phone?: string; service: string; message: string }) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.warn("EmailJS environment variables are not configured. Skipping confirmation email.");
      return;
    }

    const templateParams = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone || "—",
      service: payload.service,
      message: payload.message
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
         console.log("EmailJS confirmation sent successfully!", response.status, response.text);
      }, (err) => {
         console.error("EmailJS failed to send:", err);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      service: form.service || "Κατασκευή Ιστοσελίδας",
      message: form.message,
      date: new Date().toISOString().split("T")[0],
      read: false,
      status: "new"
    };

    // Construct Telegram Notification Message
    const tgMessage = `✉️ <b>Νέο Μήνυμα Επικοινωνίας</b>\n\n` +
      `👤 <b>Όνομα:</b> ${payload.name}\n` +
      `📧 <b>Email:</b> ${payload.email}\n` +
      `📞 <b>Τηλέφωνο:</b> ${payload.phone || "—"}\n` +
      `💼 <b>Υπηρεσία:</b> ${payload.service}\n\n` +
      `📝 <b>Μήνυμα:</b>\n${payload.message}`;

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("messages")
        .insert([payload])
        .then(({ error }) => {
          if (error) {
            console.error("Error submitting contact to Supabase:", error);
          } else {
            sendTelegramNotification(tgMessage);
            sendEmailConfirmation(payload);
          }
          setFormState("sent");
          setForm({ name: "", email: "", phone: "", service: "", message: "" });
        });
    } else {
      setTimeout(() => {
        try {
          const existingMessagesRaw = localStorage.getItem("altus_messages");
          const existingMessages = existingMessagesRaw ? JSON.parse(existingMessagesRaw) : [];
          
          const newMessage = {
            id: Date.now(),
            ...payload
          };
          
          const updatedMessages = [newMessage, ...existingMessages];
          localStorage.setItem("altus_messages", JSON.stringify(updatedMessages));
          sendTelegramNotification(tgMessage);
          sendEmailConfirmation(payload);
        } catch (err) {
          console.error("Failed to save message to localStorage:", err);
        }
        
        setFormState("sent");
        setForm({ name: "", email: "", phone: "", service: "", message: "" });
      }, 1200);
    }
  };

  const services = [
    t("services.cards.0.title") !== "services.cards.0.title" ? t("services.cards.0.title") : "Κατασκευή Ιστοσελίδας",
    t("services.cards.1.title") !== "services.cards.1.title" ? t("services.cards.1.title") : "Ανάπτυξη E-Shop",
    "Landing Page",
    t("services.addons.items.0.title") !== "services.addons.items.0.title" ? t("services.addons.items.0.title") : "Εταιρική Ταυτότητα",
  ];

  return (
    <div className="bg-[#0D0D11]">
      {/* Hero */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cgrid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cgrid)" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-[#DFBA73]" />
              <span className="text-[#DFBA73] text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {t("contact.hero.label")}
              </span>
            </div>
            <h1
              className="text-[#F9FAFB] max-w-2xl"
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, lineHeight: 1.1 }}
            >
              {t("contact.hero.heading1")}
              <br />
              <em style={{ fontStyle: "italic", color: "#DFBA73" }}>{t("contact.hero.heading2")}</em>
            </h1>
            <p
              className="text-[#F9FAFB]/50 mt-6 max-w-md"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "1.05rem", lineHeight: 1.8 }}
            >
              {t("contact.hero.sub")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left — info */}
          <div className="lg:col-span-4 space-y-12">
            <div>
              <h2
                className="text-[#0D0D11] mb-8"
                style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.6rem", fontWeight: 700 }}
              >
                {t("contact.info.email")} & {t("contact.info.phone")}
              </h2>
              <div className="space-y-6">
                {[
                  { Icon: Mail, label: t("contact.info.email"), value: contactInfo.email },
                  { Icon: Phone, label: t("contact.info.phone"), value: contactInfo.phone },
                  { Icon: Send, label: "Telegram", value: "@altus_studio" },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-[#0D0D11]/15 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-[#DFBA73]" />
                    </div>
                    <div>
                      <p className="text-[#0D0D11]/40 text-xs tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {label}
                      </p>
                      <p className="text-[#0D0D11] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#0D0D11]/10 pt-10">
              <p
                className="text-[#0D0D11]/40 text-xs tracking-widest uppercase mb-6"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("contact.info.hours")}
              </p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#DFBA73" }}>
                {t("contact.info.hoursVal")}
              </p>
              <p className="text-[#0D0D11]/55 mt-2 text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                {t("contact.info.response")}
              </p>
            </div>

            <div className="bg-[#0D0D11] p-8">
              <p className="text-[#DFBA73] text-xs tracking-[0.25em] uppercase mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                &lt; 24h
              </p>
              <p className="text-[#F9FAFB]" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.1rem", fontWeight: 600 }}>
                {t("contact.info.response")}
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-8">
            {/* Tab selector */}
            <div className="flex gap-6 border-b border-[#0D0D11]/10 pb-4 mb-8">
              <button
                type="button"
                onClick={() => setActiveTab("message")}
                className={`pb-2 text-sm tracking-wider uppercase font-semibold transition-all border-b-2 cursor-pointer ${
                  activeTab === "message"
                    ? "border-[#DFBA73] text-[#0D0D11] font-bold"
                    : "border-transparent text-[#0D0D11]/40 hover:text-[#0D0D11]/60"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("nav.about") === "About" ? "Send a Message" : "Αποστολή Μηνύματος"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("booking")}
                className={`pb-2 text-sm tracking-wider uppercase font-semibold transition-all border-b-2 cursor-pointer ${
                  activeTab === "booking"
                    ? "border-[#DFBA73] text-[#0D0D11] font-bold"
                    : "border-transparent text-[#0D0D11]/40 hover:text-[#0D0D11]/60"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("nav.about") === "About" ? "Book a Call" : "Κράτηση Call Γνωριμίας"}
              </button>
            </div>

            {activeTab === "message" ? (
              formState === "sent" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-24"
                >
                  <CheckCircle2 size={48} className="text-[#DFBA73] mb-6" />
                  <h3
                    className="text-[#0D0D11] mb-4"
                    style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2rem", fontWeight: 700 }}
                  >
                    {t("contact.form.success")}
                  </h3>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { id: "name", label: `${t("contact.form.name")} *`, placeholder: "Γιώργος Παπαδόπουλος" },
                      { id: "email", label: `${t("contact.form.email")} *`, placeholder: "email@company.gr" },
                    ].map(({ id, label, placeholder }) => (
                      <div key={id} className="group">
                        <label
                          htmlFor={id}
                          className="block text-[#0D0D11]/50 text-xs tracking-widest uppercase mb-2"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {label}
                        </label>
                        <input
                          id={id}
                          type={id === "email" ? "email" : "text"}
                          required
                          placeholder={placeholder}
                          value={form[id as keyof typeof form]}
                          onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                          className="w-full bg-transparent border-b border-[#0D0D11]/20 focus:border-[#DFBA73] pb-3 pt-1 text-[#0D0D11] outline-none placeholder-[#0D0D11]/25 transition-colors duration-300"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Phone + Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-[#0D0D11]/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {t("contact.form.phone")}
                      </label>
                      <input
                        type="tel"
                        placeholder="69XXXXXXXX"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className="w-full bg-transparent border-b border-[#0D0D11]/20 focus:border-[#DFBA73] pb-3 pt-1 text-[#0D0D11] outline-none placeholder-[#0D0D11]/25 transition-colors duration-300"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>
                    <div className="group">
                      <label className="block text-[#0D0D11]/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {t("contact.form.service")}
                      </label>
                      <select
                        value={form.service}
                        onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                        className="w-full bg-transparent border-b border-[#0D0D11]/20 focus:border-[#DFBA73] pb-3 pt-1 text-[#0D0D11] outline-none transition-colors duration-300"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <option value="">{t("contact.form.selectService")}</option>
                        {services.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[#0D0D11]/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {t("contact.form.message")} *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder={t("contact.form.messagePlaceholder")}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="w-full bg-transparent border-b border-[#0D0D11]/20 focus:border-[#DFBA73] pb-3 pt-1 text-[#0D0D11] outline-none placeholder-[#0D0D11]/25 resize-none transition-colors duration-300"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formState === "sending"}
                    className="group flex items-center gap-3 px-10 py-5 bg-[#DFBA73] text-[#0D0D11] text-sm tracking-wider uppercase hover:bg-[#E6CE93] disabled:opacity-70 transition-all duration-300 cursor-pointer"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: "0.12em" }}
                  >
                    {formState === "sending" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#0D0D11]/40 border-t-[#0D0D11] rounded-full animate-spin" />
                        {t("contact.form.sending")}
                      </>
                    ) : (
                      <>
                        {t("contact.form.submit")}
                        <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )
            ) : (
              <BookingCalendar />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
