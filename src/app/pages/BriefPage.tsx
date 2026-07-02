import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Download, 
  Calendar, 
  Zap, 
  Globe, 
  ShoppingCart, 
  Smartphone, 
  Cpu, 
  Palette, 
  Sparkles, 
  FileText, 
  Loader2 
} from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { supabase, isSupabaseConfigured } from "@/app/utils/supabaseClient";
import { sendTelegramNotification } from "@/app/utils/telegram";
import { generateBriefPdfHtml, CreativeBriefData } from "@/app/utils/generateBriefPdfHtml";
import { BookingCalendar } from "@/app/components/BookingCalendar";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export function BriefPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: Intro, 1: Type & Industry, 2: Style, 3: Features, 4: Budget & Timeline, 5: Contact, 6: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Core prices state loaded from DB/Settings
  const [prices, setPrices] = useState({
    landing: 250,
    website: 350,
    eshop: 990,
    portal: 1500,
  });

  // State values for Wizard
  const [projectType, setProjectType] = useState<"landing" | "website" | "eshop" | "portal">("website");
  const [industry, setIndustry] = useState("");
  const [aesthetic, setAesthetic] = useState<"minimal" | "dark" | "creative" | "corporate">("minimal");
  
  // Selected integrations/features
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  const [budgetRange, setBudgetRange] = useState("€600 - €1,200");
  const [timeline, setTimeline] = useState("timeNormal");

  // Contact form details
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: ""
  });

  // Load prices from Supabase settings (key: prices) or fallback
  useEffect(() => {
    document.title = lang === "el" ? "Σχεδιασμός Brief | Altus Studio" : "Brief Configurator | Altus Studio";
    
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("settings")
        .select("value")
        .eq("key", "prices")
        .maybeSingle()
        .then(({ data, error }) => {
          if (!error && data && data.value) {
            const val = data.value;
            setPrices({
              landing: val.landing ?? 250,
              website: val.website ?? 350,
              eshop: val.eshop ?? 990,
              portal: val.portal ?? 1500
            });
          }
        });
    } else {
      const cached = localStorage.getItem("altus_prices");
      if (cached) {
        try {
          const val = JSON.parse(cached);
          setPrices({
            landing: val.landing ?? 250,
            website: val.website ?? 350,
            eshop: val.eshop ?? 990,
            portal: val.portal ?? 1500
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [lang]);

  // Feature Options definition
  const featureOptions = [
    { id: "featMultilingual", price: 150 },
    { id: "featBooking", price: 150 },
    { id: "featPayments", price: 250 },
    { id: "featSEO", price: 150 },
    { id: "featPortal", price: 400 },
    { id: "featMarketing", price: 100 }
  ];

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Pricing calculations
  const calculateTotalEstimate = () => {
    let base = prices[projectType];
    let extra = 0;
    
    selectedFeatures.forEach(featId => {
      const option = featureOptions.find(o => o.id === featId);
      if (option) extra += option.price;
    });

    const totalMin = base + extra;
    const totalMax = Math.round(totalMin * 1.25);

    return `€${totalMin} - €${totalMax}`;
  };

  const getEstimatedDelivery = () => {
    switch (projectType) {
      case "landing":
        return lang === "el" ? "10 - 15 ημέρες" : "10 - 15 days";
      case "website":
        return lang === "el" ? "20 - 30 ημέρες" : "20 - 30 days";
      case "eshop":
        return lang === "el" ? "25 - 45 ημέρες" : "25 - 45 days";
      case "portal":
        return lang === "el" ? "35 - 60 ημέρες" : "35 - 60 days";
      default:
        return "20 - 30 days";
    }
  };

  // Form submission to CRM
  const handleBriefSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.name.trim() || !contact.email.trim() || !contact.phone.trim()) return;

    setIsSubmitting(true);

    const calculatedCost = calculateTotalEstimate();
    const calculatedDelivery = getEstimatedDelivery();

    // Map feature IDs to readable translations
    const readableFeatures = selectedFeatures.map(f => t(`brief.${f}`));

    const aestheticLabel = t(`brief.style${aesthetic.charAt(0).toUpperCase() + aesthetic.slice(1)}Title`);
    const projectTypeLabel = t(`brief.type${projectType.charAt(0).toUpperCase() + projectType.slice(1)}Title`);

    const dateToday = new Date().toISOString().split("T")[0];

    // Markdown description of the brief
    const summaryMd = `
### 📋 ΣΥΝΟΨΗ BRIEF
* **Τύπος Έργου:** ${projectTypeLabel}
* **Κλάδος:** ${industry || "Δεν ορίστηκε"}
* **Αισθητικό Ύφος:** ${aestheticLabel}
* **Λειτουργίες / Integrations:** ${readableFeatures.length > 0 ? readableFeatures.join(", ") : "Καμία"}
* **Επιλογή Budget (Πελάτης):** ${budgetRange}
* **Χρονοδιάγραμμα (Πελάτης):** ${t(`brief.${timeline}`)}

### 📊 ΕΚΤΙΜΗΣΗ ALTUS STUDIO
* **Εύρος Τιμής (Ενδεικτικό):** ${calculatedCost}
* **Χρόνος Παράδοσης:** ${calculatedDelivery}

### 👤 ΣΤΟΙΧΕΙΑ ΕΠΙΚΟΙΝΩΝΙΑΣ
* **Εταιρεία:** ${contact.company || "—"}
* **Όνομα:** ${contact.name}
* **Email:** ${contact.email}
* **Τηλέφωνο:** ${contact.phone}
    `.trim();

    const payload = {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      service: `Creative Brief: ${projectTypeLabel}`,
      message: summaryMd,
      date: dateToday,
      read: false,
      status: "new"
    };

    // Telegram Alert Message
    const tgMessage = `📋 <b>Νέο Creative Brief Lead</b>\n\n` +
      `👤 <b>Στοιχεία:</b> ${contact.name} (${contact.email})\n` +
      `📞 <b>Τηλέφωνο:</b> ${contact.phone}\n` +
      `🏢 <b>Εταιρεία:</b> ${contact.company || "—"}\n\n` +
      `💼 <b>Τύπος:</b> ${projectTypeLabel}\n` +
      `🎨 <b>Ύφος:</b> ${aestheticLabel}\n` +
      `⚙️ <b>Λειτουργίες:</b> ${readableFeatures.length > 0 ? readableFeatures.join(", ") : "Καμία"}\n` +
      `💵 <b>Budget:</b> ${budgetRange}\n` +
      `⏱️ <b>Delivery:</b> ${calculatedDelivery}\n\n` +
      `💰 <b>Εκτίμηση Altus:</b> <b>${calculatedCost}</b>`;

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("messages").insert([payload]);
        if (error) throw error;
      } else {
        const existing = localStorage.getItem("altus_messages");
        const existingMessages = existing ? JSON.parse(existing) : [];
        const localMsg = { id: Date.now(), ...payload };
        localStorage.setItem("altus_messages", JSON.stringify([localMsg, ...existingMessages]));
      }

      await sendTelegramNotification(tgMessage);
      
      // Dispatch storage event to alert Admin dashboard in real time
      window.dispatchEvent(new Event("storage"));
      
      setStep(6); // Go to success step
    } catch (err) {
      console.error("Error submitting Creative Brief:", err);
      alert(lang === "el" ? "Υπήρξε σφάλμα κατά την υποβολή. Δοκιμάστε ξανά." : "Error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // PDF Download trigger (reusing canvas rendering to prevent Greek fonts garbage outputs)
  const handlePdfDownload = async () => {
    setIsPdfDownloading(true);

    const aestheticLabel = t(`brief.style${aesthetic.charAt(0).toUpperCase() + aesthetic.slice(1)}Title`);
    const aestheticDesc = t(`brief.style${aesthetic.charAt(0).toUpperCase() + aesthetic.slice(1)}Desc`);
    const projectTypeLabel = t(`brief.type${projectType.charAt(0).toUpperCase() + projectType.slice(1)}Title`);
    const readableFeatures = selectedFeatures.map(f => t(`brief.${f}`));
    const dateToday = new Date().toLocaleDateString(lang === "el" ? "el-GR" : "en-US");

    const briefData: CreativeBriefData = {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company || "",
      projectType: projectTypeLabel,
      projectTypeKey: projectType,
      industry: industry,
      aesthetic: aestheticLabel,
      aestheticDesc: aestheticDesc,
      features: readableFeatures,
      budget: budgetRange,
      timeline: t(`brief.${timeline}`),
      estCostRange: calculateTotalEstimate(),
      estDelivery: getEstimatedDelivery(),
    };

    // Save document state before force width
    const originalBodyStyle = document.body.getAttribute("style") || "";
    const originalHtmlStyle = document.documentElement.getAttribute("style") || "";

    // Force viewport layout at A4 width
    document.documentElement.style.setProperty("width", "794px", "important");
    document.documentElement.style.setProperty("min-width", "794px", "important");
    document.documentElement.style.setProperty("max-width", "794px", "important");
    document.documentElement.style.setProperty("overflow-x", "visible", "important");

    document.body.style.setProperty("width", "794px", "important");
    document.body.style.setProperty("min-width", "794px", "important");
    document.body.style.setProperty("max-width", "794px", "important");
    document.body.style.setProperty("overflow-x", "visible", "important");
    document.body.style.setProperty("position", "relative", "important");

    // Construct print target
    const printArea = document.createElement("div");
    printArea.id = "brief-pdf-printable-clone";
    Object.assign(printArea.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "794px",
      minWidth: "794px",
      maxWidth: "794px",
      maxHeight: "none",
      overflow: "visible",
      margin: "0",
      background: "#ffffff",
      color: "#0D0D11",
      zIndex: "99999"
    });
    printArea.innerHTML = generateBriefPdfHtml(briefData, dateToday);
    document.body.appendChild(printArea);

    try {
      await new Promise(r => setTimeout(r, 400)); // wait for DOM reflow
      
      if (document.fonts) {
        await document.fonts.ready;
      }

      const totalHeight = printArea.scrollHeight;

      // Draw high resolution screenshot of print DOM
      const canvas = await html2canvas(printArea, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 794,
        height: totalHeight,
        windowWidth: 794,
        windowHeight: totalHeight,
        scrollX: 0,
        scrollY: 0
      });

      // Restore document viewport styles immediately
      if (originalBodyStyle) document.body.setAttribute("style", originalBodyStyle);
      else document.body.removeAttribute("style");
      
      if (originalHtmlStyle) document.documentElement.setAttribute("style", originalHtmlStyle);
      else document.documentElement.removeAttribute("style");

      // Save PDF via page slicing
      const imgWidth = 210;
      const pageHeight = 297;
      const pdf = new jsPDF("p", "mm", "a4");

      const pageHeightInPx = Math.round((canvas.width * 297) / 210);
      let yOffset = 0;
      let isFirstPage = true;

      while (yOffset < canvas.height) {
        if (!isFirstPage) pdf.addPage();

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = pageHeightInPx;

        const sliceCtx = sliceCanvas.getContext("2d");
        if (sliceCtx) {
          sliceCtx.fillStyle = "#ffffff";
          sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);

          const sourceHeight = Math.min(pageHeightInPx, canvas.height - yOffset);
          sliceCtx.drawImage(
            canvas,
            0, yOffset, canvas.width, sourceHeight,
            0, 0, canvas.width, sourceHeight
          );
        }

        const sliceImgData = sliceCanvas.toDataURL("image/png");
        pdf.addImage(sliceImgData, "PNG", 0, 0, imgWidth, pageHeight, undefined, "FAST");

        yOffset += pageHeightInPx;
        isFirstPage = false;
      }

      const sanitizedName = contact.name.trim().replace(/[^a-zA-Z0-9α-ωΑ-Ω]+/g, "_") || "Client";
      pdf.save(`Altus_Studio_Brief_${sanitizedName}.pdf`);

    } catch (err) {
      console.error("PDF Export failed:", err);
      alert(lang === "el" ? "Αποτυχία λήψης PDF. Δοκιμάστε ξανά." : "Failed to download PDF. Please try again.");
    } finally {
      if (document.body.contains(printArea)) {
        document.body.removeChild(printArea);
      }
      setIsPdfDownloading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="bg-[#0D0D11] text-[#F9FAFB] min-h-screen pt-28 pb-16 flex flex-col justify-center relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div
          className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full border border-white/5 opacity-50"
          style={{ background: "radial-gradient(circle at 60% 40%, rgba(223, 186, 115, 0.08) 0%, transparent 70%)" }}
        />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full border border-white/5 opacity-30" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 w-full z-10">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: Intro screen */}
          {step === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex p-3.5 bg-white/5 border border-white/10 rounded-full mb-8 text-[#DFBA73]">
                <FileText size={32} />
              </div>
              <h1 
                className="font-bold leading-tight"
                style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
              >
                {t("brief.title")}
              </h1>
              <p 
                className="text-[#F9FAFB]/60 mt-6 max-w-xl mx-auto text-sm md:text-base font-light leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("brief.sub")}
              </p>

              <div className="mt-12 flex justify-center gap-4">
                <button
                  onClick={nextStep}
                  className="px-10 py-4 bg-[#DFBA73] text-[#0D0D11] text-sm tracking-wider uppercase font-semibold hover:bg-[#E6CE93] hover:shadow-[0_0_30px_rgba(223, 186, 115,0.3)] transition-all duration-300 cursor-pointer"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {t("brief.startBtn")}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: Project Type & Industry */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div>
                <span className="text-[#DFBA73] text-xs font-semibold tracking-widest uppercase block mb-2">
                  {t("brief.stepOf").replace("{step}", "1").replace("{total}", "5")}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold font-outfit" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {t("brief.step1Title")}
                </h2>
                <p className="text-[#F9FAFB]/50 text-xs md:text-sm font-light mt-1">{t("brief.step1Sub")}</p>
              </div>

              {/* Selection cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "landing", icon: <Zap size={22} /> },
                  { key: "website", icon: <Globe size={22} /> },
                  { key: "eshop", icon: <ShoppingCart size={22} /> },
                  { key: "portal", icon: <Smartphone size={22} /> }
                ].map(item => {
                  const isActive = projectType === item.key;
                  return (
                    <div
                      key={item.key}
                      onClick={() => setProjectType(item.key as any)}
                      className={`p-6 border transition-all duration-300 cursor-pointer relative group ${
                        isActive
                          ? "border-[#DFBA73] bg-[#DFBA73]/5 shadow-[0_0_20px_rgba(223, 186, 115,0.05)]"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className={`p-2.5 rounded-sm inline-flex mb-4 ${isActive ? "bg-[#DFBA73] text-[#0D0D11]" : "bg-white/5 text-[#F9FAFB]/60"}`}>
                        {item.icon}
                      </div>
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {t(`brief.type${item.key.charAt(0).toUpperCase() + item.key.slice(1)}Title`)}
                      </h3>
                      <p className="text-xs text-[#F9FAFB]/50 font-light leading-relaxed">
                        {t(`brief.type${item.key.charAt(0).toUpperCase() + item.key.slice(1)}Desc`)}
                      </p>
                      {isActive && (
                        <div className="absolute top-4 right-4 text-[#DFBA73]">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Industry inputs */}
              <div className="space-y-2">
                <label className="text-xs tracking-wider uppercase text-[#F9FAFB]/60 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {t("brief.industryLabel")}
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder={t("brief.industryPlaceholder")}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#DFBA73] px-4 py-3.5 text-sm text-[#F9FAFB] placeholder-[#F9FAFB]/50 outline-none transition-colors"
                />
              </div>

              {/* Wizard Nav */}
              <div className="flex justify-between pt-4 border-t border-white/5">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-white/10 hover:border-white/20 text-[#F9FAFB]/70 hover:text-[#F9FAFB] text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <ArrowLeft size={12} /> {t("brief.back")}
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-[#DFBA73] text-[#0D0D11] text-xs tracking-wider uppercase font-semibold hover:bg-[#E6CE93] flex items-center gap-2 cursor-pointer transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {t("brief.next")} <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Aesthetic / Design Tone */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div>
                <span className="text-[#DFBA73] text-xs font-semibold tracking-widest uppercase block mb-2">
                  {t("brief.stepOf").replace("{step}", "2").replace("{total}", "5")}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {t("brief.step2Title")}
                </h2>
                <p className="text-[#F9FAFB]/50 text-xs md:text-sm font-light mt-1">{t("brief.step2Sub")}</p>
              </div>

              {/* Design options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "minimal", icon: <Palette size={20} /> },
                  { key: "dark", icon: <Cpu size={20} /> },
                  { key: "creative", icon: <Sparkles size={20} /> },
                  { key: "corporate", icon: <Globe size={20} /> }
                ].map(item => {
                  const isActive = aesthetic === item.key;
                  return (
                    <div
                      key={item.key}
                      onClick={() => setAesthetic(item.key as any)}
                      className={`p-6 border transition-all duration-300 cursor-pointer relative group ${
                        isActive
                          ? "border-[#DFBA73] bg-[#DFBA73]/5 shadow-[0_0_20px_rgba(223, 186, 115, 0.05)]"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className={`p-2 rounded-sm inline-flex mb-4 ${isActive ? "bg-[#DFBA73] text-[#0D0D11]" : "bg-white/5 text-[#F9FAFB]/60"}`}>
                        {item.icon}
                      </div>
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {t(`brief.style${item.key.charAt(0).toUpperCase() + item.key.slice(1)}Title`)}
                      </h3>
                      <p className="text-xs text-[#F9FAFB]/50 font-light leading-relaxed">
                        {t(`brief.style${item.key.charAt(0).toUpperCase() + item.key.slice(1)}Desc`)}
                      </p>
                      {isActive && (
                        <div className="absolute top-4 right-4 text-[#DFBA73]">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Wizard Nav */}
              <div className="flex justify-between pt-4 border-t border-white/5">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-white/10 hover:border-white/20 text-[#F9FAFB]/70 hover:text-[#F9FAFB] text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <ArrowLeft size={12} /> {t("brief.back")}
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-[#DFBA73] text-[#0D0D11] text-xs tracking-wider uppercase font-semibold hover:bg-[#E6CE93] flex items-center gap-2 cursor-pointer transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {t("brief.next")} <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Technical Features */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div>
                <span className="text-[#DFBA73] text-xs font-semibold tracking-widest uppercase block mb-2">
                  {t("brief.stepOf").replace("{step}", "3").replace("{total}", "5")}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {t("brief.step3Title")}
                </h2>
                <p className="text-[#F9FAFB]/50 text-xs md:text-sm font-light mt-1">{t("brief.step3Sub")}</p>
              </div>

              {/* Checkbox badge grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {featureOptions.map(option => {
                  const isSelected = selectedFeatures.includes(option.id);
                  return (
                    <div
                      key={option.id}
                      onClick={() => toggleFeature(option.id)}
                      className={`p-4 border transition-all duration-200 cursor-pointer flex items-center gap-4 ${
                        isSelected
                          ? "border-[#DFBA73] bg-[#DFBA73]/5"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className={`w-5 h-5 border rounded-sm flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "border-[#DFBA73] bg-[#DFBA73] text-[#0D0D11]" : "border-white/25"
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-wider font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {t(`brief.${option.id}`)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Wizard Nav */}
              <div className="flex justify-between pt-4 border-t border-white/5">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-white/10 hover:border-white/20 text-[#F9FAFB]/70 hover:text-[#F9FAFB] text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <ArrowLeft size={12} /> {t("brief.back")}
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-[#DFBA73] text-[#0D0D11] text-xs tracking-wider uppercase font-semibold hover:bg-[#E6CE93] flex items-center gap-2 cursor-pointer transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {t("brief.next")} <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Budget & Timeline */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div>
                <span className="text-[#DFBA73] text-xs font-semibold tracking-widest uppercase block mb-2">
                  {t("brief.stepOf").replace("{step}", "4").replace("{total}", "5")}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {t("brief.step4Title")}
                </h2>
                <p className="text-[#F9FAFB]/50 text-xs md:text-sm font-light mt-1">{t("brief.step4Sub")}</p>
              </div>

              {/* Budget brackets */}
              <div className="space-y-3">
                <label className="text-xs tracking-wider uppercase text-[#F9FAFB]/60 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {t("brief.budgetLabel")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["€300 - €600", "€600 - €1,200", "€1,200 - €2,500", "€2,500+"].map(br => {
                    const isActive = budgetRange === br;
                    return (
                      <button
                        key={br}
                        onClick={() => setBudgetRange(br)}
                        className={`py-3.5 border text-xs tracking-wider uppercase font-semibold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "border-[#DFBA73] bg-[#DFBA73] text-[#0D0D11]"
                            : "border-white/10 bg-white/5 text-[#F9FAFB]/70 hover:border-white/20 hover:text-[#F9FAFB]"
                        }`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {br}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timeline select */}
              <div className="space-y-3">
                <label className="text-xs tracking-wider uppercase text-[#F9FAFB]/60 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {t("brief.timelineLabel")}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {["timeUrgent", "timeNormal", "timeFlexible"].map(key => {
                    const isActive = timeline === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setTimeline(key)}
                        className={`py-3.5 px-2 border text-[11px] tracking-wider uppercase font-semibold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "border-[#DFBA73] bg-[#DFBA73] text-[#0D0D11]"
                            : "border-white/10 bg-white/5 text-[#F9FAFB]/70 hover:border-white/20 hover:text-[#F9FAFB]"
                        }`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {t(`brief.${key}`)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wizard Nav */}
              <div className="flex justify-between pt-4 border-t border-white/5">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-white/10 hover:border-white/20 text-[#F9FAFB]/70 hover:text-[#F9FAFB] text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <ArrowLeft size={12} /> {t("brief.back")}
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-[#DFBA73] text-[#0D0D11] text-xs tracking-wider uppercase font-semibold hover:bg-[#E6CE93] flex items-center gap-2 cursor-pointer transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {t("brief.next")} <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Contact details & Submission */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div>
                <span className="text-[#DFBA73] text-xs font-semibold tracking-widest uppercase block mb-2">
                  {t("brief.stepOf").replace("{step}", "5").replace("{total}", "5")}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {t("brief.step5Title")}
                </h2>
                <p className="text-[#F9FAFB]/50 text-xs md:text-sm font-light mt-1">{t("brief.step5Sub")}</p>
              </div>

              <form onSubmit={handleBriefSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-[#F9FAFB]/50 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {t("brief.fullName")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={contact.name}
                      onChange={(e) => setContact(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#DFBA73] px-4 py-3 text-sm text-[#F9FAFB] outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-[#F9FAFB]/50 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {t("brief.email")} *
                    </label>
                    <input
                      type="email"
                      required
                      value={contact.email}
                      onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#DFBA73] px-4 py-3 text-sm text-[#F9FAFB] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-[#F9FAFB]/50 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {t("brief.phone")} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contact.phone}
                      onChange={(e) => setContact(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#DFBA73] px-4 py-3 text-sm text-[#F9FAFB] outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-[#F9FAFB]/50 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {t("brief.company")}
                    </label>
                    <input
                      type="text"
                      value={contact.company}
                      onChange={(e) => setContact(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#DFBA73] px-4 py-3 text-sm text-[#F9FAFB] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Wizard Nav */}
                <div className="flex justify-between pt-6 border-t border-white/5 mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-white/10 hover:border-white/20 text-[#F9FAFB]/70 hover:text-[#F9FAFB] text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <ArrowLeft size={12} /> {t("brief.back")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-[#DFBA73] text-[#0D0D11] text-xs tracking-wider uppercase font-semibold hover:bg-[#E6CE93] flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={13} className="animate-spin" /> {lang === "el" ? "Υποβολή..." : "Submitting..."}
                      </>
                    ) : (
                      t("brief.submit")
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 6: Success & Dashboard screen */}
          {step === 6 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="inline-flex p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full mb-6">
                  <Check size={28} strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-bold font-outfit" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {t("brief.successTitle")}
                </h2>
                <p className="text-[#F9FAFB]/60 text-sm font-light mt-3 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {t("brief.successSub")}
                </p>
              </div>

              {/* Estimate results display */}
              <div className="bg-[#14141A] border border-white/5 p-6 md:p-8 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div>
                    <span className="text-[#F9FAFB]/50 text-[10px] tracking-wider uppercase font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {t("brief.estCost")}
                    </span>
                    <p className="text-[#DFBA73] text-3xl font-bold mt-1 font-outfit" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {calculateTotalEstimate()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#F9FAFB]/50 text-[10px] tracking-wider uppercase font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {t("brief.estDelivery")}
                    </span>
                    <p className="text-[#F9FAFB] text-lg font-semibold mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {getEstimatedDelivery()}
                    </p>
                  </div>
                  <div className="text-[10px] text-[#F9FAFB]/50 font-light leading-relaxed">
                    * {lang === "el" ? "Οι τιμές είναι ενδεικτικές προ ΦΠΑ και ενδέχεται να αναπροσαρμοστούν ανάλογα με τις ακριβείς προδιαγραφές του project." : "Prices are estimates excluding VAT and might adjust based on exact final requirements."}
                  </div>
                </div>

                {/* Next Steps CTA actions */}
                <div className="flex flex-col gap-3.5">
                  <button
                    onClick={handlePdfDownload}
                    disabled={isPdfDownloading}
                    className="w-full py-4 bg-white/5 border border-white/10 hover:border-white/20 text-[#F9FAFB] text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {isPdfDownloading ? (
                      <>
                        <Loader2 size={13} className="animate-spin" /> {lang === "el" ? "Δημιουργία..." : "Generating..."}
                      </>
                    ) : (
                      <>
                        <Download size={14} /> {t("brief.downloadPdf")}
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowCalendarModal(true)}
                    className="w-full py-4 bg-[#DFBA73] text-[#0D0D11] text-xs tracking-wider uppercase font-semibold hover:bg-[#E6CE93] hover:shadow-[0_0_20px_rgba(223,186,115,0.2)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <Calendar size={14} /> {t("brief.bookCall")}
                  </button>
                </div>
              </div>

              {/* Selection summary */}
              <div className="border border-white/5 p-6 rounded-lg space-y-4 bg-white/[0.01]">
                <h3 className="text-xs tracking-wider uppercase text-[#DFBA73] font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {t("brief.summary")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-light">
                  <div>
                    <span className="text-[#F9FAFB]/50 block mb-1">Type:</span>
                    <span className="font-semibold text-white/80">{t(`brief.type${projectType.charAt(0).toUpperCase() + projectType.slice(1)}Title`)}</span>
                  </div>
                  <div>
                    <span className="text-[#F9FAFB]/50 block mb-1">Industry:</span>
                    <span className="font-semibold text-white/80">{industry || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[#F9FAFB]/50 block mb-1">Design:</span>
                    <span className="font-semibold text-white/80">{t(`brief.style${aesthetic.charAt(0).toUpperCase() + aesthetic.slice(1)}Title`)}</span>
                  </div>
                  <div>
                    <span className="text-[#F9FAFB]/50 block mb-1">Features:</span>
                    <span className="font-semibold text-white/80">{selectedFeatures.length} selected</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <Link to="/" className="text-[#F9FAFB]/50 hover:text-[#DFBA73] text-xs uppercase tracking-widest transition-colors">
                  {lang === "el" ? "Επιστροφή στην Αρχική" : "Back to Home"}
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Booking Calendar Dialog Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0D0D11] border border-white/10 rounded-lg shadow-2xl">
            <BookingCalendar 
              isModal={true} 
              initialService={t(`brief.type${projectType.charAt(0).toUpperCase() + projectType.slice(1)}Title`)}
              onClose={() => setShowCalendarModal(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
