"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Preloader from "@/components/ui/Preloader";
import { Navbar } from "@/components/ui/navbar";
import ColorBends from "@/components/ColorBends";
import HeroSection from "./component/HeroSection";
import ProjectsSection from "./component/ProjectsSection";
import ExperienceSection from "./component/ExperienceSection";
import EducationAwardsSection from "./component/EducationAwardsSection";
import ContactSection from "./component/ContactSection";
import About from "./component/About";
import HorizontalLine from "@/components/HorizontalLine";
import { useLoadingStore } from "@/store/useLoadingStore";
import Footer from "@/components/footer";
// Import các section bạn sẽ viết sau này
// import Hero from "./component/Hero";
// import Experience from "./component/Experience";

export default function HomePage() {
  const { hasLoaded, setHasLoaded } = useLoadingStore();

  return (
    <main className="relative min-h-screen w-full">
      <AnimatePresence mode="wait">
        {!hasLoaded ? (
          <Preloader key="loader" onComplete={() => setHasLoaded(true)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Navbar />
            <HeroSection />
            <HorizontalLine />
            <About />
            <ProjectsSection />
            <ExperienceSection />
            <EducationAwardsSection />
            <ContactSection />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
