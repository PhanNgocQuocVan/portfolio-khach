import { type SchemaTypeDefinition } from "sanity";
import { cvType } from "./cv";
import project from "../schemas/project";
import contentBlock from "../schemas/contentBlock";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [cvType, project, contentBlock],
};
