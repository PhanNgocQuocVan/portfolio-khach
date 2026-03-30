// src/sanity/schemas/slots/gallerySlot.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "gallerySlot",
  title: "🖼 Gallery (nhiều ảnh)",
  type: "object",

  fields: [
    defineField({
      name: "images",
      title: "Các ảnh trong gallery",
      description: "Thêm nhiều ảnh — hiện dạng stack cards xoay",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
      ],
    }),
  ],

  preview: {
    select: { images: "images" },
    prepare({ images }) {
      const count = images?.length ?? 0;
      return { title: `🖼 Gallery (${count} ảnh)` };
    },
  },
});
