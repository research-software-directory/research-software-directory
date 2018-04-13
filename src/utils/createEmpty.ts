import { ISchema, isObjectSchema } from "../interfaces/json-schema";

export function createEmpty(schema: ISchema) {
  console.log("creating new", schema);
  if (isObjectSchema(schema)) {
    return Object.keys(schema.properties).reduce((acc, key) => {
      acc[key] = createEmpty(schema.properties[key]);
      return acc;
    }, {});
  }
  return "";
}
