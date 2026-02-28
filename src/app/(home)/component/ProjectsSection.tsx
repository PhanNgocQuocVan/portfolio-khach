"use client";

import { FilterSelect } from "@/components/ui/FilterSelect";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import ProjectCard from "@/components/ui/ProjectCard";
import { useThemeStore } from "@/store/useThemeStore";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  ProjectCardData,
  PROJECTS_LIST_QUERY,
} from "@/sanity/schemaTypes/queries";

const SOFTWARE_LIST = [
  { name: "3DsMax", icon: "/images/sw/3DsMax.png" },
  { name: "Adobe", icon: "/images/sw/AdobePack.png" },
  { name: "Archicad", icon: "/images/sw/Archicad.jpg" },
  { name: "CAD", icon: "/images/sw/cad.png" },
  { name: "Enscape", icon: "/images/sw/Enscape.png" },
  { name: "Lumion", icon: "/images/sw/Lumion.png" },
  { name: "MS Office", icon: "/images/sw/Microsoft Office.jpg" },
  { name: "Procreate", icon: "/images/sw/Procreate.png" },
  { name: "Rhino", icon: "/images/sw/Rhinoceros 3D.png" },
  { name: "Revit", icon: "/images/sw/Revit.png" },
  { name: "SketchUp", icon: "/images/sw/Sketchup.jpg" },
  { name: "TwinMotion", icon: "/images/sw/TwinMotion.png" },
  { name: "Vray", icon: "/images/sw/Vray.png" },
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSoftware, setSelectedSoftware] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    setVisibleCount(6);
  }, [selectedCategory, selectedSoftware]);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchCategory =
        !selectedCategory || p.category?.includes(selectedCategory);
      const matchSoftware =
        !selectedSoftware || p.software?.includes(selectedSoftware);
      return matchCategory && matchSoftware;
    });
  }, [allProjects, selectedCategory, selectedSoftware]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);

  const toggleSoftware = (name: string) =>
    setSelectedSoftware((prev) => (prev === name ? null : name));

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <h2 className="text-4xl md:text-7xl font-palatino font-bold">
              Projects{" "}
              <LineShadowText shadowColor={shadowColor}>
                Showcase
              </LineShadowText>
            </h2>
            <div className="flex items-center gap-4">
              {(selectedCategory || selectedSoftware) && (
                <Button
                  variant="link"
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedSoftware(null);
                  }}
                  className="text-xs opacity-50 hover:opacity-100 cursor-pointer"
                >
                  Clear All Filters
                </Button>
              )}
              <FilterSelect
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[{ value: "design", label: "Design" }]}
              />
            </div>
          </div>
        </motion.div>

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

      {/* Dock — fixed, hiện khi section in view */}
      <AnimatePresence>
        {isInView && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
          >
            <div className="pointer-events-auto">
              <Dock>
                {SOFTWARE_LIST.map((sw) => {
                  const isSelected = selectedSoftware === sw.name;
                  return (
                    <DockItem
                      key={sw.name}
                      onClick={() => toggleSoftware(sw.name)}
                      className="flex flex-col items-center relative cursor-pointer"
                    >
                      <DockIcon>
                        <Image
                          src={sw.icon}
                          alt={sw.name}
                          width={40}
                          height={40}
                          unoptimized
                          className="w-full h-full object-contain rounded-lg transition-all duration-200"
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
              </Dock>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
