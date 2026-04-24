// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from "sanity";
import { cvType } from "./cv";
import project from "../schemas/project";
import contentBlock from "../schemas/contentBlock";
import experience from "../schemas/experience";
import education from "../schemas/education";
import dividerBlock from "../schemas/dividerBlock";

// Slot sub-schemas
import textSlot from "../schemas/slots/textSlot";
import imageSlot from "../schemas/slots/imageSlot";
import gallerySlot from "../schemas/slots/gallerySlot";
import videoSlot from "../schemas/slots/videoSlot";
import beforeAfterSlot from "../schemas/slots/beforeAfterSlot";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    cvType,
    // Slot types (phải đăng ký trước contentBlock)
    textSlot,
    imageSlot,
    gallerySlot,
    videoSlot,
    beforeAfterSlot,
    // Main schemas
    contentBlock,
    project,
    experience,
    education,
    dividerBlock,
  ],
};
