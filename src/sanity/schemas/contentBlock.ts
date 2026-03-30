// sanity/schemas/contentBlock.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "contentBlock",
  title: "Content Block",
  type: "object",

  preview: {
    select: {
      heading: "heading",
      slots: "slots",
    },
    prepare({ heading, slots }) {
      const parts: string[] = [];
      if (heading) parts.push(`📌 "${heading}"`);

      if (slots && Array.isArray(slots)) {
        for (const slot of slots) {
          switch (slot._type) {
            case "textSlot":
              parts.push("📝 Text");
              break;
            case "imageSlot":
              parts.push("🖼 Hình");
              break;
            case "gallerySlot": {
              const count = slot.images?.length ?? 0;
              parts.push(`🖼×${count} Gallery`);
              break;
            }
            case "videoSlot":
              parts.push("🎬 Video");
              break;
            case "beforeAfterSlot":
              parts.push("🔄 Before/After");
              break;
          }
        }
      }

      return {
        title: parts.length > 0 ? parts.join(" · ") : "Block trống",
      };
    },
  },

  fields: [
    // ── HEADING (ngoài slots) ──────────────────────────────────────
    defineField({
      name: "heading",
      title: "Heading (tiêu đề lớn, tùy chọn)",
      type: "string",
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

    // ── SLOTS (polymorphic array) ──────────────────────────────────
    defineField({
      name: "slots",
      title: "Nội dung",
      description:
        "Thêm các slot nội dung. 1 slot = full width, 2 slot = 2 cột, 3 slot = 3 cột. Before/After luôn full width. Tối đa 3 slot.",
      type: "array",
      of: [
        { type: "textSlot" },
        { type: "imageSlot" },
        { type: "gallerySlot" },
        { type: "videoSlot" },
        { type: "beforeAfterSlot" },
      ],
      validation: (Rule) =>
        Rule.custom((slots: any[] | undefined) => {
          if (!slots || slots.length === 0) return true;

          const hasBeforeAfter = slots.some(
            (s) => s._type === "beforeAfterSlot",
          );

          // Nếu có Before/After → phải là slot duy nhất
          if (hasBeforeAfter && slots.length > 1) {
            return "🔄 Before/After phải là slot duy nhất trong block. Vui lòng xóa các slot khác.";
          }

          // Tối đa 3 slot
          if (slots.length > 3) {
            return `Tối đa 3 slot mỗi block (đang có ${slots.length}). Vui lòng tạo block mới cho nội dung thêm.`;
          }

          return true;
        }),
    }),

    // ── SWAP SIDES ─────────────────────────────────────────────────
    defineField({
      name: "swapSides",
      title: "↔ Đổi vị trí trái / phải",
      type: "boolean",
      description: "Đảo thứ tự 2 cột khi có 2 slot",
      initialValue: false,
      hidden: ({ parent }) => {
        const slots = (parent?.slots as any[]) ?? [];
        const normalSlots = slots.filter(
          (s) => s._type !== "beforeAfterSlot",
        );
        return normalSlots.length !== 2;
      },
    }),
  ],
});
