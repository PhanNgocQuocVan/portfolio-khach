"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { useThemeStore } from "@/store/useThemeStore";

export const TextHoverEffect = ({
  text,
  duration,
  forceColor,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  /** Force a specific stroke color, bypassing theme detection.
   *  Pass "white" for always-dark containers (e.g. footer). */
  forceColor?: "white" | "black";
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const isDarkStore = useThemeStore((state) => state.isDark);
  const [isDark, setIsDark] = useState(isDarkStore);

  useEffect(() => {
    setIsDark(isDarkStore);
  }, [isDarkStore]);

  // Resolved color: forceColor prop wins, then theme
  const isLight =
    forceColor === "white" ? true : forceColor === "black" ? false : isDark;

  const baseColor = isLight ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.20)";
  const strokeColor = isLight ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.30)";
  const shimmer1 = isLight ? "#ffffff" : "#000000";
  const shimmer2 = isLight ? "#d4d4d4" : "#3a3a3a";

  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const [viewBox, setViewBox] = useState("0 0 1000 160");

  const FONT_SIZE = 120;
  const PAD = 8;

  useEffect(() => {
    const measure = () => {
      if (!measureRef.current) return;
      try {
        const bbox = measureRef.current.getBBox();
        if (!bbox.width || !bbox.height) return;
        setViewBox(
          `${bbox.x - PAD} ${bbox.y - PAD} ${bbox.width + PAD * 2} ${bbox.height + PAD * 2}`,
        );
      } catch (_) {}
    };
    measure();
    const id = setTimeout(measure, 200);
    return () => clearTimeout(id);
  }, [text]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const cxPct = ((cursor.x - svgRect.left) / svgRect.width) * 100;
    const cyPct = ((cursor.y - svgRect.top) / svgRect.height) * 100;
    setMaskPosition({ cx: `${cxPct}%`, cy: `${cyPct}%` });
  }, [cursor]);

  const sharedTextProps = {
    x: "50%" as const,
    y: "50%" as const,
    textAnchor: "middle" as const,
    dominantBaseline: "middle" as const,
    fontFamily: "var(--font-palatino)",
    fontWeight: "bold" as const,
    fontSize: FONT_SIZE,
    strokeWidth: 1.2,
    letterSpacing: "0.02em",
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none block w-full"
    >
      <defs>
        {/* Shimmer gradient — always matches resolved color */}
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor={shimmer1} stopOpacity="0.5" />
              <stop offset="25%" stopColor={shimmer1} stopOpacity="1" />
              <stop offset="50%" stopColor={shimmer2} stopOpacity="0.9" />
              <stop offset="75%" stopColor={shimmer1} stopOpacity="1" />
              <stop offset="100%" stopColor={shimmer1} stopOpacity="0.5" />
            </>
          )}
        </linearGradient>

        {/* Radial reveal mask */}
        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="25%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="textMask">
          <rect
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>

      {/* Hidden measuring node */}
      <text
        ref={measureRef}
        {...sharedTextProps}
        fill="none"
        stroke="none"
        aria-hidden="true"
        style={{ visibility: "hidden" }}
      >
        {text}
      </text>

      {/* Layer 1: Base outline */}
      <text
        {...sharedTextProps}
        fill="transparent"
        stroke={baseColor}
        style={{ transition: "opacity 0.4s ease" }}
      >
        {text}
      </text>

      {/* Layer 2: Draw-on animation */}
      <motion.text
        {...sharedTextProps}
        fill="transparent"
        stroke={strokeColor}
        initial={{ strokeDashoffset: 3000, strokeDasharray: 3000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 3000 }}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        {text}
      </motion.text>

      {/* Layer 3: Shimmer revealed under cursor */}
      <text
        {...sharedTextProps}
        fill="transparent"
        stroke="url(#textGradient)"
        strokeWidth={1.8}
        mask="url(#textMask)"
      >
        {text}
      </text>
    </svg>
  );
};
