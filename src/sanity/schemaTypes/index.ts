import { type SchemaTypeDefinition } from "sanity";
import { cvType } from "./cv";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [cvType],
};
