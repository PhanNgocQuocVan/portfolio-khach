import { defineType, defineField } from "sanity";

export default defineType({
  name: "dividerSlot",
  title: "Đường kẻ ngang (Divider)",
  type: "object",
  fields: [
    defineField({
      name: "style",
      title: "Kiểu đường kẻ",
      type: "string",
      options: {
        list: [
          { title: "Mặc định (Nét liền mờ)", value: "default" },
          { title: "Nét đứt", value: "dashed" },
          { title: "Không viền (Chỉ tạo khoảng trống)", value: "spacer" },
        ],
      },
      initialValue: "default",
    }),
  ],
  preview: {
    select: {
      style: "style",
    },
    prepare({ style }) {
      const styleName =
        style === "dashed"
          ? "Nét đứt"
          : style === "spacer"
            ? "Khoảng trống"
            : "Nét liền mờ";
      return {
        title: `--- Đường kẻ ngang (${styleName}) ---`,
      };
    },
  },
});
