import React from "react";
import { TextHoverEffect } from "./ui/text-hover-effect";
import { AnimatedTooltip } from "./ui/animated-tooltip";

export default function Footer() {
  const socialLinks = [
    {
      id: 1,
      name: "Zalo",
      url: "https://zalo.me/+33622089782",
      image: "images/zalo.png",
      color: "#0068FF",
    },
    {
      id: 2,
      name: "linkedin",
      url: "https://www.linkedin.com/in/thi-tu-anh-doan/",
      image: "images/linkind.png",
      color: "#0A66C2",
    },
    {
      id: 3,
      name: "Whatsapp",
      url: "https://wa.me/+33622089782",
      image: "images/whatsapp.png",
      color: "#25D366",
    },
  ];

  return (
    <footer className="w-full bg-[#111111] transition-colors duration-300">
      {/* ── Top bar ── */}
      <div className="mx-auto px-4 md:px-6 py-4 flex flex-row items-center justify-between border-b border-white/10 gap-2">
        {/* Left: contact */}
        <div className="flex flex-col items-start text-left">
          <span className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.12em]">
            Contact
          </span>
          <a
            href="mailto:doantuanh.work@gmail.com"
            className="flex items-center gap-1 text-[12px] md:text-sm font-medium text-white hover:text-white/60 transition-colors"
          >
            doantuanh.work@gmail.com
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>

        {/* Right: social icons */}
        <nav className="flex items-center gap-2 md:gap-4 md:pr-8">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1">
              <span className="w-0.5 h-3 md:h-4 bg-white/20 rounded-full" />
              <span className="text-[9px] md:text-xs font-semibold tracking-[0.2em] uppercase text-white/40">
                Media
              </span>
            </div>
            <div className="flex flex-row items-center justify-center">
              <AnimatedTooltip items={socialLinks} />
            </div>
          </div>
        </nav>
      </div>

      {/* ── Big name ── */}
      <div className="w-full px-0">
        <TextHoverEffect text="DOAN THI TU ANH" forceColor="white" />
      </div>

      {/* ── Bottom bar ── */}
      <div className="mx-auto px-4 md:px-6 py-3 md:py-4 flex flex-row items-center justify-between border-t border-white/10 gap-2">
        {/* Left: copyright */}
        <span className="text-[10px] md:text-xs text-white/40">
          © {new Date().getFullYear()} Doan Thi Tu Anh.
        </span>

        {/* Right: portfolio link */}
        <div className="flex items-center gap-4">
          {[
            {
              label: "Portfolio drive",
              href: "https://drive.google.com/file/d/1tQtbFTdxclnGLHbMrgSsz4PFf236lTmm/view",
            },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-1 text-[10px] md:text-xs text-white/40 hover:text-white/80 transition-colors"
            >
              {label}
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
