import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, Tag, ArrowUpRight, Share2, Quote } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { getBlogPostById, getBlogPosts, BlogPost } from "@/app/utils/blog";

export function BlogDetailsPage() {
  const { postId } = useParams();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!postId) return;
    const foundPost = getBlogPostById(postId);
    if (!foundPost) {
      navigate("/blog");
      return;
    }
    setPost(foundPost);

    // Fetch 2 related posts (excluding the current one)
    const allPosts = getBlogPosts();
    const filtered = allPosts.filter((p) => p.id !== postId).slice(0, 2);
    setRelatedPosts(filtered);
  }, [postId, navigate]);

  useEffect(() => {
    if (post) {
      document.title = `${lang === "el" ? post.titleEl : post.titleEn} | Insights`;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [post, lang]);

  if (!post) return null;

  const title = lang === "el" ? post.titleEl : post.titleEn;
  const content = lang === "el" ? post.contentEl : post.contentEn;

  return (
    <div className="bg-[#0A0F1E] text-[#F5F5F0] min-h-screen">
      {/* Back button header */}
      <div className="absolute top-28 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#F5F5F0]/60 hover:text-[#C9A84C] transition-colors group cursor-pointer text-xs tracking-wider uppercase font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {lang === "el" ? "Πισω στο Blog" : "Back to Blog"}
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-end pt-40 pb-16 overflow-hidden">
        {/* Cover image background */}
        <div className="absolute inset-0 z-0">
          <img
            src={post.img}
            alt={title}
            className="w-full h-full object-cover opacity-25 filter brightness-70 scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/60 to-[#0A0F1E]/90" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 z-10 w-full text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Meta */}
            <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start text-xs text-white/50 mb-6 font-mono">
              <span className="bg-[#C9A84C]/10 border border-[#C9A84C]/35 px-3 py-1 text-[9px] tracking-wider text-[#C9A84C] uppercase font-semibold">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-[#C9A84C]/70" />
                {new Date(post.date).toLocaleDateString(lang === "el" ? "el-GR" : "en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-[#C9A84C]/70" />
                {lang === "el" ? post.readTimeEl : post.readTimeEn}
              </span>
            </div>

            <h1
              className="font-bold leading-tight mb-8"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
              }}
            >
              {title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Main Reading Section */}
      <section className="py-20 bg-[#F5F5F0] text-[#0A0F1E] relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <article className="space-y-6">
            {content.map((paragraph, idx) => {
              // Highlight the second paragraph with a beautiful quote box style
              if (idx === 1) {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="my-10 p-8 border-l-4 border-[#C9A84C] bg-[#C9A84C]/5 relative"
                  >
                    <Quote size={28} className="text-[#C9A84C] mb-4 opacity-40" />
                    <p
                      className="text-base md:text-lg font-serif italic leading-relaxed text-[#0A0F1E]/80"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {paragraph}
                    </p>
                  </motion.div>
                );
              }
              
              return (
                <p
                  key={idx}
                  className="text-base md:text-lg leading-relaxed font-light text-[#0A0F1E]/75"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {paragraph}
                </p>
              );
            })}
          </article>
        </div>
      </section>

      {/* Related Articles Footer */}
      {relatedPosts.length > 0 && (
        <section className="py-24 border-t border-white/8 relative z-10 bg-[#0C1224]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h3
              className="text-2xl font-bold font-serif text-center mb-16"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {lang === "el" ? "Σχετικές Αναλύσεις" : "Related Insights"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.id}
                  to={`/blog/${rPost.id}`}
                  className="group bg-[#0A0F1E] border border-white/6 hover:border-[#C9A84C]/40 p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <span className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-semibold block mb-3">
                      {rPost.category}
                    </span>
                    <h4
                      className="text-[#F5F5F0] group-hover:text-[#C9A84C] text-lg font-bold font-serif mb-3 transition-colors line-clamp-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {lang === "el" ? rPost.titleEl : rPost.titleEn}
                    </h4>
                    <p
                      className="text-[#F5F5F0]/50 text-xs leading-relaxed font-light line-clamp-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {lang === "el" ? rPost.excerptEl : rPost.excerptEn}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1 text-[#C9A84C] text-[9px] tracking-wider uppercase font-semibold">
                    <span>{lang === "el" ? "Διαβαστε" : "Read Post"}</span>
                    <ArrowUpRight size={12} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
