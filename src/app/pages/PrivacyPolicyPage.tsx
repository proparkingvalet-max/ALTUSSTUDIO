import { useEffect } from "react";
import { motion } from "motion/react";

export function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = "Πολιτική Απορρήτου | Altus Studio";
  }, []);

  return (
    <div className="bg-[#0D0D11] text-[#F9FAFB] min-h-screen pt-40 pb-24">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="policygrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#policygrid)" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#DFBA73]" />
            <span
              className="text-[#DFBA73] text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Νομικά Έγγραφα
            </span>
          </div>
          <h1
            className="text-[#F9FAFB] mb-12"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            Πολιτική <em style={{ fontStyle: "italic", color: "#DFBA73" }}>Απορρήτου</em>
          </h1>

          <div
            className="space-y-8 text-[#F9FAFB]/80 leading-relaxed font-light text-sm md:text-base"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <section className="space-y-4">
              <h2 className="text-[#DFBA73] text-lg md:text-xl font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                1. Εισαγωγή
              </h2>
              <p>
                Στην Altus Studio, η προστασία των προσωπικών σας δεδομένων είναι πρωταρχικής σημασίας για εμάς. Η παρούσα Πολιτική Απορρήτου περιγράφει πώς συλλέγουμε, χρησιμοποιούμε, επεξεργαζόμαστε και διασφαλίζουμε τις πληροφορίες σας όταν επισκέπτεστε την ιστοσελίδα μας ή χρησιμοποιείτε τις υπηρεσίες μας.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-[#DFBA73] text-lg md:text-xl font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                2. Δεδομένα που Συλλέγουμε
              </h2>
              <p>
                Όταν επικοινωνείτε μαζί μας μέσω της φόρμας επικοινωνίας, συλλέγουμε μόνο τα απαραίτητα στοιχεία για την εξυπηρέτησή σας:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#F9FAFB]/70">
                <li>Ονοματεπώνυμο</li>
                <li>Διεύθυνση ηλεκτρονικού ταχυδρομείου (Email)</li>
                <li>Το μήνυμα και τις πληροφορίες που επιλέγετε να μοιραστείτε μαζί μας σχετικά με το project σας.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-[#DFBA73] text-lg md:text-xl font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                3. Σκοπός Επεξεργασίας
              </h2>
              <p>
                Χρησιμοποιούμε τα δεδομένα σας αποκλειστικά για:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#F9FAFB]/70">
                <li>Να απαντήσουμε στα αιτήματά σας και να προγραμματίσουμε τη δωρεάν συνάντηση συμβουλευτικής.</li>
                <li>Να σας παρέχουμε ενημερώσεις σχετικά με τις υπηρεσίες μας κατόπιν δικού σας αιτήματος.</li>
                <li>Τη βελτίωση της εμπειρίας χρήσης της ιστοσελίδας μας.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-[#DFBA73] text-lg md:text-xl font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                4. Cookies και Στατιστικά Στοιχεία
              </h2>
              <p>
                Η ιστοσελίδα μας χρησιμοποιεί cookies για τη βελτίωση της πλοήγησης και τη συλλογή ανώνυμων στατιστικών στοιχείων (μέσω Google Analytics) για τη συμπεριφορά των χρηστών. Μπορείτε να διαχειριστείτε ή να απορρίψετε τα cookies ανά πάσα στιγμή μέσω του αναδυόμενου Cookie Banner της ιστοσελίδας μας.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-[#DFBA73] text-lg md:text-xl font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                5. Διατήρηση Δεδομένων
              </h2>
              <p>
                Διατηρούμε τα προσωπικά σας δεδομένα μόνο για το απαραίτητο χρονικό διάστημα προκειμένου να ολοκληρωθεί η επικοινωνία μας ή η παροχή των υπηρεσιών μας, εκτός εάν ορίζεται διαφορετικά από τη νομοθεσία. Δεν μοιραζόμαστε ούτε πουλάμε τα δεδομένα σας σε τρίτους για σκοπούς μάρκετινγκ.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-[#DFBA73] text-lg md:text-xl font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                6. Τα Δικαιώματά σας
              </h2>
              <p>
                Σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR), έχετε το δικαίωμα πρόσβασης, διορθώσεως, διαγραφής, περιορισμού της επεξεργασίας, καθώς και το δικαίωμα στη φορητότητα των δεδομένων σας. Για να ασκήσετε οποιοδήποτε από αυτά τα δικαιώματα, μπορείτε να επικοινωνήσετε μαζί μας στο <span className="text-[#DFBA73]">info@altus-studio.gr</span>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
