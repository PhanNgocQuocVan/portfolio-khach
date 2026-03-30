// src/sanity/schemas/slots/videoSlot.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "videoSlot",
  title: "🎬 Video YouTube",
  type: "object",

  fields: [
    defineField({
      name: "url",
      title: "YouTube URL",
      description: "Dán bất kỳ dạng link YouTube: watch?v=, youtu.be/, shorts/",
      type: "url",
    }),

    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      description: "Ảnh preview trước khi play (để trống dùng ảnh mặc định)",
      type: "image",
      options: { hotspot: true },
    }),
  ],

  preview: {
    select: { url: "url" },
    prepare({ url }) {
      return { title: `🎬 Video${url ? "" : " (chưa có URL)"}` };
    },
  },
});
