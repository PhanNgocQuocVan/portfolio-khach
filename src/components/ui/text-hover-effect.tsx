"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

export const TextHoverEffect = ({
  text,
  duration,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(
      document.documentElement.classList.contains("dark") || mq.matches,
    );
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const [viewBox, setViewBox] = useState("0 0 1000 160");

  const FONT_SIZE = 120;
  const PAD = 8;

  // Measure rendered text and fit viewBox tightly around it
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

    // Run immediately + after fonts likely loaded
    measure();
    const id = setTimeout(measure, 200);
    return () => clearTimeout(id);
  }, [text]);

  // Update spotlight mask position
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
        {/* Gold gradient — horizontal sweep across full text */}
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
              <stop offset="0%" stopColor="#c4a262" />
              <stop offset="20%" stopColor="#f0dca0" />
              <stop offset="45%" stopColor="#c4a262" />
              <stop offset="70%" stopColor="#e8d5a3" />
              <stop offset="100%" stopColor="#a07840" />
            </>
          )}
        </linearGradient>

        {/* Radial reveal mask following cursor */}
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
          {/* Oversized rect so mask covers entire viewBox regardless of pan */}
          <rect
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>

      {/* ── Hidden measuring node (never visible) ── */}
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

      {/* ── Layer 1: Base outline (always present, fades in on hover) ── */}
      <text
        {...sharedTextProps}
        fill="transparent"
        stroke="currentColor"
        className="text-neutral-400"
        style={{
          opacity: hovered ? 0.6 : 0.25,
          transition: "opacity 0.4s ease",
        }}
      >
        {text}
      </text>

      {/* ── Layer 2: Draw-on animation stroke ── */}
      <motion.text
        {...sharedTextProps}
        fill="transparent"
        stroke="currentColor"
        className="text-neutral-400"
        initial={{ strokeDashoffset: 3000, strokeDasharray: 3000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 3000 }}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        {text}
      </motion.text>

      {/* ── Layer 3: Gold gradient revealed under cursor ── */}
      <text
        {...sharedTextProps}
        fill="transparent"
        stroke="url(#textGradient)"
        strokeWidth={1.5}
        mask="url(#textMask)"
      >
        {text}
      </text>
    </svg>
  );
};
