"use client";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isDark = useThemeStore((state) => state.isDark);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Áp dụng class dark dựa trên store
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  if (!mounted) return <>{children}</>;

  return <div className={isDark ? "dark" : ""}>{children}</div>;
}
