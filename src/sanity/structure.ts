import type { StructureResolver } from "sanity/structure";

// Cấu hình giao diện Admin để vào thẳng trang chỉnh sửa CV
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Hệ thống quản trị")
    .items([
      S.listItem().title("Quản lý CV").child(
        S.document()
          .schemaType("cv")
          .documentId("singleton-cv") // Cố định ID này
          .title("Cập nhật file CV cho Annie"),
      ),

      // Dòng này giúp ẩn mục 'cv' ở những nơi khác để tránh tạo file lung tung
      ...S.documentTypeListItems().filter(
        (listItem) => !["cv"].includes(listItem.getId() as string),
      ),
    ]);
