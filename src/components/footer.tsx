import React from "react";
import { TextHoverEffect } from "./ui/text-hover-effect";

export default function Footer() {
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

        {/* Right: nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {["About", "Projects", "Experience", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-white  hover:text-[#c4a262] transition-colors"
            >
              {item}
            </a>
          ))}
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
            { label: "LinkedIn", href: "#" },
            { label: "Behance", href: "#" },
            { label: "Instagram", href: "#" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-xs text-white  hover:text-neutral-900  transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
