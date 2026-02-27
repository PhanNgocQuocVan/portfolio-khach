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
import { Project } from "@/type/project";
import { cn } from "@/lib/utils";

// Danh sách phần mềm cố định để map với Dock
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
  const [visibleCount, setVisibleCount] = useState(6);

  // State cho lọc kép
  const [selectedCategory, setSelectedCategory] = useState(""); // Lọc theo Design/All
  const [selectedSoftware, setSelectedSoftware] = useState<string | null>(null); // Lọc theo Dock

  useEffect(() => {
    setVisibleCount(6); // Reset về 2 dòng đầu tiên
  }, [selectedCategory, selectedSoftware]);

  const allProjects = [
    {
      id: 1,
      title: "Project One",
      description: "toi là van vui vẻ, toi là developer",
      software: ["Revit", "Lumion"],
      category: ["commercial"],
    },
    {
      id: 2,
      title: "Project Two",
      description: "toi là van vui vẻ, toi là developer",
      software: ["Revit", "SketchUp", "Enscape"],
      category: ["design"],
    },
    {
      id: 3,
      title: "Project Three",
      description: "toi là van vui vẻ, toi là developer",
      software: ["Lumion", "SketchUp", "Enscape"],
      category: ["design"],
    },
    {
      id: 4,
      title: "Project Four",
      description: "toi là van vui vẻ, toi là developer",
      software: ["Revit", "SketchUp", "Enscape"],
      category: ["retail"],
    },
    {
      id: 5,
      title: "Project Five",
      description: "toi là van vui vẻ, toi là developer",
      software: ["Revit", "Enscape"],
      category: ["design"],
    },
    {
      id: 6,
      title: "Project Six",
      description: "toi là van vui vẻ, toi là developer",
      software: ["Revit", "SketchUp"],
      category: ["commercial"],
    },
    {
      id: 7,
      title: "Project Seven",
      description: "toi là van vui vẻ, toi là developer",
      software: ["Revit", "SketchUp", "Enscape"],
      category: ["design"],
    },
    {
      id: 8,
      title: "Project Eight",
      description: "toi là van vui vẻ, toi là developer",
      software: ["SketchUp", "Enscape"],
      category: ["design"],
    },
  ];

  // Logic lọc kép (Memoized để tối ưu hiệu năng)
  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      // 1. Lọc theo Category (FilterSelect)
      const matchesCategory =
        selectedCategory === "" || project.category.includes(selectedCategory);

      // 2. Lọc theo Software (Dock)
      // Lưu ý: Tên trên Dock phải khớp hoặc map đúng với tên trong software[] của project
      const matchesSoftware =
        !selectedSoftware ||
        project.software.some((sw) =>
          sw
            .toLowerCase()
            .includes(selectedSoftware.toLowerCase().replace(" ", "")),
        );

      return matchesCategory && matchesSoftware;
    });
  }, [selectedCategory, selectedSoftware]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6); // Mỗi lần nhấn hiện thêm 6 cái (2 dòng tiếp theo)
  };

  const toggleSoftware = (swName: string) => {
    setSelectedSoftware((prev) => (prev === swName ? null : swName));
  };

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
              {/* Nút reset nhanh nếu đang có filter */}
              {(selectedCategory || selectedSoftware) && (
                <Button
                  variant="link"
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedSoftware(null);
                  }}
                  className="text-xs opacity-50 hover:opacity-100"
                >
                  Clear Filters
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

        {/* Hiển thị thông báo khi không có dự án nào thỏa mãn */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-64 flex items-center justify-center text-zinc-500 italic"
          >
            No projects found with the selected filters.
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            <AnimatePresence mode="popLayout">
              {displayedProjects.map((project, i) => (
                <motion.div
                  key={project.id}
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
      {visibleCount < filteredProjects.length && (
        <div className="mt-20 text-center">
          <Button
            variant="ghost"
            onClick={handleLoadMore}
            className="px-3 rounded-2xl hover:bg-primary/10 font-medium cursor-pointer "
          >
            Read more
          </Button>
        </div>
      )}

      {/* Dock Area */}
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
                      className="flex flex-col items-center relative"
                    >
                      <DockIcon>
                        <Image
                          src={sw.icon}
                          alt={sw.name}
                          width={40}
                          height={40}
                          className={cn(
                            "w-full h-full object-contain rounded-lg transition-transform",
                          )}
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
                          className="h-1 w-1 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]"
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
