"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkillItem {
  label: string;
  value: number;
  code: string;
}

interface SkillBarProps extends SkillItem {
  index: number;
}

interface CountUpProps {
  value: number;
  inView: boolean;
  delay: number;
}

interface SkillGroupProps {
  title: string;
  subtitle: string;
  items: SkillItem[];
  index: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const languages: SkillItem[] = [
  { label: "Vietnamese", value: 98, code: "VI" },
  { label: "English", value: 90, code: "EN" },
  { label: "French", value: 75, code: "FR" },
];

const skills: SkillItem[] = [
  { label: "Concept Design", value: 92, code: "01" },
  { label: "Technical Drawings", value: 85, code: "02" },
  { label: "Coordination & Execution", value: 88, code: "03" },
];

// ─── SkillBar ─────────────────────────────────────────────────────────────────

function SkillBar({ label, value, code, index }: SkillBarProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      {/* Label row */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-mono tracking-widest text-foreground/30 select-none">
            {code}
          </span>
          <span
            className="text-[13px] font-medium tracking-wide text-foreground/80 uppercase"
            style={{ letterSpacing: "0.1em" }}
          >
            {label}
          </span>
        </div>
        <motion.span
          className="text-[13px] font-mono font-semibold text-foreground/60"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.1 + 0.35, duration: 0.4 }}
        >
          <CountUp value={value} inView={inView} delay={index * 0.1} />
          <span className="text-foreground/30">%</span>
        </motion.span>
      </div>

      {/* Track */}
      <div className="relative h-[2px] w-full bg-foreground/10 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-foreground/80"
          initial={{ width: "0%" }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{
            duration: 1.0,
            delay: index * 0.1 + 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── CountUp ──────────────────────────────────────────────────────────────────

function CountUp({ value, inView, delay }: CountUpProps) {
  const [display] = useCountAnimation(value, inView, delay);
  return <>{display}</>;
}

function useCountAnimation(
  target: number,
  inView: boolean,
  delay: number,
): [number] {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(
      () => {
        let start = 0;
        const duration = 1000;
        const step = 16;
        const increment = target / (duration / step);
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, step);
        return () => clearInterval(timer);
      },
      delay * 1000 + 100,
    );
    return () => clearTimeout(timeout);
  }, [inView]);

  return [count];
}

// ─── SkillGroup ───────────────────────────────────────────────────────────────

function SkillGroup({
  title,
  subtitle,
  items,
  index: groupIndex,
}: SkillGroupProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: groupIndex * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Group header */}
      <div className="mb-6 md:mb-8">
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-foreground/35 mb-1.5">
          {subtitle}
        </p>
        <h3 className="text-lg font-semibold text-foreground tracking-tight">
          {title}
        </h3>
        {/* thin underline */}
        <div className="mt-3 h-px w-full bg-foreground/10" />
      </div>

      <div className="space-y-5 md:space-y-6">
        {items.map((item, i) => (
          <SkillBar key={item.label} {...item} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function SkillsSection() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section className="py-10 md:py-20" id="skills">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
        {/* ── Header ── */}
        <div ref={titleRef} className="text-center mb-10 md:mb-20">
          <motion.p
            className="text-[11px] font-mono tracking-[0.35em] uppercase text-foreground/35 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
          >
            Expertise & Proficiency
          </motion.p>

          <motion.h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-none font-palatino"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            initial={{ opacity: 0, y: 24 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            My Skills
          </motion.h2>

          {/* animated divider */}
          <motion.div
            className="mx-auto mt-5 h-px bg-foreground/15"
            initial={{ width: 0 }}
            animate={titleInView ? { width: "60px" } : {}}
            transition={{
              duration: 0.7,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          <motion.p
            className="mt-5 text-sm text-foreground/40 max-w-sm mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={titleInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            A curated overview of languages spoken and professional capabilities
            developed over the years.
          </motion.p>
        </div>

        {/* ── Two columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-20">
          <div className="pb-10 md:pb-0">
            <SkillGroup
              title="Languages"
              subtitle="Communication"
              items={languages}
              index={0}
            />
          </div>

          {/* Mobile divider between groups */}
          <div className="block md:hidden h-px w-full bg-foreground/10 mb-10" />

          <div>
            <SkillGroup
              title="Professional Skills"
              subtitle="Design & Architecture"
              items={skills}
              index={1}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
