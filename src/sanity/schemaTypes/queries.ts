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
      heading,
      headingAlign,
      swapSides,
      slots[] {
        _type,

        // textSlot
        content,
        align,

        // imageSlot
        "image": {
          "url": image.asset->url,
          "caption": caption
        },

        // gallerySlot
        "images": images[]{
          "url": asset->url,
          "caption": caption
        },

        // videoSlot
        url,
        "thumbnail": thumbnail.asset->url,

        // beforeAfterSlot
        "beforeImage": beforeImage.asset->url,
        "afterImage":  afterImage.asset->url,
        beforeLabel,
        afterLabel,
        variant,
      }
    }
  }
`;

// ── Slot Interfaces ───────────────────────────────────────────────

export interface TextSlot {
  _type: "textSlot";
  content?: any[]; // Portable Text blocks
  align?: "left" | "center" | "right";
}

export interface ImageSlot {
  _type: "imageSlot";
  image?: { url: string; caption?: string };
}

export interface GallerySlot {
  _type: "gallerySlot";
  images?: { url: string; caption?: string }[];
}

export interface VideoSlot {
  _type: "videoSlot";
  url?: string;
  thumbnail?: string;
}

export interface BeforeAfterSlot {
  _type: "beforeAfterSlot";
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  variant?: "slider" | "hover" | "fade";
}

export type AnySlot =
  | TextSlot
  | ImageSlot
  | GallerySlot
  | VideoSlot
  | BeforeAfterSlot;

// ── ContentBlock & Project Interfaces ─────────────────────────────

export interface ContentBlock {
  heading?: string;
  headingAlign?: "left" | "center" | "right";
  slots?: AnySlot[];
  swapSides?: boolean;
}

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
  *[_type == "experience"] | order(startDate desc) {
    _id,
    title,
    startDate,
    endDate,
    version,
    tags,
    description,
    "image": image.asset->url
  }
`;

export interface ExperienceData {
  _id: string;
  title: string;
  startDate: string;
  endDate?: string;
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
