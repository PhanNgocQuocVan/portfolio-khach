import React from "react";
import { TextHoverEffect } from "./ui/text-hover-effect";
import { AnimatedTooltip } from "./ui/animated-tooltip";

export default function Footer() {
  const socialLinks = [
    {
      id: 1,
      name: "Zalo",
      url: "https://zalo.me/yourhandle",
      image: "images/zalo.png",
      color: "#0068FF",
    },
    {
      id: 2,
      name: "linkedin",
      url: "https://linkedin.com/in/yourprofile",
      image: "images/linkind.png",
      color: "#0A66C2",
    },
    {
      id: 3,
      name: "Whatsapp",
      url: "https://wa.me/yourphonenumber",
      image: "images/whatsapp.png",
      color: "#25D366",
    },
  ];
  return (
    <footer className="w-full bg-[#1e2d25] transition-colors duration-300">
      {/* ── Top bar ── */}
      <div className=" mx-auto px-6 py-4 flex items-center justify-between border-b border-neutral-200 ">
        {/* Left: contact */}
        <div className="flex flex-col">
          <span className="text-xs text-white ">Contact me at:</span>
          <a
            href="mailto:tuanh@example.com"
            className="flex items-center gap-1 text-sm font-medium text-[#c4a262]  hover:opacity-70 transition-opacity"
          >
            tuanh@example.com
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>

        {/* Right: links */}
        <nav className="hidden md:flex items-center gap-4 pr-8">
          <div className="flex items-center gap-3">
            {/* Media label với styling đẹp hơn */}
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-4 bg-amber-400 rounded-full"></span>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/50">
                Media
              </span>
            </div>
            {/* Avatars */}
            <div className="flex flex-row items-center justify-center">
              <AnimatedTooltip items={socialLinks} />
            </div>
          </div>
        </nav>
      </div>

      {/* ── Big name ── */}
      <div className="w-full px-0 ">
        <TextHoverEffect text="DOAN THI TU ANH" />
      </div>

      {/* ── Bottom bar ── */}
      <div className="mx-auto px-6 py-4 flex items-center justify-between border-t border-neutral-200 ">
        {/* Left: copyright */}
        <span className="text-xs text-white ">
          © {new Date().getFullYear()} Doan Thi Tu Anh. All rights reserved.
        </span>

        {/* Right: social links */}
        <div className="flex items-center gap-4">
          {[
            {
              label: "Portfolio drive link",
              href: "https://drive.google.com/file/d/1tQtbFTdxclnGLHbMrgSsz4PFf236lTmm/view",
            },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-xs text-white  hover:text-[#c4a262] hover:underline transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
