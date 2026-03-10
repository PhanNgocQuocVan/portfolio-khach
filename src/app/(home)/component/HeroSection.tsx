"use client";
import ColorBends from "@/components/ColorBends";
import Grainient from "@/components/Grainient";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
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

      {/* 2. Nội dung Hero Section */}
      <div className="absolute z-[51] inset-0 px-6 pointer-events-none contain-content top-20">
        <div className="flex items-center justify-between w-full relative z-[51]">
          <div>
            <p className="text-[#1a1a1a] text-lg font-semibold tracking-tight">
              Thi Tu Anh (Annie) Doan
            </p>
            <p className="text-[#555] text-sm font-normal tracking-wide">
              Retail & Scenography Designer
            </p>
          </div>
          <div className="pointer-events-auto flex items-center gap-6">
            <a
              href="#"
              className="text-[#1a1a1a] hover:underline transition-colors text-sm font-medium"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-[#1a1a1a] hover:underline transition-colors text-sm font-medium"
            >
              whatsapp
            </a>
            <LiquidMetalButton
              label="Contact"
              onClick={() => {
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 px-6 pointer-events-auto z-50">
          <div className="contain-content mx-auto flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                aria-label="scroll down"
                className="w-10 h-10 rounded-lg border border-gray-700 bg-black/60 flex items-center justify-center text-gray-300 hover:bg-white/5 transition"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-300"
                >
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

              <p className="text-[#555] text-sm max-w-xl">
                I design retail and experiential spaces where brand identity
                becomes physical. From concept to completion, I move between
                vision and execution.
              </p>
            </div>

            {/* Right: stats / icons */}
            <div className="flex items-center gap-10 text-right">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-semibold text-[#1a1a1a]">2+</div>
                <div className="text-xs text-[#555]">
                  Years of <br /> Experience
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-[#1a1a1a]">
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
                  </div>
                  <span className="text-xs text-[#555]">
                    2 Master's Degrees
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-[#1a1a1a]">
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
                  </div>
                  <span className="text-xs text-[#555]">
                    3 Fluent Languages
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="relative w-[20vw] h-[35vw] min-w-[250px] min-h-[375px] max-w-[500px] max-h-[750px] flex items-center justify-center transition-all duration-300">
            {/* Halo/Shadow background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-transparent to-purple-400/20 rounded-full blur-3xl" />

            {/* Border circle */}
            <div className="absolute inset-0 rounded-full backdrop-blur-md ring-[10px] ring-gray-300/20" />

            {/* Image */}
            <img
              src="/images/annie-doan.png"
              alt="Annie Doan"
              className="w-full h-full object-cover rounded-full shadow-2xl z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
