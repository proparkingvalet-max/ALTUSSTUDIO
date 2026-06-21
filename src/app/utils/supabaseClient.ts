import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are valid and not placeholders
export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  supabaseUrl !== "your_supabase_project_url" &&
  supabaseAnonKey !== "your_supabase_anon_public_key";

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function useContactInfo() {
  const [contact, setContact] = useState(() => {
    const defaultContact = { phone: "6970015447", email: "info@altus-studio.gr" };
    const raw = localStorage.getItem("altus_contact_info");
    if (!raw) return defaultContact;
    try {
      const parsed = JSON.parse(raw);
      return {
        phone: parsed.phone || defaultContact.phone,
        email: parsed.email || defaultContact.email,
      };
    } catch (e) {
      return defaultContact;
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      const defaultContact = { phone: "6970015447", email: "info@altus-studio.gr" };
      const raw = localStorage.getItem("altus_contact_info");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setContact({
            phone: parsed.phone || defaultContact.phone,
            email: parsed.email || defaultContact.email,
          });
        } catch (e) {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return contact;
}
