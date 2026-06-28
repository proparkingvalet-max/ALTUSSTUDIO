import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, HelpCircle, Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { supabase, isSupabaseConfigured } from "@/app/utils/supabaseClient";
import { sendTelegramNotification } from "@/app/utils/telegram";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export function AltusAssistant() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [contactInput, setContactInput] = useState("");
  const [isWaitingForContact, setIsWaitingForContact] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [prices, setPrices] = useState({
    landing: 250,
    website: 350,
    eshop: 990,
  });

  useEffect(() => {
    // Load current prices from Supabase
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("settings")
        .select("value")
        .eq("key", "prices")
        .maybeSingle()
        .then(({ data, error }) => {
          if (!error && data && data.value) {
            const val = data.value;
            if (val.landing || val.website || val.eshop) {
              setPrices({
                website: val.website ?? 350,
                eshop: val.eshop ?? 990,
                landing: val.landing ?? 250,
              });
            }
          }
        });
    } else {
      const cached = localStorage.getItem("altus_prices");
      if (cached) {
        try {
          const val = JSON.parse(cached);
          if (val.landing || val.website || val.eshop) {
            setPrices({
              website: val.website ?? 350,
              eshop: val.eshop ?? 990,
              landing: val.landing ?? 250,
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Initialize with greeting
  useEffect(() => {
    const welcomeMsg =
      lang === "el"
        ? "Γεια σας! Είμαι ο Altus Assistant. Πώς μπορώ να σας βοηθήσω σήμερα;"
        : "Hello! I am the Altus Assistant. How can I help you today?";
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: welcomeMsg,
        timestamp: new Date(),
      },
    ]);
    setIsWaitingForContact(false);
    setLeadSubmitted(false);
    setContactInput("");
  }, [lang]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const quickPrompts = [
    {
      id: "services",
      label: lang === "el" ? "💼 Τι υπηρεσίες προσφέρετε;" : "💼 What services do you offer?",
      botReply:
        lang === "el"
          ? "Σχεδιάζουμε και αναπτύσσουμε premium ιστοσελίδες, e-shops, custom web εφαρμογές και εταιρικές ταυτότητες (branding). Κάθε έργο σχεδιάζεται custom (UI/UX) και αναπτύσσεται με σύγχρονες τεχνολογίες για μέγιστη ταχύτητα και SEO."
          : "We design and develop premium websites, e-shops, custom web applications, and corporate branding identities. Every project is custom designed (UI/UX) and built with modern technologies for maximum speed and top SEO performance.",
    },
    {
      id: "cost",
      label: lang === "el" ? "💶 Πόσο κοστίζει μια ιστοσελίδα;" : "💶 How much does a website cost?",
      botReply:
        lang === "el"
          ? `Το κόστος προσαρμόζεται στις απαιτήσεις σας. Ενδεικτικά: Landing Pages από €${prices.landing}, Custom Ιστοσελίδες από €${prices.website}, E-Shops από €${prices.eshop}. Μπορείτε να χρησιμοποιήσετε τον «Κοστολογητή» στη σελίδα των Υπηρεσιών μας για μια άμεση, live εκτίμηση!`
          : `Pricing is tailored to your requirements. Indicatively: Landing Pages start at €${prices.landing}, Custom Websites at €${prices.website}, and E-Shops at €${prices.eshop}. You can use our 'Quote Estimator' wizard on our Services page for an instant, live estimate!`,
    },
    {
      id: "time",
      label: lang === "el" ? "⏱️ Ποιος είναι ο χρόνος παράδοσης;" : "⏱️ How long does a project take?",
      botReply:
        lang === "el"
          ? "Συνήθως, μια Landing Page ολοκληρώνεται σε 1-2 εβδομάδες, ένα Custom Website σε 2-4 εβδομάδες, και ένα e-shop ή custom web app σε 3-6 εβδομάδες, ανάλογα με την πολυπλοκότητα των λειτουργιών."
          : "Typically, a Landing Page is completed in 1-2 weeks, a Custom Website in 2-4 weeks, and an e-shop or custom web app in 3-6 weeks, depending on the complexity of its features.",
    },
    {
      id: "start",
      label: lang === "el" ? "🤝 Πώς ξεκινάμε τη συνεργασία;" : "🤝 How do we get started?",
      botReply:
        lang === "el"
          ? "Αρχικά κάνουμε μια δωρεάν συνάντηση (ή κλήση) για να αναλύσουμε τις ανάγκες σας. Στη συνέχεια σας στέλνουμε μια αναλυτική προσφορά και ξεκινάμε με τον UI/UX σχεδιασμό. Αφού τον εγκρίνετε, προχωράμε στην υλοποίηση."
          : "We start with a free discovery call or meeting to discuss your goals. Next, we send you a detailed quote and begin the custom UI/UX design. Once you approve the mockups, we proceed to development and coding.",
    },
    {
      id: "quote",
      label: lang === "el" ? "✍️ Θέλω να ζητήσω προσφορά" : "✍️ Request a customized quote",
      botReply:
        lang === "el"
          ? "Εξαιρετικά! Παρακαλώ πληκτρολογήστε το Email ή το Τηλέφωνό σας παρακάτω, και ένας εκπρόσωπός μας θα επικοινωνήσει μαζί σας άμεσα με μια προσαρμοσμένη προσφορά."
          : "Wonderful! Please type your Email or Phone number below, and one of our experts will contact you shortly with a customized quote proposal.",
      triggerContact: true,
    },
  ];

  const handlePromptClick = (label: string, botReply: string, triggerContact = false) => {
    if (isTyping) return;

    // Add user message
    const userMsg: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text: label,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botMsg: Message = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: botReply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (triggerContact) {
        setIsWaitingForContact(true);
      }
    }, 800);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInput.trim() || leadSubmitted) return;

    // Add user's contact details as a chat bubble
    const contactMsg: Message = {
      id: "user-contact-" + Date.now(),
      sender: "user",
      text: contactInput,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, contactMsg]);
    setContactInput("");
    setIsWaitingForContact(false);
    setIsTyping(true);

    // Generate bot thanks reply
    setTimeout(() => {
      const thanksMsg =
        lang === "el"
          ? "Ευχαριστούμε πολύ! Τα στοιχεία σας καταχωρήθηκαν. Θα επικοινωνήσουμε μαζί σας εντός 24 ωρών."
          : "Thank you! Your contact details have been registered. We will reach out to you within 24 hours.";

      const botMsg: Message = {
        id: "bot-thanks-" + Date.now(),
        sender: "bot",
        text: thanksMsg,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      setLeadSubmitted(true);

      // Save to Supabase (if configured) or fallback to localStorage as a new CRM lead message!
      try {
        // Construct full transcript for the admin lead
        const transcript = messages
          .concat(contactMsg)
          .map((m) => `[${m.sender === "bot" ? "Βοηθός" : "Πελάτης"}]: ${m.text}`)
          .join("\n");

        const newLead = {
          name: lang === "el" ? "Πελάτης (Chatbot)" : "Client (Chatbot)",
          email: contactInput.includes("@") ? contactInput.trim() : "",
          phone: !contactInput.includes("@") ? contactInput.trim() : "",
          service: lang === "el" ? "Lead από AI Assistant" : "Lead from AI Assistant",
          message: `Ολοκληρωμένη συνομιλία με το chatbot:\n\n${transcript}\n\nΣτοιχεία Επικοινωνίας: ${contactInput.trim()}`,
          date: new Date().toISOString().split("T")[0],
          read: false,
          status: "new",
        };

        // Construct Telegram Message for Chatbot Lead
        const tgMessage = `🤖 <b>Νέο Lead από AI Assistant</b>\n\n` +
          `👤 <b>Στοιχεία:</b> ${contactInput.trim()}\n\n` +
          `📝 <b>Συνομιλία:</b>\n${transcript}`;

        if (isSupabaseConfigured && supabase) {
          supabase
            .from("messages")
            .insert([newLead])
            .then(({ error }) => {
              if (error) {
                console.error("Error submitting chatbot lead to Supabase:", error);
              } else {
                sendTelegramNotification(tgMessage);
              }
              // Dispatch event for Admin dashboard
              window.dispatchEvent(new Event("storage"));
            });
        } else {
          const raw = localStorage.getItem("altus_messages");
          const existingMessages = raw ? JSON.parse(raw) : [];
          
          const localLead = {
            id: "lead-chat-" + Date.now(),
            ...newLead
          };

          const updated = [localLead, ...existingMessages];
          localStorage.setItem("altus_messages", JSON.stringify(updated));
          sendTelegramNotification(tgMessage);
          
          // Dispatch event for Admin dashboard
          window.dispatchEvent(new Event("storage"));
        }
      } catch (err) {
        console.error("Failed to save chatbot lead", err);
      }
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative w-14 h-14 bg-[#0D0D11] border border-[#DFBA73]/40 hover:border-[#DFBA73] text-[#DFBA73] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(223, 186, 115,0.3)] hover:shadow-[0_0_20px_rgba(223, 186, 115,0.5)] transition-all duration-300 cursor-pointer group"
      >
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#DFBA73] to-[#E6CE93] opacity-20 group-hover:opacity-40 blur transition-opacity duration-300 animate-pulse" />
        {isOpen ? <X size={22} className="relative z-10" /> : <MessageSquare size={22} className="relative z-10" />}
      </button>

      {/* Chat Window (Glassmorphic Pane) */}
      {isOpen && (
        <div
          className="absolute bottom-18 right-0 w-[350px] sm:w-[380px] h-[500px] bg-[#0D0D11]/95 border border-[#DFBA73]/25 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md flex flex-col overflow-hidden transition-all duration-300"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#14141A] to-[#0D0D11] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#DFBA73]/15 border border-[#DFBA73]/30 flex items-center justify-center">
                <Bot size={18} className="text-[#DFBA73]" />
              </div>
              <div>
                <h5 className="text-[#F9FAFB] text-sm font-semibold tracking-wide">Altus AI Assistant</h5>
                <span className="text-[#4CAF50] text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] inline-block animate-ping" />
                  {lang === "el" ? "Συνδεδεμένος" : "Online"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#F9FAFB]/50 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#DFBA73] text-[#0D0D11] rounded-tr-none font-medium"
                      : "bg-white/5 border border-white/10 text-[#F9FAFB]/90 rounded-tl-none font-light"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 text-[#F9FAFB]/50 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <Loader2 size={14} className="animate-spin text-[#DFBA73]" />
                  <span className="text-xs font-mono">typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Options */}
          {!isWaitingForContact && !leadSubmitted && (
            <div className="p-3 border-t border-white/5 bg-black/10 space-y-1.5 shrink-0">
              <p className="text-[#DFBA73]/50 text-[10px] uppercase tracking-wider font-semibold px-1 flex items-center gap-1">
                <HelpCircle size={10} />
                {lang === "el" ? "Επιλέξτε ερώτηση:" : "Select a question:"}
              </p>
              <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto scrollbar-thin">
                {quickPrompts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePromptClick(p.label, p.botReply, p.triggerContact)}
                    disabled={isTyping}
                    className="w-full text-left p-2.5 bg-white/2 hover:bg-white/5 border border-white/5 hover:border-[#DFBA73]/35 rounded-lg text-xs text-[#F9FAFB]/80 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contact Input Form (Triggered by Offer option) */}
          {isWaitingForContact && (
            <form
              onSubmit={handleContactSubmit}
              className="p-3 border-t border-white/5 bg-[#14141A] flex gap-2 shrink-0 items-center"
            >
              <input
                type="text"
                value={contactInput}
                onChange={(e) => setContactInput(e.target.value)}
                placeholder={lang === "el" ? "Email ή Τηλέφωνο..." : "Email or Phone..."}
                required
                className="flex-1 px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg text-[#F9FAFB] text-xs outline-none focus:border-[#DFBA73]/50"
              />
              <button
                type="submit"
                className="p-2.5 bg-[#DFBA73] hover:bg-[#E6CE93] text-[#0D0D11] rounded-lg transition-colors cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>
          )}

          {/* Finished lead confirmation message */}
          {leadSubmitted && (
            <div className="p-3 border-t border-white/5 bg-emerald-500/10 text-emerald-400 text-xs text-center flex items-center justify-center gap-1.5 shrink-0">
              <Check size={14} />
              {lang === "el" ? "Το lead αποθηκεύτηκε στο CRM!" : "Lead registered in CRM!"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
