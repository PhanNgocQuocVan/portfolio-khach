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

// ── Video widget ──────────────────────────────────────────────────
function VideoBlock({ block }: { block: ContentBlock }) {
  const embedUrl = toYouTubeEmbed(block.videoUrl!);
  return (
    <HeroVideoDialog
      animationStyle="from-center"
      videoSrc={embedUrl}
      thumbnailSrc={block.videoThumbnail ?? "/images/default-thumbnail.png"}
      thumbnailAlt="Project video"
      className="w-full"
    />
  );
}

// ── Content block renderer ────────────────────────────────────────
function RenderBlock({ block, index }: { block: ContentBlock; index: number }) {
  const hasText = block.text && block.text.length > 0;
  const hasImage = !!block.image?.url;
  const hasVideo = !!block.videoUrl;
  const count = [hasText, hasImage, hasVideo].filter(Boolean).length;

  // ── Chỉ 1 loại → full width ───────────────────────────────────
  if (count <= 1) {
    if (hasText)
      return (
        <section className="max-w-7xl px-6 mx-auto py-12 md:px-20">
          <div className="max-w-3xl">
            <PortableText value={block.text!} components={ptComponents} />
          </div>
        </section>
      );

    if (hasImage)
      return (
        <section className="max-w-7xl mx-auto px-6 py-8 md:px-20">
          <figure>
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{ height: "480px" }}
            >
              <img
                src={block.image!.url}
                alt={block.image?.caption ?? ""}
                className="w-full h-full object-cover"
              />
            </div>
            {block.image?.caption && (
              <figcaption className="mt-3 text-center text-sm text-foreground/40">
                {block.image.caption}
              </figcaption>
            )}
          </figure>
        </section>
      );

    if (hasVideo)
      return (
        <section className="max-w-7xl mx-auto px-6 py-8 md:px-20">
          <div className="w-full">
            <VideoBlock block={block} />
          </div>
        </section>
      );

    return null;
  }

  // ── 2 loại → 2 cột xen kẽ trái/phải theo index ───────────────
  const isEven = index % 2 === 0;

  // Xây phần tử A và B theo thứ tự ưu tiên: text > image > video
  const elements: React.ReactNode[] = [];

  if (hasText)
    elements.push(
      <div key="text" className="md:w-1/2">
        <PortableText value={block.text!} components={ptComponents} />
      </div>,
    );

  if (hasImage)
    elements.push(
      <figure key="image" className="md:w-1/2">
        <div
          className="relative overflow-hidden rounded-2xl bg-muted"
          style={{ height: "340px" }}
        >
          <img
            src={block.image!.url}
            alt={block.image?.caption ?? ""}
            className="w-full h-full object-cover"
          />
        </div>
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

  // index chẵn = giữ nguyên thứ tự, index lẻ = đảo ngược
  const ordered = isEven ? elements : [...elements].reverse();

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:px-20">
      <div className="flex flex-col gap-10 md:flex-row md:items-center">
        {ordered}
      </div>
    </section>
  );
}

// ── Page component ────────────────────────────────────────────────
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
      {/* ── Header ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-8 md:px-20 border-b border-border">
        {project.category && project.category.length > 0 && (
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-foreground/40">
            {project.category.join(" · ")}
          </p>
        )}
        <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl font-palatino text-center">
          {project.title}
        </h1>
        <div className="flex flex-wrap gap-8 text-sm text-foreground/50">
          {project.year && (
            <div className="flex gap-3 items-center">
              <span className="block font-semibold text-foreground/80 mb-0.5">
                Year
              </span>
              {project.year}
            </div>
          )}
          {project.software && project.software.length > 0 && (
            <div className="flex gap-3 items-center">
              <span className="block font-semibold text-foreground/80 mb-0.5">
                Software
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {project.software.map((sw) => (
                  <span
                    key={sw}
                    className="px-2.5 py-0.5 rounded-full text-xs border border-border text-foreground/60"
                  >
                    {sw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Hero Image ───────────────────────────────────────────── */}
      {project.heroImage && (
        <section className="max-w-7xl mx-auto px-6 py-10 md:px-20">
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{ height: "clamp(360px, 55vw, 680px)" }}
          >
            <img
              src={project.heroImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      )}

      {/* ── Content Blocks ───────────────────────────────────────── */}
      {project.contentBlocks && project.contentBlocks.length > 0 && (
        <div className="divide-y divide-border/40">
          {project.contentBlocks.map((block, index) => (
            <RenderBlock key={index} block={block} index={index} />
          ))}
        </div>
      )}
    </main>
  );
}

export async function generateStaticParams() {
  const ids = await client.fetch<{ id: string }[]>(
    `*[_type == "project"]{ "id": _id }`,
  );
  return ids.map((s) => ({ id: s.id }));
}
