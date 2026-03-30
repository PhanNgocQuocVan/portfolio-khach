// src/sanity/schemas/slots/imageSlot.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "imageSlot",
  title: "🖼 Hình ảnh đơn",
  type: "object",

  fields: [
    defineField({
      name: "image",
      title: "Hình ảnh",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],

  preview: {
    select: { media: "image", caption: "caption" },
    prepare({ media, caption }) {
      return {
        title: `🖼 ${caption || "Hình ảnh"}`,
        media,
      };
    },
  },
});
