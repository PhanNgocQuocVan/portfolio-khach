// sanity/schemas/education.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "education",
  title: "Education & Certification",
  type: "document",

  preview: {
    select: {
      title: "title",
      subtitle: "issuer",
      media: "image",
    },
  },

  fields: [
    defineField({
      name: "title",
      title: "Tên bằng cấp / chứng chỉ",
      type: "string",
      validation: (R) => R.required(),
    }),

    defineField({
      name: "label",
      title: "Label (vd: University Degree, Cloud Certification...)",
      type: "string",
    }),

    defineField({
      name: "issuer",
      title: "Tổ chức cấp",
      type: "string",
    }),

    defineField({
      name: "year",
      title: "Năm",
      type: "string",
    }),

    defineField({
      name: "description",
      title: "Mô tả",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "image",
      title: "Hình ảnh / Certificate scan",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "type",
      title: "Loại",
      type: "string",
      options: {
        list: [
          { title: "University Degree", value: "degree" },
          { title: "Certificate", value: "certificate" },
        ],
        layout: "radio",
      },
    }),

    defineField({
      name: "order",
      title: "Thứ tự hiển thị",
      description: "Số nhỏ hơn hiển thị trước (1, 2, 3...)",
      type: "number",
    }),
  ],
});
