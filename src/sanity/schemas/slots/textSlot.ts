// src/sanity/schemas/slots/textSlot.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "textSlot",
  title: "📝 Văn bản",
  type: "object",

  fields: [
    defineField({
      name: "content",
      title: "Nội dung văn bản",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Blockquote", value: "blockquote" },
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
      name: "align",
      title: "Căn lề",
      type: "string",
      options: {
        list: [
          { title: "← Trái", value: "left" },
          { title: "— Giữa", value: "center" },
          { title: "→ Phải", value: "right" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "left",
    }),
  ],

  preview: {
    select: { content: "content" },
    prepare({ content }) {
      const firstBlock = content?.[0];
      const text = firstBlock?.children
        ?.map((c: any) => c.text)
        .join("") ?? "";
      const snippet = text.length > 40 ? text.slice(0, 40) + "…" : text;
      return { title: `📝 ${snippet || "Văn bản"}` };
    },
  },
});
