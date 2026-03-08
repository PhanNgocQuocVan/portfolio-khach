"use client";
import MagicBento from "@/components/MagicBento";
import { useThemeStore } from "@/store/useThemeStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { EDUCATION_QUERY, EducationData } from "@/sanity/schemaTypes/queries";

export default function EducationAwardsSection() {
  const isDark = useThemeStore((state) => state.isDark);

  const [items, setItems] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch<EducationData[]>(EDUCATION_QUERY)
      .then((data) => setItems(data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="Education&Awards"
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-20"
    >
      <div className="max-w-screen-xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-center mb-12 font-palatino">
            Education & Certification
          </h2>
        </motion.div>

        {/* Loading skeleton — giữ min-h để tránh layout shift */}
        {loading ? (
          <div
            className="grid gap-2 p-3 w-[90%] mx-auto"
            style={{ gridTemplateColumns: "repeat(6, 1fr)" }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-[20px] bg-muted min-h-[280px]"
                style={{
                  gridColumn: ["1 / 4", "4 / 7", "1 / 3", "3 / 5", "5 / 7"][i],
                }}
              />
            ))}
          </div>
        ) : (
          <MagicBento
            items={items}
            clickEffect={false}
            enableMagnetism={false}
            theme={isDark ? "dark" : "light"}
          />
        )}
      </div>
    </section>
  );
}
