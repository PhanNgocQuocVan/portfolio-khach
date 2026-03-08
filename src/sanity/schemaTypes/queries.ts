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

export const EXPERIENCES_QUERY = `
  *[_type == "experience"] | order(date desc) {
    _id,
    title,
    date,
    version,
    tags,
    description,
    "image": image.asset->url
  }
`;

export interface ExperienceData {
  _id: string;
  title: string;
  date: string;
  version?: string;
  tags?: string[];
  description?: string;
  image?: string;
}

// Thêm vào file lib/sanity/queries.ts

export const EDUCATION_QUERY = `
  *[_type == "education"] | order(order asc, year desc) {
    _id,
    title,
    label,
    issuer,
    year,
    description,
    type,
    "image": image.asset->url
  }
`;

export interface EducationData {
  _id: string;
  title: string;
  label?: string;
  issuer?: string;
  year?: string;
  description?: string;
  type?: "degree" | "certificate";
  image?: string;
}
