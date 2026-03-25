// sanity/schemas/contentBlock.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "contentBlock",
  title: "Content Block",
  type: "object",

  preview: {
    select: {
      heading: "heading",
      text: "text",
      image: "image",
      images: "images",
      videoUrl: "videoUrl",
      threeImages: "threeImages",
    },
    prepare({ heading, text, image, images, videoUrl, threeImages }) {
      const parts = [];
      if (heading) parts.push(`📌 "${heading}"`);
      if (threeImages && threeImages.length === 3) parts.push("🖼×3 Row");
      if (text && text.length > 0) parts.push("📝 Text");
      if (image) parts.push("🖼 Hình");
      if (images && images.length > 0)
        parts.push(`🖼×${images.length} Gallery`);
      if (videoUrl) parts.push("🎬 Video");
      return {
        title: parts.length > 0 ? parts.join(" + ") : "Block trống",
      };
    },
  },

  fields: [
    // ── HEADING ──────────────────────────────────────────────────
    defineField({
      name: "heading",
      title: "Heading (tiêu đề lớn)",
      type: "string",
      description:
        "Hiện dạng tiêu đề lớn giữa trang, có thể dùng độc lập hoặc kết hợp với content khác",
    }),

    defineField({
      name: "headingAlign",
      title: "Căn heading",
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
      initialValue: "center",
      hidden: ({ parent }) => !parent?.heading,
    }),

    // ── TEXT ─────────────────────────────────────────────────────
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
      hidden: ({ parent }) =>
        !!(parent?.threeImages && parent.threeImages.length === 3),
    }),

    // ── SINGLE IMAGE ─────────────────────────────────────────────
    defineField({
      name: "image",
      title: "Hình ảnh đơn",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
      hidden: ({ parent }) =>
        !!(parent?.threeImages && parent.threeImages.length === 3),
    }),

    // ── GALLERY (nhiều ảnh) ───────────────────────────────────────
    defineField({
      name: "images",
      title: "Gallery (nhiều ảnh)",
      description: "Thêm nhiều ảnh — hiện dạng grid tự động",
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
      hidden: ({ parent }) =>
        !!(parent?.threeImages && parent.threeImages.length === 3),
    }),

    // ── VIDEO ────────────────────────────────────────────────────
    defineField({
      name: "videoUrl",
      title: "Video URL (YouTube)",
      type: "url",
      description: "Dán bất kỳ dạng link YouTube: watch?v=, youtu.be/, shorts/",
      hidden: ({ parent }) =>
        !!(parent?.threeImages && parent.threeImages.length === 3),
    }),

    // ── 3 ẢNH NGANG HÀNG ─────────────────────────────────────────
    defineField({
      name: "threeImages",
      title: "3 ảnh ngang hàng (full width)",
      description:
        "Thêm đúng 3 ảnh — hiện ngang hàng, chiếm toàn bộ chiều rộng. Không kết hợp với text/video.",
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
      validation: (R) =>
        R.custom((value) => {
          if (value && value.length > 0 && value.length !== 3) {
            return "Phải thêm đúng 3 ảnh";
          }
          return true;
        }),
      hidden: ({ parent }) => {
        const hasOther =
          (parent?.text && parent.text.length > 0) ||
          parent?.image ||
          (parent?.images && parent.images.length > 0) ||
          parent?.videoUrl;
        return !!hasOther;
      },
    }),

    defineField({
      name: "videoThumbnail",
      title: "Video Thumbnail",
      type: "image",
      options: { hotspot: true },
      description: "Ảnh preview trước khi play (để trống dùng ảnh mặc định)",
      hidden: ({ parent }) =>
        !parent?.videoUrl ||
        !!(parent?.threeImages && parent.threeImages.length === 3),
    }),

    // ── LAYOUT CONTROL ───────────────────────────────────────────
    defineField({
      name: "swapSides",
      title: "↔ Đổi trái / phải",
      type: "boolean",
      description:
        "Khi có 2 content (vd: text + ảnh) — mặc định text trái / ảnh phải. Bật lên để đổi ngược lại.",
      initialValue: false,
      hidden: ({ parent }) => {
        // Ẩn nếu có threeImages
        if (parent?.threeImages && parent.threeImages.length === 3) return true;
        // Chỉ hiện khi có ít nhất 2 loại content
        const count = [
          parent?.text && parent.text.length > 0,
          parent?.image || (parent?.images && parent.images.length > 0),
          parent?.videoUrl,
        ].filter(Boolean).length;
        return count < 2;
      },
    }),
  ],
});
