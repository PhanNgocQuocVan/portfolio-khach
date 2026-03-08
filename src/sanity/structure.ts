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

      // ── PROJECTS — click thẳng vào danh sách luôn ───────
      S.listItem()
        .title("Quản lý Projects")
        .icon(() => "🗂️")
        .schemaType("project")
        .child(
          S.documentTypeList("project")
            .title("Quản lý Projects")
            .defaultOrdering([{ field: "year", direction: "desc" }])
            .child((id) => S.document().documentId(id).schemaType("project")),
        ),

      S.divider(),

      // ── EXPERIENCE — click thẳng vào danh sách ──────────
      S.listItem()
        .title("Quản lý Experience")
        .icon(() => "💼")
        .schemaType("experience")
        .child(
          S.documentTypeList("experience")
            .title("Quản lý Experience")
            .defaultOrdering([{ field: "date", direction: "desc" }])
            .child((id) =>
              S.document().documentId(id).schemaType("experience"),
            ),
        ),

      S.divider(),

      // ── EDUCATION ────────────────────────────────────────
      S.listItem()
        .title("Quản lý Education & Certification")
        .icon(() => "🎓")
        .schemaType("education")
        .child(
          S.documentTypeList("education")
            .title("Education & Certification")
            .defaultOrdering([{ field: "order", direction: "asc" }])
            .child((id) => S.document().documentId(id).schemaType("education")),
        ),

      S.divider(),

      // ── Ẩn các document type đã được quản lý ở trên ────
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !["cv", "project", "experience", "education"].includes(
            listItem.getId() as string,
          ),
      ),
    ]);
