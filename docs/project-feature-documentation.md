# Tài liệu tính năng Project — Portfolio Tu Anh

> **Mục đích:** Mô tả chi tiết toàn bộ luồng logic, schema, thuật toán render, và UI của tính năng **Project** — từ Sanity Studio (CMS) đến frontend (Next.js). Dành cho AI hoặc developer khác nghiên cứu.
>
> **Kiến trúc:** Polymorphic Slots (v2) — mỗi content block chứa mảng `slots[]` linh hoạt, mỗi slot có `_type` riêng.

---

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Danh sách file liên quan](#2-danh-sách-file-liên-quan)
3. [Sanity Schema — Project](#3-sanity-schema--project)
4. [Sanity Schema — ContentBlock (Polymorphic Slots)](#4-sanity-schema--contentblock-polymorphic-slots)
5. [Sanity Schema — 5 Slot Types](#5-sanity-schema--5-slot-types)
6. [Sanity Studio Structure & Validation](#6-sanity-studio-structure--validation)
7. [GROQ Queries & TypeScript Interfaces](#7-groq-queries--typescript-interfaces)
8. [Trang chủ — ProjectsSection (danh sách project)](#8-trang-chủ--projectssection-danh-sách-project)
9. [ProjectCard — Component hiển thị card](#9-projectcard--component-hiển-thị-card)
10. [Project Detail Page — Thuật toán render](#10-project-detail-page--thuật-toán-render)
11. [Các component phụ trợ](#11-các-component-phụ-trợ)
12. [Luồng người dùng trên Studio](#12-luồng-người-dùng-trên-studio)
13. [Lưu ý quan trọng](#13-lưu-ý-quan-trọng)

---

## 1. Tổng quan kiến trúc

```
┌──────────────────────────────────────────────────────┐
│                   SANITY STUDIO (CMS)                │
│                                                      │
│  ┌─────────────┐     ┌───────────────────────────┐   │
│  │   project    │────►│  contentBlock              │   │
│  │  (document)  │     │  └── slots[] (polymorphic) │   │
│  └─────────────┘     │       ├── textSlot          │   │
│                      │       ├── imageSlot         │   │
│                      │       ├── gallerySlot       │   │
│                      │       ├── videoSlot         │   │
│                      │       └── beforeAfterSlot   │   │
│                      └───────────────────────────┘   │
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
│  │  │ (mỗi card) │  │    │     → RenderSlot       │  │
│  │  └────────────┘  │    │  → Footer              │  │
│  └──────────────────┘    └────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

**Tech stack:**
- **CMS:** Sanity v3 (hosted)
- **Frontend:** Next.js 15 (App Router, Server Components)
- **Styling:** Tailwind CSS
- **Rich Text:** `@portabletext/react`
- **Animation:** Framer Motion (`motion/react`)

---

## 2. Danh sách file liên quan

### Sanity (Backend/CMS)

| File | Vai trò |
|------|---------|
| `src/sanity/schemas/project.ts` | Schema document "project" — fields cho card + detail |
| `src/sanity/schemas/contentBlock.ts` | Schema object "contentBlock" — heading + slots[] + swapSides + validation |
| `src/sanity/schemas/slots/textSlot.ts` | Schema object "textSlot" — Portable Text + align |
| `src/sanity/schemas/slots/imageSlot.ts` | Schema object "imageSlot" — image + caption |
| `src/sanity/schemas/slots/gallerySlot.ts` | Schema object "gallerySlot" — array of images |
| `src/sanity/schemas/slots/videoSlot.ts` | Schema object "videoSlot" — YouTube URL + thumbnail |
| `src/sanity/schemas/slots/beforeAfterSlot.ts` | Schema object "beforeAfterSlot" — exclusive comparison slot |
| `src/sanity/schemaTypes/index.ts` | Đăng ký tất cả schema (5 slot types + contentBlock + project + ...) |
| `src/sanity/schemaTypes/queries.ts` | GROQ queries + TypeScript interfaces |
| `src/sanity/structure.ts` | Cấu trúc menu Sanity Studio |
| `src/sanity/lib/client.ts` | Khởi tạo Sanity client |

### Frontend (Rendering)

| File | Vai trò |
|------|---------|
| `src/app/projects/[id]/page.tsx` | **Trang chi tiết project** — Server Component, RenderBlock + RenderSlot |
| `src/app/projects/[id]/not-found.tsx` | Trang 404 khi project không tồn tại |
| `src/app/(home)/component/ProjectsSection.tsx` | Section grid card trên trang chủ + filter |
| `src/components/ui/ProjectCard.tsx` | Card project (thumbnail, video hover, tags) |
| `src/components/ui/StackGallery.tsx` | Gallery ảnh dạng "stack cards" xoay |
| `src/components/ui/hero-video-dialog.tsx` | Modal phát video YouTube |
| `src/components/ui/image-comparison.tsx` | 6 variants: Slider, Hover, Fade, Split, Swipe, Lens |
| `src/components/ui/BeforeAfterSlotClient.tsx` | Client component wrapper cho image comparison |
| `src/components/layout/back-button.tsx` | Nút quay lại |
| `src/lib/youtube.ts` | Utility chuyển đổi URL YouTube sang embed |

---

## 3. Sanity Schema — Project

**File:** `src/sanity/schemas/project.ts`

Schema document `project` được chia làm **2 group** trong Studio:

### Group 1: 📋 Thông tin card (`info`)

| Field | Type | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `title` | `string` | ✅ | Tên project |
| `year` | `string` | ❌ | Năm thực hiện |
| `description` | `text` (2 rows) | ❌ | Mô tả ngắn (tối đa 2 dòng trên card) |
| `thumbnail` | `image` (hotspot) | ❌ | Ảnh thumbnail hiện trên card |
| `previewVideo` | `file` (mp4/webm) | ❌ | Video ngắn auto-play khi hover (desktop only) |
| `software` | `array of string` | ❌ | Phần mềm sử dụng — dùng để filter |
| `category` | `array of string` | ❌ | Danh mục — dùng để filter |

**Software options (grid):** Adobe CC, AutoCAD, SketchUp, 3DsMax, Vray, TwinMotion, Rhino, Archicad, Revit

**Category options (list):** Retail, Set Design, Hospitality, Objects

### Group 2: 📄 Trang chi tiết (`detail`)

| Field | Type | Mô tả |
|-------|------|-------|
| `heroImage` | `image` (hotspot) | Ảnh hero lớn đầu trang detail |
| `contentBlocks` | `array of contentBlock` | Mảng các block nội dung (Polymorphic Slots) |

---

## 4. Sanity Schema — ContentBlock (Polymorphic Slots)

**File:** `src/sanity/schemas/contentBlock.ts`

Mỗi contentBlock có cấu trúc:

```
ContentBlock
├── heading?          (string)  — tiêu đề lớn, tùy chọn
├── headingAlign?     (left | center | right)  — ẩn khi không có heading
├── slots[]           — MẢNG polymorphic, mỗi slot có _type riêng
│    ├── textSlot
│    ├── imageSlot
│    ├── gallerySlot
│    ├── videoSlot
│    └── beforeAfterSlot  ← EXCLUSIVE: phải là slot duy nhất
└── swapSides?        (boolean) — ẩn khi không phải đúng 2 normal slots
```

### Validation Rules (trên Studio)

| Rule | Thông báo lỗi |
|------|---------------|
| Tối đa 3 slot per block | "Tối đa 3 slot mỗi block (đang có N). Vui lòng tạo block mới." |
| Before/After phải là slot duy nhất | "🔄 Before/After phải là slot duy nhất trong block. Vui lòng xóa các slot khác." |

### Layout tự động theo số lượng slots

| Số normal slots | Layout trên web |
|-----------------|----------------|
| 0 | Heading đơn (full width) |
| 1 | Full width (100%) |
| 2 | 2 cột (50% / 50%), có toggle swapSides |
| 3 | 3 cột (33% / 33% / 33%) |
| beforeAfterSlot | Full width exclusive |

### Preview trên Studio

Hiện dạng: `📌 "Heading" · 📝 Text · 🖼 Hình · 🖼×5 Gallery · 🎬 Video · 🔄 Before/After`

---

## 5. Sanity Schema — 5 Slot Types

### 5.1 textSlot (`📝 Văn bản`)

**File:** `src/sanity/schemas/slots/textSlot.ts`

| Field | Type | Mô tả |
|-------|------|-------|
| `content` | `array of block` (Portable Text) | Rich text: Normal, H2, H3, Blockquote, Bold, Italic |
| `align` | `string` (radio: left/center/right) | Căn lề text, default: "left" |

**Preview:** Hiện 40 ký tự đầu tiên của text content.

### 5.2 imageSlot (`🖼 Hình ảnh đơn`)

**File:** `src/sanity/schemas/slots/imageSlot.ts`

| Field | Type | Mô tả |
|-------|------|-------|
| `image` | `image` (hotspot) | Hình ảnh |
| `caption` | `string` | Caption tùy chọn |

### 5.3 gallerySlot (`🖼 Gallery`)

**File:** `src/sanity/schemas/slots/gallerySlot.ts`

| Field | Type | Mô tả |
|-------|------|-------|
| `images` | `array of image` (mỗi ảnh có caption) | Nhiều ảnh, hiện dạng StackGallery |

**Preview:** Hiện số lượng ảnh: `🖼 Gallery (5 ảnh)`

### 5.4 videoSlot (`🎬 Video YouTube`)

**File:** `src/sanity/schemas/slots/videoSlot.ts`

| Field | Type | Mô tả |
|-------|------|-------|
| `url` | `url` | YouTube URL (bất kỳ dạng: watch?v=, youtu.be/, shorts/) |
| `thumbnail` | `image` (hotspot) | Ảnh preview tùy chọn |

### 5.5 beforeAfterSlot (`🔄 Before / After`) — EXCLUSIVE

**File:** `src/sanity/schemas/slots/beforeAfterSlot.ts`

| Field | Type | Mô tả |
|-------|------|-------|
| `beforeImage` | `image` (hotspot, bắt buộc) | Ảnh TRƯỚC (phác thảo) |
| `afterImage` | `image` (hotspot, bắt buộc) | Ảnh SAU (hoàn thiện) |
| `beforeLabel` | `string` (default: "Phác thảo") | Label ảnh trước |
| `afterLabel` | `string` (default: "Hoàn thiện") | Label ảnh sau |
| `variant` | `string` (radio) | Kiểu hiệu ứng: slider / hover / fade |

**Variant options:**
- **slider** (default) — Kéo thanh trượt, dùng `ImageComparison`
- **hover** — Theo chuột, dùng `ImageComparisonHover`
- **fade** — Click đổi ảnh, dùng `ImageComparisonFade`

**⚠️ EXCLUSIVE:** Khi có beforeAfterSlot, block chỉ render slot này, bỏ qua mọi slot khác. Validation trên Studio cũng ngăn thêm slot khác.

---

## 6. Sanity Studio Structure & Validation

**File:** `src/sanity/structure.ts`

```
📄 Quản lý CV (singleton)
──────────────────────
🗂️ Quản lý Projects → danh sách projects (sắp xếp year DESC)
──────────────────────
💼 Quản lý Experience
──────────────────────
🎓 Quản lý Education & Certification
```

### Schema Registration Order

**File:** `src/sanity/schemaTypes/index.ts`

Slot types PHẢI được đăng ký TRƯỚC contentBlock:

```typescript
types: [
  cvType,
  textSlot, imageSlot, gallerySlot, videoSlot, beforeAfterSlot,  // slots trước
  contentBlock,                                                    // contentBlock sau
  project, experience, education,
]
```

---

## 7. GROQ Queries & TypeScript Interfaces

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

### Query 2: PROJECT_DETAIL_QUERY (trang chi tiết)

```groq
*[_type == "project" && _id == $id][0] {
  _id, title, year, description,
  "heroImage": heroImage.asset->url,
  software, category,
  contentBlocks[] {
    heading, headingAlign, swapSides,
    slots[] {
      _type,
      // textSlot
      content, align,
      // imageSlot
      "image": { "url": image.asset->url, "caption": caption },
      // gallerySlot
      "images": images[]{ "url": asset->url, "caption": caption },
      // videoSlot
      url, "thumbnail": thumbnail.asset->url,
      // beforeAfterSlot
      "beforeImage": beforeImage.asset->url,
      "afterImage": afterImage.asset->url,
      beforeLabel, afterLabel, variant,
    }
  }
}
```

**Quan trọng:** Vì `slots[]` là polymorphic array, tất cả fields của MỌI loại slot đều phải query trong cùng 1 projection. Sanity tự trả về đúng field tương ứng với `_type` của từng item.

### TypeScript Interfaces

```typescript
// Slot types
interface TextSlot    { _type: "textSlot"; content?: any[]; align?: "left"|"center"|"right" }
interface ImageSlot   { _type: "imageSlot"; image?: { url: string; caption?: string } }
interface GallerySlot { _type: "gallerySlot"; images?: { url: string; caption?: string }[] }
interface VideoSlot   { _type: "videoSlot"; url?: string; thumbnail?: string }
interface BeforeAfterSlot {
  _type: "beforeAfterSlot";
  beforeImage?: string; afterImage?: string;
  beforeLabel?: string; afterLabel?: string;
  variant?: "slider" | "hover" | "fade";
}

type AnySlot = TextSlot | ImageSlot | GallerySlot | VideoSlot | BeforeAfterSlot;

// ContentBlock
interface ContentBlock {
  heading?: string;
  headingAlign?: "left" | "center" | "right";
  slots?: AnySlot[];
  swapSides?: boolean;
}

// Project
interface ProjectCardData { _id, title, year?, description?, thumbnail?, previewVideo?, software?[], category?[] }
interface ProjectDetailData { _id, title, year?, description?, heroImage?, software?[], category?[], contentBlocks?[] }
```

---

## 8. Trang chủ — ProjectsSection (danh sách project)

**File:** `src/app/(home)/component/ProjectsSection.tsx`

### Luồng hoạt động

```
1. Component mount → fetch PROJECTS_LIST_QUERY từ Sanity
2. Hiển thị skeleton loading (6 cards giả)
3. Data về → hiển thị grid ProjectCard
4. User filter theo Category + Software
5. "Read more" button load thêm 6 cards
```

### Thuật toán filter (AND logic)

```typescript
filteredProjects = allProjects.filter(project => {
  // Project phải chứa TẤT CẢ category đang chọn (AND)
  const matchCategory = selectedCategories.length === 0
    || selectedCategories.every(c => project.category?.includes(c));
  // Project phải chứa TẤT CẢ software đang chọn (AND)
  const matchSoftware = selectedSoftware.length === 0
    || selectedSoftware.every(s => project.software?.includes(s));
  return matchCategory && matchSoftware;
});
```

### Filter UI

- **Desktop:** Dock component (macOS-style) — category icons + software icons
- **Mobile:** 2 dropdown buttons (Software / Category) + active chips + Clear button
- **Pagination:** Mặc định 6 cards, "Read more" += 6, reset khi filter thay đổi

---

## 9. ProjectCard — Component hiển thị card

**File:** `src/components/ui/ProjectCard.tsx`

### Cấu trúc visual

```
┌─────────────────────────────────────┐
│      THUMBNAIL / VIDEO PREVIEW      │  aspect-ratio: 4/3
│                                     │  rounded-xl
│  [Software tags - hover]      [→]   │
└─────────────────────────────────────┘
  Software tags (static, ẩn khi hover)
  Title (text-sm, semibold)
  Description (text-xs, max 2 dòng)
```

### Video hover logic (desktop only)

```
1. Detect touch device: window.matchMedia("(hover: none)")
2. Chỉ render video nếu: có URL video VÀ không phải touch device
3. Mouse enter → play video từ đầu
4. Mouse leave → pause, reset về đầu
5. Mobile: chỉ scale thumbnail, không có video
```

### Navigation

Click card → `/projects/{project._id}`

---

## 10. Project Detail Page — Thuật toán render

**File:** `src/app/projects/[id]/page.tsx` (Server Component)

### Luồng tổng quát

```
1. Lấy id từ URL params
2. Fetch project data từ Sanity (revalidate 60s)
3. Nếu không tìm thấy → notFound() (404)
4. Render: Hero → Title+Meta → ContentBlocks (loop) → Footer
```

### Cấu trúc trang

```
┌─────────────────────────────────────────┐
│ [← Back]                                │
│              HERO IMAGE                  │  height: clamp(260px, 50vw, 680px)
│         (full width, object-cover)       │  gradient overlay
└─────────────────────────────────────────┘
│ CATEGORY · CATEGORY                      │
│ PROJECT TITLE          Year | Software   │
├──────────────────────────────────────────┤ border-b
│         CONTENT BLOCK 1                  │  ← RenderBlock
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤ divide-border/40
│         CONTENT BLOCK 2                  │
│         ...                              │
└──────────────────────────────────────────┘
│              FOOTER                      │
└──────────────────────────────────────────┘
```

### ⭐ Thuật toán RenderBlock — Decision Tree

```
RenderBlock(block)
  │
  ├── Có beforeAfterSlot?
  │     YES → Render heading (nếu có) + BeforeAfterSlotClient
  │           STOP, bỏ qua mọi slot khác
  │
  ├── Không có slot nào?
  │     └── Có heading? → Render heading đơn
  │     └── Không? → return null
  │
  └── Có 1+ normalSlots
        ├── Render heading (nếu có, mb-10)
        └── switch(normalSlots.length)
              1 → RenderSlot(size="full")
              2 → flex-row 2 cột + swapSides
                  └── 2× RenderSlot(size="half")
              3 → flex-row 3 cột (lấy 3 slot đầu)
                  └── 3× RenderSlot(size="third")
```

### ⭐ Thuật toán RenderSlot

```
RenderSlot(slot, size)
  │
  ├── textSlot
  │     ├── Luôn áp dụng: textAlignOnly[align]  (text-left/center/right)
  │     └── Chỉ khi full: max-w-3xl + textContainerPosition[align]  (ml-auto/mr-auto/mx-auto)
  │
  ├── imageSlot
  │     ├── Full: height 480px
  │     └── Half/Third: height 340px
  │     └── rounded-2xl, object-cover, figcaption bên dưới
  │
  ├── gallerySlot
  │     ├── Full: height 400px
  │     └── Half/Third: height 340px
  │     └── Render StackGallery (cards xoay, kéo thả)
  │
  └── videoSlot
        └── HeroVideoDialog (toYouTubeEmbed auto)
        └── Fallback thumbnail: "/images/default-thumbnail.png"
```

### Text Alignment — Logic chi tiết

```typescript
// 2 map riêng biệt:
const textAlignOnly = {          // Căn chữ bên trong div
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const textContainerPosition = {  // Đẩy container div đến vị trí
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

// Áp dụng:
// textAlignOnly → LUÔN áp dụng (cả full, half, third)
// textContainerPosition → CHỈ khi full width (kèm max-w-3xl)

// Ví dụ khi align="right", size="full":
//   class = "w-full text-right max-w-3xl ml-auto"
//   → text căn phải + container nằm bên phải

// Ví dụ khi align="right", size="half":
//   class = "w-full text-right"
//   → text căn phải trong cột 50%, không cần ml-auto vì flex layout
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

### Static Generation & Revalidation

```typescript
// Build time: pre-render tất cả project
export async function generateStaticParams() {
  const ids = await client.fetch(`*[_type == "project"]{ "id": _id }`);
  return ids.map(s => ({ id: s.id }));
}

// Runtime: revalidate mỗi 60 giây
client.fetch(query, params, { next: { revalidate: 60 } });
```

---

## 11. Các component phụ trợ

### StackGallery

**File:** `src/components/ui/StackGallery.tsx` (Client Component)

Gallery hiển thị ảnh dạng **"stack cards"** — nhiều ảnh xếp chồng, user kéo/click để xem ảnh tiếp theo.

```typescript
// Container: w-full h-full (parent control height)
// Stack props:
{
  sendToBackOnClick: true,    // click ảnh trên cùng → đẩy xuống dưới
  autoplayDelay: 3000,        // tự chuyển mỗi 3 giây
  pauseOnHover: true,         // dừng autoplay khi hover
  mobileClickOnly: true,      // mobile chỉ click, không drag
  randomRotation: true,       // ảnh xoay ngẫu nhiên
  sensitivity: 150,           // độ nhạy drag
}
```

### BeforeAfterSlotClient

**File:** `src/components/ui/BeforeAfterSlotClient.tsx` (Client Component)

Wrapper cho image comparison, switch theo `variant`:

```typescript
// variant === "slider" → ImageComparison (drag handle, initialPosition=50)
// variant === "hover"  → ImageComparisonHover (theo chuột)
// variant === "fade"   → ImageComparisonFade (click toggle)
// Container height: clamp(400px, 50vw, 600px)
```

### Image Comparison

**File:** `src/components/ui/image-comparison.tsx` (Client Component)

6 variants có sẵn (hiện chỉ dùng 3 cho beforeAfterSlot):

| Component | Cách hoạt động |
|-----------|---------------|
| `ImageComparison` | Kéo thanh trượt horizontal/vertical |
| `ImageComparisonHover` | Theo vị trí chuột, reset khi rời |
| `ImageComparisonFade` | Click toggle before/after |
| `ImageComparisonSplit` | 2 ảnh side-by-side cố định |
| `ImageComparisonSwipe` | Drag swipe (Framer Motion) |
| `ImageComparisonLens` | Lens/magnifying glass effect |

### HeroVideoDialog

**File:** `src/components/ui/hero-video-dialog.tsx` (Client Component)

```
1. Hiện thumbnail + nút Play (icon lớn, gradient)
2. Click → mở modal fullscreen (backdrop blur)
3. YouTube iframe
4. Click backdrop / X / Escape → đóng
5. Scroll body bị lock khi modal mở
```

### YouTube URL Utility

**File:** `src/lib/youtube.ts`

```typescript
toYouTubeEmbed(url):
  - Đã là /embed/      → giữ nguyên
  - youtu.be/VIDEO_ID   → youtube.com/embed/VIDEO_ID
  - /shorts/VIDEO_ID    → youtube.com/embed/VIDEO_ID
  - ?v=VIDEO_ID         → youtube.com/embed/VIDEO_ID
  - Không match          → trả lại URL gốc
```

### BackButton

**File:** `src/components/layout/back-button.tsx` (Client Component)

- `router.back()`
- UI: nút tròn trắng/blur, icon chevron + "Back"

---

## 12. Luồng người dùng trên Studio

### Tạo project mới

```
1. Mở Sanity Studio → "🗂️ Quản lý Projects" → "+"
2. Tab "📋 Thông tin card":
   a. Nhập Tên project (bắt buộc)
   b. Năm, Mô tả, Thumbnail, Video preview
   c. Chọn Software, Category
3. Tab "📄 Trang chi tiết":
   a. Upload Hero Image
   b. Thêm Content Blocks (xem bên dưới)
4. Click "Publish"
```

### Thêm content block

```
1. Click "+ Add item" trong contentBlocks
2. [Tùy chọn] Nhập Heading + căn lề
3. Trong "Nội dung (slots)" → "Add item" → chọn loại:
   ┌─────────────────────────────────────────────┐
   │  📝 Văn bản          → rich text editor     │
   │  🖼 Hình ảnh đơn     → upload 1 ảnh         │
   │  🖼 Gallery           → upload nhiều ảnh     │
   │  🎬 Video YouTube    → dán URL              │
   │  🔄 Before / After   → upload 2 ảnh (⚠️ exclusive) │
   └─────────────────────────────────────────────┘
4. Thêm tiếp slot thứ 2, 3 (tối đa 3)
5. Nếu đúng 2 slot → hiện toggle "↔ Đổi vị trí trái/phải"
6. Publish → frontend cập nhật trong 60 giây
```

### Ví dụ kết hợp slots

| Slots | Layout trên web |
|-------|----------------|
| 1× 📝 Text | Full width, max-w-3xl, căn theo align |
| 1× 🖼 Image | Full width, height 480px, rounded |
| 1× 🖼 Gallery | Full width Stack, height 400px |
| 1× 🎬 Video | Full width HeroVideoDialog |
| 1× 🔄 Before/After | Full width, clamp(400px, 50vw, 600px) |
| 📝 Text + 🖼 Image | 2 cột: text trái, ảnh phải (toggle swap) |
| 📝 Text + 🎬 Video | 2 cột: text trái, video phải |
| 🖼 Gallery + 📝 Text | 2 cột: gallery trái, text phải |
| 🎬 Video + 🎬 Video | 2 video 2 cột |
| 🖼 + 🖼 + 🖼 | 3 ảnh 3 cột (thay thế threeImages cũ) |
| 📝 + 🖼 + 🎬 | 3 cột: text, ảnh, video |
| 📌 Heading đơn | Heading lớn full width, không có slot |
| 📌 Heading + 2 slots | Heading trên, 2 cột dưới |

### Sửa / Xóa project

```
Sửa: Mở project → sửa fields → Publish (60s cập nhật)
     Có thể kéo thả sắp xếp lại contentBlocks & slots
Xóa: Mở project → "..." → Delete → Xác nhận
```

---

## 13. Lưu ý quan trọng

### Kiến trúc

1. **beforeAfterSlot là exclusive**: Khi block có slot này, chỉ render nó, bỏ qua slots khác. Validation trên Studio cũng ngăn chặn.

2. **Slot types phải đăng ký trước contentBlock** trong `schemaTypes/index.ts`.

3. **GROQ polymorphic projection**: Tất cả fields của mọi slot type query cùng 1 object. Sanity tự trả đúng field theo `_type`.

4. **Server Component / Client Component**: `page.tsx` là Server Component. `StackGallery`, `BeforeAfterSlotClient`, `HeroVideoDialog`, `image-comparison` là Client Components. Next.js cho phép import client component vào server component.

### Render

5. **Text alignment 2 maps**: `textAlignOnly` (luôn áp dụng) + `textContainerPosition` (chỉ full width). Tách ra để tránh bug căn lề trong layout 2 cột.

6. **images vs image priority**: Nếu cả `images` gallery và `image` đơn cùng tồn tại trong old data, `images` được ưu tiên. Với Polymorphic Slots mới, mỗi loại là 1 slot riêng nên không còn conflict.

### Performance

7. **Revalidation 60s**: Frontend cập nhật tối đa 60 giây sau publish.

8. **generateStaticParams**: Pre-render tại build time cho mọi project → SEO tốt.

9. **previewVideo chỉ desktop**: Touch device bỏ qua video hover.

### Data

10. **Filter logic AND**: Chọn nhiều filter → project phải match TẤT CẢ filter.

11. **YouTube URL tự convert**: `toYouTubeEmbed()` hỗ trợ mọi dạng URL YouTube.

---

## Sơ đồ Data Flow tổng quan

```
┌───────────────────────────────────────────────────────────┐
│                     SANITY STUDIO                         │
│                                                           │
│  User tạo/sửa Project                                     │
│    ├─ Tab "Thông tin card"                                 │
│    │    └─ title, year, description, thumbnail,            │
│    │       previewVideo, software[], category[]            │
│    └─ Tab "Trang chi tiết"                                 │
│         └─ heroImage                                       │
│         └─ contentBlocks[] ← mỗi block:                    │
│              ├─ heading + headingAlign                      │
│              ├─ swapSides                                   │
│              └─ slots[] ← polymorphic:                      │
│                   ├─ textSlot    { content, align }         │
│                   ├─ imageSlot   { image, caption }         │
│                   ├─ gallerySlot { images[] }               │
│                   ├─ videoSlot   { url, thumbnail }         │
│                   └─ beforeAfterSlot { before, after,       │
│                        labels, variant }                    │
│                                                           │
│  Publish ─────────────────────────┐                        │
└───────────────────────────────────┼────────────────────────┘
                                    ▼
                             Sanity API (CDN)
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                   │
                 ▼                  ▼                   │
       PROJECTS_LIST_QUERY  PROJECT_DETAIL_QUERY        │
       (trang chủ)          (trang chi tiết)            │
                 │                  │                   │
                 ▼                  ▼                   │
       ProjectsSection     ProjectDetailPage            │
       ├─ Filter (Dock)    ├─ Hero Image                │
       ├─ Grid Cards       ├─ Title + Meta              │
       └─ Pagination       ├─ RenderBlock (loop)        │
                           │   └─ RenderSlot (switch)   │
                           │       ├─ textSlot          │
                           │       ├─ imageSlot         │
                           │       ├─ gallerySlot       │
                           │       ├─ videoSlot         │
                           │       └─ beforeAfterSlot   │
                           └─ Footer                    │
                                                        │
                          revalidate: 60s ──────────────┘
```
