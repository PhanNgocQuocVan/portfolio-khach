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
      className="max-w-full w-auto object-contain pointer-events-none rounded-2xl"
    />
  ));

  return (
    <Stack
      cards={cards}
      sendToBackOnClick
      autoplayDelay={3000}
      pauseOnHover
      mobileClickOnly
      randomRotation
      sensitivity={150}
    />
  );
}
