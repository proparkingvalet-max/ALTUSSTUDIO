import eshopPreview from "@/assets/eshop_preview.png";
import eshopProduct from "@/assets/eshop_product.png";
import resortPreview from "@/assets/resort_preview.png";
import resortBooking from "@/assets/resort_booking.png";
import ppHero from "@/assets/proparking/hero_section.png";
import ppBooking from "@/assets/proparking/booking_section.png";
import ppMarina from "@/assets/proparking/marina.jpg";
import ppAirSea from "@/assets/proparking/air_sea.png";
import ppContact from "@/assets/proparking/contact_section.png";
import ppShowroom from "@/assets/proparking/showroom.png";
import ppSupercar from "@/assets/proparking/supercar.png";
import ppTheater from "@/assets/proparking/theater.jpg";
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
    gallery: [ppHero, ppBooking, ppMarina, ppAirSea, ppContact, ppShowroom, ppSupercar, ppTheater],
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

export function mapSupabaseProject(p: any): Project {
  let img = p.img || "";
  let gallery = Array.isArray(p.gallery) ? p.gallery : [];
  
  // Fallbacks for default projects if they contain the Unsplash placeholder, are empty, or point to stale build assets
  if (p.id === "project-1") {
    if (!img || img.includes("unsplash.com/photo-1506015391300-4802dc74de2e") || img.startsWith("/assets/") || img.startsWith("assets/")) {
      img = ppHero;
    }
    if (gallery.length === 0 || gallery.some(g => g.includes("unsplash.com/photo-1506015391300-4802dc74de2e") || g.startsWith("/assets/") || g.startsWith("assets/"))) {
      gallery = [ppHero, ppBooking, ppMarina, ppAirSea, ppContact, ppShowroom, ppSupercar, ppTheater];
    }
  } else if (p.id === "project-2") {
    if (!img || img.startsWith("/assets/") || img.startsWith("assets/")) img = eshopPreview;
    if (gallery.length === 0 || gallery.some(g => g.startsWith("/assets/") || g.startsWith("assets/"))) gallery = [eshopPreview, eshopProduct];
  } else if (p.id === "project-3") {
    if (!img || img.startsWith("/assets/") || img.startsWith("assets/")) img = resortPreview;
    if (gallery.length === 0 || gallery.some(g => g.startsWith("/assets/") || g.startsWith("assets/"))) gallery = [resortPreview, resortBooking];
  }

  let liveUrl = p.live_url || p.liveUrl || "";
  if (!liveUrl && p.id === "project-1") {
    liveUrl = "https://proparkingvalet.gr";
  }

  return {
    id: p.id,
    name: p.name || p.title || "Unnamed Project",
    category: p.category || "Website",
    tags: Array.isArray(p.tags) ? p.tags : [],
    year: p.year || "",
    description: p.description || "",
    img: img,
    results: p.results || "",
    isLive: p.is_live !== undefined ? !!p.is_live : !!p.isLive,
    gallery: gallery,
    liveUrl: liveUrl,
  };
}

export function getProjects(): Project[] {
  // Async background sync with Supabase if configured
  if (isSupabaseConfigured && supabase) {
    supabase
      .from("projects")
      .select("*")
      .then(({ data, error }) => {
        if (!error && data) {
          const mapped = data.map(mapSupabaseProject);
          
          // Merge with current local projects to avoid deleting unsynced ones
          const localStored = localStorage.getItem("altus_projects");
          const currentList = [...defaultProjects];
          if (localStored) {
            try {
              const parsed = JSON.parse(localStored);
              if (Array.isArray(parsed)) {
                for (const p of parsed) {
                  if (!currentList.some((dp) => dp.id === p.id)) {
                    currentList.push(p);
                  }
                }
              }
            } catch (e) {}
          }
          
          const merged = [...mapped];
          const missingInDb: Project[] = [];
          for (const localProj of currentList) {
            if (!mapped.some((dbP) => dbP.id === localProj.id)) {
              merged.push(localProj);
              missingInDb.push(localProj);
            }
          }

          localStorage.setItem("altus_projects", JSON.stringify(merged));
          // Notify components list to re-render
          window.dispatchEvent(new Event("storage"));

          if (missingInDb.length > 0) {
            const dbPayload = missingInDb.map((p) => ({
              id: p.id,
              name: p.name,
              category: p.category,
              tags: p.tags || [],
              year: p.year || "",
              description: p.description || "",
              img: p.img && !p.img.startsWith("data:") && !p.img.startsWith("blob:") ? p.img : "",
              results: p.results || "",
              is_live: p.isLive,
              gallery: p.gallery || [],
              live_url: p.liveUrl || "",
            }));

            supabase
              .from("projects")
              .insert(dbPayload)
              .then(({ error }) => {
                if (error) console.error("Error syncing missing projects to Supabase:", error);
              });
          }
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
      const mergedList = [...defaultProjects];
      for (const p of parsed) {
        const idx = mergedList.findIndex((dp) => dp.id === p.id);
        if (idx !== -1) {
          mergedList[idx] = p;
        } else {
          mergedList.push(p);
        }
      }

      return mergedList.map((p: any) => {
        let img = p.img || "";
        let gallery = Array.isArray(p.gallery) ? p.gallery : [];
        if (p.id === "project-1") {
          if (!img || img.includes("unsplash.com/photo-1506015391300-4802dc74de2e") || img.startsWith("/assets/") || img.startsWith("assets/")) {
            img = ppHero;
          }
          if (gallery.length === 0 || gallery.some(g => g.includes("unsplash.com/photo-1506015391300-4802dc74de2e") || g.startsWith("/assets/") || g.startsWith("assets/"))) {
            gallery = [ppHero, ppBooking, ppMarina, ppAirSea, ppContact, ppShowroom, ppSupercar, ppTheater];
          }
        } else if (p.id === "project-2") {
          if (!img || img.startsWith("/assets/") || img.startsWith("assets/")) img = eshopPreview;
          if (gallery.length === 0 || gallery.some(g => g.startsWith("/assets/") || g.startsWith("assets/"))) gallery = [eshopPreview, eshopProduct];
        } else if (p.id === "project-3") {
          if (!img || img.startsWith("/assets/") || img.startsWith("assets/")) img = resortPreview;
          if (gallery.length === 0 || gallery.some(g => g.startsWith("/assets/") || g.startsWith("assets/"))) gallery = [resortPreview, resortBooking];
        }

        let liveUrl = p.liveUrl || "";
        if (!liveUrl && p.id === "project-1") {
          liveUrl = "https://proparkingvalet.gr";
        }

        return {
          id: p.id || "project-" + Math.random(),
          name: p.name || p.title || "Unnamed Project",
          category: p.category || "Website",
          tags: Array.isArray(p.tags) ? p.tags : [],
          year: p.year || "",
          description: p.description || "",
          img: img,
          results: p.results || "",
          isLive: p.isLive !== undefined ? !!p.isLive : !!p.is_live,
          gallery: gallery,
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
      img: p.img && !p.img.startsWith("data:") && !p.img.startsWith("blob:") ? p.img : "",
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

