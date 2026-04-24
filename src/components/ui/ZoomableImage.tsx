"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export default function ZoomableImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className} cursor-zoom-in`}
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-6 cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-[90vw] max-h-[85vh] rounded-2xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="block max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full border-none bg-black/60 text-white flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-black/80 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/45 text-xs pointer-events-none">
            Bấm ra ngoài để đóng
          </div>
        </div>
      )}
    </>
  );
}
