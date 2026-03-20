"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back"
      className="
        cursor-pointer
        group
        inline-flex items-center gap-2
        px-3 py-2 rounded-full
        bg-white/80 backdrop-blur-sm
        border border-white/30
        shadow-md
        text-sm font-medium text-black/70
        hover:bg-white hover:text-black hover:shadow-lg
        transition-all duration-200
      "
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-200 group-hover:-translate-x-0.5"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span className="pr-1">Back</span>
    </button>
  );
}
