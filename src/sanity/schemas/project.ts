// sanity/schemas/project.ts
import { defineField, defineType } from "sanity";

const SOFTWARE_OPTIONS = [
  { title: "3DsMax", value: "3DsMax" },
  { title: "Adobe", value: "Adobe" },
  { title: "Archicad", value: "Archicad" },
  { title: "CAD", value: "CAD" },
  { title: "Enscape", value: "Enscape" },
  { title: "Lumion", value: "Lumion" },
  { title: "MS Office", value: "MS Office" },
  { title: "Procreate", value: "Procreate" },
  { title: "Rhino", value: "Rhino" },
  { title: "Revit", value: "Revit" },
  { title: "SketchUp", value: "SketchUp" },
  { title: "TwinMotion", value: "TwinMotion" },
  { title: "Vray", value: "Vray" },
];

const CATEGORY_OPTIONS = [{ title: "Design", value: "design" }];

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
        layout: "grid",
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
