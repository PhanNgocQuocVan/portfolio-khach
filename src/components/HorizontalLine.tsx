import { Marquee } from "./ui/marquee";

export default function HorizontalLine() {
  return (
    <div className="w-full pointer-events-auto py-2 bg-[#f3f3f3]">
      <Marquee reverse className="text-sm text-black font-medium">
        {[
          "100+ Stores Worldwide",
          "✦",
          "Spatial Visualization & Rendering",
          "✦",
          "Concept to Execution",
          "✦",
          "Brand & Experiential Spaces",
          "✦",
          "English-French-Vietnamese",
        ].map((txt, i) => (
          <span key={i} className="mx-4">
            {txt}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
