"use client";
import MagicBento from "@/components/MagicBento";
import { useThemeStore } from "@/store/useThemeStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { EDUCATION_QUERY, EducationData } from "@/sanity/schemaTypes/queries";

const MOBILE_INITIAL = 3;

export default function EducationAwardsSection() {
  const isDark = useThemeStore((state) => state.isDark);

  const [items, setItems] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    client
      .fetch<EducationData[]>(EDUCATION_QUERY)
      .then((data) => setItems(data ?? []))
      .finally(() => setLoading(false));
  }, []);

  // Trên mobile: chỉ hiện MOBILE_INITIAL item, trừ khi showAll
  const displayedItems =
    isMobile && !showAll ? items.slice(0, MOBILE_INITIAL) : items;
  const hasMore = isMobile && !showAll && items.length > MOBILE_INITIAL;

  return (
    <section
      id="Education&Awards"
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-12 md:py-20"
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-center mb-8 md:mb-12 font-palatino leading-tight">
            Education & Certification
          </h2>
        </motion.div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 w-full mx-auto">
            {Array.from({ length: isMobile ? MOBILE_INITIAL : 5 }).map(
              (_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-[20px] bg-muted min-h-[200px] md:min-h-[280px]"
                />
              ),
            )}
          </div>
        ) : (
          <MagicBento
            items={displayedItems}
            clickEffect={false}
            enableMagnetism={false}
            theme={isDark ? "dark" : "light"}
          />
        )}

        {/* Read more button — mobile only */}
        <AnimatePresence>
          {hasMore && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex justify-center mt-4"
            >
              <button
                onClick={() => setShowAll(true)}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#1a1a1a]/20 text-[11px] uppercase tracking-[0.12em] text-[#666] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all duration-200 cursor-pointer"
              >
                See all {items.length} certificates
                <ChevronDown
                  size={12}
                  strokeWidth={2}
                  className="transition-transform group-hover:translate-y-0.5"
                />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
