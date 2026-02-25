"use client";
import ColorBends from "@/components/ColorBends";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* 1. Background riêng của Section 1 */}
      <div className="bg-black w-full h-full">
        <ColorBends />
      </div>

      {/* 2. Nội dung Hero Section */}
      <div className="absolute z-[51] inset-0 px-6 pointer-events-none contain-content top-20">
        <div className="flex items-center justify-between w-full relative z-[51]">
          <div>
            <p className="text-white text-lg font-semibold tracking-tight">
              Annie Doan
            </p>
            <p className="text-gray-400 text-sm font-normal tracking-wide">
              Space x Narrative x Emotion
            </p>
          </div>
          <div className="pointer-events-auto flex items-center gap-6">
            <a
              href="#"
              className="text-white hover:underline transition-colors text-sm font-medium"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-white hover:underline transition-colors text-sm font-medium"
            >
              Twitter/X
            </a>
            <LiquidMetalButton label="Contact" />
          </div>
        </div>

        {/* Bottom info bar (fixed to bottom of section) */}
        <div className="absolute bottom-6 left-0 right-0 px-6 pointer-events-auto z-50">
          <div className="contain-content mx-auto flex items-center justify-between gap-6">
            {/* Left: down button + description */}
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

              <p className="text-gray-400 text-sm max-w-xl">
                Annie is an interior architect & spatial storyteller, crafting
                immersive environments that balance refined aesthetics with the
                quiet power of functional design.
              </p>
            </div>

            {/* Right: stats / icons */}
            <div className="flex items-center gap-10 text-right">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-semibold text-white">10+</div>
                <div className="text-xs text-gray-400">
                  Years of <br /> Experience
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-300">
                    {/* globe icon */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2a10 10 0 100 20 10 10 0 000-20z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-400">
                    AI &<br />
                    Web3
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-300">
                    {/* star / AR icon */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2v20M2 12h20"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-400">
                    AR/VR &<br />
                    Digital+Physical
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="relative w-[25vw] h-[40vw] min-w-[250px] min-h-[375px] max-w-[500px] max-h-[750px] flex items-center justify-center transition-all duration-300">
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
