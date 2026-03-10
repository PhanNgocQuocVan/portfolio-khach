"use client";

import { LineShadowText } from "@/components/ui/line-shadow-text";
import ProjectCard from "@/components/ui/ProjectCard";
import { useThemeStore } from "@/store/useThemeStore";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Dock,
  DockIcon,
  DockItem,
  DockLabel,
  DockSeparator,
} from "@/components/ui/dock";
import { Button } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import {
  ProjectCardData,
  PROJECTS_LIST_QUERY,
} from "@/sanity/schemaTypes/queries";
import { Lightbulb, Ruler, Box, GitMerge } from "lucide-react";

const SOFTWARE_LIST = [
  { name: "Adobe CC", icon: "/images/sw/AdobeCCLogo-800x418.jpg" },
  { name: "AutoCAD", icon: "/images/sw/cad.png" },
  { name: "SketchUp", icon: "/images/sw/Sketchup.jpg" },
  { name: "3DsMax", icon: "/images/sw/3DsMax.png" },
  { name: "Vray", icon: "/images/sw/Vray.png" },
  { name: "TwinMotion", icon: "/images/sw/TwinMotion.png" },
  { name: "Rhino", icon: "/images/sw/Rhinoceros 3D.png" },
  { name: "Archicad", icon: "/images/sw/Archicad.jpg" },
  { name: "Revit", icon: "/images/sw/Revit.png" },
];

const CATEGORY_LIST = [
  { value: "concept-design", label: "Concept Design", icon: Lightbulb },
  { value: "technical-drawings", label: "Technical Drawings", icon: Ruler },
  { value: "3d-render", label: "3D & Render", icon: Box },
  { value: "coordination", label: "Coordination & Execution", icon: GitMerge },
];

export default function ProjectsSection() {
  const isDark = useThemeStore((state) => state.isDark);
  const shadowColor = isDark ? "white" : "black";
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });

  // ── Fetch data từ Sanity ─────────────────────────────────────────
  const [allProjects, setAllProjects] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch<ProjectCardData[]>(PROJECTS_LIST_QUERY)
      .then((data) => setAllProjects(data ?? []))
      .finally(() => setLoading(false));
  }, []);

  // ── Filter ───────────────────────────────────────────────────────
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    setVisibleCount(6);
  }, [selectedCategories, selectedSoftware]);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      // AND: project phải chứa TẤT CẢ category đang chọn
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.every((c) => p.category?.includes(c));
      // AND: project phải chứa TẤT CẢ software đang chọn
      const matchSoftware =
        selectedSoftware.length === 0 ||
        selectedSoftware.every((s) => p.software?.includes(s));
      return matchCategory && matchSoftware;
    });
  }, [allProjects, selectedCategories, selectedSoftware]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);

  // Toggle: có trong mảng → bỏ ra, chưa có → thêm vào
  const toggleSoftware = (name: string) =>
    setSelectedSoftware((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name],
    );

  const toggleCategory = (value: string) =>
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );

  const hasFilter =
    selectedCategories.length > 0 || selectedSoftware.length > 0;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-20"
    >
      <div className="max-w-screen-xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative flex items-center mb-10">
            <h2 className="text-4xl md:text-7xl font-palatino font-bold text-center w-full">
              Projects{" "}
              <LineShadowText shadowColor={shadowColor}>
                Showcase
              </LineShadowText>
            </h2>

            {/* Chỉ giữ Clear All Filters — hiện khi có filter active */}
            <AnimatePresence>
              {hasFilter && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="absolute right-0"
                >
                  <Button
                    variant="link"
                    onClick={() => {
                      setSelectedCategories([]);
                      setSelectedSoftware([]);
                    }}
                    className="text-xs opacity-50 hover:opacity-100 cursor-pointer"
                  >
                    Clear All Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        {/* ── Dock ── */}
        <AnimatePresence>
          {isInView && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex justify-center px-4 pointer-events-none mb-10"
            >
              <div className="pointer-events-auto">
                <Dock>
                  {/* Software items — bên trái separator */}
                  {SOFTWARE_LIST.map((sw) => {
                    const isSelected = selectedSoftware.includes(sw.name);
                    return (
                      <DockItem
                        key={sw.name}
                        onClick={() => toggleSoftware(sw.name)}
                        className="flex flex-col items-center relative cursor-pointer dark:bg-white"
                      >
                        <DockIcon>
                          <Image
                            src={sw.icon}
                            alt={sw.name}
                            width={40}
                            height={40}
                            unoptimized
                            className={`w-full h-full object-contain rounded-lg transition-all duration-200 ${
                              !isSelected && selectedSoftware.length > 0
                                ? "opacity-40 grayscale"
                                : ""
                            }`}
                          />
                        </DockIcon>
                        <DockLabel>{sw.name}</DockLabel>
                        <div className="absolute -bottom-1 flex justify-center w-full">
                          <motion.span
                            initial={false}
                            animate={{
                              scale: isSelected ? 1 : 0,
                              opacity: isSelected ? 1 : 0,
                            }}
                            className="h-1 w-1 rounded-full bg-primary"
                          />
                        </div>
                      </DockItem>
                    );
                  })}

                  <DockSeparator />

                  {/* Category items — bên phải separator */}
                  {CATEGORY_LIST.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.value);
                    const Icon = cat.icon;
                    return (
                      <DockItem
                        key={cat.value}
                        onClick={() => toggleCategory(cat.value)}
                        className="flex flex-col items-center relative cursor-pointer"
                      >
                        <DockIcon>
                          <div
                            className={`w-full h-full flex items-center justify-center rounded-lg transition-all duration-200 ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            } ${
                              !isSelected && selectedCategories.length > 0
                                ? "opacity-40"
                                : ""
                            }`}
                          >
                            <Icon size={20} />
                          </div>
                        </DockIcon>
                        <DockLabel>{cat.label}</DockLabel>
                        <div className="absolute -bottom-1 flex justify-center w-full">
                          <motion.span
                            initial={false}
                            animate={{
                              scale: isSelected ? 1 : 0,
                              opacity: isSelected ? 1 : 0,
                            }}
                            className="h-1 w-1 rounded-full bg-primary"
                          />
                        </div>
                      </DockItem>
                    );
                  })}
                </Dock>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* min-h cố định để tránh giật layout khi filter không có kết quả */}
        <div className="min-h-[600px]">
          {/* Loading skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="rounded-xl aspect-[4/3] bg-muted" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-64 flex items-center justify-center text-foreground/40 italic"
            >
              No projects found with the selected filters.
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              <AnimatePresence mode="popLayout">
                {displayedProjects.map((project, i) => (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProjectCard project={project} index={i} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>{" "}
        {/* end min-h wrapper */}
      </div>

      {/* Load more */}
      {!loading && visibleCount < filteredProjects.length && (
        <div className="mt-20 text-center">
          <Button
            variant="ghost"
            onClick={() => setVisibleCount((p) => p + 6)}
            className="px-3 rounded-2xl hover:bg-primary/10 font-medium cursor-pointer"
          >
            Read more
          </Button>
        </div>
      )}
    </section>
  );
}
