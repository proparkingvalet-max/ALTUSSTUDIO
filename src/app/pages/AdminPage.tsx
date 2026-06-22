import { useState, useEffect, useMemo } from "react";
import { getProjects, saveProjects, mapSupabaseProject, Project } from "@/app/utils/projects";
import { supabase, isSupabaseConfigured } from "@/app/utils/supabaseClient";
import { useIsMobile } from "@/app/components/ui/use-mobile";
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  Settings,
  LogOut,
  Eye,
  TrendingUp,
  Users,
  Mail,
  CheckCircle,
  Clock,
  Trash2,
  ExternalLink,
  ChevronRight,
  Shield,
  AlertCircle,
  Bell,
  BarChart2,
  Globe,
  Star,
  X,
  Phone,
  FileText,
  Plus,
  Printer,
  UserCheck,
  Building2,
  Send,
  MinusCircle,
  PlusCircle,
  Menu,
} from "lucide-react";

const ADMIN_PASSWORD = "gate71337";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockMessages: any[] = [];

const mockProjects: any[] = [];

const stats = [
  { label: "Επισκέπτες (Μήνας)", value: "1.847", change: "+12%", icon: Eye, color: "#C9A84C" },
  { label: "Νέα Μηνύματα", value: "4", change: "+2 σήμερα", icon: Mail, color: "#4CAF50" },
  { label: "Ενεργά Projects", value: "2", change: "1 ολοκλ.", icon: FolderOpen, color: "#2196F3" },
  { label: "Ολοκλ. Projects", value: "12", change: "+3 φέτος", icon: CheckCircle, color: "#9C27B0" },
];

// ─── Status helpers ────────────────────────────────────────────────────────────

const statusLabel: Record<string, string> = {
  new: "Νέο",
  replied: "Απαντήθηκε",
  "in-progress": "Σε εξέλιξη",
  completed: "Ολοκληρώθηκε",
};

const statusColor: Record<string, string> = {
  new: "#ef4444",
  replied: "#3b82f6",
  "in-progress": "#f59e0b",
  completed: "#22c55e",
  live: "#22c55e",
  draft: "#6b7280",
};

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handle = () => {
    if (pw === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A0F1E 0%, #111827 50%, #0A0F1E 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative orbs */}
      <div style={{ position: "absolute", top: "10%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: 24,
          padding: "56px 48px",
          width: "100%",
          maxWidth: 420,
          backdropFilter: "blur(20px)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
          animation: shake ? "shake 0.5s ease" : undefined,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
            <Shield size={28} color="#C9A84C" />
            <span style={{ fontSize: 22, fontWeight: 700, color: "#C9A84C", fontFamily: "'Playfair Display', serif", letterSpacing: "0.05em" }}>
              ALTUS STUDIO
            </span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Admin Dashboard
          </p>
        </div>

        {/* Input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
            Κωδικός Πρόσβασης
          </label>
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handle()}
            placeholder="••••••••••"
            style={{
              width: "100%",
              padding: "14px 18px",
              background: "rgba(255,255,255,0.05)",
              border: error ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              color: "#fff",
              fontSize: 16,
              outline: "none",
              letterSpacing: "0.2em",
              boxSizing: "border-box",
              transition: "border 0.2s",
            }}
          />
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: "#ef4444", fontSize: 13 }}>
              <AlertCircle size={14} />
              Λάθος κωδικός. Δοκιμάστε ξανά.
            </div>
          )}
        </div>

        <button
          onClick={handle}
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #C9A84C, #a8893e)",
            border: "none",
            borderRadius: 12,
            color: "#0A0F1E",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.05em",
            transition: "opacity 0.2s, transform 0.1s",
          }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.opacity = "0.9"; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.opacity = "1"; }}
        >
          Είσοδος →
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
      `}</style>
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "messages", label: "Μηνύματα", icon: MessageSquare },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "clients", label: "Πελάτες (CRM)", icon: Users },
  { id: "quotes", label: "Προσφορές", icon: FileText },
  { id: "analytics", label: "Στατιστικά", icon: BarChart2 },
  { id: "settings", label: "Ρυθμίσεις", icon: Settings },
];

function Sidebar({
  active,
  setActive,
  onLogout,
  isMobile,
  isOpen,
  onClose,
}: {
  active: string;
  setActive: (s: string) => void;
  onLogout: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  return (
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        height: isMobile ? "100vh" : "auto",
        background: "#0A0F1E",
        borderRight: "1px solid rgba(201,168,76,0.15)",
        display: "flex",
        flexDirection: "column",
        padding: "32px 0",
        position: isMobile ? "fixed" : "sticky",
        top: 0,
        left: isMobile ? (isOpen ? 0 : -240) : 0,
        zIndex: 100,
        transition: isMobile ? "left 0.3s ease" : "none",
        boxShadow: isMobile && isOpen ? "0 0 40px rgba(0,0,0,0.8)" : "none",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 24px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "rgba(201,168,76,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(201,168,76,0.3)" }}>
            <Globe size={18} color="#C9A84C" />
          </div>
          <div>
            <div style={{ color: "#C9A84C", fontWeight: 700, fontSize: 14, fontFamily: "'Playfair Display', serif", letterSpacing: "0.05em" }}>ALTUS</div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.1em" }}>ADMIN PANEL</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActive(item.id);
                if (isMobile && onClose) onClose();
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 10,
                border: "none",
                background: isActive ? "rgba(201,168,76,0.12)" : "transparent",
                color: isActive ? "#C9A84C" : "rgba(255,255,255,0.45)",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.2s",
                marginBottom: 2,
                borderLeft: isActive ? "3px solid #C9A84C" : "3px solid transparent",
              }}
            >
              <Icon size={17} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ background: "#ef4444", color: "#fff", borderRadius: 9999, fontSize: 10, padding: "2px 7px", fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* View Site Link */}
      <div style={{ padding: "0 12px 10px" }}>
        <a
          href="/?preview=true"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (isMobile && onClose) onClose();
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 14px",
            borderRadius: 10,
            background: "rgba(201,168,76,0.05)",
            border: "1px solid rgba(201,168,76,0.15)",
            color: "#C9A84C",
            cursor: "pointer",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
            boxSizing: "border-box",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.15)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.05)"; }}
        >
          <ExternalLink size={17} />
          Προβολή Site
        </a>
      </div>

      {/* Logout */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={() => {
            onLogout();
            if (isMobile && onClose) onClose();
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 14px",
            borderRadius: 10,
            border: "none",
            background: "transparent",
            color: "rgba(255,255,255,0.3)",
            cursor: "pointer",
            fontSize: 14,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#ef4444"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <LogOut size={17} />
          Αποσύνδεση
        </button>
      </div>
    </aside>
  );
}

// ─── Dashboard View ────────────────────────────────────────────────────────────

function DashboardView() {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pageViewsMonth, setPageViewsMonth] = useState<number | null>(null);
  const [pageViewsToday, setPageViewsToday] = useState<number>(0);

  useEffect(() => {
    // Fetch messages from Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            setMessages(data);
            localStorage.setItem("altus_messages", JSON.stringify(data));
          } else {
            console.error("Failed to load messages from Supabase in dashboard:", error);
            const raw = localStorage.getItem("altus_messages");
            if (raw) setMessages(JSON.parse(raw));
          }
        });
    } else {
      const raw = localStorage.getItem("altus_messages");
      if (raw) {
        setMessages(JSON.parse(raw));
      } else {
        setMessages(mockMessages);
        localStorage.setItem("altus_messages", JSON.stringify(mockMessages));
      }
    }

    // Fetch projects from Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            const mapped = data.map(mapSupabaseProject);
            setProjects(mapped);
            localStorage.setItem("altus_projects", JSON.stringify(mapped));
          } else {
            console.error("Failed to load projects from Supabase in dashboard:", error);
            setProjects(getProjects());
          }
        });
    } else {
      setProjects(getProjects());
    }
    // Fetch real page view counts from Supabase
    if (isSupabaseConfigured && supabase) {
      const thisMonth = new Date().toISOString().substring(0, 7); // "YYYY-MM"
      const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

      supabase
        .from("page_views")
        .select("date")
        .gte("date", `${thisMonth}-01`)
        .then(({ data }) => {
          if (data) {
            setPageViewsMonth(data.length);
            setPageViewsToday(data.filter((r: any) => r.date === today).length);
          }
        });
    }
  }, []);

  const recentMessages = messages.slice(0, 3);
  const newMessagesCount = messages.filter((m) => m.status === "new").length;

  const liveProjects = projects.filter((p) => p.isLive).length;
  const activeProjects = projects.filter((p) => !p.isLive).length;
  const totalProjects = projects.length;

  const dynamicStats = [
    {
      label: "Επισκέπτες Μήνα",
      value: pageViewsMonth === null ? "—" : pageViewsMonth.toLocaleString("el-GR"),
      change: pageViewsToday > 0 ? `+${pageViewsToday} σήμερα` : "Σήμερα: 0",
      icon: Eye, color: "#C9A84C"
    },
    { label: "Νέα Μηνύματα", value: newMessagesCount.toString(), change: newMessagesCount > 0 ? `${newMessagesCount} αδιάβαστα` : "Κανένα νέο", icon: Mail, color: "#4CAF50" },
    { label: "Ενεργά Projects", value: activeProjects.toString(), change: `${liveProjects} live`, icon: FolderOpen, color: "#2196F3" },
    { label: "Ολοκλ. Projects", value: totalProjects.toString(), change: `${liveProjects} live`, icon: CheckCircle, color: "#9C27B0" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', serif", marginBottom: 6 }}>
          Καλωσήρθες 👋
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
          Εδώ είναι η σύνοψη της επιχείρησής σου σήμερα.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {dynamicStats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "24px 20px",
                transition: "border 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.border = `1px solid ${s.color}40`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.08)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={18} color={s.color} />
                </div>
                <span style={{ fontSize: 11, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "3px 8px", borderRadius: 999 }}>
                  {s.change}
                </span>
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent messages and Active Projects */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>Πρόσφατα Μηνύματα</h3>
            <Mail size={16} color="#C9A84C" />
          </div>
          {recentMessages.map((msg) => (
            <div
              key={msg.id}
              style={{
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(201,168,76,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, color: "#C9A84C", fontWeight: 700 }}>
                {msg.name ? msg.name[0] : "?"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{msg.name}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{msg.service}</div>
              </div>
              <span style={{ fontSize: 11, color: statusColor[msg.status] || "#fff", background: `${statusColor[msg.status] || "#fff"}18`, padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>
                {statusLabel[msg.status] || msg.status}
              </span>
            </div>
          ))}
        </div>

        {/* Active Projects */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>Ενεργά Projects</h3>
            <FolderOpen size={16} color="#C9A84C" />
          </div>
          {projects.filter((p) => !p.isLive).map((p) => (
            <div
              key={p.id}
              style={{
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(33,150,243,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Globe size={16} color="#2196F3" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{p.category}</div>
              </div>
              <span style={{ fontSize: 11, color: statusColor["draft"], background: `${statusColor["draft"]}18`, padding: "3px 8px", borderRadius: 999 }}>
                Draft
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Messages View ─────────────────────────────────────────────────────────────

function MessagesView() {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            setMessages(data);
            localStorage.setItem("altus_messages", JSON.stringify(data));
          } else {
            console.error("Failed to load messages from Supabase:", error);
            const raw = localStorage.getItem("altus_messages");
            if (raw) setMessages(JSON.parse(raw));
          }
        });
    } else {
      const raw = localStorage.getItem("altus_messages");
      if (raw) {
        setMessages(JSON.parse(raw));
      } else {
        setMessages(mockMessages);
        localStorage.setItem("altus_messages", JSON.stringify(mockMessages));
      }
    }
  }, []);

  const saveMessages = (updated: any[]) => {
    setMessages(updated);
    try {
      localStorage.setItem("altus_messages", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const markRead = (id: any) => {
    const updated = messages.map((m) => m.id === id ? { ...m, read: true } : m);
    saveMessages(updated);

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("messages")
        .update({ read: true })
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Failed to update message read state in Supabase:", error);
        });
    }
  };

  const deleteMsg = (id: any) => {
    const updated = messages.filter((m) => m.id !== id);
    saveMessages(updated);
    if (selected?.id === id) { setSelected(null); setReply(""); }

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("messages")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Failed to delete message in Supabase:", error);
        });
    }
  };

  const markStatus = (id: any, status: string) => {
    const updated = messages.map((m) => m.id === id ? { ...m, status } : m);
    saveMessages(updated);
    if (selected?.id === id) setSelected((prev: any) => prev ? { ...prev, status } : prev);

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("messages")
        .update({ status })
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Failed to update message status in Supabase:", error);
        });
    }
  };

  const handleSelect = (msg: any) => {
    setSelected(msg);
    markRead(msg.id);
    setSent(false);
    // Pre-fill a polite opening
    setReply(`Αγαπητέ/ή ${msg.name ? msg.name.split(" ")[0] : ""},\n\nΕυχαριστούμε για το ενδιαφέρον σας.\n\n`);
  };

  const sendReply = () => {
    if (!selected || !reply.trim()) return;
    const subject = encodeURIComponent(`Re: Ενδιαφέρον για ${selected.service} – Altus Studio`);
    const body = encodeURIComponent(reply);
    window.open(`mailto:${selected.email}?subject=${subject}&body=${body}`);
    setSent(true);
    markStatus(selected.id, "replied");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', serif", marginBottom: 24 }}>
        Μηνύματα
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.6fr", gap: 20 }}>
        {/* List */}
        {(!isMobile || !selected) && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden", maxHeight: "75vh", overflowY: "auto" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelect(msg)}
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  background: selected?.id === msg.id ? "rgba(201,168,76,0.08)" : msg.read ? "transparent" : "rgba(255,255,255,0.03)",
                  borderLeft: selected?.id === msg.id ? "3px solid #C9A84C" : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: msg.read ? 500 : 700 }}>{msg.name}</span>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{msg.date}</span>
                </div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {msg.message}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#C9A84C", background: "rgba(201,168,76,0.1)", padding: "2px 8px", borderRadius: 999 }}>
                    {msg.service}
                  </span>
                  <span style={{ fontSize: 11, color: statusColor[msg.status], background: `${statusColor[msg.status]}18`, padding: "2px 8px", borderRadius: 999 }}>
                    {statusLabel[msg.status]}
                  </span>
                  {!msg.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail + Compose */}
        {(!isMobile || selected) && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {selected ? (
              <>
                {/* Back button on mobile */}
                {isMobile && (
                  <div style={{ padding: "16px 20px 0" }}>
                    <button
                      onClick={() => setSelected(null)}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        padding: "6px 12px",
                        color: "#C9A84C",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      ← Πίσω στα Μηνύματα
                    </button>
                  </div>
                )}
                {/* Header */}
                <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "flex-start", gap: isMobile ? 16 : 0 }}>
                    <div>
                      <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{selected.name}</h2>
                      <a href={`mailto:${selected.email}`} style={{ color: "#C9A84C", fontSize: 13, textDecoration: "none" }}>{selected.email}</a>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, margin: "0 8px" }}>·</span>
                      <a href={`tel:${selected.phone}`} style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none" }}>{selected.phone}</a>
                    </div>
                    <button onClick={() => deleteMsg(selected.id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "7px 12px", cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, alignSelf: isMobile ? "flex-start" : "auto" }}>
                      <Trash2 size={13} /> Διαγραφή
                    </button>
                  </div>

                {/* Status changer */}
                <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
                  {Object.entries(statusLabel).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => markStatus(selected.id, key)}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 999,
                        border: `1px solid ${selected.status === key ? statusColor[key] : "rgba(255,255,255,0.1)"}`,
                        background: selected.status === key ? `${statusColor[key]}18` : "transparent",
                        color: selected.status === key ? statusColor[key] : "rgba(255,255,255,0.35)",
                        cursor: "pointer",
                        fontSize: 12,
                        transition: "all 0.15s",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Original message */}
              <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                  Υπηρεσία: {selected.service} · {selected.date}
                </div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{selected.message}</p>
              </div>

              {/* Compose reply */}
              <div style={{ padding: "20px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                  ✏️ Σύνταξη Απάντησης
                </div>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Γράψε την απάντησή σου εδώ..."
                  style={{
                    flex: 1,
                    minHeight: 160,
                    width: "100%",
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 14,
                    lineHeight: 1.7,
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "'DM Sans', sans-serif",
                    boxSizing: "border-box",
                    marginBottom: 14,
                  }}
                />

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button
                    onClick={sendReply}
                    disabled={!reply.trim()}
                    style={{
                      flex: 1,
                      padding: "13px",
                      background: sent
                        ? "rgba(34,197,94,0.15)"
                        : reply.trim()
                          ? "linear-gradient(135deg, #C9A84C, #a8893e)"
                          : "rgba(255,255,255,0.06)",
                      border: sent ? "1px solid rgba(34,197,94,0.4)" : "none",
                      borderRadius: 10,
                      color: sent ? "#22c55e" : reply.trim() ? "#0A0F1E" : "rgba(255,255,255,0.2)",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: reply.trim() ? "pointer" : "not-allowed",
                      transition: "all 0.3s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    {sent ? <><CheckCircle size={15} /> Αποστέλθηκε!</> : <><Mail size={15} /> Αποστολή Απάντησης</>}
                  </button>
                  <a
                    href={`tel:${selected.phone}`}
                    style={{
                      padding: "13px 18px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 13,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      whiteSpace: "nowrap",
                    }}
                  >
                    📞 Κλήση
                  </a>
                </div>
                {sent && (
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 8, textAlign: "center" }}>
                    Το email app σου άνοιξε με έτοιμη την απάντηση. Πάτα «Αποστολή» εκεί για να σταλεί!
                  </p>
                )}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", padding: 48, gap: 12 }}>
              <Mail size={48} />
              <p style={{ margin: 0 }}>Επίλεξε ένα μήνυμα για να απαντήσεις</p>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}


// ─── Projects View ─────────────────────────────────────────────────────────────

function ProjectsView() {
  const isMobile = useIsMobile();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("Όλα");
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Website");
  const [formTags, setFormTags] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImg, setFormImg] = useState("");
  const [formGallery, setFormGallery] = useState("");
  const [formResults, setFormResults] = useState("");
  const [formIsLive, setFormIsLive] = useState(false);
  const [formLiveUrl, setFormLiveUrl] = useState("");

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            const mapped = data.map(mapSupabaseProject);
            setProjects(mapped);
            localStorage.setItem("altus_projects", JSON.stringify(mapped));
          } else {
            console.error("Failed to load projects from Supabase in admin projects view:", error);
            setProjects(getProjects());
          }
        });
    } else {
      setProjects(getProjects());
    }
  }, []);

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormTags(p.tags.join(", "));
    setFormYear(p.year);
    setFormDescription(p.description);
    setFormImg(p.img);
    setFormGallery(p.gallery.join(", "));
    setFormResults(p.results);
    setFormIsLive(p.isLive);
    setFormLiveUrl(p.liveUrl || "");
  };

  const openNew = () => {
    setEditingProject({
      id: "",
      name: "",
      category: "Website",
      tags: [],
      year: new Date().getFullYear().toString(),
      description: "",
      img: "",
      results: "",
      isLive: false,
      gallery: [],
      liveUrl: ""
    });
    setFormName("");
    setFormCategory("Website");
    setFormTags("");
    setFormYear(new Date().getFullYear().toString());
    setFormDescription("");
    setFormImg("");
    setFormGallery("");
    setFormResults("");
    setFormIsLive(false);
    setFormLiveUrl("");
  };

  const handleSave = () => {
    if (!formName.trim()) return;

    const tagsArray = formTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const galleryArray = formGallery
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);

    const updatedProjects = [...projects];

    if (editingProject && editingProject.id) {
      // Editing
      const idx = updatedProjects.findIndex((p) => p.id === editingProject.id);
      if (idx !== -1) {
        updatedProjects[idx] = {
          ...editingProject,
          name: formName,
          category: formCategory,
          tags: tagsArray,
          year: formYear,
          description: formDescription,
          img: formImg,
          gallery: galleryArray,
          results: formResults,
          isLive: formIsLive,
          liveUrl: formIsLive ? formLiveUrl : "",
        };
      }

      if (isSupabaseConfigured && supabase) {
        supabase
          .from("projects")
          .update({
            name: formName,
            category: formCategory,
            tags: tagsArray,
            year: formYear,
            description: formDescription,
            img: formImg,
            gallery: galleryArray,
            results: formResults,
            is_live: formIsLive,
            live_url: formIsLive ? formLiveUrl : "",
          })
          .eq("id", editingProject.id)
          .then(({ error }) => {
            if (error) console.error("Error updating project in Supabase:", error);
          });
      }
    } else {
      // Creating
      const newProj: Project = {
        id: "p_" + Date.now().toString(),
        name: formName,
        category: formCategory,
        tags: tagsArray,
        year: formYear,
        description: formDescription,
        img: formImg,
        gallery: galleryArray,
        results: formResults,
        isLive: formIsLive,
        liveUrl: formIsLive ? formLiveUrl : "",
      };
      updatedProjects.unshift(newProj);

      if (isSupabaseConfigured && supabase) {
        supabase
          .from("projects")
          .insert([
            {
              id: newProj.id,
              name: formName,
              category: formCategory,
              tags: tagsArray,
              year: formYear,
              description: formDescription,
              img: formImg,
              gallery: galleryArray,
              results: formResults,
              is_live: formIsLive,
              live_url: formIsLive ? formLiveUrl : "",
            },
          ])
          .then(({ error }) => {
            if (error) console.error("Error inserting project to Supabase:", error);
          });
      }
    }

    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    setEditingProject(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το project;")) {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      saveProjects(updated);

      if (isSupabaseConfigured && supabase) {
        supabase
          .from("projects")
          .delete()
          .eq("id", id)
          .then(({ error }) => {
            if (error) console.error("Error deleting project in Supabase:", error);
          });
      }
    }
  };

  const filtered = projects.filter((p) => {
    if (filter === "Όλα") return true;
    if (filter === "Live") return p.isLive;
    if (filter === "Draft") return !p.isLive;
    return true;
  });

  if (editingProject) {
    return (
      <div>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 16 : 0, marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', serif" }}>
            {editingProject.id ? "Επεξεργασία Έργου" : "Νέο Έργο"}
          </h1>
          <button
            onClick={() => setEditingProject(null)}
            style={{
              padding: "8px 16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              fontSize: 13,
              alignSelf: isMobile ? "flex-start" : "auto",
            }}
          >
            Ακύρωση
          </button>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: isMobile ? 16 : 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20, marginBottom: 20 }}>
            {/* Left Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, display: "block", marginBottom: 6 }}>Όνομα Έργου</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="π.χ. PRO Parking Valet"
                  style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, display: "block", marginBottom: 6 }}>Κατηγορία</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  style={{ width: "100%", padding: "12px 16px", background: "#0A0F1E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                >
                  <option value="Website">Website</option>
                  <option value="E-Shop">E-Shop</option>
                </select>
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, display: "block", marginBottom: 6 }}>Tags (διαχωρισμένα με κόμμα)</label>
                <input
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="React, Tailwind CSS, SEO"
                  style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, display: "block", marginBottom: 6 }}>Έτος</label>
                <input
                  value={formYear}
                  onChange={(e) => setFormYear(e.target.value)}
                  placeholder="2025"
                  style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, display: "block", marginBottom: 6 }}>Αποτέλεσμα / Metrics</label>
                <input
                  value={formResults}
                  onChange={(e) => setFormResults(e.target.value)}
                  placeholder="π.χ. Live Project ή +280% conversion rate"
                  style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, display: "block", marginBottom: 6 }}>Περιγραφή</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Σύντομη περιγραφή του έργου..."
                  rows={4}
                  style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, display: "block", marginBottom: 6 }}>URL Κύριας Εικόνας</label>
                <input
                  value={formImg}
                  onChange={(e) => setFormImg(e.target.value)}
                  placeholder="Εισάγετε URL εικόνας ή τοπική διαδρομή"
                  style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, display: "block", marginBottom: 6 }}>Gallery Εικόνες (URLs διαχωρισμένα με κόμμα)</label>
                <input
                  value={formGallery}
                  onChange={(e) => setFormGallery(e.target.value)}
                  placeholder="Image URL 1, Image URL 2..."
                  style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <input
                  type="checkbox"
                  id="formIsLive"
                  checked={formIsLive}
                  onChange={(e) => setFormIsLive(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#C9A84C" }}
                />
                <label htmlFor="formIsLive" style={{ color: "#fff", fontSize: 14, cursor: "pointer", userSelect: "none" }}>
                  Είναι Live Project (Εμφάνιση πράσινης ένδευξης)
                </label>
              </div>

              {formIsLive && (
                <div style={{ marginTop: 8 }}>
                  <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, display: "block", marginBottom: 6 }}>Live URL Ιστοσελίδας</label>
                  <input
                    value={formLiveUrl}
                    onChange={(e) => setFormLiveUrl(e.target.value)}
                    placeholder="π.χ. https://proparkingvalet.gr"
                    style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <button
              onClick={handleSave}
              style={{
                padding: "14px 28px",
                background: "linear-gradient(135deg, #C9A84C, #a8893e)",
                border: "none",
                borderRadius: 12,
                color: "#0A0F1E",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer"
              }}
            >
              Αποθήκευση Έργου
            </button>
            <button
              onClick={() => setEditingProject(null)}
              style={{
                padding: "14px 28px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontSize: 14
              }}
            >
              Ακύρωση
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 16 : 0, marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', serif" }}>
          Projects
        </h1>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12, alignItems: isMobile ? "stretch" : "center" }}>
          {/* Add Project Button */}
          <button
            onClick={openNew}
            style={{
              padding: "8px 16px",
              background: "linear-gradient(135deg, #C9A84C, #a8893e)",
              border: "none",
              borderRadius: 8,
              color: "#0A0F1E",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <Plus size={15} /> Νέο Έργο
          </button>
          <div style={{ display: "flex", gap: 6, marginLeft: 16 }}>
            {["Όλα", "Live", "Draft"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: `1px solid ${filter === f ? "#C9A84C" : "rgba(255,255,255,0.1)"}`,
                  background: filter === f ? "rgba(201,168,76,0.1)" : "transparent",
                  color: filter === f ? "#C9A84C" : "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  fontSize: 13
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? 700 : "auto" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {["Project", "Κατηγορία", "Tags / Έτος", "Αποτέλεσμα", "Status", ""].map((h) => (
                <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img src={p.img} alt={p.name} style={{ width: 44, height: 33, objectFit: "cover", borderRadius: 6, background: "rgba(255,255,255,0.05)" }} />
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                  </div>
                </td>
                <td style={{ padding: "16px 20px", color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{p.category}</td>
                <td style={{ padding: "16px 20px", color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxWidth: 200 }}>
                    {p.tags.map(t => (
                      <span key={t} style={{ fontSize: 10, background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: 4, color: "rgba(255,255,255,0.4)" }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{p.year}</div>
                </td>
                <td style={{ padding: "16px 20px", color: "#C9A84C", fontSize: 13, fontWeight: 500 }}>{p.results}</td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ fontSize: 12, color: p.isLive ? "#22c55e" : "#6b7280", background: p.isLive ? "#22c55e18" : "#6b728018", padding: "4px 10px", borderRadius: 999 }}>
                    {p.isLive ? "Live" : "Draft"}
                  </span>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={() => openEdit(p)}
                      style={{ background: "transparent", border: "none", color: "#C9A84C", cursor: "pointer", fontSize: 13 }}
                    >
                      Επεξεργασία
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 13 }}
                    >
                      Διαγραφή
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Analytics View ────────────────────────────────────────────────────────────

function AnalyticsView() {
  const isMobile = useIsMobile();
  const [views, setViews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"7days" | "30days" | "all">("30days");

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("page_views")
        .select("*")
        .order("created_at", { ascending: true })
        .then(({ data, error }) => {
          if (!error && data) {
            setViews(data);
            localStorage.setItem("altus_page_views", JSON.stringify(data));
          } else {
            console.error("Failed to load page views from Supabase:", error);
            const raw = localStorage.getItem("altus_page_views");
            if (raw) setViews(JSON.parse(raw));
          }
          setLoading(false);
        });
    } else {
      const raw = localStorage.getItem("altus_page_views");
      if (raw) {
        setViews(JSON.parse(raw));
      }
      setLoading(false);
    }
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const thisMonth = new Date().toISOString().substring(0, 7);

  const totalMonth = views.filter((v) => v.date?.startsWith(thisMonth)).length;
  const totalToday = views.filter((v) => v.date === today).length;

  const filteredViews = useMemo(() => {
    if (timeframe === "all") return views;
    
    const limitDate = new Date();
    if (timeframe === "7days") {
      limitDate.setDate(limitDate.getDate() - 7);
    } else if (timeframe === "30days") {
      limitDate.setDate(limitDate.getDate() - 30);
    }
    const limitStr = limitDate.toISOString().split("T")[0];
    return views.filter(v => v.date >= limitStr);
  }, [views, timeframe]);

  const totalFiltered = filteredViews.length || 1;
  const desktopCount = filteredViews.filter(v => v.device === "Desktop").length;
  const mobileCount = filteredViews.filter(v => v.device === "Mobile").length;
  const tabletCount = filteredViews.filter(v => v.device === "Tablet").length;

  const desktopPercent = Math.round((desktopCount / totalFiltered) * 100);
  const mobilePercent = Math.round((mobileCount / totalFiltered) * 100);
  const tabletPercent = Math.round((tabletCount / totalFiltered) * 100);

  const refCounts: Record<string, number> = {};
  filteredViews.forEach(v => {
    const ref = v.referrer || "Direct";
    refCounts[ref] = (refCounts[ref] || 0) + 1;
  });
  const topReferrers = Object.entries(refCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topRefVal = topReferrers[0]?.[0] || "Direct";
  const periodViews = filteredViews.length;

  // Build last 7 days bar chart (always absolute daily counts for recent context)
  const last7: { label: string; date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("el-GR", { day: "2-digit", month: "2-digit" });
    last7.push({ label, date: dateStr, count: views.filter((v) => v.date === dateStr).length });
  }
  const maxCount = Math.max(...last7.map((d) => d.count), 1);

  // Top pages (based on period)
  const pathCounts: Record<string, number> = {};
  filteredViews.forEach((v) => {
    const p = v.path || "/";
    pathCounts[p] = (pathCounts[p] || 0) + 1;
  });
  const topPages = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: 16, marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', serif", margin: 0 }}>
          Στατιστικά
        </h1>
        {/* Timeframe Filter Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { id: "7days", label: "7 Ημέρες" },
            { id: "30days", label: "30 Ημέρες" },
            { id: "all", label: "Όλα" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id as any)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: `1px solid ${timeframe === t.id ? "#C9A84C" : "rgba(255,255,255,0.1)"}`,
                background: timeframe === t.id ? "rgba(201,168,76,0.1)" : "transparent",
                color: timeframe === t.id ? "#C9A84C" : "rgba(255,255,255,0.45)",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: timeframe === t.id ? 600 : 400
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)" }}>
          <div style={{ width: 32, height: 32, border: "2px solid rgba(201,168,76,0.3)", borderTop: "2px solid #C9A84C", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
          Φόρτωση στατιστικών...
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
            {[
              { label: "Σελιδοπροβολές Μήνα", value: totalMonth.toLocaleString("el-GR"), icon: Eye, color: "#C9A84C" },
              { label: "Σελιδοπροβολές Σήμερα", value: totalToday.toLocaleString("el-GR"), icon: TrendingUp, color: "#22c55e" },
              { label: "Σύνολο Περιόδου", value: periodViews.toLocaleString("el-GR"), icon: BarChart2, color: "#3b82f6" },
              { label: "Κορυφαία Πηγή", value: topRefVal, icon: Globe, color: "#a855f7" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: isMobile ? "16px 20px" : "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={20} color={s.color} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</div>
                    <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.value}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bar Chart — last 7 days */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: isMobile ? 16 : 28, marginBottom: 20 }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Τελευταίες 7 μέρες</div>
            {last7.every((d) => d.count === 0) ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.2)", fontSize: 14 }}>
                Δεν υπάρχουν δεδομένα ακόμα — αναμένουμε επισκέπτες!
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "flex-end", gap: isMobile ? 6 : 10, height: 140 }}>
                {last7.map((d) => (
                  <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{d.count > 0 ? d.count : ""}</div>
                    <div style={{
                      width: "100%",
                      background: d.date === today
                        ? "linear-gradient(180deg, #C9A84C, #a8893e)"
                        : "rgba(201,168,76,0.3)",
                      height: `${Math.max((d.count / maxCount) * 110, d.count > 0 ? 4 : 0)}px`,
                      borderRadius: "4px 4px 0 0",
                      transition: "height 0.3s",
                    }} />
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{d.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
            {/* Top Pages */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: isMobile ? 16 : 28 }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Top Σελίδες</div>
              {topPages.length === 0 ? (
                <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 14, textAlign: "center", padding: "16px 0" }}>Δεν υπάρχουν δεδομένα ακόμα</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {topPages.map(([path, count]) => (
                    <div key={path} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1, color: "#fff", fontSize: 14, fontFamily: "monospace" }}>{path}</div>
                      <div style={{ width: 120, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ width: `${(count / (topPages[0]?.[1] || 1)) * 100}%`, height: "100%", background: "#C9A84C", borderRadius: 999 }} />
                      </div>
                      <div style={{ color: "#C9A84C", fontWeight: 700, fontSize: 13, minWidth: 30, textAlign: "right" }}>{count}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Devices & Referrers */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Devices Card */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: isMobile ? 16 : 28 }}>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Συσκευές Χρηστών</div>
                {filteredViews.length === 0 ? (
                  <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 14, textAlign: "center" }}>Δεν υπάρχουν δεδομένα</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Progress bar split */}
                    <div style={{ display: "flex", height: 16, borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
                      <div style={{ width: `${desktopPercent}%`, background: "#C9A84C" }} title={`Desktop: ${desktopPercent}%`} />
                      <div style={{ width: `${mobilePercent}%`, background: "#3b82f6" }} title={`Mobile: ${mobilePercent}%`} />
                      <div style={{ width: `${tabletPercent}%`, background: "#22c55e" }} title={`Tablet: ${tabletPercent}%`} />
                    </div>
                    {/* Legend */}
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 10, height: 10, background: "#C9A84C", borderRadius: 2 }} />
                        <span>💻 Desktop ({desktopPercent}%)</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 10, height: 10, background: "#3b82f6", borderRadius: 2 }} />
                        <span>📱 Mobile ({mobilePercent}%)</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 10, height: 10, background: "#22c55e", borderRadius: 2 }} />
                        <span>📟 Tablet ({tabletPercent}%)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Referrers Card */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: isMobile ? 16 : 28 }}>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Πηγές Προέλευσης</div>
                {topReferrers.length === 0 ? (
                  <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 14, textAlign: "center" }}>Δεν υπάρχουν δεδομένα</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {topReferrers.map(([ref, count]) => (
                      <div key={ref} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ flex: 1, color: "#fff", fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ref}</div>
                        <div style={{ width: 120, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", flexShrink: 0 }}>
                          <div style={{ width: `${(count / (topReferrers[0]?.[1] || 1)) * 100}%`, height: "100%", background: "#C9A84C", borderRadius: 999 }} />
                        </div>
                        <div style={{ color: "#C9A84C", fontWeight: 700, fontSize: 13, minWidth: 30, textAlign: "right", flexShrink: 0 }}>{count}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Settings View ─────────────────────────────────────────────────────────────

function SettingsView() {
  const [viber, setViber] = useState("6970015447");
  const [email, setEmail] = useState("info@altusstudio.gr");
  const [saved, setSaved] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);

  useEffect(() => {
    // Load current maintenance state from Supabase
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("settings")
        .select("value")
        .eq("key", "maintenance_mode")
        .maybeSingle()
        .then(({ data, error }) => {
          if (!error && data) {
            setMaintenanceMode(!!data.value?.enabled);
          }
          setLoadingMaintenance(false);
        });

      // Load contact info
      supabase
        .from("settings")
        .select("value")
        .eq("key", "contact_info")
        .maybeSingle()
        .then(({ data, error }) => {
          if (!error && data && data.value) {
            if (data.value.phone) setViber(data.value.phone);
            if (data.value.email) setEmail(data.value.email);
          }
        });
    } else {
      setMaintenanceMode(localStorage.getItem("altus_maintenance") === "true");
      setLoadingMaintenance(false);

      const cached = localStorage.getItem("altus_contact_info");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.phone) setViber(parsed.phone);
          if (parsed.email) setEmail(parsed.email);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleToggleMaintenance = (enabled: boolean) => {
    setMaintenanceMode(enabled);
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("settings")
        .upsert({ key: "maintenance_mode", value: { enabled } })
        .then(({ error }) => {
          if (error) {
            console.error("Failed to update maintenance state in Supabase:", error);
          }
        });
    } else {
      localStorage.setItem("altus_maintenance", enabled ? "true" : "false");
    }
  };

  const save = () => {
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("settings")
        .upsert({ key: "contact_info", value: { phone: viber, email } })
        .then(({ error }) => {
          if (error) {
            console.error("Failed to save contact info to Supabase:", error);
            alert("Αποτυχία αποθήκευσης στη βάση δεδομένων Supabase. Παρακαλώ ελέγξτε τη σύνδεση ή τα RLS policies. Σφάλμα: " + (error.message || JSON.stringify(error)));
          } else {
            localStorage.setItem("altus_contact_info", JSON.stringify({ phone: viber, email }));
            window.dispatchEvent(new Event("storage"));
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }
        });
    } else {
      localStorage.setItem("altus_contact_info", JSON.stringify({ phone: viber, email }));
      window.dispatchEvent(new Event("storage"));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', serif", marginBottom: 24 }}>
        Ρυθμίσεις
      </h1>

      <div style={{ display: "grid", gap: 20 }}>
        {/* Contact Info */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28 }}>
          <h3 style={{ color: "#C9A84C", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>Στοιχεία Επικοινωνίας</h3>
          {[
            { label: "Τηλέφωνο Επικοινωνίας", value: viber, onChange: setViber },
            { label: "Email Επικοινωνίας", value: email, onChange: setEmail },
          ].map((f) => (
            <div key={f.label} style={{ marginBottom: 16 }}>
              <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, display: "block", marginBottom: 6, letterSpacing: "0.1em" }}>{f.label}</label>
              <input
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>
          ))}
        </div>

        {/* Maintenance Mode Toggle */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28 }}>
          <h3 style={{ color: "#C9A84C", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>
            Κατάσταση Συντήρησης (Maintenance Mode)
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
            Ενεργοποιήστε την κατάσταση συντήρησης για να εμποδίσετε την πρόσβαση στους απλούς χρήστες. 
            Εσείς θα συνεχίσετε να έχετε κανονικά πρόσβαση σε όλες τις σελίδες εφόσον είστε συνδεδεμένος ως Admin.
          </p>
          {loadingMaintenance ? (
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Φόρτωση κατάστασης...</div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button
                onClick={() => handleToggleMaintenance(!maintenanceMode)}
                style={{
                  width: 50,
                  height: 26,
                  borderRadius: 13,
                  background: maintenanceMode ? "#C9A84C" : "rgba(255,255,255,0.1)",
                  position: "relative",
                  cursor: "pointer",
                  border: "none",
                  transition: "background 0.3s",
                  padding: 0,
                  display: "block",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#0A0F1E",
                    position: "absolute",
                    top: 3,
                    left: maintenanceMode ? 27 : 3,
                    transition: "left 0.3s",
                  }}
                />
              </button>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
                {maintenanceMode ? "Ενεργοποιημένο (Maintenance Active)" : "Απενεργοποιημένο (Live)"}
              </span>
            </div>
          )}
        </div>

        {/* Security */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28 }}>
          <h3 style={{ color: "#C9A84C", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>Ασφάλεια</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 10 }}>
            <CheckCircle size={18} color="#22c55e" />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Ο λογαριασμός σας προστατεύεται με κωδικό.</span>
          </div>
        </div>

        <button
          onClick={save}
          style={{
            padding: "14px 32px",
            background: saved ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg, #C9A84C, #a8893e)",
            border: saved ? "1px solid rgba(34,197,94,0.4)" : "none",
            borderRadius: 12,
            color: saved ? "#22c55e" : "#0A0F1E",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            alignSelf: "flex-start",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {saved ? <><CheckCircle size={16} /> Αποθηκεύτηκε!</> : "Αποθήκευση Αλλαγών"}
        </button>
      </div>
    </div>
  );
}

// ─── CRM View ─────────────────────────────────────────────────────────────────

function CRMView() {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            setMessages(data);
          }
          setLoading(false);
        });
    } else {
      const raw = localStorage.getItem("altus_messages");
      if (raw) {
        setMessages(JSON.parse(raw));
      } else {
        setMessages(mockMessages);
      }
      setLoading(false);
    }
  }, []);

  const clients = useMemo(() => {
    const map = new Map<string, any>();
    // Sort chronologically so latest message overrides fields (name, phone, business)
    const sorted = [...messages].sort((a, b) => new Date(a.created_at || a.date || 0).getTime() - new Date(b.created_at || b.date || 0).getTime());
    
    sorted.forEach((m) => {
      const emailKey = m.email?.toLowerCase().trim() || "";
      if (!emailKey) return;

      const existing = map.get(emailKey);
      let status = "lead";
      if (m.status === "in-progress") status = "in-progress";
      else if (m.status === "completed" || m.status === "replied") status = "active";

      if (!existing) {
        map.set(emailKey, {
          id: emailKey,
          name: m.name || "Ανώνυμος",
          business: m.service || "Ιδιώτης",
          email: m.email,
          phone: m.phone || "—",
          projects: 1,
          totalValue: "Lead",
          status: status,
          since: m.date ? m.date.substring(0, 7) : new Date().toISOString().substring(0, 7),
        });
      } else {
        existing.name = m.name || existing.name;
        existing.business = m.service || existing.business;
        existing.phone = m.phone || existing.phone;
        existing.projects += 1;
        existing.status = status;
      }
    });
    return Array.from(map.values());
  }, [messages]);

  const [selected, setSelected] = useState<any | null>(null);
  const [filter, setFilter] = useState("all");

  const clientStatus: Record<string, { label: string; color: string }> = {
    active: { label: "Ενεργός", color: "#22c55e" },
    "in-progress": { label: "Σε εξέλιξη", color: "#f59e0b" },
    lead: { label: "Υποψήφιος", color: "#3b82f6" },
  };

  const filtered = filter === "all" ? clients : clients.filter((c) => c.status === filter);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 16 : 0, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>Πελάτες</h1>
          {loading ? (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Φόρτωση πελατών...</p>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{clients.length} πελάτες συνολικά</p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all", "active", "in-progress", "lead"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 14px", borderRadius: 8,
                border: `1px solid ${filter === f ? "#C9A84C" : "rgba(255,255,255,0.1)"}`,
                background: filter === f ? "rgba(201,168,76,0.1)" : "transparent",
                color: filter === f ? "#C9A84C" : "rgba(255,255,255,0.45)",
                cursor: "pointer", fontSize: 13,
                flex: isMobile ? 1 : "auto",
              }}
            >
              {f === "all" ? "Όλοι" : clientStatus[f]?.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.5fr", gap: 20 }}>
        {/* Client list */}
        {(!isMobile || !selected) && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelected(c)}
                style={{
                  background: selected?.id === c.id ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selected?.id === c.id ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 14, padding: "16px 18px", cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#C9A84C", fontWeight: 700, flexShrink: 0 }}>
                    {c.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#fff", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{c.business}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#C9A84C" }}>{c.totalValue}</span>
                    <span style={{ fontSize: 11, color: clientStatus[c.status]?.color, background: `${clientStatus[c.status]?.color}18`, padding: "2px 8px", borderRadius: 999 }}>{clientStatus[c.status]?.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Client detail */}
        {(!isMobile || selected) && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
            {selected ? (
              <>
                {/* Back button on mobile */}
                {isMobile && (
                  <div style={{ padding: "16px 20px 0" }}>
                    <button
                      onClick={() => setSelected(null)}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        padding: "6px 12px",
                        color: "#C9A84C",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      ← Πίσω στους Πελάτες
                    </button>
                  </div>
                )}
                {/* Profile header */}
                <div style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.03))", padding: "28px 28px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", gap: 16 }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#C9A84C", fontWeight: 700, border: "2px solid rgba(201,168,76,0.3)", alignSelf: isMobile ? "flex-start" : "auto" }}>
                      {selected.name[0]}
                    </div>
                    <div>
                      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{selected.name}</h2>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
                        <Building2 size={13} /> {selected.business}
                      </div>
                    </div>
                    <span style={{ marginLeft: isMobile ? 0 : "auto", alignSelf: isMobile ? "flex-start" : "center", fontSize: 12, color: clientStatus[selected.status]?.color, background: `${clientStatus[selected.status]?.color}18`, padding: "4px 12px", borderRadius: 999, border: `1px solid ${clientStatus[selected.status]?.color}40` }}>
                      {clientStatus[selected.status]?.label}
                    </span>
                  </div>
                </div>

                <div style={{ padding: 28 }}>
                  {/* Contact info */}
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 24 }}>
                  {[
                    { icon: Mail, label: "Email", value: selected.email, href: `mailto:${selected.email}` },
                    { icon: Phone, label: "Τηλέφωνο", value: selected.phone, href: `tel:${selected.phone}` },
                    { icon: FolderOpen, label: "Projects", value: `${selected.projects} project${selected.projects !== 1 ? "s" : ""}`, href: null },
                    { icon: Star, label: "Αξία", value: selected.totalValue, href: null },
                  ].map((info) => (
                    <div key={info.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.35)", fontSize: 11, marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        <info.icon size={12} /> {info.label}
                      </div>
                      {info.href ? (
                        <a href={info.href} style={{ color: "#C9A84C", fontSize: 13, textDecoration: "none", fontWeight: 500 }}>{info.value}</a>
                      ) : (
                        <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{info.value}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quick actions */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <a href={`mailto:${selected.email}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "linear-gradient(135deg, #C9A84C, #a8893e)", borderRadius: 10, color: "#0A0F1E", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                    <Mail size={14} /> Αποστολή Email
                  </a>
                  <a href={`tel:${selected.phone}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 13, textDecoration: "none" }}>
                    <Phone size={14} /> Κλήση
                  </a>
                  <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer" }}>
                    <FileText size={14} /> Νέα Προσφορά
                  </button>
                </div>

                <div style={{ marginTop: 20, padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Πελάτης από</div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{selected.since}</div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ height: "100%", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", gap: 12 }}>
              <UserCheck size={48} />
              <p style={{ margin: 0 }}>Επίλεξε έναν πελάτη για λεπτομέρειες</p>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

// ─── Quotes View ───────────────────────────────────────────────────────────────

const serviceOptions = [
  { name: "Κατασκευή Ιστοσελίδας", price: 350 },
  { name: "Ανάπτυξη E-Shop", price: 790 },
  { name: "Landing Page", price: 250 },
  { name: "Εταιρική Ταυτότητα", price: 200 },
  { name: "SEO & Στατιστικά", price: 150 },
  { name: "Συνεχής Υποστήριξη (μηνιαία)", price: 80 },
];

const packageDeliverables: Record<string, { titleEl: string; titleEn: string; price: number; items: string[] }> = {
  landing: {
    titleEl: "Landing Page (Μονοσέλιδο)",
    titleEn: "Landing Page",
    price: 250,
    items: [
      "Μονοσέλιδη στοχευμένη δομή (Single Page)",
      "Έως 6 σχεδιαστικές ενότητες (Sections)",
      "Φόρμα επικοινωνίας & κουμπιά Call-to-Action",
      "Πλήρης responsive προσαρμογή για κινητά",
      "Σύνδεση με Google Analytics",
      "Βασική βελτιστοποίηση ταχύτητας"
    ]
  },
  website: {
    titleEl: "Εταιρική Ιστοσελίδα (Corporate)",
    titleEn: "Corporate Website",
    price: 350,
    items: [
      "Ολοκληρωμένη πολυσελιδική δομή (5-8 σελίδες)",
      "Σελίδες: Αρχική, Υπηρεσίες, Portfolio, Επικοινωνία, Σχετικά",
      "Bespoke UI/UX σχεδίαση μακέτας στο Figma",
      "Responsive για κινητά & tablets",
      "Setup Google Search Console (SEO)",
      "Βελτιστοποίηση ταχύτητας (PageSpeed 90+)"
    ]
  },
  eshop: {
    titleEl: "Ηλεκτρονικό Κατάστημα (E-Shop)",
    titleEn: "E-Shop",
    price: 790,
    items: [
      "Πλατφόρμα e-commerce με καλάθι & checkout",
      "Σύνδεση με τράπεζες (Stripe, Viva) & PayPal",
      "Διαχείριση αποστολών & υπολογισμός μεταφορικών",
      "Πλήρες διαχειριστικό panel προϊόντων & παραγγελιών",
      "Σύνθετα φίλτρα & αναζήτηση προϊόντων",
      "GDPR Συμμόρφωση & Cookies Banner"
    ]
  }
};

function QuotesView() {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<"list" | "new">("list");
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<"landing" | "website" | "eshop" | null>(null);
  const [note, setNote] = useState("");
  const [items, setItems] = useState<{ name: string; price: number; qty: number; pkgKey?: string }[]>([]);
  const [printed, setPrinted] = useState(false);

  const fetchQuotes = () => {
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            setQuotes(data);
            localStorage.setItem("altus_quotes", JSON.stringify(data));
          } else {
            console.error("Failed to load quotes from Supabase:", error);
            const raw = localStorage.getItem("altus_quotes");
            if (raw) setQuotes(JSON.parse(raw));
          }
          setLoading(false);
        });
    } else {
      const raw = localStorage.getItem("altus_quotes");
      if (raw) {
        setQuotes(JSON.parse(raw));
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    window.addEventListener("storage", fetchQuotes);
    return () => window.removeEventListener("storage", fetchQuotes);
  }, []);

  const saveQuote = (newQuote: any) => {
    const updated = [newQuote, ...quotes];
    setQuotes(updated);
    localStorage.setItem("altus_quotes", JSON.stringify(updated));

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("quotes")
        .insert([newQuote])
        .then(({ error }) => {
          if (error) console.error("Failed to save new quote in Supabase:", error);
          fetchQuotes();
        });
    }
  };

  const openQuote = (q: any) => {
    setClientName(q.client || q.name || "");
    setClientEmail(q.email || "");
    setClientPhone(q.phone || "");
    setNote(q.note || "");
    setItems(q.items || []);
    
    if (q.items && q.items.length > 0) {
      const firstItem = q.items[0].name;
      if (firstItem.includes("Landing Page")) setSelectedPackage("landing");
      else if (firstItem.includes("Website") || firstItem.includes("Ιστοσελίδας")) setSelectedPackage("website");
      else if (firstItem.includes("E-Shop") || firstItem.includes("Κατάστημα")) setSelectedPackage("eshop");
      else setSelectedPackage(null);
    } else {
      setSelectedPackage(null);
    }
    
    setTab("new");
  };

  const addService = (svc: { name: string; price: number }) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.name === svc.name);
      if (exists) return prev;
      return [...prev, { ...svc, qty: 1 }];
    });
  };

  const removeItem = (name: string) => setItems((prev) => prev.filter((i) => i.name !== name));
  const changeQty = (name: string, delta: number) => {
    setItems((prev) => prev.map((i) => i.name === name ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const printQuote = () => {
    if (!clientName) return;

    const qId = "Q" + Math.floor(1000 + Math.random() * 9000);
    const dateToday = new Date().toLocaleDateString("el-GR");

    const newQuote = {
      id: qId,
      client: clientName,
      email: clientEmail,
      phone: clientPhone,
      date: dateToday,
      total: `€${total}`,
      status: "accepted",
      items: items,
      note: note,
    };

    saveQuote(newQuote);

    const content = `
      <html><head><style>
        body { font-family: 'DM Sans', Arial, sans-serif; padding: 60px; color: #0A0F1E; }
        h1 { font-size: 32px; margin-bottom: 4px; } h2 { font-size: 20px; color: #888; font-weight: 400; margin-bottom: 40px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; }
        .logo { font-size: 24px; font-weight: 700; letter-spacing: 2px; color: #C9A84C; }
        .date { color: #888; font-size: 14px; margin-top: 4px; }
        .to { margin-bottom: 40px; } .label { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { text-align: left; padding: 12px 16px; background: #f8f8f5; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888; }
        td { padding: 14px 16px; border-bottom: 1px solid #eee; font-size: 15px; }
        .total-row { font-weight: 700; font-size: 18px; color: #C9A84C; }
        .note { background: #f8f8f5; padding: 20px; border-radius: 8px; font-size: 14px; color: #555; margin-top: 20px; }
        .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #bbb; }
        .gold { color: #C9A84C; }
      </style></head><body>
        <div class="header">
          <div><div class="logo">ALTUS STUDIO</div><div class="date">Ημ/νία: ${newQuote.date}</div></div>
          <div style="text-align:right"><div style="font-size:28px;font-weight:700;color:#C9A84C">ΠΡΟΣΦΟΡΑ</div><div style="color:#999;font-size:14px">#${newQuote.id}</div></div>
        </div>
        <div class="to">
          <div class="label">Προς</div>
          <div style="font-size:18px;font-weight:600">${clientName}</div>
          <div style="color:#555;font-size:13px;margin-top:2px;">Email: ${clientEmail}</div>
          ${clientPhone ? `<div style="color:#555;font-size:13px;margin-top:2px;">Τηλ: ${clientPhone}</div>` : ""}
        </div>
        <table>
          <thead><tr><th>Υπηρεσία</th><th style="text-align:right">Τιμή</th><th style="text-align:right">Σύνολο</th></tr></thead>
          <tbody>
            ${items.map((i) => {
              const pk = i.pkgKey || "";
              const deliv = pk && packageDeliverables[pk]
                ? `<div style="margin-top:10px;padding:10px 14px;background:#f8f8f5;border-left:3px solid #C9A84C;border-radius:4px;">
                     <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#C9A84C;margin-bottom:6px;">Αναλυτικά Περιλαμβάνει:</div>
                     <ul style="margin:0;padding-left:16px;font-size:12px;color:#444;line-height:1.8;">
                       ${packageDeliverables[pk].items.map(d => `<li>${d}</li>`).join("")}
                     </ul>
                   </div>`
                : "";
              return `
                <tr>
                  <td style="padding:16px;border-bottom:1px solid #eee;vertical-align:top;">
                    <div style="font-size:15px;font-weight:700;color:#0A0F1E;">${i.name}</div>
                    ${deliv}
                  </td>
                  <td style="padding:16px;border-bottom:1px solid #eee;vertical-align:top;text-align:right;white-space:nowrap;">€${i.price} × ${i.qty}</td>
                  <td style="padding:16px;border-bottom:1px solid #eee;vertical-align:top;text-align:right;font-weight:700;color:#0A0F1E;white-space:nowrap;">€${i.price * i.qty}</td>
                </tr>
              `;
            }).join("")}
            <tr><td colspan="2" style="padding:16px;text-align:right;font-size:13px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:1px;">ΣΥΝΟΛΙΚΟ ΚΟΣΤΟΣ</td><td style="padding:16px;text-align:right;font-size:22px;font-weight:700;color:#C9A84C;">€${total}</td></tr>
          </tbody>
        </table>
        ${note ? `<div class="note"><strong>Σημείωση:</strong> ${note}</div>` : ""}
        <div class="footer">Altus Studio · info@altusstudio.gr · 6970015447 · altusstudio.gr</div>
      </body></html>
    `;
    const w = window.open("", "_blank");
    if (w) { w.document.write(content); w.document.close(); w.print(); }
    setPrinted(true);
    setTimeout(() => setPrinted(false), 3000);
  };

  const quoteStatusColor: Record<string, string> = { accepted: "#22c55e", pending: "#f59e0b", draft: "#6b7280" };
  const quoteStatusLabel: Record<string, string> = { accepted: "Εγκρίθηκε", pending: "Αναμονή", draft: "Draft" };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 16 : 0, marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', serif" }}>Προσφορές</h1>
        <div style={{ display: "flex", gap: 8, alignSelf: isMobile ? "flex-start" : "auto" }}>
          <button onClick={() => setTab("list")} style={{ padding: "9px 18px", borderRadius: 10, border: `1px solid ${tab === "list" ? "#C9A84C" : "rgba(255,255,255,0.1)"}`, background: tab === "list" ? "rgba(201,168,76,0.1)" : "transparent", color: tab === "list" ? "#C9A84C" : "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 13 }}>Ιστορικό</button>
          <button onClick={() => setTab("new")} style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid #C9A84C", background: "rgba(201,168,76,0.15)", color: "#C9A84C", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> Νέα Προσφορά
          </button>
        </div>
      </div>

      {tab === "list" ? (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "rgba(255,255,255,0.25)" }}>
              Φόρτωση προσφορών...
            </div>
          ) : quotes.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "rgba(255,255,255,0.25)" }}>
              <FileText size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: 15 }}>Δεν υπάρχουν ακόμα προσφορές</p>
              <p style={{ margin: "6px 0 0", fontSize: 13 }}>Πατήστε «Νέα Προσφορά» για να δημιουργήσετε την πρώτη</p>
            </div>
          ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? 650 : "auto" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["#", "Πελάτης", "Ημ/νία", "Σύνολο", "Status", ""].map((h) => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <td style={{ padding: "14px 20px", color: "#C9A84C", fontWeight: 600, fontSize: 13 }}>{q.id}</td>
                  <td style={{ padding: "14px 20px", color: "#fff", fontSize: 14, fontWeight: 500 }}>{q.client}</td>
                  <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{q.date}</td>
                  <td style={{ padding: "14px 20px", color: "#fff", fontWeight: 700, fontSize: 15 }}>
                    {typeof q.total === "number" ? `€${q.total}` : q.total}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: 12, color: quoteStatusColor[q.status] || "#6b7280", background: `${quoteStatusColor[q.status] || "#6b7280"}18`, padding: "4px 10px", borderRadius: 999 }}>{quoteStatusLabel[q.status] || q.status}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <button onClick={() => openQuote(q)} style={{ background: "transparent", border: "none", color: "#C9A84C", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                      <FileText size={14} /> Άνοιγμα
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr", gap: 20 }}>
          {/* Left: services selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Client info */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
              <div style={{ color: "#C9A84C", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Στοιχεία Πελάτη</div>
              {[
                { label: "Ονοματεπώνυμο", value: clientName, set: setClientName, placeholder: "π.χ. Γιώργος Παπαδόπουλος" },
                { label: "Email", value: clientEmail, set: setClientEmail, placeholder: "email@example.com" },
                { label: "Τηλέφωνο Επικοινωνίας", value: clientPhone, set: setClientPhone, placeholder: "69XXXXXXXX" },
              ].map((f) => (
                <div key={f.label} style={{ marginBottom: 12 }}>
                  <label style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, display: "block", marginBottom: 5 }}>{f.label}</label>
                  <input value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder}
                    style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              ))}
            </div>

            {/* Package Selector */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
              <div style={{ color: "#C9A84C", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Πακέτο Υπηρεσίας</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { id: "landing", label: "Landing Page", name: "Landing Page", price: 250 },
                  { id: "website", label: "Corporate Site", name: "Κατασκευή Ιστοσελίδας", price: 350 },
                  { id: "eshop", label: "E-Shop", name: "Ανάπτυξη E-Shop", price: 790 }
                ].map((pkg) => {
                  const isActive = selectedPackage === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => {
                        setSelectedPackage(pkg.id as any);
                        setItems((prev) => {
                          const baseNames = ["Landing Page", "Κατασκευή Ιστοσελίδας", "Ανάπτυξη E-Shop"];
                          const filtered = prev.filter((i) => !baseNames.includes(i.name));
                          return [...filtered, { name: pkg.name, price: pkg.price, qty: 1, pkgKey: pkg.id }];
                        });
                      }}
                      style={{
                        padding: "10px",
                        background: isActive ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isActive ? "#C9A84C" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: 10,
                        color: isActive ? "#C9A84C" : "rgba(255,255,255,0.6)",
                        fontSize: 12,
                        fontWeight: isActive ? 600 : 400,
                        cursor: "pointer",
                        transition: "all 0.15s"
                      }}
                    >
                      {pkg.label}
                    </button>
                  );
                })}
              </div>

              {selectedPackage && (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: 14, textAlign: "left" }}>
                  <div style={{ color: "#C9A84C", fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 10 }}>
                    Παροχές Πακέτου:
                  </div>
                  <ul style={{ paddingLeft: 16, margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: "1.6" }}>
                    {packageDeliverables[selectedPackage].items.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Service picker */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
              <div style={{ color: "#C9A84C", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Επίλεξε Επιπλέον Υπηρεσίες</div>
              {serviceOptions.map((svc) => {
                const added = items.some((i) => i.name === svc.name);
                return (
                  <div key={svc.name} onClick={() => addService(svc)}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 10, marginBottom: 6, cursor: "pointer", background: added ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${added ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.06)"}`, transition: "all 0.15s" }}
                  >
                    <span style={{ color: added ? "#C9A84C" : "rgba(255,255,255,0.7)", fontSize: 14 }}>{svc.name}</span>
                    <span style={{ color: added ? "#C9A84C" : "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 600 }}>€{svc.price}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: preview */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#C9A84C", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>Προεπισκόπηση Προσφοράς</div>

            {/* Header preview */}
            <div style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.08), transparent)", borderRadius: 12, padding: "16px 20px", marginBottom: 20, border: "1px solid rgba(201,168,76,0.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: "#C9A84C", fontWeight: 700, fontSize: 16, fontFamily: "'Playfair Display', serif" }}>ALTUS STUDIO</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{new Date().toLocaleDateString("el-GR")}</div>
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 }}>
                Προς: <span style={{ color: clientName ? "#fff" : "rgba(255,255,255,0.3)" }}>{clientName || "[Ονοματεπώνυμο]"}</span>
              </div>
              {(clientEmail || clientPhone) && (
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 4 }}>
                  {clientEmail && `Email: ${clientEmail}`} {clientPhone && ` · Τηλ: ${clientPhone}`}
                </div>
              )}
            </div>

            {/* Items */}
            <div style={{ flex: 1, marginBottom: 20 }}>
              {items.length === 0 ? (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", padding: "30px 0", fontSize: 14 }}>Επίλεξε υπηρεσίες από αριστερά →</div>
              ) : (
                items.map((item) => {
                  const pk = (item as any).pkgKey || "";
                  const delivs = pk && packageDeliverables[pk] ? packageDeliverables[pk].items : null;
                  return (
                    <div key={item.name} style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>€{item.price} × {item.qty}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button onClick={() => changeQty(item.name, -1)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex" }}><MinusCircle size={16} /></button>
                          <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                          <button onClick={() => changeQty(item.name, 1)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex" }}><PlusCircle size={16} /></button>
                          <button onClick={() => removeItem(item.name)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", display: "flex", marginLeft: 4 }}><X size={15} /></button>
                          <span style={{ color: "#C9A84C", fontWeight: 700, fontSize: 14, minWidth: 50, textAlign: "right" }}>€{item.price * item.qty}</span>
                        </div>
                      </div>
                      {delivs && (
                        <div style={{ marginTop: 10, padding: "10px 12px", background: "rgba(201,168,76,0.05)", borderLeft: "2px solid rgba(201,168,76,0.4)", borderRadius: "0 6px 6px 0" }}>
                          <div style={{ color: "#C9A84C", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Αναλυτικά Περιλαμβάνει:</div>
                          <ul style={{ margin: 0, paddingLeft: 14, listStyle: "none" }}>
                            {delivs.map((d, idx) => (
                              <li key={idx} style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, lineHeight: "1.7", display: "flex", gap: 6, alignItems: "flex-start" }}>
                                <span style={{ color: "#C9A84C", marginTop: 1 }}>✓</span> {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Total */}
            {items.length > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: "2px solid rgba(201,168,76,0.3)", marginBottom: 16 }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600 }}>ΣΥΝΟΛΟ</span>
                <span style={{ color: "#C9A84C", fontSize: 24, fontWeight: 700 }}>€{total}</span>
              </div>
            )}

            {/* Note */}
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Σημείωση (προαιρετικά)..."
              style={{ width: "100%", minHeight: 70, padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "rgba(255,255,255,0.7)", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", marginBottom: 14 }}
            />

            <button
              onClick={printQuote}
              disabled={!clientName || items.length === 0}
              style={{ width: "100%", padding: "13px", background: printed ? "rgba(34,197,94,0.15)" : (clientName && items.length > 0 ? "linear-gradient(135deg, #C9A84C, #a8893e)" : "rgba(255,255,255,0.05)"), border: printed ? "1px solid rgba(34,197,94,0.4)" : "none", borderRadius: 12, color: printed ? "#22c55e" : (clientName && items.length > 0 ? "#0A0F1E" : "rgba(255,255,255,0.2)"), fontWeight: 700, fontSize: 15, cursor: clientName && items.length > 0 ? "pointer" : "not-allowed", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {printed ? <><CheckCircle size={16} /> Έτοιμο για εκτύπωση!</> : <><Printer size={16} /> Εκτύπωση / PDF</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  // Persist session
  useEffect(() => {
    const session = localStorage.getItem("altus_admin");
    if (session === "true") setLoggedIn(true);
  }, []);

  const handleLogin = () => {
    localStorage.setItem("altus_admin", "true");
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("altus_admin");
    setLoggedIn(false);
  };

  if (!loggedIn) return <LoginScreen onLogin={handleLogin} />;

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard": return <DashboardView />;
      case "messages": return <MessagesView />;
      case "projects": return <ProjectsView />;
      case "clients": return <CRMView />;
      case "quotes": return <QuotesView />;
      case "analytics": return <AnalyticsView />;
      case "settings": return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "100vh",
        background: "#0d1117",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Backdrop overlay for mobile sidebar drawer */}
      {isMobile && menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 90,
          }}
        />
      )}

      {/* Sticky Mobile Header */}
      {isMobile && (
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 80,
            height: 60,
            background: "#0A0F1E",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
          }}
        >
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "#C9A84C",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: 8,
            }}
          >
            <Menu size={24} />
          </button>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Globe size={18} color="#C9A84C" />
            <span style={{ color: "#C9A84C", fontWeight: 700, fontSize: 13, fontFamily: "'Playfair Display', serif", letterSpacing: "0.05em" }}>ALTUS ADMIN</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#C9A84C", fontWeight: 700 }}>A</div>
          </div>
        </header>
      )}

      <Sidebar
        active={activeSection}
        setActive={setActiveSection}
        onLogout={handleLogout}
        isMobile={isMobile}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main style={{ flex: 1, padding: isMobile ? "24px 16px" : "40px 48px", overflowY: "auto" }}>
        {/* Top bar - Desktop only */}
        {!isMobile && (
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 32, gap: 12 }}>
            <button style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 12px", cursor: "pointer", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <Bell size={15} /> Ειδοποιήσεις
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 14px" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#C9A84C", fontWeight: 700 }}>A</div>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Admin</span>
            </div>
          </div>
        )}

        {renderContent()}
      </main>
    </div>
  );
}
