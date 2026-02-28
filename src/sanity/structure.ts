// sanity/structure.ts
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Hệ thống quản trị")
    .items([
      // ── CV (singleton, giữ nguyên) ──────────────────────
      S.listItem()
        .title("Quản lý CV")
        .icon(() => "📄")
        .child(
          S.document()
            .schemaType("cv")
            .documentId("singleton-cv")
            .title("Cập nhật file CV cho Annie"),
        ),

      S.divider(),

      // ── PROJECTS ────────────────────────────────────────
      S.listItem()
        .title("Quản lý Projects")
        .icon(() => "🗂️")
        .child(
          S.list()
            .title("Quản lý Projects")
            .items([
              // 1. Danh sách tất cả projects
              S.listItem()
                .title("Tất cả Projects")
                .icon(() => "📋")
                .child(
                  S.documentTypeList("project")
                    .title("Tất cả Projects")
                    .defaultOrdering([{ field: "year", direction: "desc" }]),
                ),

              S.divider(),

              // 2. Tạo project mới (shortcut tiện lợi)
              S.listItem()
                .title("+ Thêm Project mới")
                .icon(() => "➕")
                .child(S.editor().schemaType("project").title("Project mới")),
            ]),
        ),

      S.divider(),

      // ── Ẩn các document type đã được quản lý ở trên ────
      ...S.documentTypeListItems().filter(
        (listItem) => !["cv", "project"].includes(listItem.getId() as string),
      ),
    ]);
