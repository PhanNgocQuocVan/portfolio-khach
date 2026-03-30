"use client";

import {
  ImageComparison,
  ImageComparisonHover,
  ImageComparisonFade,
} from "@/components/ui/image-comparison";
import type { BeforeAfterSlot } from "@/sanity/schemaTypes/queries";

interface BeforeAfterSlotClientProps {
  slot: BeforeAfterSlot;
}

export default function BeforeAfterSlotClient({
  slot,
}: BeforeAfterSlotClientProps) {
  if (!slot.beforeImage || !slot.afterImage) return null;

  const commonProps = {
    beforeImage: slot.beforeImage,
    afterImage: slot.afterImage,
    beforeLabel: slot.beforeLabel ?? "Phác thảo",
    afterLabel: slot.afterLabel ?? "Hoàn thiện",
    className: "max-w-full mx-auto",
    showLabels: true,
  };

  return (
    <>
      {slot.variant === "hover" ? (
        <ImageComparisonHover {...commonProps} />
      ) : slot.variant === "fade" ? (
        <ImageComparisonFade {...commonProps} />
      ) : (
        <ImageComparison
          {...commonProps}
          initialPosition={50}
          orientation="horizontal"
        />
      )}
    </>
  );
}
