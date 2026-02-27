import { defineField, defineType } from "sanity";
import { CvUploadInput } from "../component/Cvuploadinput";

export const cvType = defineType({
  name: "cv",
  title: "CV",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tên hiển thị",
      type: "string",
      initialValue: "CV của Annie",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "filecv",
      title: "File CV (PDF)",
      type: "file",
      options: {
        accept: ".pdf",
        storeOriginalFilename: true,
      },
      // Dùng component tuỳ chỉnh để hiển thị nút tải lên đẹp hơn
      components: {
        input: CvUploadInput,
      },
      description:
        "Chỉ chấp nhận file PDF. Tải lên file mới sẽ tự động thay thế file cũ.",
    }),
    defineField({
      name: "updatedAt",
      title: "Cập nhật lúc",
      type: "datetime",
      readOnly: true,
      description: "Thời gian cập nhật CV gần nhất",
    }),
  ],
  preview: {
    select: {
      title: "title",
      updatedAt: "updatedAt",
    },
    prepare({ title, updatedAt }) {
      return {
        title: title || "CV của Annie",
        subtitle: updatedAt
          ? `Cập nhật: ${new Date(updatedAt).toLocaleString("vi-VN")}`
          : "Chưa có CV",
      };
    },
  },
});
