// app/projects/[id]/page.tsx
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import {
  type AnySlot,
  type BeforeAfterSlot,
  type ContentBlockData,
  type AnyBlock,
  type GallerySlot,
  type ImageSlot,
  PROJECT_DETAIL_QUERY,
  type ProjectDetailData,
  type TextSlot,
  type VideoSlot,
} from "@/sanity/schemaTypes/queries";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { toYouTubeEmbed } from "@/lib/youtube";
import Footer from "@/components/layout/footer";
import { BackButton } from "@/components/layout/back-button";
import StackGallery from "@/components/ui/StackGallery";
import BeforeAfterSlotClient from "@/components/ui/BeforeAfterSlotClient";
import ZoomableImage from "@/components/ui/ZoomableImage";

// ── Portable Text components ──────────────────────────────────────
const ptComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-base leading-relaxed text-foreground/70 mb-4">
        {children}
      </p>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-foreground mt-8 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">
        {children}
      </h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-2 border-foreground/20 pl-4 italic text-foreground/50 my-4">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
  },
};

// ── Heading alignment map ─────────────────────────────────────────
const headingAlignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

// ── Text alignment ────────────────────────────────────────────────
const textAlignOnly = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

const textContainerPosition = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
} as const;

// ── HeadingEl ─────────────────────────────────────────────────────
function HeadingEl({
  text,
  align = "center",
  className = "",
}: {
  text: string;
  align?: "left" | "center" | "right";
  className?: string;
}) {
  return (
    <h2
      className={`text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-palatino ${headingAlignClass[align]} ${className}`}
    >
      {text}
    </h2>
  );
}

// ── RenderSlot ────────────────────────────────────────────────────
function RenderSlot({
  slot,
  size,
}: {
  slot: AnySlot;
  size: "full" | "half" | "third";
}) {
  const imgHeight = size === "full" ? "480px" : "340px";

  switch (slot._type) {
    case "textSlot": {
      const ts = slot as TextSlot;
      const align = ts.align ?? "left";
      const txtAlign = textAlignOnly[align];
      const containerPos = textContainerPosition[align];

      return (
        <div
          className={`w-full ${txtAlign} ${size === "full" ? `max-w-3xl ${containerPos}` : ""}`}
        >
          <PortableText value={ts.content ?? []} components={ptComponents} />
        </div>
      );
    }

    case "imageSlot": {
      const is = slot as ImageSlot;
      if (!is.image?.url) return null;
      return (
        <figure>
          <div className="flex items-center justify-center">
            <ZoomableImage
              src={is.image.url}
              alt={is.image.caption ?? ""}
              className="w-full h-auto object-contain rounded-2xl"
            />
          </div>
          {is.image.caption && (
            <figcaption className="mt-2 text-sm text-foreground/40 text-center">
              {is.image.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "gallerySlot": {
      const gs = slot as GallerySlot;
      if (!gs.images?.length) return null;
      return (
        <StackGallery images={gs.images} />
      );
    }

    case "videoSlot": {
      const vs = slot as VideoSlot;
      if (!vs.url) return null;
      return (
        <HeroVideoDialog
          animationStyle="from-center"
          videoSrc={toYouTubeEmbed(vs.url)}
          thumbnailSrc={vs.thumbnail ?? "/images/default-thumbnail.png"}
          thumbnailAlt="Project video"
          className="w-full"
        />
      );
    }

    default:
      return null;
  }
}

// ── RenderBlock ───────────────────────────────────────────────────
function RenderBlock({ block }: { block: ContentBlockData }) {
  const slots = block.slots ?? [];
  const heading = block.heading;
  const align = block.headingAlign ?? "center";

  // 1. Check beforeAfterSlot → exclusive render
  const beforeAfterSlot = slots.find((s) => s._type === "beforeAfterSlot") as
    | BeforeAfterSlot
    | undefined;

  if (beforeAfterSlot) {
    return (
      <section className="max-w-[1440px] mx-auto px-6 py-12 md:px-20">
        {heading && (
          <HeadingEl text={heading} align={align} className="mb-10" />
        )}
        <BeforeAfterSlotClient slot={beforeAfterSlot} />
      </section>
    );
  }

  // 2. Filter normal slots
  const normalSlots = slots.filter((s) => s._type !== "beforeAfterSlot");

  // 3. No slots → heading only or nothing
  if (normalSlots.length === 0) {
    if (!heading) return null;
    return (
      <section className="max-w-[1440px] mx-auto px-6 py-12 md:px-20">
        <HeadingEl text={heading} align={align} />
      </section>
    );
  }

  // 4. Render based on slot count
  return (
    <section className="max-w-[1440px] mx-auto px-6 py-12 md:px-20">
      {heading && <HeadingEl text={heading} align={align} className="mb-10" />}

      {/* 1 slot → full width */}
      {normalSlots.length === 1 && (
        <RenderSlot slot={normalSlots[0]} size="full" />
      )}

      {/* 2 slots → 2 columns */}
      {normalSlots.length === 2 && (
        <div className="flex flex-col gap-10 md:flex-row md:items-center">
          {(block.swapSides ? [...normalSlots].reverse() : normalSlots).map(
            (slot, i) => (
              <div key={i} className="md:w-1/2">
                <RenderSlot slot={slot} size="half" />
              </div>
            ),
          )}
        </div>
      )}

      {/* 3+ slots → 3 columns */}
      {normalSlots.length >= 3 && (
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {normalSlots.slice(0, 3).map((slot, i) => (
            <div key={i} className="md:w-1/3">
              <RenderSlot slot={slot} size="third" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ── RenderAnyBlock ────────────────────────────────────────────────
function RenderAnyBlock({ block }: { block: AnyBlock }) {
  if (block._type === "dividerBlock") {
    if (block.style === "spacer") return <div className="h-16 md:h-32" />;
    if (block.style === "dashed") return <hr className="border-t border-dashed border-border/60 my-12 mx-6 md:mx-20" />;
    return <hr className="border-t border-border/40 my-12 mx-6 md:mx-20" />;
  }

  // default to contentBlock (or fallback if _type is missing on old data)
  return <RenderBlock block={block as ContentBlockData} />;
}

// ── Page ──────────────────────────────────────────────────────────
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await client.fetch<ProjectDetailData>(
    PROJECT_DETAIL_QUERY,
    { id },
    { next: { revalidate: 60 } },
  );
  if (!project) notFound();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section
        className="relative w-full"
        style={{ height: "clamp(260px, 50vw, 680px)" }}
      >
        {project.heroImage && (
          <ZoomableImage
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/20" />
        <div className="absolute top-5 left-6 md:left-10 z-10">
          <BackButton />
        </div>
      </section>

      {/* Title + Meta */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-8 md:py-14 border-b border-border">
        {project.category && project.category.length > 0 && (
          <p className="mb-4 md:mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
            {project.category.join(" · ")}
          </p>
        )}
        <div className="flex flex-row items-end gap-6 md:gap-12 flex-wrap md:flex-nowrap">
          <h1 className="flex-1 text-[clamp(2.4rem,6vw,5rem)] font-black leading-[0.95] tracking-tight text-foreground font-palatino m-0">
            {project.title}
          </h1>
          <div className="flex-shrink-0 flex flex-col md:flex-row items-stretch gap-6 md:gap-8 md:pl-10 md:pb-1 w-full md:w-auto">
            {project.year && (
              <div className="pr-0 md:pr-8">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/40 mb-1">
                  Year
                </span>
                <span className="text-sm font-medium text-foreground">
                  {project.year}
                </span>
              </div>
            )}
            {project.year &&
              project.software &&
              project.software.length > 0 && (
                <div className="hidden md:block w-px bg-border self-stretch" />
              )}
            {project.software && project.software.length > 0 && (
              <div className="pl-0 md:pl-8">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/40 mb-1.5">
                  Software
                </span>
                <div className="flex flex-wrap gap-1.5 w-full md:max-w-[200px]">
                  {project.software.map((sw) => (
                    <span
                      key={sw}
                      className="px-2.5 py-0.5 rounded-full text-[11px] border border-border text-foreground/60 whitespace-nowrap"
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Blocks */}
      {project.contentBlocks && project.contentBlocks.length > 0 && (
        <div className="flex flex-col">
          {project.contentBlocks.map((block, index) => (
            <RenderAnyBlock key={index} block={block} />
          ))}
        </div>
      )}

      <Footer />
    </main>
  );
}

export async function generateStaticParams() {
  const ids = await client.fetch<{ id: string }[]>(
    `*[_type == "project"]{ "id": _id }`,
  );
  return ids.map((s) => ({ id: s.id }));
}
