import { Marquee } from "./ui/marquee";

export default function HorizontalLine() {
  return (
    <div className="w-full pointer-events-auto py-2 bg-[#f3f3f3]">
      <Marquee reverse className="text-sm text-black font-medium">
        {[
          "50+ Projects Completed",
          "✦",
          "10 Years of Experience",
          "✦",
          "100% Bespoke Designs",
          "✦",
          "12 Awards Won",
          "✦",
          "Featured in ArchDaily",
        ].map((txt, i) => (
          <span key={i} className="mx-4">
            {txt}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
