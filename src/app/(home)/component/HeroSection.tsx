"use client";
import Grainient from "@/components/Grainient";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function HeroSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.1 });

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* ── Background ── */}
      <div className="bg-black w-full h-full absolute inset-0">
        {isInView ? (
          <Grainient
            color1="#cfcfc9"
            color2="#807e8b"
            color3="#dcdbd0"
            timeSpeed={1.6}
            colorBalance={0.09}
            warpStrength={1.2}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={1.5}
            grainAmount={0}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        ) : (
          <div className="w-full h-full bg-white" />
        )}
      </div>

      {/* ════════════════════════════════
          DESKTOP LAYOUT  (md+)
      ════════════════════════════════ */}
      <div className="hidden md:flex absolute inset-0 z-50 px-6 flex-col justify-between pb-6 pt-20">
        {/* Top */}
        <div className="flex items-center justify-between w-full">
          <div>
            <p className="text-[#1a1a1a] text-lg font-semibold tracking-tight">
              Thi Tu Anh (Annie) Doan
            </p>
            <p className="text-[#555] text-sm font-normal tracking-wide">
              Retail & Scenography Designer
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-[#1a1a1a] hover:underline text-sm font-medium"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-[#1a1a1a] hover:underline text-sm font-medium"
            >
              Whatsapp
            </a>
            <LiquidMetalButton
              label="Contact"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button
              aria-label="scroll down"
              className="w-10 h-10 rounded-lg border border-gray-700 bg-black/60 flex items-center justify-center text-gray-300 hover:bg-white/5 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 13l-6 6-6-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <p className="text-[#555] text-sm max-w-sm leading-relaxed">
              I design retail and experiential spaces where brand identity
              becomes physical. From concept to completion, I move between
              vision and execution.
            </p>
          </div>
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-semibold text-[#1a1a1a]">2+</span>
              <span className="text-xs text-[#555] leading-snug">
                Years of
                <br />
                Experience
              </span>
            </div>
            <DesktopStatIcon type="education" label="2 Master's Degrees" />
            <DesktopStatIcon type="language" label="3 Fluent Languages" />
          </div>
        </div>
      </div>

      {/* Desktop center portrait */}
      <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none z-40">
        <div className="relative w-[20vw] h-[35vw] min-w-[250px] min-h-[375px] max-w-[400px] max-h-[650px]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-transparent to-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 rounded-full backdrop-blur-md ring-[10px] ring-gray-300/20" />
          <img
            src="/images/annie-doan.png"
            alt="Annie Doan"
            className="relative z-10 w-full h-full object-cover rounded-full shadow-2xl"
          />
        </div>
      </div>

      {/* ════════════════════════════════
          MOBILE LAYOUT  (< md)
          Structure:
            [nav]         ← fixed height
            [portrait]    ← flex-1, fills remaining
            [bio + stats] ← fixed height, sits above bottom nav
      ════════════════════════════════ */}
      <div className="flex md:hidden absolute inset-0 z-30 flex-col select-none">
        {/* NAV ─────────────────────────────── */}
        <div className="flex items-start justify-between px-5 pt-11 pb-2 shrink-0">
          <div>
            <p className="text-[#1a1a1a] text-[15px] font-semibold tracking-tight leading-none">
              Thi Tu Anh (Annie) Doan
            </p>
            <p className="text-[#666] text-[10px] tracking-[0.14em] uppercase mt-[5px] leading-none">
              Retail & Scenography Designer
            </p>
          </div>

          <div className="flex items-center gap-[10px] ml-2 mt-[1px] shrink-0">
            <a href="#" className="text-[#1a1a1a] text-[11px] font-medium">
              LinkedIn
            </a>
            <span className="text-[#ccc] text-[10px]">·</span>
            <a href="#" className="text-[#1a1a1a] text-[11px] font-medium">
              WA
            </a>
            <div className="scale-[0.70] origin-right -mr-1">
              <LiquidMetalButton
                label="Contact"
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              />
            </div>
          </div>
        </div>

        {/* PORTRAIT ───────────────────────── */}
        <div className="flex-1 flex items-center justify-center min-h-0 py-3">
          <div
            className="relative"
            style={{ width: "min(68vw, 290px)", height: "min(68vw, 290px)" }}
          >
            {/* Ambient glow */}
            <div
              className="absolute -inset-8 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(180,180,200,0.28) 0%, transparent 70%)",
              }}
            />
            {/* Ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow:
                  "0 0 0 7px rgba(255,255,255,0.22), 0 0 0 8px rgba(0,0,0,0.06)",
              }}
            />
            {/* Photo */}
            <img
              src="/images/annie-doan.png"
              alt="Annie Doan"
              className="relative z-10 w-full h-full object-cover object-top rounded-full"
              style={{ boxShadow: "0 12px 48px rgba(0,0,0,0.16)" }}
            />
          </div>
        </div>

        {/* BOTTOM INFO ─────────────────────
            Extra bottom padding so content
            clears any floating bottom nav   */}
        <div className="shrink-0 px-5 pb-16 flex flex-col items-center gap-4">
          {/* Bio */}
          <p className="text-[#4d4d4d] text-[11.5px] leading-[1.8] text-center max-w-[300px]">
            I design retail and experiential spaces where brand identity becomes
            physical. From concept to completion, I move between vision and
            execution.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center gap-3 w-full max-w-[280px]">
            <div className="flex-1 h-px bg-[#1a1a1a]/12" />
            <div className="w-1 h-1 rounded-full bg-[#1a1a1a]/20" />
            <div className="flex-1 h-px bg-[#1a1a1a]/12" />
          </div>

          {/* Stats */}
          <div className="flex items-stretch justify-between w-full max-w-[300px]">
            {/* Years */}
            <div className="flex flex-col items-center justify-center gap-1 flex-1 py-1">
              <span className="text-[28px] font-semibold text-[#1a1a1a] leading-none">
                2+
              </span>
              <span className="text-[9px] text-[#777] text-center uppercase tracking-[0.1em] leading-[1.5]">
                Years of
                <br />
                Experience
              </span>
            </div>

            {/* Separator */}
            <div className="w-px bg-[#1a1a1a]/10 my-1 mx-1 shrink-0" />

            {/* Master's */}
            <div className="flex flex-col items-center justify-center gap-1.5 flex-1 py-1">
              <div className="w-[26px] h-[26px] rounded-full border border-[#999]/50 flex items-center justify-center shrink-0">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3L2 9l10 6 10-6-10-6z"
                    stroke="#444"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 12.5v5c0 0 2 2 6 2s6-2 6-2v-5"
                    stroke="#444"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 9v5"
                    stroke="#444"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-[9px] text-[#777] text-center uppercase tracking-[0.1em] leading-[1.5]">
                2 Master's
                <br />
                Degrees
              </span>
            </div>

            {/* Separator */}
            <div className="w-px bg-[#1a1a1a]/10 my-1 mx-1 shrink-0" />

            {/* Languages */}
            <div className="flex flex-col items-center justify-center gap-1.5 flex-1 py-1">
              <div className="w-[26px] h-[26px] rounded-full border border-[#999]/50 flex items-center justify-center shrink-0">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 10h8M8 14h5"
                    stroke="#444"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 3V7z"
                    stroke="#444"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-[9px] text-[#777] text-center uppercase tracking-[0.1em] leading-[1.5]">
                3 Fluent
                <br />
                Languages
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Desktop stat helper ── */
function DesktopStatIcon({
  type,
  label,
}: {
  type: "education" | "language";
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-[#1a1a1a]">
        {type === "education" ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3L2 9l10 6 10-6-10-6z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M6 12.5v5c0 0 2 2 6 2s6-2 6-2v-5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 9v5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 10h8M8 14h5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M3 7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 3V7z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="text-xs text-[#555]">{label}</span>
    </div>
  );
}
