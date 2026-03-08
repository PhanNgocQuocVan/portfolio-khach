// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from "sanity";
import { cvType } from "./cv";
import project from "../schemas/project";
import contentBlock from "../schemas/contentBlock";
import experience from "../schemas/experience";
import education from "../schemas/education"; // ← thêm dòng này

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [cvType, contentBlock, project, experience, education], // ← thêm education
};
