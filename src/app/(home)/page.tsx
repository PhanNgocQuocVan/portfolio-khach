"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Preloader from "@/components/ui/Preloader";
import { Navbar } from "@/components/ui/navbar";
import ColorBends from "@/components/ColorBends";
import HeroSection from "./component/HeroSection";
import ProjectsSection from "./component/ProjectsSection";
import ExperienceSection from "./component/ExperienceSection";
import TechnicalDrawingsSection from "./component/TechnicalDrawingsSection";
import EducationAwardsSection from "./component/EducationAwardsSection";
import ContactSection from "./component/ContactSection";
import About from "./component/About";
// Import các section bạn sẽ viết sau này
// import Hero from "./component/Hero";
// import Experience from "./component/Experience";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="relative min-h-screen w-full">
      <div className="relative">
        <div className="bg-black h-screen w-full"></div>
        <div className="absolute top-0 w-full">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <Preloader key="loader" onComplete={() => setIsLoading(false)} />
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <Navbar />
                <HeroSection />
                <About />
                <ProjectsSection />
                <ExperienceSection />
                <TechnicalDrawingsSection />
                <EducationAwardsSection />
                <ContactSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
