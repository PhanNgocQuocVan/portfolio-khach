// sanity/schemas/experience.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "experience",
  title: "Experience",
  type: "document",

  preview: {
    select: {
      title: "title",
      subtitle: "date",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      const year = subtitle ? new Date(subtitle).getFullYear() : "";
      return { title, subtitle: String(year), media };
    },
  },

  fields: [
    defineField({
      name: "title",
      title: "Tên vị trí / công ty",
      type: "string",
      validation: (R) => R.required(),
    }),

    defineField({
      name: "date",
      title: "Ngày bắt đầu",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (R) => R.required(),
    }),

    defineField({
      name: "version",
      title: "Version (vd: v1, v2...)",
      description: "Hiện bên trái timeline, dùng để đánh số thứ tự",
      type: "string",
    }),

    defineField({
      name: "tags",
      title: "Tags / Kỹ năng",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" }, // Sanity tag input — gõ Enter để thêm
    }),

    defineField({
      name: "description",
      title: "Mô tả",
      type: "text",
      rows: 4,
    }),

    defineField({
      name: "image",
      title: "Hình ảnh minh họa",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
