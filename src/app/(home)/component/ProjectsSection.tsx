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
import {
  Lightbulb,
  Ruler,
  Box,
  GitMerge,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react";

// ─── Mobile Dropdown Filter Component ────────────────────────────────────────

interface DropdownFilterProps {
  label: string;
  selectedCount: number;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

function DropdownFilter({
  label,
  selectedCount,
  isOpen,
  onToggle,
  onClose,
  children,
}: DropdownFilterProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all duration-200 cursor-pointer
          ${
            isOpen || selectedCount > 0
              ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
              : "border-[#1a1a1a]/20 bg-transparent text-[#555] hover:border-[#1a1a1a]/40"
          }`}
      >
        <span className="uppercase tracking-[0.1em]">{label}</span>
        {selectedCount > 0 && (
          <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white text-[#1a1a1a] text-[9px] font-bold leading-none">
            {selectedCount}
          </span>
        )}
        <ChevronDown
          size={11}
          strokeWidth={2.5}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-[calc(100%+6px)] left-0 z-50 min-w-[190px] bg-white border border-[#1a1a1a]/10 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.10)] overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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

  // Mobile dropdown state
  const [openDropdown, setOpenDropdown] = useState<
    "software" | "category" | null
  >(null);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-12 md:py-20"
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative flex items-center mb-8 md:mb-10 mt-10 md:mt-0">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-palatino font-bold text-center w-full">
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
        {/* ── Dock — Desktop only ── */}
        <div className="hidden md:block">
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
        </div>
        {/* end hidden md:block */}
        {/* ── Mobile Filter — Mobile only ── */}
        <div className="flex md:hidden flex-col gap-2 mb-6">
          {/* Filter row */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-[10px] text-[#999] uppercase tracking-[0.12em] mr-0.5">
              <SlidersHorizontal size={11} strokeWidth={2} />
            </div>

            {/* Software dropdown */}
            <DropdownFilter
              label="Software"
              selectedCount={selectedSoftware.length}
              isOpen={openDropdown === "software"}
              onToggle={() =>
                setOpenDropdown((p) => (p === "software" ? null : "software"))
              }
              onClose={() => setOpenDropdown(null)}
            >
              <div className="p-1.5">
                {SOFTWARE_LIST.map((sw) => {
                  const isSelected = selectedSoftware.includes(sw.name);
                  return (
                    <button
                      key={sw.name}
                      onClick={() => toggleSoftware(sw.name)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 cursor-pointer
                        ${isSelected ? "bg-[#1a1a1a] text-white" : "hover:bg-[#f5f5f5] text-[#333]"}`}
                    >
                      <div className="w-5 h-5 rounded overflow-hidden shrink-0 bg-white border border-[#eee]">
                        <Image
                          src={sw.icon}
                          alt={sw.name}
                          width={20}
                          height={20}
                          unoptimized
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[12px] font-medium">{sw.name}</span>
                      {isSelected && (
                        <div className="ml-auto w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </DropdownFilter>

            {/* Category dropdown */}
            <DropdownFilter
              label="Category"
              selectedCount={selectedCategories.length}
              isOpen={openDropdown === "category"}
              onToggle={() =>
                setOpenDropdown((p) => (p === "category" ? null : "category"))
              }
              onClose={() => setOpenDropdown(null)}
            >
              <div className="p-1.5">
                {CATEGORY_LIST.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.value);
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => toggleCategory(cat.value)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 cursor-pointer
                        ${isSelected ? "bg-[#1a1a1a] text-white" : "hover:bg-[#f5f5f5] text-[#333]"}`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${isSelected ? "bg-white/20" : "bg-[#f0f0f0]"}`}
                      >
                        <Icon
                          size={11}
                          strokeWidth={1.8}
                          className={isSelected ? "text-white" : "text-[#555]"}
                        />
                      </div>
                      <span className="text-[12px] font-medium">
                        {cat.label}
                      </span>
                      {isSelected && (
                        <div className="ml-auto w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </DropdownFilter>

            {/* Clear */}
            <AnimatePresence>
              {hasFilter && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedSoftware([]);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.1em] text-[#999] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                >
                  <X size={9} strokeWidth={2.5} /> Clear
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Active chips */}
          <AnimatePresence>
            {hasFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-1.5 overflow-hidden"
              >
                {selectedSoftware.map((s) => (
                  <motion.button
                    key={s}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    onClick={() => toggleSoftware(s)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1a1a1a]/8 border border-[#1a1a1a]/15 text-[10px] text-[#333] cursor-pointer"
                  >
                    {s}
                    <X size={8} strokeWidth={2.5} />
                  </motion.button>
                ))}
                {selectedCategories.map((c) => {
                  const cat = CATEGORY_LIST.find((x) => x.value === c);
                  return (
                    <motion.button
                      key={c}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      onClick={() => toggleCategory(c)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1a1a1a]/8 border border-[#1a1a1a]/15 text-[10px] text-[#333] cursor-pointer"
                    >
                      {cat?.label ?? c}
                      <X size={8} strokeWidth={2.5} />
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* min-h cố định để tránh giật layout khi filter không có kết quả */}
        <div className="min-h-[600px]">
          {/* Loading skeleton */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-x-6 md:gap-y-12">
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
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-x-6 md:gap-y-12">
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
