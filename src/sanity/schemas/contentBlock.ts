// sanity/schemas/contentBlock.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "contentBlock",
  title: "Block nội dung",
  type: "object",

  // Preview trong danh sách block của Studio
  preview: {
    select: {
      text: "text",
      media: "image",
    },
    prepare({ text, media }) {
      // Lấy dòng đầu tiên của Portable Text làm title preview
      const firstText = text?.[0]?.children?.[0]?.text;
      const hasImage = !!media;

      let subtitle = "";
      if (firstText && hasImage) subtitle = "Text + Hình";
      else if (firstText) subtitle = "Chỉ có text → full width";
      else if (hasImage) subtitle = "Chỉ có hình → full width";
      else subtitle = "(Trống)";

      return {
        title: firstText ?? "(Không có text)",
        subtitle,
        media,
      };
    },
  },

  fields: [
    defineField({
      name: "text",
      title: "Nội dung văn bản",
      description: "Để trống nếu block này chỉ có hình",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
      ],
    }),

    defineField({
      name: "image",
      title: "Hình ảnh",
      description: "Để trống nếu block này chỉ có text",
      type: "image",
      options: { hotspot: true },
      fields: [
        // Caption nằm ngay trong field image cho gọn
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
    }),
  ],
});
