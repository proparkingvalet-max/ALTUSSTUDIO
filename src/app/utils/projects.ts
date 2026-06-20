import eshopPreview from "@/assets/eshop_preview.png";
import eshopProduct from "@/assets/eshop_product.png";
import resortPreview from "@/assets/resort_preview.png";
import resortBooking from "@/assets/resort_booking.png";
import ppHero from "@/assets/proparking/hero_section.png";
import ppBooking from "@/assets/proparking/booking_section.png";
import ppMarina from "@/assets/proparking/marina.jpg";

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
}
