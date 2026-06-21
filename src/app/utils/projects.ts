import eshopPreview from "@/assets/eshop_preview.png";
import eshopProduct from "@/assets/eshop_product.png";
import resortPreview from "@/assets/resort_preview.png";
import resortBooking from "@/assets/resort_booking.png";
import ppHero from "@/assets/proparking/hero_section.png";
import ppBooking from "@/assets/proparking/booking_section.png";
import ppMarina from "@/assets/proparking/marina.jpg";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

export interface Project {
  id: string;
  name: string;
  category: string;
  tags: string[];
  year: string;
  description: string;
  img: string;
  results: string;
  isLive: boolean;
  gallery: string[];
  liveUrl?: string;
}

export const defaultProjects: Project[] = [
  {
    id: "project-1",
    name: "PRO Parking Valet",
    category: "Website",
    tags: ["React", "Tailwind CSS", "Framer Motion", "SEO"],
    year: "2025",
    description: "Premium υπηρεσίες valet parking στην Αθήνα με σύστημα κρατήσεων και concierge.",
    img: ppHero,
    results: "Live Project",
    isLive: true,
    gallery: [ppHero, ppBooking, ppMarina],
    liveUrl: "https://proparkingvalet.gr",
  },
  {
    id: "project-2",
    name: "AURA Design",
    category: "E-Shop",
    tags: ["React", "Tailwind CSS", "E-Commerce", "Stripe"],
    year: "2025",
    description: "High-end ηλεκτρονικό κατάστημα για luxury έπιπλα και design αντικείμενα.",
    img: eshopPreview,
    results: "+280% conversion rate",
    isLive: false,
    gallery: [eshopPreview, eshopProduct],
    liveUrl: "",
  },
  {
    id: "project-3",
    name: "Aetheria Suites",
    category: "Website",
    tags: ["React", "Tailwind CSS", "Booking Engine", "Speed Optimized"],
    year: "2025",
    description: "Premium ιστοσελίδα για ένα luxury boutique resort στη Σαντορίνη με ενσωματωμένο σύστημα κρατήσεων.",
    img: resortPreview,
    results: "Live Booking Platform",
    isLive: false,
    gallery: [resortPreview, resortBooking],
    liveUrl: "",
  },
];

export function getProjects(): Project[] {
  // Async background sync with Supabase if configured
  if (isSupabaseConfigured && supabase) {
    supabase
      .from("projects")
      .select("*")
      .then(({ data, error }) => {
        if (!error && data) {
          const mapped = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            tags: p.tags || [],
            year: p.year || "",
            description: p.description || "",
            img: p.img || "",
            results: p.results || "",
            isLive: !!p.is_live,
            gallery: p.gallery || [],
            liveUrl: p.live_url || "",
          }));
          localStorage.setItem("altus_projects", JSON.stringify(mapped));
          // Notify components list to re-render
          window.dispatchEvent(new Event("storage"));
        }
      });
  }

  const stored = localStorage.getItem("altus_projects");
  if (!stored) {
    localStorage.setItem("altus_projects", JSON.stringify(defaultProjects));
    return defaultProjects;
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      const hasProParking = parsed.some(p => p.name === "PRO Parking Valet" || p.title === "PRO Parking Valet");
      if (!hasProParking) {
        localStorage.setItem("altus_projects", JSON.stringify(defaultProjects));
        return defaultProjects;
      }

      return parsed.map((p: any) => {
        let liveUrl = p.liveUrl || "";
        if (!liveUrl && (p.name === "PRO Parking Valet" || p.title === "PRO Parking Valet")) {
          liveUrl = "https://proparkingvalet.gr";
        }
        return {
          id: p.id || "project-" + Math.random(),
          name: p.name || p.title || "Unnamed Project",
          category: p.category || "Website",
          tags: Array.isArray(p.tags) ? p.tags : [],
          year: p.year || "",
          description: p.description || "",
          img: p.img || "",
          results: p.results || "",
          isLive: !!p.isLive,
          gallery: Array.isArray(p.gallery) ? p.gallery : [],
          liveUrl: liveUrl,
        };
      });
    }
    return defaultProjects;
  } catch (e) {
    console.error("Error parsing projects from localStorage", e);
    return defaultProjects;
  }
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem("altus_projects", JSON.stringify(projects));

  if (isSupabaseConfigured && supabase) {
    const dbPayload = projects.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      tags: p.tags || [],
      year: p.year || "",
      description: p.description || "",
      img: p.img || "",
      results: p.results || "",
      is_live: p.isLive,
      gallery: p.gallery || [],
      live_url: p.liveUrl || "",
    }));

    supabase
      .from("projects")
      .upsert(dbPayload)
      .then(({ error }) => {
        if (error) {
          console.error("Failed to sync updated projects with Supabase:", error);
        }
      });
  }
}
