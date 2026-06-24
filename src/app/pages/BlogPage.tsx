import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Search, Calendar, Clock, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { getBlogPosts, BlogPost } from "@/app/utils/blog";

export function BlogPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = `Blog & Insights | Altus Studio`;
    setPosts(getBlogPosts());
  }, []);

  const categories = lang === "el" 
    ? ["Όλα", "Design", "Development", "SEO"]
    : ["All", "Design", "Development", "SEO"];

  const filteredPosts = posts.filter((post) => {
    // Category check
    const matchesCategory = 
      activeCategory === "All" || 
      activeCategory === "Όλα" || 
      post.category === activeCategory;

    // Search check
    const query = searchQuery.toLowerCase().trim();
    const title = lang === "el" ? post.titleEl.toLowerCase() : post.titleEn.toLowerCase();
    const excerpt = lang === "el" ? post.excerptEl.toLowerCase() : post.excerptEn.toLowerCase();
    const matchesSearch = !query || title.includes(query) || excerpt.includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#0D0D11] text-[#F9FAFB] min-h-screen">
      {/* Hero Section */}
      <section className="pt-44 pb-20 relative overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="blog-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blog-grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
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
                Insights
              </span>
            </div>
            <h1
              className="leading-tight"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight: 700,
              }}
            >
              {lang === "el" ? "Blog & " : "Blog & "}
              <br />
              <em style={{ fontStyle: "italic", color: "#DFBA73" }}>
                {lang === "el" ? "Αναλύσεις" : "Insights"}
              </em>
            </h1>
            <p
              className="text-white/50 mt-6 max-w-md text-sm md:text-base font-light leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {lang === "el"
                ? "Σκέψεις, οδηγοί και συμβουλές γύρω από το UI/UX design, την ανάπτυξη ιστοσελίδων και τη βελτιστοποίηση SEO."
                : "Thoughts, guides, and strategic tips regarding UI/UX design, custom web development, and search engine optimization."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search Toolbar */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
        {/* Categories */}
        <div className="flex gap-2 flex-wrap justify-center md:justify-start w-full md:w-auto">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-[10px] md:text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#DFBA73] text-[#0D0D11] font-semibold"
                    : "border border-white/10 text-white/50 hover:border-white/20 hover:text-white"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.12em" }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "el" ? "Αναζήτηση άρθρου..." : "Search article..."}
            className="w-full bg-white/5 border border-white/10 focus:border-[#DFBA73] pl-10 pr-4 py-2.5 text-xs text-[#F9FAFB] placeholder-white/25 outline-none transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
        </div>
      </section>

      {/* Grid of Articles */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, i) => (
              <motion.div
                layout
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative group cursor-pointer bg-[#0D0D11]"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                {/* Visual Thumbnail */}
                <div className="aspect-[16/10] overflow-hidden relative bg-[#111827]">
                  <img
                    src={post.img}
                    alt={lang === "el" ? post.titleEl : post.titleEn}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D11] via-[#0D0D11]/20 to-transparent group-hover:from-[#0D0D11]/95 transition-all duration-500" />
                  
                  {/* Category Pill Tag */}
                  <span className="absolute top-4 left-4 z-10 bg-[#0D0D11]/80 backdrop-blur-sm border border-[#DFBA73]/30 px-3 py-1 text-[9px] tracking-wider text-[#DFBA73] uppercase font-semibold"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col justify-between min-h-[220px]">
                  <div>
                    {/* Date / Read Time */}
                    <div className="flex gap-4 items-center text-[10px] text-white/40 mb-3 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} className="text-[#DFBA73]/70" />
                        {new Date(post.date).toLocaleDateString(lang === "el" ? "el-GR" : "en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-[#DFBA73]/70" />
                        {lang === "el" ? post.readTimeEl : post.readTimeEn}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-[#F9FAFB] group-hover:text-[#DFBA73] transition-colors line-clamp-2 mb-3"
                      style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.2rem", fontWeight: 700 }}
                    >
                      {lang === "el" ? post.titleEl : post.titleEn}
                    </h3>

                    {/* Excerpt */}
                    <p
                      className="text-[#F9FAFB]/50 text-xs leading-relaxed line-clamp-3 font-light mb-6"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {lang === "el" ? post.excerptEl : post.excerptEn}
                    </p>
                  </div>

                  {/* Read More link */}
                  <div
                    className={`flex items-center gap-1.5 text-[#DFBA73] text-[10px] tracking-wider uppercase font-semibold transition-all duration-300 transform ${
                      hoveredIndex === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <span>{lang === "el" ? "Διαβαστε Περισσοτερα" : "Read More"}</span>
                    <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
