"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Project } from "@/type/project";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <motion.div className="group cursor-pointer">
      {/* Image container */}
      <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-muted mb-3 shadow-sm group-hover:shadow-2xl transition-shadow duration-500">
        <img
          src={project.image ?? "/images/project-default.jpg"}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />

        {/* Gradient overlay — luôn có nhẹ ở dưới, đậm hơn khi hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Tags nổi lên khi hover */}
        {project.software && project.software.length > 0 && (
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {project.software.map((tag) => (
              <span
                key={`overlay-${tag}`}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-background/80 backdrop-blur-sm text-foreground/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Arrow button góc trên phải */}
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-md">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 11L11 3M11 3H5M11 3V9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1 px-0.5">
        {/* Tags tĩnh khi không hover */}
        {project.software && project.software.length > 0 && (
          <div className="flex flex-wrap gap-1 group-hover:opacity-0 transition-opacity duration-200">
            {project.software.map((tag) => (
              <span
                key={`static-${tag}`}
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
                  "bg-foreground/6 text-foreground/45",
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold leading-snug tracking-tight group-hover:text-foreground/60 transition-colors duration-300">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-foreground/45 leading-relaxed line-clamp-2">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}
