// sanity/schemas/contentBlock.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "contentBlock",
  title: "Content Block",
  type: "object",

  // Preview trong Studio hiện rõ block chứa gì
  preview: {
    select: {
      text: "text",
      image: "image",
      videoUrl: "videoUrl",
    },
    prepare({ text, image, videoUrl }) {
      const parts = [];
      if (text && text.length > 0) parts.push("📝 Text");
      if (image) parts.push("🖼 Hình");
      if (videoUrl) parts.push("🎬 Video");
      return {
        title: parts.length > 0 ? parts.join(" + ") : "Block trống",
      };
    },
  },

  fields: [
    defineField({
      name: "text",
      title: "Nội dung văn bản",
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
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "videoUrl",
      title: "Video URL (YouTube embed)",
      type: "url",
      description:
        "Dán link dạng: https://www.youtube.com/embed/VIDEO_ID — tối đa chọn 2 trong 3 (text / hình / video)",
    }),

    defineField({
      name: "videoThumbnail",
      title: "Video Thumbnail",
      type: "image",
      options: { hotspot: true },
      description:
        "Ảnh preview trước khi play video (để trống sẽ dùng ảnh mặc định)",
    }),
  ],
});
