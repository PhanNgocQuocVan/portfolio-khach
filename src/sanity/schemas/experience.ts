// sanity/schemas/experience.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "experience",
  title: "Experience",
  type: "document",

  preview: {
    select: {
      title: "title",
      startDate: "startDate",
      endDate: "endDate",
      media: "image",
    },
    prepare({ title, startDate, endDate, media }) {
      const fmt = (d: string) => {
        const dt = new Date(d);
        return dt.toLocaleDateString("en-US", { year: "numeric", month: "short" });
      };
      const range = startDate
        ? `${fmt(startDate)}${endDate ? " – " + fmt(endDate) : ""}`
        : "";
      return { title, subtitle: range, media };
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
      name: "startDate",
      title: "Tháng/Năm bắt đầu",
      type: "date",
      options: { dateFormat: "YYYY-MM" },
      validation: (R) => R.required(),
    }),

    defineField({
      name: "endDate",
      title: "Tháng/Năm kết thúc",
      description: "Để trống nếu đang làm việc",
      type: "date",
      options: { dateFormat: "YYYY-MM" },
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
