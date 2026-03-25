// lib/sanity/queries.ts

// ── PROJECTS ──────────────────────────────────────────────────────

export const PROJECTS_LIST_QUERY = `
  *[_type == "project"] | order(year desc) {
    _id,
    title,
    year,
    description,
    "thumbnail": thumbnail.asset->url,
    "previewVideo": previewVideo.asset->url,
    software,
    category
  }
`;

export const PROJECT_DETAIL_QUERY = `
  *[_type == "project" && _id == $id][0] {
    _id, title, year, description,
    "heroImage": heroImage.asset->url,
    software, category,
    contentBlocks[] {
      text,
      "image": {
        "url": image.asset->url,
        "caption": image.caption
      },
      videoUrl,
      "videoThumbnail": videoThumbnail.asset->url
    }
  }
`;

export interface ProjectCardData {
  _id: string;
  title: string;
  year?: string;
  description?: string;
  thumbnail?: string;
  previewVideo?: string;
  software?: string[];
  category?: string[];
}

export interface ContentBlock {
  text?: any[];
  image?: {
    url: string;
    caption?: string;
  };
  videoUrl?: string;
  videoThumbnail?: string;
}

export interface ProjectDetailData {
  _id: string;
  title: string;
  year?: string;
  description?: string;
  heroImage?: string;
  software?: string[];
  category?: string[];
  contentBlocks?: ContentBlock[];
}

// ── EXPERIENCE ────────────────────────────────────────────────────

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

// ── EDUCATION ─────────────────────────────────────────────────────

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
