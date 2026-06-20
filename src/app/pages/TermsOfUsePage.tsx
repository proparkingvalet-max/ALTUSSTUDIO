import { useEffect } from "react";
import { motion } from "motion/react";

export function TermsOfUsePage() {
  useEffect(() => {
    document.title = "Όροι Χρήσης | Altus Studio";
  }, []);

  return (
    <div className="bg-[#0A0F1E] text-[#F5F5F0] min-h-screen pt-40 pb-24">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="termsgrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#termsgrid)" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#C9A84C]" />
            <span
              className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Νομικά Έγγραφα
            </span>
          </div>
          <h1
            className="text-[#F5F5F0] mb-12"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            Όροι <em style={{ fontStyle: "italic", color: "#C9A84C" }}>Χρήσης</em>
          </h1>

          <div
            className="space-y-8 text-[#F5F5F0]/80 leading-relaxed font-light text-sm md:text-base"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <section className="space-y-4">
              <h2 className="text-[#C9A84C] text-lg md:text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                1. Αποδοχή Όρων
              </h2>
              <p>
                Με την πρόσβαση και τη χρήση αυτής της ιστοσελίδας, αποδέχεστε και δεσμεύεστε από τους παρόντες Όρους Χρήσης. Εάν δεν συμφωνείτε με οποιοδήποτε μέρος αυτών των όρων, παρακαλούμε να μη χρησιμοποιήσετε την ιστοσελίδα μας.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-[#C9A84C] text-lg md:text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                2. Παροχή Υπηρεσιών
              </h2>
              <p>
                Η Altus Studio παρέχει premium υπηρεσίες σχεδιασμού (UI/UX) και ανάπτυξης ιστοσελίδων & e-shops. Οι πληροφορίες που παρουσιάζονται στην ιστοσελίδα είναι ενδεικτικές και δεν αποτελούν δεσμευτική προσφορά παρά μόνο κατόπιν υπογραφής σχετικής σύμβασης έργου.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-[#C9A84C] text-lg md:text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                3. Πνευματική Ιδιοκτησία
              </h2>
              <p>
                Όλο το περιεχόμενο της ιστοσελίδας, συμπεριλαμβανομένων των κειμένων, των γραφικών, των λογοτύπων, των εικόνων, καθώς και του πηγαίου κώδικα, αποτελεί πνευματική ιδιοκτησία της Altus Studio και προστατεύεται από τους σχετικούς ελληνικούς και διεθνείς νόμους. Απαγορεύεται η αναπαραγωγή, διανομή ή τροποποίηση χωρίς την έγγραφη άδειά μας.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-[#C9A84C] text-lg md:text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                4. Περιορισμός Ευθύνης
              </h2>
              <p>
                Καταβάλλουμε κάθε δυνατή προσπάθεια για την ακρίβεια των πληροφοριών στην ιστοσελίδα μας. Ωστόσο, η Altus Studio δεν φέρει καμία ευθύνη για τυχόν προσωρινή μη διαθεσιμότητα της ιστοσελίδας, τεχνικά σφάλματα ή ζημίες που προκύπτουν από τη χρήση ή την αδυναμία χρήσης αυτής.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-[#C9A84C] text-lg md:text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                5. Σύνδεσμοι προς Τρίτους
              </h2>
              <p>
                Η ιστοσελίδα μας ενδέχεται να περιέχει συνδέσμους προς εξωτερικές ιστοσελίδες τρίτων. Η Altus Studio δεν ελέγχει και δεν φέρει καμία ευθύνη για το περιεχόμενο, την πολιτική απορρήτου ή την ασφάλεια αυτών των ιστοσελίδων.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-[#C9A84C] text-lg md:text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                6. Τροποποιήσεις Όρων
              </h2>
              <p>
                Διατηρούμε το δικαίωμα να τροποποιούμε τους παρόντες όρους ανά πάσα στιγμή χωρίς προηγούμενη ειδοποίηση. Οι αλλαγές θα δημοσιεύονται σε αυτή τη σελίδα και η χρήση της ιστοσελίδας μετά τη δημοσίευση αποτελεί αποδοχή των νέων όρων.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
