import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, CheckCircle2, Calendar, Clock, User, X } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { supabase, isSupabaseConfigured } from "@/app/utils/supabaseClient";
import { sendTelegramNotification } from "@/app/utils/telegram";

interface BookingCalendarProps {
  isModal?: boolean;
  onClose?: () => void;
  initialService?: string;
}

export function BookingCalendar({ isModal = false, onClose, initialService }: BookingCalendarProps) {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState(1);

  // Date state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const timeSlots = [
    "10:00 - 10:15",
    "11:30 - 11:45",
    "13:00 - 13:15",
    "14:30 - 14:45",
    "16:00 - 16:15",
    "17:30 - 17:45"
  ];

  // Calendar logic helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNamesEl = [
    "Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος",
    "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"
  ];
  const monthNamesEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeekEl = ["Δε", "Τρ", "Τε", "Πε", "Πα", "Σα", "Κυ"];
  const daysOfWeekEn = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => {
    // getDay() returns 0 for Sunday, 1 for Monday etc. 
    // We adjust it so Monday is index 0.
    const day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    const now = new Date();
    if (year === now.getFullYear() && month <= now.getMonth()) return; // Don't go to past months
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(year, month, day);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    // Disable past days and weekends
    if (selected < now || selected.getDay() === 0 || selected.getDay() === 6) return;
    
    setSelectedDate(selected);
    setSelectedTimeSlot(null); // Reset time slot on new date selection
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTimeSlot || !name.trim() || !email.trim()) return;

    setSubmitting(true);
    
    const formattedDate = selectedDate.toLocaleDateString(lang === "el" ? "el-GR" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const payload = {
      name,
      email,
      phone,
      service: initialService || (lang === "el" ? "Call Γνωριμίας" : "Discovery Call"),
      message: `Προγραμματισμένο Call:\nΗμερομηνία: ${formattedDate}\nΏρα: ${selectedTimeSlot}`,
      date: new Date().toISOString().split("T")[0],
      read: false,
      status: "new"
    };

    // Construct Telegram Notification Message
    const tgMessage = `📅 <b>Νέο Ραντεβού (Call Γνωριμίας)</b>\n\n` +
      `👤 <b>Όνομα:</b> ${name}\n` +
      `📧 <b>Email:</b> ${email}\n` +
      `📞 <b>Τηλέφωνο:</b> ${phone || "—"}\n` +
      `🕒 <b>Ημερομηνία/Ώρα:</b> ${formattedDate} (${selectedTimeSlot})`;

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("messages")
        .insert([payload])
        .then(({ error }) => {
          if (error) {
            console.error("Error submitting booking call to Supabase:", error);
          } else {
            sendTelegramNotification(tgMessage);
          }
          setSubmitting(false);
          setSuccess(true);
        });
    } else {
      setTimeout(() => {
        try {
          const raw = localStorage.getItem("altus_messages");
          const existingMessages = raw ? JSON.parse(raw) : [];

          const newBookingLead = {
            id: "booking-" + Date.now(),
            ...payload
          };

          const updated = [newBookingLead, ...existingMessages];
          localStorage.setItem("altus_messages", JSON.stringify(updated));
          sendTelegramNotification(tgMessage);

          // Dispatch storage event to alert dashboard
          window.dispatchEvent(new Event("storage"));
        } catch (err) {
          console.error("Failed to save booking:", err);
        }

        setSubmitting(false);
        setSuccess(true);
      }, 1200);
    }
  };

  // Generate calendar grid array
  const calendarGrid = [];
  // Pad previous month trailing cells
  for (let i = 0; i < firstDayIndex; i++) {
    calendarGrid.push(null);
  }
  // Populate current month cells
  for (let d = 1; d <= daysInMonth; d++) {
    calendarGrid.push(d);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const containerClasses = isModal
    ? "bg-[#0D0D11] border border-white/10 p-8 md:p-12 shadow-2xl relative max-w-lg w-full max-h-[90vh] overflow-y-auto"
    : "bg-white border border-[#0D0D11]/8 p-8 md:p-12 shadow-sm text-[#0D0D11] w-full";

  const textPrimary = isModal ? "text-[#F9FAFB]" : "text-[#0D0D11]";
  const textMuted = isModal ? "text-[#F9FAFB]/50" : "text-[#0D0D11]/55";
  const borderCol = isModal ? "border-white/10" : "border-[#0D0D11]/10";
  const cardBg = isModal ? "bg-[#111827]/60 border-white/8" : "bg-white border-[#0D0D11]/8";

  return (
    <div className={isModal ? "fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" : "w-full"}>
      <div className={containerClasses}>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#F9FAFB]/50 hover:text-white cursor-pointer"
            aria-label={t("booking.close")}
          >
            <X size={20} />
          </button>
        )}

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="booking-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="mb-8">
                <h3 className={`${textPrimary} text-2xl font-bold font-serif mb-2`} style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {t("booking.title")}
                </h3>
                <p className={`${textMuted} text-xs leading-relaxed`}>
                  {t("booking.sub")}
                </p>
              </div>

              {/* Progress Steps */}
              <div className={`flex items-center gap-2 mb-8 border-b ${borderCol} pb-4 text-xs font-medium`}>
                <span className={step === 1 ? "text-[#DFBA73]" : textMuted}>
                  {lang === "el" ? "1. Ημερομηνία" : "1. Date"}
                </span>
                <ChevronRight size={12} className={textMuted} />
                <span className={step === 2 ? "text-[#DFBA73]" : textMuted}>
                  {lang === "el" ? "2. Ώρα" : "2. Time"}
                </span>
                <ChevronRight size={12} className={textMuted} />
                <span className={step === 3 ? "text-[#DFBA73]" : textMuted}>
                  {lang === "el" ? "3. Στοιχεία" : "3. Info"}
                </span>
              </div>

              {/* STEP 1: CALENDAR SELECTOR */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className={`${textPrimary} text-sm font-semibold`}>
                      {lang === "el" ? monthNamesEl[month] : monthNamesEn[month]} {year}
                    </h4>
                    <div className="flex gap-1">
                      <button
                        onClick={prevMonth}
                        type="button"
                        className={`p-2 border ${borderCol} hover:text-[#DFBA73] cursor-pointer`}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={nextMonth}
                        type="button"
                        className={`p-2 border ${borderCol} hover:text-[#DFBA73] cursor-pointer`}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] tracking-wider uppercase font-semibold mb-2">
                    {(lang === "el" ? daysOfWeekEl : daysOfWeekEn).map((day) => (
                      <div key={day} className={textMuted}>
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar cells */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarGrid.map((day, idx) => {
                      if (day === null) {
                        return <div key={`empty-${idx}`} />;
                      }

                      const dateObj = new Date(year, month, day);
                      const isPast = dateObj < today;
                      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                      const isDisabled = isPast || isWeekend;
                      const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;

                      return (
                        <button
                          key={`day-${day}`}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => handleDateSelect(day)}
                          className={`aspect-square text-xs font-mono transition-all border flex items-center justify-center cursor-pointer ${
                            isSelected
                              ? "bg-[#DFBA73] text-[#0D0D11] border-[#DFBA73] font-bold"
                              : isDisabled
                              ? "opacity-20 cursor-not-allowed border-transparent"
                              : isModal
                              ? "border-white/5 hover:border-[#DFBA73] text-[#F9FAFB]"
                              : "border-[#0D0D11]/5 hover:border-[#DFBA73] text-[#0D0D11]"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: TIME SLOTS */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar size={14} className="text-[#DFBA73]" />
                    <span className={`${textPrimary} text-xs font-medium`}>
                      {selectedDate?.toLocaleDateString(lang === "el" ? "el-GR" : "en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`p-3 text-xs font-mono text-center border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#DFBA73] text-[#0D0D11] border-[#DFBA73] font-bold"
                              : isModal
                              ? "border-white/10 text-white/80 hover:border-[#DFBA73]"
                              : "border-[#0D0D11]/10 text-[#0D0D11] hover:border-[#DFBA73]"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className={`px-4 py-2 border ${borderCol} ${textPrimary} hover:text-[#DFBA73] text-xs uppercase tracking-wider cursor-pointer`}
                    >
                      {t("booking.back")}
                    </button>
                    <button
                      type="button"
                      disabled={!selectedTimeSlot}
                      onClick={() => setStep(3)}
                      className="px-6 py-2 bg-[#DFBA73] text-[#0D0D11] hover:bg-[#E6CE93] disabled:opacity-50 text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      {t("booking.next")}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: CONTACT FORM */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex flex-col gap-2 mb-6 p-4 bg-white/2 border border-white/5 rounded-sm">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar size={12} className="text-[#DFBA73]" />
                      <span className={textPrimary}>
                        {selectedDate?.toLocaleDateString(lang === "el" ? "el-GR" : "en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock size={12} className="text-[#DFBA73]" />
                      <span className={textPrimary}>{selectedTimeSlot}</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className={`block ${textMuted} text-[10px] tracking-widest uppercase mb-1.5`}>
                        {t("booking.name")} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className={`w-full bg-transparent border-b ${borderCol} focus:border-[#DFBA73] pb-2 text-sm ${textPrimary} outline-none`}
                      />
                    </div>
                    <div>
                      <label className={`block ${textMuted} text-[10px] tracking-widest uppercase mb-1.5`}>
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        className={`w-full bg-transparent border-b ${borderCol} focus:border-[#DFBA73] pb-2 text-sm ${textPrimary} outline-none`}
                      />
                    </div>
                    <div>
                      <label className={`block ${textMuted} text-[10px] tracking-widest uppercase mb-1.5`}>
                        {t("booking.phone")}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+30 697..."
                        className={`w-full bg-transparent border-b ${borderCol} focus:border-[#DFBA73] pb-2 text-sm ${textPrimary} outline-none`}
                      />
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className={`px-4 py-2 border ${borderCol} ${textPrimary} hover:text-[#DFBA73] text-xs uppercase tracking-wider cursor-pointer`}
                      >
                        {t("booking.back")}
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-3 bg-[#DFBA73] text-[#0D0D11] hover:bg-[#E6CE93] disabled:opacity-50 text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
                      >
                        {submitting ? (
                          <>
                            <div className="w-3 h-3 border border-[#0D0D11] border-t-transparent animate-spin rounded-full" />
                            {lang === "el" ? "Κράτηση..." : "Booking..."}
                          </>
                        ) : (
                          t("booking.submit")
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 flex flex-col items-center"
            >
              <CheckCircle2 size={48} className="text-[#DFBA73] mb-6 animate-pulse" />
              <h3 className={`${textPrimary} text-2xl font-bold font-serif mb-4`} style={{ fontFamily: "'Outfit', sans-serif" }}>
                {t("booking.successTitle")}
              </h3>
              <p className={`${textMuted} text-sm max-w-xs mb-8 leading-relaxed`}>
                {t("booking.successSub")}
              </p>
              {isModal && onClose && (
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-[#DFBA73] text-[#0D0D11] hover:bg-[#E6CE93] font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  {t("booking.close")}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
