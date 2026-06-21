import ppHero from "@/assets/proparking/hero_section.png";
import eshopPreview from "@/assets/eshop_preview.png";
import resortPreview from "@/assets/resort_preview.png";

export interface BlogPost {
  id: string;
  titleEl: string;
  titleEn: string;
  excerptEl: string;
  excerptEn: string;
  contentEl: string[]; // array of paragraphs for easy rendering
  contentEn: string[];
  category: "Design" | "Development" | "SEO";
  date: string;
  readTimeEl: string;
  readTimeEn: string;
  img: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "custom-vs-templates",
    titleEl: "Γιατί ο Custom Σχεδιασμός Ιστοσελίδων Υπερέχει των Templates",
    titleEn: "Why Custom Web Design Outperforms Pre-Made Templates",
    excerptEl: "Ανακαλύψτε πώς ο custom UI/UX σχεδιασμός επηρεάζει τις πωλήσεις σας και γιατί τα έτοιμα θέματα WordPress κοστίζουν τελικά ακριβότερα.",
    excerptEn: "Discover how custom UI/UX design directly impacts your conversions and why generic pre-made templates cost more in the long run.",
    contentEl: [
      "Στον ψηφιακό κόσμο, η πρώτη εντύπωση δημιουργείται μέσα σε ελάχιστα δευτερόλεπτα. Όταν ένας υποψήφιος πελάτης επισκέπτεται την ιστοσελίδα σας, κρίνει την αξιοπιστία της επιχείρησής σας από την αισθητική και τη λειτουργικότητα που συναντά. Εδώ ακριβώς εντοπίζεται η μεγάλη διαφορά μεταξύ μιας custom ιστοσελίδας και ενός έτοιμου template.",
      "Τα έτοιμα templates (όπως αυτά που χρησιμοποιούνται ευρέως στο WordPress) σχεδιάζονται για να καλύψουν χιλιάδες διαφορετικές επιχειρήσεις ταυτόχρονα. Αυτό σημαίνει ότι περιέχουν τεράστιο όγκο άχρηστου κώδικα, ο οποίος επιβαρύνει την ταχύτητα φόρτωσης της σελίδας σας. Αντίθετα, ο custom σχεδιασμός UI/UX δημιουργείται αποκλειστικά για τους δικούς σας επιχειρηματικούς στόχους και το δικό σας κοινό.",
      "Επιπλέον, οι custom ιστοσελίδες προσφέρουν απεριόριστη ελευθερία. Μπορείτε να χτίσετε ακριβώς τη δομή που χρειάζεστε για να οδηγήσετε τον χρήστη στην επιθυμητή ενέργεια (αγορά ή επικοινωνία). Στην Altus Studio, ξεκινάμε κάθε project σχεδιάζοντας μακέτες στο Figma, προσαρμοσμένες 100% στο brand σας, εξασφαλίζοντας μοναδικότητα και μέγιστο conversion rate."
    ],
    contentEn: [
      "In the digital realm, first impressions are forged in milliseconds. When a potential client lands on your website, they instantly judge your credibility based on visual layout and performance. This is where the distinct divide between custom engineering and off-the-shelf templates becomes critical.",
      "Pre-made templates are built to satisfy thousands of generic buyers. To achieve this, they bundle heavy style options and redundant code dependencies, directly crippling your page load speeds. Custom UI/UX engineering, however, is streamlined only for your user journey maps.",
      "Furthermore, custom-designed interfaces offer boundless flexibility. You can build exact flows tailored to lead capture goals. At Altus Studio, we kickstart every project by designing bespoke Figma mockups aligned with your branding, guaranteeing originality and maximum conversions."
    ],
    category: "Design",
    date: "2026-06-15",
    readTimeEl: "3 λεπτά διάβασμα",
    readTimeEn: "3 min read",
    img: resortPreview
  },
  {
    id: "core-web-vitals-guide",
    titleEl: "Οδηγός Core Web Vitals: Πώς η Ταχύτητα Επηρεάζει το Google Ranking σας",
    titleEn: "Core Web Vitals Guide: How Page Speed Impacts Search Engine Rankings",
    excerptEl: "Μάθετε τι είναι τα Core Web Vitals της Google και πώς μπορείτε να βελτιστοποιήσετε την ιστοσελίδα σας για μέγιστη ταχύτητα και καλύτερο SEO.",
    excerptEn: "Learn what Google's Core Web Vitals are and discover key strategies to optimize your website for maximum loading speed and SEO ranking.",
    contentEl: [
      "Η Google έχει ξεκαθαρίσει ότι η εμπειρία του χρήστη (UX) αποτελεί έναν από τους πιο κρίσιμους παράγοντες κατάταξης στα αποτελέσματα αναζήτησης. Τα Core Web Vitals είναι ένα σύνολο συγκεκριμένων μετρήσεων που αξιολογούν την ταχύτητα φόρτωσης, τη διαδραστικότητα και την οπτική σταθερότητα μιας σελίδας.",
      "Αν η ιστοσελίδα σας αργεί να φορτώσει (πάνω από 2-3 δευτερόλεπτα), οι επισκέπτες θα την εγκαταλείψουν αμέσως (υψηλό bounce rate). Αυτό στέλνει αρνητικό σήμα στη Google, με αποτέλεσμα να υποβαθμίζει τη θέση σας στα αποτελέσματα. Μετρώντας παράγοντες όπως το LCP (χρόνος φόρτωσης του κύριου περιεχομένου) και το CLS (οπτική σταθερότητα), μπορούμε να εντοπίσουμε ακριβώς τι καθυστερεί τη σελίδα.",
      "Για να πετύχετε εξαιρετικά σκορ, πρέπει να αποφεύγετε τα βαριά plugins, να συμπιέζετε τις εικόνες σας σε σύγχρονες μορφές (όπως WebP/AVIF) και να χρησιμοποιείτε καθαρό κώδικα χωρίς περιττά scripts. Στην Altus Studio, βελτιστοποιούμε κάθε γραμμή κώδικα για να διασφαλίσουμε PageSpeed scores άνω του 90+ σε κινητά και υπολογιστές."
    ],
    contentEn: [
      "Google has formally declared that user experience (UX) metrics play a fundamental role in Search Engine Result Page (SERP) positions. Core Web Vitals measure critical speed milestones: rendering speeds, layout shifting, and visual stability.",
      "If your website loads sluggishly (exceeding 2.5 seconds), bounce rates will skyrocket. Google flags this as a sign of poor quality, pushing your page lower in index queries. By monitoring LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift), we locate script bottlenecks.",
      "To hit optimal green metrics, you must strip redundant plugins, deliver modern image formats (like WebP/AVIF), and construct clean code assets. At Altus Studio, we design with performance in mind, guaranteeing 90+ page speed scores on both mobile and desktop viewports."
    ],
    category: "SEO",
    date: "2026-06-08",
    readTimeEl: "4 λεπτά διάβασμα",
    readTimeEn: "4 min read",
    img: ppHero
  },
  {
    id: "ecommerce-conversions-tips",
    titleEl: "3 Τρόποι για να Αυξήσετε τις Πωλήσεις του E-Shop σας Άμεσα",
    titleEn: "3 Proven Ways to Instantly Boost Your E-Shop Conversion Rate",
    excerptEl: "Μικρές αλλαγές στο UI/UX του ηλεκτρονικού σας καταστήματος που μπορούν να κάνουν τεράστια διαφορά στα έσοδα και στο checkout funnel.",
    excerptEn: "Minor UI/UX tweaks inside your e-commerce checkout funnel that can yield major improvements to your sales and monthly revenues.",
    contentEl: [
      "Η απόκτηση επισκεπτών στο e-shop σας είναι μόνο το πρώτο βήμα. Το πραγματικό στοίχημα είναι να τους πείσετε να ολοκληρώσουν την αγορά. Πολλά e-shops χάνουν έως και το 70% των δυνητικών πελατών τους κατά τη διάρκεια της διαδικασίας του checkout (εγκατάλειψη καλαθιού).",
      "Ο πρώτος τρόπος για να το διορθώσετε αυτό είναι η απλοποίηση του Checkout. Αφαιρέστε τα περιττά βήματα και τα υποχρεωτικά accounts. Επιτρέψτε στον χρήστη να αγοράσει ως επισκέπτης (guest checkout) και προσφέρετε άμεσες μεθόδους πληρωμής όπως Apple Pay ή Google Pay.",
      "Ο δεύτερος παράγοντας είναι η Mobile-First εμπειρία. Πάνω από το 80% των online αγορών στην Ελλάδα γίνεται πλέον από κινητά τηλέφωνα. Αν το e-shop σας δεν είναι τέλεια προσαρμοσμένο για οθόνες αφής, χάνετε πωλήσεις. Τέλος, η ταχύτητα είναι καθοριστική: κάθε δευτερόλεπτο καθυστέρησης μειώνει τις μετατροπές κατά 7%."
    ],
    contentEn: [
      "Driving organic traffic to your e-shop is only half the battle. The ultimate milestone is convincing visitors to finalize checkout. Statistics reveal that cart abandonment averages around 70% due to friction inside payment steps.",
      "The first step to fix this is simplifying checkout pathways. Remove mandatory account registration prompts. Support guest checkout options and integrate modern payment tokens like Apple Pay, Google Pay, or direct card entry.",
      "The second optimization is prioritizing mobile-first workflows. Since over 80% of current retail browsing happens on smartphones, visual assets must stay thumb-friendly. Finally, speed is vital: every 100ms loading lag drops sales conversion potential by 7%."
    ],
    category: "Development",
    date: "2026-06-01",
    readTimeEl: "5 λεπτά διάβασμα",
    readTimeEn: "5 min read",
    img: eshopPreview
  }
];

export function getBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getBlogPostById(id: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === id);
}
