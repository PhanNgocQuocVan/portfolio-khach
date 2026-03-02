"use client";
import MagicBento from "@/components/MagicBento";
import { useThemeStore } from "@/store/useThemeStore";
import { motion } from "framer-motion";

export default function EducationAwardsSection() {
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <section
      id="Education&Awards"
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 "
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
        <MagicBento
          clickEffect={false}
          enableMagnetism={false}
          theme={isDark ? "dark" : "light"}
        />
      </div>
    </section>
  );
}
