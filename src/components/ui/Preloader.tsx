"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CharacterMorph } from "./character-morph";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800); // Delay nhẹ sau khi đạt 100% để user kịp thấy
          return 100;
        }
        return prev + 1;
      });
    }, 8); // Tăng 1% mỗi 20ms => khoảng 2s để đạt 100%
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{
        duration: 0.9,
        ease: [0.76, 0, 0.24, 1],
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]"
    >
      <div className="relative flex flex-col items-center space-y-20">
        {/* Chữ Annie Doan - Hiệu ứng mờ dần và giãn chữ */}
        <div className="flex items-center justify-center">
          <CharacterMorph
            texts={["THI TU ANH (ANIME)", "INTERIOR ARCHITECT"]}
            interval={2000} // Khoảng cách giữa 2 lần chuyển chữ (1.5 giây mỗi chữ)
            charDuration={0.6} // Thời gian mỗi chữ cái bay lên (nhanh nhưng đủ mượt)
            staggerDelay={0.02}
            className="font-bold text-9xl text-white mb-10"
          />
        </div>

        {/* Thanh loading mảnh kiểu Apple UI */}
        <div className="relative w-[350px] h-[4px] bg-white/20 overflow-hidden rounded-full">
          {/* Lớp nền sáng mờ */}
          <motion.div
            className="absolute left-0 h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
            style={{
              boxShadow: "0 0 10px 1px rgba(184, 155, 102, 0.5)", // Hiệu ứng hào quang nhẹ
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
