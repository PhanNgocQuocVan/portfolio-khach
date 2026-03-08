// sanity/schemas/project.ts
import { defineField, defineType } from "sanity";

const SOFTWARE_OPTIONS = [
  { title: "Adobe CC", value: "Adobe CC" },
  { title: "AutoCAD", value: "AutoCAD" },
  { title: "SketchUp", value: "SketchUp" },
  { title: "3DsMax", value: "3DsMax" },
  { title: "Vray", value: "Vray" },
  { title: "TwinMotion", value: "TwinMotion" },
  { title: "Rhino", value: "Rhino" },
  { title: "Archicad", value: "Archicad" },
  { title: "Revit", value: "Revit" },
];

const CATEGORY_OPTIONS = [
  { title: "Concept Design", value: "concept-design" },
  { title: "Technical Drawings", value: "technical-drawings" },
  { title: "3D & Render", value: "3d-render" },
  { title: "Coordination & Execution", value: "coordination" },
];

export default defineType({
  name: "project",
  title: "Project",
  type: "document",

  preview: {
    select: {
      title: "title",
      subtitle: "year",
      media: "thumbnail",
    },
  },

  groups: [
    { name: "info", title: "📋 Thông tin card", default: true },
    { name: "detail", title: "📄 Trang chi tiết" },
  ],

  fields: [
    // ── GROUP 1: THÔNG TIN CARD ──────────────────────────────────
    defineField({
      name: "title",
      title: "Tên project",
      type: "string",
      group: "info",
      validation: (R) => R.required(),
    }),

    defineField({
      name: "year",
      title: "Năm thực hiện",
      type: "string",
      group: "info",
    }),

    defineField({
      name: "description",
      title: "Mô tả ngắn",
      description: "Hiện trên ProjectCard (tối đa 2 dòng)",
      type: "text",
      rows: 2,
      group: "info",
    }),

    defineField({
      name: "thumbnail",
      title: "Ảnh thumbnail (hiện trên card)",
      type: "image",
      group: "info",
      options: { hotspot: true },
    }),

    defineField({
      name: "software",
      title: "Phần mềm sử dụng",
      description: "Dùng để lọc ở trang Projects",
      type: "array",
      group: "info",
      of: [{ type: "string" }],
      options: {
        list: SOFTWARE_OPTIONS,
        layout: "grid",
      },
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "array",
      group: "info",
      of: [{ type: "string" }],
      options: {
        list: CATEGORY_OPTIONS,
        // không dùng layout: "grid" vì tên category dài, để list dọc cho dễ đọc
      },
    }),

    // ── GROUP 2: TRANG CHI TIẾT ──────────────────────────────────
    defineField({
      name: "heroImage",
      title: "Hero Image (ảnh lớn đầu trang detail)",
      type: "image",
      group: "detail",
      options: { hotspot: true },
    }),

    defineField({
      name: "contentBlocks",
      title: "Các block nội dung",
      description:
        "Mỗi block có thể có text, hình, hoặc cả hai. Tự động xen kẽ trái/phải.",
      type: "array",
      group: "detail",
      of: [{ type: "contentBlock" }],
    }),
  ],
});
