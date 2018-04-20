import {
  ISchema,
  isObjectSchema,
  isForeignKeySchema
} from "../interfaces/json-schema";

export function createEmpty(schema: ISchema) {
  if (isObjectSchema(schema)) {
    return Object.keys(schema.properties).reduce((acc, key) => {
      acc[key] = createEmpty(schema.properties[key]);
      return acc;
    }, {});
  }
  if (isForeignKeySchema(schema)) {
    return {
      id: null,
      collection: schema.properties.collection.enum[0]
    };
  }
  return "";
}
