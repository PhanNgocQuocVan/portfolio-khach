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
  accent: string;
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
  accent: string;
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

function SkillBar({ label, value, code, index, accent }: SkillBarProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      {/* Row header */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-bold tracking-[0.2em] opacity-40 font-mono"
            style={{ color: accent }}
          >
            {code}
          </span>
          <span
            className="text-sm font-semibold tracking-wide text-white/90 uppercase"
            style={{ letterSpacing: "0.08em" }}
          >
            {label}
          </span>
        </div>
        <motion.span
          className="text-sm font-bold font-mono"
          style={{ color: accent }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.12 + 0.4, duration: 0.4 }}
        >
          <CountUp value={value} inView={inView} delay={index * 0.12} />%
        </motion.span>
      </div>

      {/* Track */}
      <div
        className="relative h-[3px] w-full rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.07)" }}
      >
        {/* Glow shadow behind bar */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full blur-sm opacity-60"
          style={{ background: accent }}
          initial={{ width: "0%" }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{
            duration: 1.1,
            delay: index * 0.12 + 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
        {/* Actual bar */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${accent}cc, ${accent})`,
          }}
          initial={{ width: "0%" }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{
            duration: 1.1,
            delay: index * 0.12 + 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
    </motion.div>
  );
}

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
        const duration = 1100;
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
      delay * 1000 + 150,
    );
    return () => clearTimeout(timeout);
  }, [inView]);

  return [count];
}

function SkillGroup({
  title,
  subtitle,
  items,
  accent,
  index: groupIndex,
}: SkillGroupProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: groupIndex * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative p-8 rounded-2xl"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Accent corner line */}
      <div
        className="absolute top-0 left-8 h-[2px] w-12 rounded-full"
        style={{ background: accent }}
      />

      <div className="mb-8">
        <p
          className="text-[10px] font-mono tracking-[0.25em] uppercase mb-1"
          style={{ color: accent, opacity: 0.7 }}
        >
          {subtitle}
        </p>
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
      </div>

      <div className="space-y-7">
        {items.map((item, i) => (
          <SkillBar key={item.label} {...item} index={i} accent={accent} />
        ))}
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section
      className="relative min-h-screen flex items-center py-28 px-6 overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      {/* Background ambient blobs */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[120px] pointer-events-none"
        style={{ background: "#c8a96e" }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px] pointer-events-none"
        style={{ background: "#6e9dc8" }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* Section header */}
        <div ref={titleRef} className="mb-16">
          <motion.p
            className="text-[11px] font-mono tracking-[0.35em] uppercase mb-4"
            style={{ color: "#c8a96e", opacity: 0.8 }}
            initial={{ opacity: 0, x: -20 }}
            animate={titleInView ? { opacity: 0.8, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Expertise & Proficiency
          </motion.p>

          <motion.h2
            className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none"
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.65,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            My{" "}
            <span
              className="relative inline-block"
              style={{ color: "#c8a96e" }}
            >
              Skills
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] rounded-full"
                style={{
                  background: "linear-gradient(90deg, #c8a96e, #6e9dc8)",
                }}
                initial={{ width: "0%" }}
                animate={titleInView ? { width: "100%" } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </span>
          </motion.h2>

          <motion.p
            className="mt-4 text-sm text-white/30 max-w-xs leading-relaxed"
            initial={{ opacity: 0 }}
            animate={titleInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            A curated overview of languages spoken and professional capabilities
            developed over the years.
          </motion.p>
        </div>

        {/* Two column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkillGroup
            title="Languages"
            subtitle="Communication"
            items={languages}
            accent="#c8a96e"
            index={0}
          />
          <SkillGroup
            title="Professional Skills"
            subtitle="Design & Architecture"
            items={skills}
            accent="#6e9dc8"
            index={1}
          />
        </div>

        {/* Bottom divider line */}
        <motion.div
          className="mt-16 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
