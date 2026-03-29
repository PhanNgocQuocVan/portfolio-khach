// app/projects/[id]/page.tsx
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import {
  ContentBlock,
  PROJECT_DETAIL_QUERY,
  ProjectDetailData,
} from "@/sanity/schemaTypes/queries";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { toYouTubeEmbed } from "@/lib/youtube";
import Footer from "@/components/layout/footer";
import { BackButton } from "@/components/layout/back-button";
import StackGallery from "@/components/ui/StackGallery";

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

// ── Heading alignment ─────────────────────────────────────────────
const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

const textAlignClass = {
  left: "text-left mr-auto",
  center: "text-center mx-auto",
  right: "text-right ml-auto",
} as const;

// ── Video widget ──────────────────────────────────────────────────
function VideoBlock({ block }: { block: ContentBlock }) {
  return (
    <HeroVideoDialog
      animationStyle="from-center"
      videoSrc={toYouTubeEmbed(block.videoUrl!)}
      thumbnailSrc={block.videoThumbnail ?? "/images/default-thumbnail.png"}
      thumbnailAlt="Project video"
      className="w-full"
    />
  );
}

// ── Content block renderer ────────────────────────────────────────
function RenderBlock({ block, index }: { block: ContentBlock; index: number }) {
  const hasHeading = !!block.heading;
  const hasText = !!(block.text && block.text.length > 0);
  const hasImage = !!block.image?.url;
  const hasImages = !!(block.images && block.images.length > 0);
  const hasVideo = !!block.videoUrl;
  const hasThreeImages = !!(
    block.threeImages && block.threeImages.length === 3
  );
  const align = block.headingAlign ?? "center";
  const textAlign = block.textAlign ?? "left";

  // ── 3 ảnh ngang hàng full width ─────────────────────────────────
  if (hasThreeImages) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12 md:px-20">
        {hasHeading && (
          <h2
            className={`text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-palatino mb-10 ${alignClass[align]}`}
          >
            {block.heading}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {block.threeImages!.map((img, i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl group">
              <img
                src={img.url}
                alt={img.caption ?? ""}
                className="w-full rounded-2xl transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 md:p-5">
                  <p className="text-xs md:text-sm text-white/80 font-medium">
                    {img.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Số content chính (không tính heading)
  // images và image đơn tính chung 1 slot
  const contentCount = [hasText, hasImages || hasImage, hasVideo].filter(
    Boolean,
  ).length;

  // ── Heading đơn ──────────────────────────────────────────────
  if (hasHeading && contentCount === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12 md:px-20">
        <h2
          className={`text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-palatino ${alignClass[align]}`}
        >
          {block.heading}
        </h2>
      </section>
    );
  }

  // ── 1 content → full width ────────────────────────────────────
  if (contentCount <= 1) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12 md:px-20">
        {hasHeading && (
          <h2
            className={`text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-palatino mb-8 ${alignClass[align]}`}
          >
            {block.heading}
          </h2>
        )}

        {hasText && (
          <div className={`max-w-3xl ${textAlignClass[textAlign]}`}>
            <PortableText value={block.text!} components={ptComponents} />
          </div>
        )}

        {/* Gallery → Stack */}
        {hasImages && (
          <div className="w-full">
            <StackGallery images={block.images!} />
          </div>
        )}

        {/* Ảnh đơn */}
        {!hasImages && hasImage && (
          <figure>
            <img
              src={block.image!.url}
              alt={block.image?.caption ?? ""}
              className="w-full rounded-2xl"
            />
            {block.image?.caption && (
              <figcaption className="mt-3 text-center text-sm text-foreground/40">
                {block.image.caption}
              </figcaption>
            )}
          </figure>
        )}

        {hasVideo && (
          <div className="w-full">
            <VideoBlock block={block} />
          </div>
        )}
      </section>
    );
  }

  // ── 2-3 content → 2 cột, swapSides kiểm soát thứ tự ─────────
  // Thứ tự mặc định: text → images/image → video
  // swapSides = true → đảo ngược thứ tự
  const elements: React.ReactNode[] = [];

  if (hasText)
    elements.push(
      <div key="text" className={`md:w-1/2 flex flex-col justify-center ${textAlignClass[textAlign]}`}>
        <PortableText value={block.text!} components={ptComponents} />
      </div>,
    );

  if (hasImages)
    elements.push(
      <div key="images" className="md:w-1/2">
        <StackGallery images={block.images!} />
      </div>,
    );

  if (!hasImages && hasImage)
    elements.push(
      <figure key="image" className="md:w-1/2">
        <img
          src={block.image!.url}
          alt={block.image?.caption ?? ""}
          className="w-full rounded-2xl"
        />
        {block.image?.caption && (
          <figcaption className="mt-2 text-sm text-foreground/40">
            {block.image.caption}
          </figcaption>
        )}
      </figure>,
    );

  if (hasVideo)
    elements.push(
      <div key="video" className="md:w-1/2">
        <VideoBlock block={block} />
      </div>,
    );

  // swapSides đảo thứ tự, nếu không bật thì giữ nguyên
  const ordered = block.swapSides ? [...elements].reverse() : elements;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:px-20">
      {hasHeading && (
        <h2
          className={`text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-palatino mb-10 ${alignClass[align]}`}
        >
          {block.heading}
        </h2>
      )}
      <div className="flex flex-col gap-10 md:flex-row md:items-center">
        {ordered}
      </div>
    </section>
  );
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
          <img
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
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-14 border-b border-border">
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
        <div className="divide-y divide-border/40">
          {project.contentBlocks.map((block, index) => (
            <RenderBlock key={index} block={block} index={index} />
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
