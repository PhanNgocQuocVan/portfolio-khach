# Tài liệu tính năng Project — Portfolio Tu Anh

> **Mục đích:** Mô tả chi tiết toàn bộ luồng logic, schema, thuật toán render, và UI của tính năng **Project** — từ Sanity Studio (CMS) đến frontend (Next.js). Dành cho AI hoặc developer khác nghiên cứu.

---

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Danh sách file liên quan](#2-danh-sách-file-liên-quan)
3. [Sanity Schema — Project](#3-sanity-schema--project)
4. [Sanity Schema — ContentBlock](#4-sanity-schema--contentblock)
5. [Sanity Studio Structure](#5-sanity-studio-structure)
6. [GROQ Queries & TypeScript Interfaces](#6-groq-queries--typescript-interfaces)
7. [Trang chủ — ProjectsSection (danh sách project)](#7-trang-chủ--projectssection-danh-sách-project)
8. [ProjectCard — Component hiển thị card](#8-projectcard--component-hiển-thị-card)
9. [Project Detail Page — Thuật toán render](#9-project-detail-page--thuật-toán-render)
10. [Các component phụ trợ](#10-các-component-phụ-trợ)
11. [Luồng người dùng trên Studio](#11-luồng-người-dùng-trên-studio)
12. [Các lỗi đã fix & lưu ý](#12-các-lỗi-đã-fix--lưu-ý)

---

## 1. Tổng quan kiến trúc

```
┌──────────────────────────────────────────────────────┐
│                   SANITY STUDIO (CMS)                │
│                                                      │
│  ┌─────────────┐     ┌───────────────────────────┐   │
│  │   project    │────►│      contentBlock (array) │   │
│  │  (document)  │     │         (object)          │   │
│  └─────────────┘     └───────────────────────────┘   │
└──────────────┬───────────────────────────────────────┘
               │ GROQ Query (fetch via API)
               ▼
┌──────────────────────────────────────────────────────┐
│                  NEXT.JS FRONTEND                    │
│                                                      │
│  ┌──────────────────┐    ┌────────────────────────┐  │
│  │  ProjectsSection │    │  ProjectDetailPage     │  │
│  │  (trang chủ)     │    │  /projects/[id]        │  │
│  │                  │    │                        │  │
│  │  ┌────────────┐  │    │  Hero → Title/Meta     │  │
│  │  │ProjectCard │  │    │  → RenderBlock (loop)  │  │
│  │  │ (mỗi card) │  │    │  → Footer              │  │
│  │  └────────────┘  │    └────────────────────────┘  │
│  └──────────────────┘                                │
└──────────────────────────────────────────────────────┘
```

**Tech stack:**
- **CMS:** Sanity v3 (hosted)
- **Frontend:** Next.js (App Router, Server Components)
- **Styling:** Tailwind CSS
- **Rich Text:** `@portabletext/react`
- **Animation:** Framer Motion (`motion/react`)

---

## 2. Danh sách file liên quan

### Sanity (Backend/CMS)

| File | Vai trò |
|------|---------|
| `src/sanity/schemas/project.ts` | Schema document "project" — định nghĩa fields cho card + detail |
| `src/sanity/schemas/contentBlock.ts` | Schema object "contentBlock" — block nội dung linh hoạt |
| `src/sanity/schemaTypes/index.ts` | Đăng ký tất cả schema vào Sanity |
| `src/sanity/schemaTypes/queries.ts` | GROQ queries + TypeScript interfaces |
| `src/sanity/structure.ts` | Cấu trúc menu Sanity Studio |
| `src/sanity/lib/client.ts` | Khởi tạo Sanity client |
| `src/sanity/lib/image.ts` | Utility tạo URL ảnh từ Sanity |
| `src/sanity/env.ts` | Biến môi trường Sanity |

### Frontend (Rendering)

| File | Vai trò |
|------|---------|
| `src/app/projects/[id]/page.tsx` | **Trang chi tiết project** — Server Component, render content blocks |
| `src/app/projects/[id]/not-found.tsx` | Trang 404 khi project không tồn tại |
| `src/app/(home)/component/ProjectsSection.tsx` | Section hiển thị grid card trên trang chủ + filter |
| `src/components/ui/ProjectCard.tsx` | Component card project (thumbnail, video hover, tags) |
| `src/components/ui/StackGallery.tsx` | Gallery ảnh dạng "stack cards" xoay |
| `src/components/ui/hero-video-dialog.tsx` | Modal phát video YouTube |
| `src/components/layout/back-button.tsx` | Nút quay lại |
| `src/lib/youtube.ts` | Utility chuyển đổi URL YouTube sang embed |
| `src/types/project.ts` | Interface cũ (không còn sử dụng chính) |

---

## 3. Sanity Schema — Project

**File:** `src/sanity/schemas/project.ts`

Schema document `project` được chia làm **2 group** trong Studio:

### Group 1: 📋 Thông tin card (`info`)

Các field hiển thị trên **ProjectCard** ở trang chủ:

| Field | Type | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `title` | `string` | ✅ | Tên project |
| `year` | `string` | ❌ | Năm thực hiện (hiện trên card & detail) |
| `description` | `text` (2 rows) | ❌ | Mô tả ngắn, hiện trên card (tối đa 2 dòng) |
| `thumbnail` | `image` (hotspot) | ❌ | Ảnh thumbnail hiện trên card |
| `previewVideo` | `file` (mp4/webm) | ❌ | Video ngắn auto-play khi hover card (desktop only) |
| `software` | `array of string` | ❌ | Phần mềm sử dụng — dùng để filter |
| `category` | `array of string` | ❌ | Danh mục — dùng để filter |

**Software options (grid layout):**
```
Adobe CC, AutoCAD, SketchUp, 3DsMax, Vray, TwinMotion, Rhino, Archicad, Revit
```

**Category options (list layout):**
```
Retail, Set Design, Hospitality, Objects
```

### Group 2: 📄 Trang chi tiết (`detail`)

| Field | Type | Mô tả |
|-------|------|-------|
| `heroImage` | `image` (hotspot) | Ảnh hero lớn đầu trang detail |
| `contentBlocks` | `array of contentBlock` | Mảng các block nội dung linh hoạt |

### Preview config

Trên Studio, mỗi project hiển thị:
- **Title:** `title`
- **Subtitle:** `year`
- **Media:** `thumbnail`

---

## 4. Sanity Schema — ContentBlock

**File:** `src/sanity/schemas/contentBlock.ts`

Đây là **trái tim** của trang chi tiết. Mỗi contentBlock là một **object** có thể chứa bất kỳ tổ hợp nội dung nào.

### Tất cả fields

| Field | Type | Mô tả | Điều kiện ẩn |
|-------|------|-------|-------------|
| `heading` | `string` | Tiêu đề lớn | Không bao giờ ẩn |
| `headingAlign` | `string` (radio: left/center/right) | Căn heading | Ẩn khi không có heading |
| `text` | `array of block` (Portable Text) | Nội dung văn bản rich text | Ẩn khi có threeImages |
| `textAlign` | `string` (radio: left/center/right) | Căn text | Ẩn khi không có text hoặc có threeImages |
| `image` | `image` + caption | Hình ảnh đơn | Ẩn khi có threeImages |
| `images` | `array of image` + caption | Gallery nhiều ảnh | Ẩn khi có threeImages |
| `videoUrl` | `url` | URL YouTube | Ẩn khi có threeImages |
| `videoThumbnail` | `image` | Thumbnail cho video | Ẩn khi không có videoUrl hoặc có threeImages |
| `threeImages` | `array of image` (đúng 3) | 3 ảnh ngang hàng full width | Ẩn khi đã có text/image/images/videoUrl |
| `swapSides` | `boolean` | Đổi thứ tự trái/phải | Ẩn khi threeImages hoặc ít hơn 2 loại content |

### Portable Text config (cho field `text`)

```
Styles:   Normal, H2, H3, Blockquote
Marks:    Bold (strong), Italic (em)
```

### Logic ẩn/hiện fields (quan trọng!)

ContentBlock được thiết kế theo nguyên tắc **"threeImages là mode đặc biệt"**:

```
NẾU có threeImages (đúng 3 ảnh):
  → ẨN: text, textAlign, image, images, videoUrl, videoThumbnail
  → CHỈ HIỆN: heading, headingAlign, threeImages

NẾU có bất kỳ text/image/images/videoUrl:
  → ẨN: threeImages

swapSides CHỈ HIỆN KHI:
  → Không có threeImages
  → VÀ có ít nhất 2 loại content (vd: text + image, text + video,...)
```

### Preview config

Mỗi contentBlock hiện preview trên Studio dạng:
```
📌 "Heading text" + 📝 Text + 🖼 Hình + 🖼×5 Gallery + 🎬 Video + 🖼×3 Row
```
Nếu block trống: `"Block trống"`

### Validation

- `threeImages`: Custom validation — nếu có ảnh thì phải đúng 3 ảnh, nếu không sẽ báo lỗi "Phải thêm đúng 3 ảnh"

---

## 5. Sanity Studio Structure

**File:** `src/sanity/structure.ts`

Menu Studio được tổ chức:
```
📄 Quản lý CV (singleton)
──────────────────────
🗂️ Quản lý Projects → danh sách projects (sắp xếp theo year DESC)
──────────────────────
💼 Quản lý Experience
──────────────────────
🎓 Quản lý Education & Certification
──────────────────────
(các document type khác tự động)
```

Khi click "Quản lý Projects":
1. Hiện danh sách tất cả project, sắp xếp theo `year` giảm dần
2. Click vào 1 project → mở form edit với 2 tab: **📋 Thông tin card** và **📄 Trang chi tiết**

---

## 6. GROQ Queries & TypeScript Interfaces

**File:** `src/sanity/schemaTypes/queries.ts`

### Query 1: PROJECTS_LIST_QUERY (trang chủ)

```groq
*[_type == "project"] | order(year desc) {
  _id, title, year, description,
  "thumbnail": thumbnail.asset->url,
  "previewVideo": previewVideo.asset->url,
  software, category
}
```

**Trả về:** Array các `ProjectCardData`

```typescript
interface ProjectCardData {
  _id: string;
  title: string;
  year?: string;
  description?: string;
  thumbnail?: string;      // URL ảnh
  previewVideo?: string;    // URL video file
  software?: string[];
  category?: string[];
}
```

### Query 2: PROJECT_DETAIL_QUERY (trang chi tiết)

```groq
*[_type == "project" && _id == $id][0] {
  _id, title, year, description,
  "heroImage": heroImage.asset->url,
  software, category,
  contentBlocks[] {
    heading, headingAlign, swapSides,
    text, textAlign,
    "image": { "url": image.asset->url, "caption": image.caption },
    "images": images[]{ "url": asset->url, "caption": caption },
    "threeImages": threeImages[]{ "url": asset->url, "caption": caption },
    videoUrl,
    "videoThumbnail": videoThumbnail.asset->url
  }
}
```

**Trả về:** 1 object `ProjectDetailData`

```typescript
interface ContentBlock {
  heading?: string;
  headingAlign?: "left" | "center" | "right";
  text?: any[];                          // Portable Text blocks
  textAlign?: "left" | "center" | "right";
  image?: { url: string; caption?: string };
  images?: { url: string; caption?: string }[];
  threeImages?: { url: string; caption?: string }[];
  videoUrl?: string;
  videoThumbnail?: string;
  swapSides?: boolean;
}

interface ProjectDetailData {
  _id: string;
  title: string;
  year?: string;
  description?: string;
  heroImage?: string;
  software?: string[];
  category?: string[];
  contentBlocks?: ContentBlock[];
}
```

---

## 7. Trang chủ — ProjectsSection (danh sách project)

**File:** `src/app/(home)/component/ProjectsSection.tsx`

### Luồng hoạt động

```
1. Component mount → fetch PROJECTS_LIST_QUERY từ Sanity
2. Hiển thị skeleton loading (6 cards giả)
3. Data về → hiển thị grid ProjectCard
4. User có thể filter theo Category + Software
5. "Read more" button load thêm 6 cards
```

### Hệ thống Filter

**Desktop:** Dock component (thanh dock giống macOS) với icon category + icon software

**Mobile:** 2 dropdown buttons (Software / Category) + active chips

#### Thuật toán filter

```typescript
// Logic: AND giữa 2 nhóm, AND trong mỗi nhóm
filteredProjects = allProjects.filter(project => {
  // Project phải chứa TẤT CẢ category đang chọn
  const matchCategory = selectedCategories.length === 0
    || selectedCategories.every(c => project.category?.includes(c));
  
  // Project phải chứa TẤT CẢ software đang chọn  
  const matchSoftware = selectedSoftware.length === 0
    || selectedSoftware.every(s => project.software?.includes(s));
  
  return matchCategory && matchSoftware;
});
```

**Ví dụ:** Chọn `Retail` + `SketchUp` → chỉ hiện project có **cả** category Retail **và** software SketchUp.

#### Toggle logic

```
Click vào filter đã chọn → bỏ chọn (remove khỏi array)
Click vào filter chưa chọn → thêm vào (push vào array)
```

#### Pagination

```
- Mặc định hiện 6 cards (visibleCount = 6)
- Click "Read more" → visibleCount += 6
- Khi thay đổi filter → reset visibleCount = 6
```

### Filter UI Constants

```typescript
const SOFTWARE_LIST = [
  { name: "Adobe CC", icon: "/images/sw/AdobeCCLogo-800x418.jpg" },
  { name: "AutoCAD", icon: "/images/sw/cad.png" },
  { name: "SketchUp", icon: "/images/sw/Sketchup.jpg" },
  { name: "3DsMax", icon: "/images/sw/3DsMax.png" },
  { name: "Vray", icon: "/images/sw/Vray.png" },
  { name: "TwinMotion", icon: "/images/sw/TwinMotion.png" },
  { name: "Rhino", icon: "/images/sw/Rhinoceros 3D.png" },
  { name: "Archicad", icon: "/images/sw/Archicad.jpg" },
  { name: "Revit", icon: "/images/sw/Revit.png" },
];

const CATEGORY_LIST = [
  { value: "retail", label: "Retail", icon: Store },
  { value: "set-design", label: "Set Design", icon: Clapperboard },
  { value: "hospitality", label: "Hospitality", icon: UtensilsCrossed },
  { value: "objects", label: "Objects", icon: Sofa },
];
```

---

## 8. ProjectCard — Component hiển thị card

**File:** `src/components/ui/ProjectCard.tsx`

### Cấu trúc visual

```
┌─────────────────────────────────┐
│      THUMBNAIL / VIDEO          │  aspect-ratio: 4/3
│                                 │  rounded-xl
│  [Software tags - hover]  [→]  │
└─────────────────────────────────┘
  Software tags (static, ẩn khi hover)
  Title (text-sm, semibold)
  Description (text-xs, max 2 dòng)
```

### Logic video hover (desktop only)

```typescript
// 1. Detect touch device
const isTouch = window.matchMedia("(hover: none)").matches;

// 2. Chỉ render video nếu: có URL video VÀ không phải touch device
const showVideo = hasVideo && !isTouch;

// 3. Mouse enter → play video từ đầu
handleMouseEnter: videoRef.currentTime = 0; videoRef.play();

// 4. Mouse leave → pause, reset về đầu
handleMouseLeave: videoRef.pause(); videoRef.currentTime = 0;
```

**UI khi hover (desktop):**
- Thumbnail fade out (opacity-0) + nhẹ scale lên
- Video fade in (opacity-100)
- Gradient overlay xuất hiện
- Software tags trượt lên từ dưới (overlay)
- Arrow button xuất hiện góc phải trên

**UI khi hover (mobile/touch):**
- Chỉ scale thumbnail nhẹ (1.06)
- Không có video

### Navigation

Click card → navigate đến `/projects/{project._id}`

---

## 9. Project Detail Page — Thuật toán render

**File:** `src/app/projects/[id]/page.tsx`

Đây là **Server Component** (async function). Quan trọng nhất.

### Luồng tổng quát

```
1. Lấy `id` từ URL params
2. Fetch project data từ Sanity (revalidate 60s)
3. Nếu không tìm thấy → notFound() (hiện 404)
4. Render page:
   a. Hero section (ảnh lớn + gradient + nút Back)
   b. Title + Meta (category, title, year, software)
   c. Content Blocks (loop qua contentBlocks[])
   d. Footer
```

### Cấu trúc trang

```
┌─────────────────────────────────────────┐
│ [← Back]                                │
│              HERO IMAGE                  │  height: clamp(260px, 50vw, 680px)
│         (full width, object-cover)       │  gradient overlay
└─────────────────────────────────────────┘
│ CATEGORY · CATEGORY                      │  text-[11px] uppercase
│                                          │
│ PROJECT TITLE          Year: 2024        │  clamp(2.4rem, 6vw, 5rem)
│                        Software: [tags]  │
├──────────────────────────────────────────┤ border-b
│                                          │
│         CONTENT BLOCK 1                  │  ← RenderBlock
│                                          │
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤ divide-border/40
│                                          │
│         CONTENT BLOCK 2                  │  ← RenderBlock
│                                          │
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤
│         ...                              │
└──────────────────────────────────────────┘
│              FOOTER                      │
└──────────────────────────────────────────┘
```

### ⭐ Thuật toán RenderBlock — Logic phân nhánh

Đây là **thuật toán cốt lõi**, quyết định layout dựa trên nội dung block:

```
INPUT: ContentBlock { heading, text, image, images, threeImages, video, ... }

STEP 1: Xác định có gì
  hasHeading    = !!block.heading
  hasText       = block.text && block.text.length > 0
  hasImage      = !!block.image?.url
  hasImages     = block.images && block.images.length > 0
  hasVideo      = !!block.videoUrl
  hasThreeImages = block.threeImages && block.threeImages.length === 3

STEP 2: Đọc alignment
  align     = block.headingAlign ?? "center"    // heading alignment
  textAlign = block.textAlign ?? "left"         // text alignment

STEP 3: PHÂN NHÁNH LAYOUT
```

#### Nhánh 1: hasThreeImages = true → Layout "3 ảnh ngang hàng"

```
┌──────────────────────────────────────────────┐
│         HEADING (optional, aligned)           │
│                                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐  │
│  │   Ảnh 1   │ │   Ảnh 2   │ │   Ảnh 3   │  │
│  │           │ │           │ │           │  │
│  │ [caption] │ │ [caption] │ │ [caption] │  │
│  └───────────┘ └───────────┘ └───────────┘  │
│  grid-cols-3 (md), grid-cols-1 (mobile)      │
└──────────────────────────────────────────────┘
```
- Caption hiện trong gradient overlay ở bottom ảnh
- Hover: ảnh scale nhẹ (1.03)

#### Nhánh 2: contentCount === 0 && hasHeading → Layout "Heading đơn"

```
contentCount = [hasText, hasImages || hasImage, hasVideo]
               .filter(Boolean).length
```

```
┌──────────────────────────────────────────────┐
│                                              │
│            HEADING (aligned)                  │
│     text-4xl → sm:5xl → md:7xl               │
│     font-palatino, bold                       │
│                                              │
└──────────────────────────────────────────────┘
```

#### Nhánh 3: contentCount <= 1 → Layout "Full width"

Khi chỉ có 1 loại content (text HOẶC image HOẶC gallery HOẶC video):

```
┌──────────────────────────────────────────────┐
│         HEADING (optional, aligned)           │
│                                              │
│  ┌─────────────────────────────────────────┐ │
│  │     TEXT (max-w-3xl, aligned)            │ │
│  │     hoặc GALLERY (StackGallery)         │ │
│  │     hoặc IMAGE (full width)             │ │
│  │     hoặc VIDEO (HeroVideoDialog)        │ │
│  └─────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

**Text alignment trong layout full width:**

```typescript
const textAlignClass = {
  left:   "text-left mr-auto",   // div nằm bên trái
  center: "text-center mx-auto", // div nằm chính giữa
  right:  "text-right ml-auto",  // div nằm bên phải
};
// Áp dụng cho div max-w-3xl
// → text-left/center/right: căn nội dung text bên trong
// → mr-auto/mx-auto/ml-auto: đẩy div container đến vị trí đúng
```

**Thứ tự ưu tiên render (chỉ render 1):**
1. Text (nếu có)
2. Gallery/images (nếu có, render StackGallery)
3. Image đơn (nếu không có gallery)
4. Video (nếu có)

#### Nhánh 4: contentCount >= 2 → Layout "2 cột"

Khi có 2-3 loại content:

```
┌──────────────────────────────────────────────┐
│         HEADING (optional, aligned)           │
│                                              │
│  ┌────────────────┐  ┌────────────────────┐  │
│  │                │  │                    │  │
│  │  CONTENT A     │  │   CONTENT B        │  │
│  │  (md:w-1/2)   │  │   (md:w-1/2)      │  │
│  │                │  │                    │  │
│  └────────────────┘  └────────────────────┘  │
│  flex-row (md), flex-col (mobile)             │
└──────────────────────────────────────────────┘
```

**Thứ tự mặc định của elements:**
1. Text (nếu có)
2. Gallery/Images (nếu có)
3. Image đơn (nếu không có gallery)
4. Video (nếu có)

**swapSides logic:**
```typescript
// Mặc định: [text, image] → text trái, image phải
// swapSides = true: [image, text] → image trái, text phải
const ordered = block.swapSides ? [...elements].reverse() : elements;
```

**Text alignment trong layout 2 cột cũng hoạt động:**
```typescript
// div text có class: `md:w-1/2 flex flex-col justify-center ${textAlignClass[textAlign]}`
```

### Sơ đồ quyết định layout (Decision Tree)

```
                    ┌─ hasThreeImages? ─┐
                    │                   │
                   YES                  NO
                    │                   │
            [3 ảnh ngang hàng]    ┌─ contentCount? ─┐
                                  │                  │
                                  0                 1              >=2
                                  │                  │              │
                           ┌─ hasHeading? ─┐   [Full width]   [2 cột]
                           │               │                   │
                          YES              NO            ┌─ swapSides? ─┐
                           │               │             │              │
                    [Heading đơn]    [Không render      NO             YES
                                      gì cả]           │              │
                                                  [Thứ tự      [Đảo ngược
                                                   mặc định]    thứ tự]
```

### Portable Text Rendering

```typescript
const ptComponents = {
  block: {
    normal:     → <p>  text-base, text-foreground/70
    h2:         → <h2> text-2xl, font-bold
    h3:         → <h3> text-xl, font-semibold
    blockquote: → <blockquote> border-l-2, italic
  },
  marks: {
    strong: → <strong> font-semibold
    em:     → <em> italic
  }
};
```

### Static Generation

```typescript
// Tại build time, tạo sẵn trang cho tất cả project
export async function generateStaticParams() {
  const ids = await client.fetch(`*[_type == "project"]{ "id": _id }`);
  return ids.map(s => ({ id: s.id }));
}
```

**Revalidation:** `{ next: { revalidate: 60 } }` → cập nhật mỗi 60 giây

---

## 10. Các component phụ trợ

### StackGallery

**File:** `src/components/ui/StackGallery.tsx`

Component gallery hiển thị ảnh dạng **"stack cards"** — nhiều ảnh xếp chồng lên nhau, user kéo/click để xem ảnh tiếp theo.

```typescript
// Props cho Stack component bên trong
{
  sendToBackOnClick: true,   // click ảnh trên cùng → đẩy xuống dưới
  autoplayDelay: 3000,       // tự chuyển ảnh mỗi 3 giây
  pauseOnHover: true,        // dừng autoplay khi hover
  mobileClickOnly: true,     // mobile chỉ click, không drag
  randomRotation: true,      // ảnh xoay ngẫu nhiên
  sensitivity: 150,          // độ nhạy drag
}
```

Container cao cố định: `height: 340px`

### HeroVideoDialog

**File:** `src/components/ui/hero-video-dialog.tsx`

Modal phát video YouTube với hiệu ứng animation:

```
1. Hiện thumbnail + nút Play (icon lớn, gradient)
2. Click → mở modal fullscreen (backdrop blur)
3. YouTube iframe load trong modal
4. Click backdrop / nút X / Escape → đóng modal
5. Scroll body bị lock khi modal mở (fixed position trick)
```

**Animation styles:** from-bottom, from-center, from-top, from-left, from-right, fade, top-in-bottom-out, left-in-right-out

Hiện tại sử dụng: `from-center`

### YouTube URL Utility

**File:** `src/lib/youtube.ts`

```typescript
// Chuyển đổi các dạng URL YouTube sang embed URL
toYouTubeEmbed(url):
  - Đã là /embed/ → giữ nguyên
  - youtu.be/VIDEO_ID → https://www.youtube.com/embed/VIDEO_ID
  - /shorts/VIDEO_ID → https://www.youtube.com/embed/VIDEO_ID
  - ?v=VIDEO_ID → https://www.youtube.com/embed/VIDEO_ID
  - Không match → trả lại URL gốc
```

### BackButton

**File:** `src/components/layout/back-button.tsx`

```
- Client component (dùng useRouter)
- Click → router.back()
- UI: nút tròn trắng/blur, có icon chevron + text "Back"
- Hover: nền trắng hơn, shadow lớn hơn, chevron dịch trái nhẹ
```

---

## 11. Luồng người dùng trên Studio

### Tạo project mới

```
1. Mở Sanity Studio
2. Click "🗂️ Quản lý Projects"
3. Click nút "+" (tạo mới)
4. Tab "📋 Thông tin card":
   a. Nhập "Tên project" (bắt buộc)
   b. Nhập "Năm thực hiện"
   c. Nhập "Mô tả ngắn" (hiện trên card, tối đa 2 dòng)
   d. Upload "Ảnh thumbnail" (cho card)
   e. Upload "Video preview" (MP4/WebM, tự play khi hover card trên desktop)
   f. Chọn "Phần mềm sử dụng" (grid checkbox)
   g. Chọn "Category" (list checkbox)
5. Tab "📄 Trang chi tiết":
   a. Upload "Hero Image" (ảnh lớn đầu trang)
   b. Thêm "Các block nội dung" (xem chi tiết bên dưới)
6. Click "Publish"
```

### Thêm content block (trang chi tiết)

Mỗi block là một "mảnh ghép" linh hoạt. User có thể tạo nhiều block, mỗi block có thể chứa:

#### Cách 1: Chỉ heading

```
1. Thêm block mới
2. Nhập "Heading" → Chọn căn lề (trái/giữa/phải)
3. Không điền gì thêm → block hiện heading lớn đơn lẻ
```

#### Cách 2: Text đơn

```
1. Thêm block mới
2. (Tùy chọn) Nhập heading
3. Nhập text trong editor rich text
   - Có thể dùng: Normal, H2, H3, Blockquote
   - Có thể dùng: Bold, Italic
4. Chọn "Căn text": trái / giữa / phải
   → Trái: text nằm bên trái trang, chữ căn trái
   → Giữa: text nằm giữa trang, chữ căn giữa
   → Phải: text nằm bên phải trang, chữ căn phải
5. → Hiện full width (text có max-width 768px)
```

#### Cách 3: Ảnh đơn

```
1. Thêm block mới
2. Upload 1 ảnh vào "Hình ảnh đơn"
3. (Tùy chọn) Nhập caption
4. → Hiện full width, rounded, caption ở dưới
```

#### Cách 4: Gallery (nhiều ảnh)

```
1. Thêm block mới
2. Thêm nhiều ảnh vào "Gallery"
3. (Tùy chọn) Caption cho từng ảnh
4. → Hiện dạng StackGallery (cards xoay, kéo/click)
```

#### Cách 5: Video YouTube

```
1. Thêm block mới
2. Nhập URL YouTube (bất kỳ dạng nào)
3. (Tùy chọn) Upload thumbnail
4. → Hiện thumbnail lớn + nút Play, click → modal video
```

#### Cách 6: Text + Ảnh (2 cột)

```
1. Thêm block mới
2. Nhập text VÀ upload ảnh (hoặc gallery)
3. → Tự động thành layout 2 cột (desktop)
   Mặc định: text trái | ảnh phải
4. Bật "↔ Đổi trái / phải" → ảnh trái | text phải
5. Chọn "Căn text" → căn nội dung text
```

#### Cách 7: 3 ảnh ngang hàng

```
1. Thêm block mới
2. KHÔNG điền text, image, gallery, video
3. Thêm đúng 3 ảnh vào "3 ảnh ngang hàng"
4. (Tùy chọn) Caption cho từng ảnh (hiện overlay gradient)
5. → Hiện 3 ảnh ngang hàng full width, responsive (1 cột mobile, 3 desktop)
```

### Sửa project

```
1. Mở "🗂️ Quản lý Projects"
2. Click vào project cần sửa
3. Sửa bất kỳ field nào
4. Kéo thả để sắp xếp lại thứ tự content blocks
5. Click "Publish" → frontend tự cập nhật trong 60 giây
```

### Xóa project

```
1. Mở "🗂️ Quản lý Projects"
2. Click vào project cần xóa
3. Click menu "..." → "Delete"
4. Xác nhận → project biến mất khỏi danh sách
```

---

## 12. Các lỗi đã fix & lưu ý

### Bug 1: Text căn phải nhưng không nằm bên phải (layout full width)

**Nguyên nhân:** Div chứa text có `max-w-3xl` (~768px) nhỏ hơn container, nhưng chỉ có `text-right` (căn chữ bên trong div) mà không có `ml-auto` (đẩy div sang phải).

**Fix:** Thêm margin-auto vào `textAlignClass`:
```typescript
const textAlignClass = {
  left:   "text-left mr-auto",    // div + text căn trái
  center: "text-center mx-auto",  // div + text căn giữa  
  right:  "text-right ml-auto",   // div + text căn phải
};
```

### Bug 2: Text căn phải không hoạt động trong layout 2 cột

**Nguyên nhân:** Trong layout 2-3 content (line 196), div text có class cố định `"md:w-1/2 flex flex-col justify-center"` mà không áp dụng `textAlignClass`.

**Fix:** Thêm `textAlignClass[textAlign]` vào class name:
```tsx
<div className={`md:w-1/2 flex flex-col justify-center ${textAlignClass[textAlign]}`}>
```

### Lưu ý quan trọng cho developer

1. **threeImages là mode "exclusive"**: Khi có 3 ảnh ngang hàng, tất cả field khác bị ẩn trên Studio. Logic render cũng check threeImages TRƯỚC tiên.

2. **images vs image**: `images` (gallery) được ưu tiên hơn `image` (đơn). Nếu có cả 2, chỉ images được render.

3. **swapSides chỉ hoạt động khi >= 2 content**: Toggle này ẩn trên Studio khi chỉ có 1 loại content.

4. **Revalidation 60s**: Sau khi publish trên Studio, frontend cần tối đa 60 giây để cập nhật.

5. **previewVideo chỉ hoạt động desktop**: Touch device (mobile) không có hover nên video bị bỏ qua.

6. **YouTube URL tự động convert**: User có thể dán bất kỳ dạng URL YouTube nào, utility sẽ tự chuyển thành embed URL.

7. **generateStaticParams**: Trang chi tiết được pre-render tại build time cho tất cả project, cải thiện SEO và performance.

8. **Filter logic dùng AND**: Chọn nhiều filter → project phải match TẤT CẢ filter đã chọn, không phải chỉ 1.

---

## Sơ đồ tổng quan Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      SANITY STUDIO                          │
│                                                             │
│   User tạo/sửa Project                                      │
│     ├─ Tab "Thông tin card"                                  │
│     │    └─ title, year, description, thumbnail,             │
│     │       previewVideo, software[], category[]             │
│     └─ Tab "Trang chi tiết"                                  │
│          └─ heroImage                                        │
│          └─ contentBlocks[] ← mỗi block:                     │
│               ├─ heading + headingAlign                       │
│               ├─ text (Portable Text) + textAlign             │
│               ├─ image + caption                              │
│               ├─ images[] + caption (gallery)                 │
│               ├─ threeImages[] + caption                      │
│               ├─ videoUrl + videoThumbnail                    │
│               └─ swapSides                                    │
│                                                             │
│   User click "Publish" ──────────────────┐                   │
└──────────────────────────────────────────┼───────────────────┘
                                           │
                                           ▼
                                    Sanity API (CDN)
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      │
          PROJECTS_LIST_QUERY    PROJECT_DETAIL_QUERY              │
          (trang chủ)            (trang chi tiết)                 │
                    │                      │                      │
                    ▼                      ▼                      │
          ProjectsSection         ProjectDetailPage               │
          ├─ Filter (Dock/Dropdown)  ├─ Hero Image                │
          ├─ Grid ProjectCards       ├─ Title + Meta              │
          └─ Pagination              ├─ RenderBlock (loop)        │
                                     │   ├─ 3-ảnh-ngang-hàng     │
                                     │   ├─ Heading đơn           │
                                     │   ├─ Full-width content    │
                                     │   └─ 2-cột layout          │
                                     └─ Footer                    │
                                                                  │
                                    revalidate: 60s ──────────────┘
```
