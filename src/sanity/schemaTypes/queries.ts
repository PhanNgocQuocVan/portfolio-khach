// lib/sanity/queries.ts

// ── Danh sách (dùng cho ProjectsSection) ──────────────────────────
export const PROJECTS_LIST_QUERY = `
  *[_type == "project"] | order(year desc) {
    _id,
    title,
    year,
    description,
    "thumbnail": thumbnail.asset->url,
    software,
    category
  }
`;

// ── Chi tiết 1 project (dùng cho trang detail) ────────────────────
export const PROJECT_DETAIL_QUERY = `
  *[_type == "project" && _id == $id][0] {
    _id,
    title,
    year,
    description,
    "heroImage": heroImage.asset->url,
    software,
    category,
    contentBlocks[] {
      text,
      "image": {
        "url": image.asset->url,
        "caption": image.caption
      }
    }
  }
`;

// ── TypeScript types ──────────────────────────────────────────────

export interface ProjectCardData {
  _id: string;
  title: string;
  year?: string;
  description?: string;
  thumbnail?: string;
  software?: string[];
  category?: string[];
}

export interface ContentBlock {
  text?: any[]; // Portable Text
  image?: {
    url: string;
    caption?: string;
  };
}

export interface ProjectDetailData extends ProjectCardData {
  heroImage?: string;
  contentBlocks?: ContentBlock[];
}
