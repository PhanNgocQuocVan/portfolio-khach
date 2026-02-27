"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterSelect({
  options,
  value,
  onChange,
  className,
}: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected ? selected.label : "All";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      {/* Trigger button */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
          "border transition-all duration-200 outline-none select-none cursor-pointer",
          "bg-background/80 backdrop-blur-sm",
          open
            ? "border-foreground/40 shadow-md"
            : "border-foreground/15 hover:border-foreground/30 shadow-sm",
        )}
      >
        {/* Dot indicator — chỉ hiện khi đang filter (không phải All) */}
        <motion.span
          animate={{
            scale: value ? 1 : 0,
            opacity: value ? 1 : 0,
            width: value ? 6 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="h-1.5 w-1.5 rounded-full bg-foreground inline-block overflow-hidden"
        />

        <span className="text-foreground/80">{displayLabel}</span>

        {/* Chevron */}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="text-foreground/50"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute top-[calc(100%+6px)] left-0 z-50",
              "rounded-2xl border border-foreground/10",
              "bg-background/95 backdrop-blur-md shadow-xl",
              "overflow-hidden p-1",
            )}
          >
            {/* Option All cố định */}
            <OptionItem
              label="All"
              isSelected={!value}
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              index={0}
            />

            {/* Divider */}
            <div className="mx-2 my-1 h-px bg-foreground/10" />

            {/* Các option còn lại */}
            {options.map((option, i) => (
              <OptionItem
                key={option.value}
                label={option.label}
                isSelected={value === option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                index={i + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OptionItem({
  label,
  isSelected,
  onClick,
  index = 0,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  index?: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.15 }}
      onClick={onClick}
      className={cn(
        "relative w-full flex items-center justify-center gap-2.5 px-3 py-2 rounded-xl text-sm",
        "transition-colors duration-150 cursor-pointer text-left outline-none",
        isSelected
          ? "bg-foreground text-background font-medium"
          : "text-foreground/70 hover:bg-foreground/8 hover:text-foreground",
      )}
    >
      {/* Check icon khi selected */}
      {isSelected && (
        <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M1.5 5L3.5 7.5L8.5 2.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
      {label}
    </motion.button>
  );
}
