import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, CheckCircle2, ChevronRight, ChevronLeft, Calculator, Laptop, ShoppingCart, Zap, PlusCircle, Check } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { BookingCalendar } from "./BookingCalendar";
import { supabase, isSupabaseConfigured } from "@/app/utils/supabaseClient";
import { sendTelegramNotification } from "@/app/utils/telegram";

interface Addon {
  id: string;
  nameEl: string;
  nameEn: string;
  price: number;
  descEl: string;
  descEn: string;
}

export function QuoteEstimator() {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Selection States
  const [projectType, setProjectType] = useState<"website" | "eshop" | "landing" | null>(null);
  const [complexity, setComplexity] = useState<string>("basic");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  
  // Lead info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  // Pricing Logic
  const basePrices = {
    website: 350,
    eshop: 790,
    landing: 250,
  };

  const complexityPrices: Record<string, number> = {
    basic: 0,
    medium: 120,
    premium: 250,
  };

  const addons: Addon[] = [
    { id: "uiux", nameEl: "Custom UI/UX Σχεδιασμός", nameEn: "Custom UI/UX Design", price: 150, descEl: "Μοναδικό visual mockup πριν τον κώδικα", descEn: "Unique custom visual mockups before coding" },
    { id: "seo", nameEl: "SEO & Google Analytics", nameEn: "SEO & Google Analytics", price: 120, descEl: "Πλήρης βελτιστοποίηση λέξεων-κλειδιών", descEn: "Full speed and keyword optimization" },
    { id: "multilang", nameEl: "Πολυγλωσσικότητα (2 Γλώσσες)", nameEn: "Multi-language (2 Languages)", price: 100, descEl: "Υλοποίηση EL / EN με διακόπτη", descEn: "EL / EN integration with switcher" },
    { id: "support", nameEl: "VIP Συνεχής Υποστήριξη", nameEn: "VIP Ongoing Support", price: 80, descEl: "Μηνιαία υποστήριξη και αναβαθμίσεις", descEn: "Monthly maintenance and updates" },
  ];

  const calculateTotal = () => {
    if (!projectType) return 0;
    const base = basePrices[projectType] || 0;
    const comp = complexityPrices[complexity] || 0;
    const adds = addons
      .filter((a) => selectedAddons.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0);
    return base + comp + adds;
  };

  const handleAddonClick = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert(lang === "el" ? "Παρακαλώ συμπληρώστε τα υποχρεωτικά πεδία." : "Please fill in all required fields.");
      return;
    }

    setSending(true);

    const typeLabel = projectType === "website" ? "Website" : projectType === "eshop" ? "E-Shop" : "Landing Page";
    const compLabel = complexity === "basic" ? "Βασικό" : complexity === "medium" ? "Μεσαίο (έως 10 σελίδες)" : "Premium / Large Scale";
    const selectedAddsList = addons.filter((a) => selectedAddons.includes(a.id)).map((a) => a.nameEl).join(", ");

    const totalCost = calculateTotal();
    const qId = "Q" + Math.floor(1000 + Math.random() * 9000);
    const dateToday = new Date().toLocaleDateString("el-GR");

    const payload = {
      name,
      email,
      phone,
      service: `Προσφορά: ${typeLabel}`,
      message: `Αυτόματη εκτίμηση κόστους: €${totalCost}
--
Τύπος: ${typeLabel}
Πολυπλοκότητα: ${compLabel}
Πρόσθετα: ${selectedAddsList || "Κανένα"}`,
      date: new Date().toISOString().split("T")[0],
      read: false,
      status: "new"
    };

    const quotePayload = {
      id: qId,
      client: name,
      email: email,
      phone: phone || "",
      date: dateToday,
      total: totalCost,
      status: "pending",
      items: [
        {
          name: `${typeLabel} (${compLabel})`,
          price: basePrices[projectType || "website"] + complexityPrices[complexity || "basic"],
          qty: 1
        },
        ...addons
          .filter((a) => selectedAddons.includes(a.id))
          .map((a) => ({
            name: a.nameEl,
            price: a.price,
            qty: 1
          }))
      ],
      note: `Υποβλήθηκε από τον Κοστολογητή στις δημόσιες σελίδες.`
    };

    // Construct Telegram Notification Message
    const tgMessage = `💰 <b>Νέα Ζήτηση Προσφοράς από Κοστολογητή</b>\n\n` +
      `👤 <b>Όνομα:</b> ${name}\n` +
      `📧 <b>Email:</b> ${email}\n` +
      `📞 <b>Τηλέφωνο:</b> ${phone || "—"}\n\n` +
      `💻 <b>Τύπος:</b> ${typeLabel}\n` +
      `⚙️ <b>Μέγεθος:</b> ${compLabel}\n` +
      `➕ <b>Πρόσθετα:</b> ${selectedAddsList || "Κανένα"}\n\n` +
      `💵 <b>Σύνολο:</b> €${totalCost}`;

    const saveToLocalStorage = () => {
      try {
        const existingMessagesRaw = localStorage.getItem("altus_messages");
        const existingMessages = existingMessagesRaw ? JSON.parse(existingMessagesRaw) : [];
        const newMessage = { id: Date.now(), ...payload };
        localStorage.setItem("altus_messages", JSON.stringify([newMessage, ...existingMessages]));

        const existingQuotesRaw = localStorage.getItem("altus_quotes");
        const existingQuotes = existingQuotesRaw ? JSON.parse(existingQuotesRaw) : [];
        localStorage.setItem("altus_quotes", JSON.stringify([quotePayload, ...existingQuotes]));

        window.dispatchEvent(new Event("storage"));
        sendTelegramNotification(tgMessage);
      } catch (err) {
        console.error("Failed to save estimator quote lead locally:", err);
      }
    };

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("messages")
        .insert([payload])
        .then(({ error: msgError }) => {
          if (msgError) console.error("Error submitting quote lead to Supabase:", msgError);
          
          supabase
            .from("quotes")
            .insert([quotePayload])
            .then(({ error: quoteError }) => {
              if (quoteError) console.error("Error submitting quote details to Supabase:", quoteError);
              
              saveToLocalStorage();
              setSending(false);
              setSubmitted(true);
            });
        });
    } else {
      setTimeout(() => {
        saveToLocalStorage();
        setSending(false);
        setSubmitted(true);
      }, 1200);
    }
  };

  return (
    <section className="py-24 bg-[#0A0F1E] border-t border-white/5 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-radial-gradient" 
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 60%)" }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#C9A84C]/30 bg-[#C9A84C]/5 rounded-full mb-4">
            <Calculator size={13} className="text-[#C9A84C]" />
            <span className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-semibold">
              {lang === "el" ? "Υπολογισμός Κόστους" : "Cost Estimator"}
            </span>
          </div>
          <h2 className="text-[#F5F5F0] text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            {lang === "el" ? "Σχεδιάστε την Προσφορά σας" : "Estimate Your Project Cost"}
          </h2>
          <p className="text-[#F5F5F0]/50 text-sm mt-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {lang === "el" 
              ? "Επιλέξτε τις προδιαγραφές που επιθυμείτε και δείτε μια εκτίμηση κόστους σε πραγματικό χρόνο." 
              : "Select your project options to receive a live dynamic estimate."}
          </p>
        </div>

        {/* Wizard Card */}
        <div className="bg-[#111827]/40 border border-white/8 backdrop-blur-xl p-8 md:p-12 shadow-2xl relative">
          
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
            <motion.div 
              className="h-full bg-[#C9A84C]"
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
              >
                {/* STEP 1: PROJECT TYPE */}
                {step === 1 && (
                  <div>
                    <h3 className="text-[#F5F5F0] text-lg font-semibold mb-8 flex items-center gap-2">
                      <span className="text-[#C9A84C]">01.</span> {lang === "el" ? "Τύπος Έργου" : "Project Type"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: "website", labelEl: "Εταιρική Ιστοσελίδα", labelEn: "Corporate Website", price: 350, icon: Laptop, descEl: "Σελίδα παρουσίασης της επιχείρησής σας", descEn: "Represent your business online professionally" },
                        { id: "eshop", labelEl: "Ηλεκτρονικό Κατάστημα", labelEn: "E-Shop", price: 790, icon: ShoppingCart, descEl: "Πωλήσεις προϊόντων 24/7 με ασφάλεια πληρωμών", descEn: "Sell products online 24/7 with payments security" },
                        { id: "landing", labelEl: "Landing Page", labelEn: "Landing Page", price: 250, icon: Zap, descEl: "Σελίδα με στόχο την άμεση μετατροπή πελατών", descEn: "High conversion single-page lead capture" },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = projectType === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setProjectType(item.id as any)}
                            className={`border p-6 cursor-pointer text-left transition-all duration-300 group ${
                              isSelected 
                                ? "border-[#C9A84C] bg-[#C9A84C]/5" 
                                : "border-white/10 hover:border-white/20 bg-white/2"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className={`w-10 h-10 flex items-center justify-center border transition-colors ${isSelected ? "border-[#C9A84C]" : "border-white/15"}`}>
                                <Icon size={18} className={isSelected ? "text-[#C9A84C]" : "text-[#F5F5F0]/60"} />
                              </div>
                              <span className="text-[#C9A84C] text-sm font-bold">from €{item.price}</span>
                            </div>
                            <h4 className="text-[#F5F5F0] font-semibold text-base mb-2">{lang === "el" ? item.labelEl : item.labelEn}</h4>
                            <p className="text-[#F5F5F0]/40 text-xs leading-relaxed">{lang === "el" ? item.descEl : item.descEn}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Dynamic Service Deliverables description */}
                    {projectType && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-6 bg-white/2 border border-white/5 rounded-lg text-left"
                      >
                        <div className="mb-6 border-b border-white/10 pb-4">
                          <p className="text-xs text-[#F5F5F0]/80 leading-relaxed">
                            {projectType === "landing" && (lang === "el" 
                              ? "Μία στοχευμένη, μονοσέλιδη παρουσίαση σχεδιασμένη αποκλειστικά για να μετατρέπει τους επισκέπτες σε πελάτες (leads/πωλήσεις). Ιδανική για διαφημιστικές καμπάνιες Google/Social Media, προώθηση ενός συγκεκριμένου προϊόντος/υπηρεσίας και γρήγορο ξεκίνημα με χαμηλό κόστος." 
                              : "A focused, single-page website designed specifically to convert visitors into customers (leads/sales). Ideal for Google/Social Media campaigns, promoting a single product or service, and launching quickly with a lower budget.")}
                            {projectType === "website" && (lang === "el" 
                              ? "Η ολοκληρωμένη ψηφιακή παρουσία της επιχείρησής σας στο διαδίκτυο. Περιλαμβάνει πολλές σελίδες (Αρχική, Υπηρεσίες, Portfolio, Επικοινωνία, κ.α.) με μοναδικό design (Figma mockups) που χτίζει αξιοπιστία, αναδεικνύει το brand σας και προσελκύει νέους συνεργάτες/πελάτες." 
                              : "The complete digital presence for your business. It includes multiple pages (Home, Services, Portfolio, About, Contact) with a custom design (Figma mockups) that builds credibility, showcases your brand, and attracts new B2B or B2C clients.")}
                            {projectType === "eshop" && (lang === "el" 
                              ? "Ένα υπερσύγχρονο ηλεκτρονικό κατάστημα για να πουλάτε τα προϊόντα σας 24/7 σε όλο τον κόσμο. Περιλαμβάνει καλάθι αγορών, απόλυτα ασφαλείς πληρωμές με κάρτες (Stripe/Viva/PayPal), αυτόματο υπολογισμό μεταφορικών, διασύνδεση με courier και εύκολο panel διαχείρισης." 
                              : "A state-of-the-art e-commerce store to sell your products 24/7 globally. Features shopping cart checkout, secure card processing (Stripe/Viva/PayPal), automated shipping calculations, courier system integration, and an easy-to-use admin management panel.")}
                          </p>
                        </div>
                        
                        <h4 className="text-[#C9A84C] text-[10px] font-bold tracking-wider mb-4 uppercase">
                          {lang === "el" ? "Βασικά Χαρακτηριστικά & Παραδοτέα:" : "Core Features & Deliverables:"}
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#F5F5F0]/70">
                          {projectType === "landing" && (
                            <>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Μονοσέλιδη στοχευμένη δομή (Single Page)" : "Single Page conversion-focused layout"}</li>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Έως 6 σχεδιαστικές ενότητες (Sections)" : "Up to 6 visual sections"}</li>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Φόρμα επικοινωνίας & κουμπιά Call-to-Action" : "Contact form & Call-to-action buttons"}</li>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Πλήρης responsive προσαρμογή για κινητά" : "100% Responsive mobile optimization"}</li>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Σύνδεση με Google Analytics" : "Google Analytics integration"}</li>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Βασική βελτιστοποίηση ταχύτητας" : "Basic speed performance optimization"}</li>
                            </>
                          )}
                          {projectType === "website" && (
                            <>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Ολοκληρωμένη πολυσελιδική δομή (5-8 σελίδες)" : "Complete multi-page structure (5-8 pages)"}</li>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Σελίδες: Αρχική, Υπηρεσίες, Portfolio, Επικοινωνία" : "Pages: Home, Services, Portfolio, Contact, About"}</li>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Bespoke UI/UX σχεδίαση μακέτας στο Figma" : "Bespoke UI/UX custom Figma design mockups"}</li>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Responsive για κινητά & tablets" : "100% Mobile & tablet responsive layout"}</li>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Setup Google Search Console (SEO)" : "Google Search Console index setup"}</li>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Βελτιστοποίηση ταχύτητας (PageSpeed 90+)" : "Advanced speed optimization (PageSpeed 90+)"}</li>
                            </>
                          )}
                          {projectType === "eshop" && (
                            <>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Πλατφόρμα e-commerce με καλάθι & checkout" : "Full e-commerce cart & checkout funnel"}</li>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Σύνδεση με τράπεζες (Stripe, Viva) & PayPal" : "Stripe, Viva Wallet, & PayPal payment integration"}</li>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Διαχείριση αποστολών & υπολογισμός μεταφορικών" : "Shipping management & delivery cost calculation"}</li>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Πλήρες διαχειριστικό panel προϊόντων" : "Admin dashboard for catalog & orders management"}</li>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "Σύνθετα φίλτρα & αναζήτηση προϊόντων" : "Advanced product filters & search tools"}</li>
                              <li className="flex items-center gap-2"><span className="text-[#C9A84C]">✓</span> {lang === "el" ? "GDPR Συμμόρφωση & Cookies Banner" : "GDPR Compliance & cookies privacy banner setup"}</li>
                            </>
                          )}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* STEP 2: COMPLEXITY */}
                {step === 2 && (
                  <div>
                    <h3 className="text-[#F5F5F0] text-lg font-semibold mb-8 flex items-center gap-2">
                      <span className="text-[#C9A84C]">02.</span> {lang === "el" ? "Μέγεθος / Σελίδες" : "Scope & Pages"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: "basic", labelEl: "Βασικό (Μονοσέλιδο)", labelEn: "Basic (Single Page)", price: 0, descEl: "Ιδανικό για απλές παρουσιάσεις", descEn: "Ideal for basic online presence" },
                        { id: "medium", labelEl: "Μεσαίο (Έως 10 σελίδες)", labelEn: "Medium (Up to 10 pages)", price: 120, descEl: "Για αναπτυσσόμενες επιχειρήσεις", descEn: "For growing businesses needing more pages" },
                        { id: "premium", labelEl: "Μεγάλο / Custom", labelEn: "Large / Custom Layout", price: 250, descEl: "Πολυσέλιδο ή με custom ανάγκες", descEn: "Multi-page or complex structural layouts" },
                      ].map((item) => {
                        const isSelected = complexity === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setComplexity(item.id)}
                            className={`border p-6 cursor-pointer text-left transition-all duration-300 group ${
                              isSelected 
                                ? "border-[#C9A84C] bg-[#C9A84C]/5" 
                                : "border-white/10 hover:border-white/20 bg-white/2"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "border-[#C9A84C]" : "border-white/20"}`}>
                                {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]" />}
                              </span>
                              <span className="text-[#C9A84C] text-sm font-bold">+{item.price > 0 ? `€${item.price}` : "Free"}</span>
                            </div>
                            <h4 className="text-[#F5F5F0] font-semibold text-base mb-2">{lang === "el" ? item.labelEl : item.labelEn}</h4>
                            <p className="text-[#F5F5F0]/40 text-xs leading-relaxed">{lang === "el" ? item.descEl : item.descEn}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 3: ADDONS */}
                {step === 3 && (
                  <div>
                    <h3 className="text-[#F5F5F0] text-lg font-semibold mb-8 flex items-center gap-2">
                      <span className="text-[#C9A84C]">03.</span> {lang === "el" ? "Πρόσθετες Υπηρεσίες" : "Add-ons"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addons.map((item) => {
                        const isSelected = selectedAddons.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleAddonClick(item.id)}
                            className={`border p-5 cursor-pointer text-left transition-all duration-300 flex items-start gap-4 ${
                              isSelected 
                                ? "border-[#C9A84C] bg-[#C9A84C]/5" 
                                : "border-white/10 hover:border-white/20 bg-white/2"
                            }`}
                          >
                            <div className={`w-5 h-5 border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSelected ? "border-[#C9A84C] bg-[#C9A84C]" : "border-white/20"}`}>
                              {isSelected && <Check size={12} className="text-[#0A0F1E] stroke-[3]" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="text-[#F5F5F0] font-semibold text-sm truncate">{lang === "el" ? item.nameEl : item.nameEn}</h4>
                                <span className="text-[#C9A84C] text-xs font-bold font-mono">+{item.id === "support" ? `€${item.price}/mo` : `€${item.price}`}</span>
                              </div>
                              <p className="text-[#F5F5F0]/40 text-xs truncate">{lang === "el" ? item.descEl : item.descEn}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 4: SEND REQUEST */}
                {step === 4 && (
                  <div className="max-w-md mx-auto text-center">
                    <h3 className="text-[#F5F5F0] text-lg font-semibold mb-4">
                      {lang === "el" ? "Σχεδόν Έτοιμο!" : "Almost There!"}
                    </h3>
                    <p className="text-[#F5F5F0]/50 text-xs mb-8">
                      {lang === "el" 
                        ? "Συμπληρώστε τα στοιχεία σας για να καταχωρηθεί η προσφορά σας στο σύστημα. Θα επικοινωνήσουμε άμεσα μαζί σας."
                        : "Complete your contact details to save your quote request. We will review it and contact you."}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                      <div>
                        <label className="block text-[#F5F5F0]/40 text-[10px] tracking-widest uppercase mb-1.5">{lang === "el" ? "Ονοματεπώνυμο *" : "Full Name *"}</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Γιώργος Παπαδόπουλος"
                          className="w-full bg-white/5 border border-white/10 focus:border-[#C9A84C] p-3 text-sm text-[#F5F5F0] outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[#F5F5F0]/40 text-[10px] tracking-widest uppercase mb-1.5">Email *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@company.gr"
                          className="w-full bg-white/5 border border-white/10 focus:border-[#C9A84C] p-3 text-sm text-[#F5F5F0] outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[#F5F5F0]/40 text-[10px] tracking-widest uppercase mb-1.5">{lang === "el" ? "Τηλέφωνο" : "Phone"}</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="69XXXXXXXX"
                          className="w-full bg-white/5 border border-white/10 focus:border-[#C9A84C] p-3 text-sm text-[#F5F5F0] outline-none transition-colors"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full mt-6 py-4 bg-[#C9A84C] text-[#0A0F1E] text-sm tracking-wider uppercase hover:bg-[#D4B76A] font-bold disabled:opacity-75 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        {sending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#0A0F1E]/40 border-t-[#0A0F1E] rounded-full animate-spin" />
                            {lang === "el" ? "Αποστολή..." : "Sending..."}
                          </>
                        ) : (
                          <>
                            {lang === "el" ? "Υποβολή Ζήτησης" : "Request Custom Quote"}
                            <ArrowUpRight size={16} />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
                  <div className="flex gap-2">
                    {step > 1 && (
                      <button
                        onClick={() => setStep(step - 1)}
                        className="px-4 py-2 border border-white/10 hover:border-white/20 text-[#F5F5F0]/70 hover:text-[#F5F5F0] text-xs tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft size={14} /> {lang === "el" ? "Πίσω" : "Back"}
                      </button>
                    )}
                  </div>

                  {/* Summary cost */}
                  <div className="text-right">
                    <p className="text-[#F5F5F0]/40 text-[10px] tracking-widest uppercase mb-1">{lang === "el" ? "ΕΚΤΙΜΩΜΕΝΟ ΚΟΣΤΟΣ" : "ESTIMATED TOTAL"}</p>
                    <p className="text-[#C9A84C] font-mono text-2xl font-bold">
                      €{calculateTotal()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {step < 4 && (
                      <button
                        onClick={() => {
                          if (step === 1 && !projectType) {
                            alert(lang === "el" ? "Παρακαλώ επιλέξτε τύπο έργου." : "Please select a project type.");
                            return;
                          }
                          setStep(step + 1);
                        }}
                        className="px-6 py-2.5 bg-[#C9A84C] hover:bg-[#D4B76A] text-[#0A0F1E] text-xs tracking-wider uppercase font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {lang === "el" ? "Επόμενο" : "Next"} <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 flex flex-col items-center"
              >
                <CheckCircle2 size={48} className="text-[#C9A84C] mb-6 animate-pulse" />
                <h3 className="text-[#F5F5F0] text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {lang === "el" ? "Η Προσφορά Καταχωρήθηκε!" : "Quote Requested!"}
                </h3>
                <p className="text-[#F5F5F0]/50 text-sm max-w-sm mb-8 leading-relaxed">
                  {lang === "el" 
                    ? "Λάβαμε τις προδιαγραφές σας και υπολογίσαμε το κόστος. Η ομάδα μας θα επικοινωνήσει μαζί σας μέσω email σύντομα!"
                    : "We have received your specifications and estimated budget. Our team will contact you via email shortly!"}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="px-8 py-3 bg-[#C9A84C] hover:bg-[#D4B76A] text-[#0A0F1E] font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    {lang === "el" ? "Κλείσιμο Ραντεβού" : "Schedule Call"}
                  </button>
                  <button
                    onClick={() => {
                      setStep(1);
                      setProjectType(null);
                      setComplexity("basic");
                      setSelectedAddons([]);
                      setName("");
                      setEmail("");
                      setPhone("");
                      setSubmitted(false);
                    }}
                    className="px-8 py-3 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10 text-xs tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    {lang === "el" ? "Νέος Υπολογισμός" : "New Estimation"}
                  </button>
                </div>
              </motion.div>
            )}

            {showBookingModal && (
              <BookingCalendar
                isModal={true}
                onClose={() => setShowBookingModal(false)}
                initialService={lang === "el" ? "Call από Κοστολογητή" : "Quote Call"}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
