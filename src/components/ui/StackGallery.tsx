"use client";

import Stack from "../Stack";

interface StackGalleryProps {
  images: { url: string; caption?: string }[];
}

export default function StackGallery({ images }: StackGalleryProps) {
  const cards = images.map((img, i) => (
    <img
      key={i}
      src={img.url}
      alt={img.caption ?? `image-${i + 1}`}
      className="w-full h-full object-cover pointer-events-none"
    />
  ));

  return (
    // padding-bottom để Stack có không gian hiện hiệu ứng xoay
    <div className="w-full" style={{ height: "340px" }}>
      <Stack
        cards={cards}
        sendToBackOnClick
        autoplay
        autoplayDelay={3000}
        pauseOnHover
        mobileClickOnly
        randomRotation
        sensitivity={150}
      />
    </div>
  );
}
