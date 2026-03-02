"use client";
import { motion } from "framer-motion";
import SegmentedButton from "./segmented-button";
import { AnimatedThemeToggler } from "./animated-theme-toggler";
import { useLoadingStore } from "@/store/useLoadingStore";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "Education&Awards", label: "Education" },
  { id: "contact", label: "Contact" },
];

export const Navbar = () => {
  const handleNavigation = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
      className="fixed top-5 inset-x-0 z-99 flex justify-center px-4"
    >
      <div className="backdrop-blur-md  border-2 border-black dark:border-white rounded-full p-1 shadow-2xl bg-gray-300/50 dark:bg-transparent">
        <SegmentedButton
          buttons={navItems}
          defaultActive="home"
          onChange={(activeId) => handleNavigation(activeId)}
          className="text-[11px] uppercase tracking-[0.2em]"
        />
      </div>
      <div className="pl-2">
        <AnimatedThemeToggler className="hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer text-black bg-gray-200 dark:bg-transparent dark:text-white " />
      </div>
    </motion.nav>
  );
};
