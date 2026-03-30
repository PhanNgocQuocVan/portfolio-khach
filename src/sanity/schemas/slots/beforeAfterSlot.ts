// src/sanity/schemas/slots/beforeAfterSlot.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "beforeAfterSlot",
  title: "🔄 Before / After",
  type: "object",

  fields: [
    defineField({
      name: "beforeImage",
      title: "Ảnh TRƯỚC (phác thảo)",
      type: "image",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),

    defineField({
      name: "afterImage",
      title: "Ảnh SAU (hoàn thiện)",
      type: "image",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),

    defineField({
      name: "beforeLabel",
      title: "Label ảnh trước",
      type: "string",
      initialValue: "Phác thảo",
    }),

    defineField({
      name: "afterLabel",
      title: "Label ảnh sau",
      type: "string",
      initialValue: "Hoàn thiện",
    }),

    defineField({
      name: "variant",
      title: "Kiểu hiệu ứng",
      type: "string",
      options: {
        list: [
          { title: "Kéo thanh trượt", value: "slider" },
          { title: "Theo chuột", value: "hover" },
          { title: "Click đổi ảnh", value: "fade" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "slider",
    }),
  ],

  preview: {
    select: { media: "afterImage" },
    prepare({ media }) {
      return { title: "🔄 Before / After", media };
    },
  },
});
