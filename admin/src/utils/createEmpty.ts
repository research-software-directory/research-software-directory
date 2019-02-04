import {
  ISchema,
  isObjectSchema,
  isForeignKeySchema,
  isArraySchema,
  isBooleanSchema
} from "../interfaces/json-schema";
import { IResource } from "../interfaces/resource";

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
  if (isBooleanSchema(schema) && "default" in schema) {
    return schema.default;
  }
  if (isArraySchema(schema)) {
    return [];
  }
  return "";
}

export function createEmptyResource(
  schema: ISchema,
  username: string,
  primaryKey: string,
  now: string
): IResource {
  const resource = createEmpty(schema) as IResource;
  resource.primaryKey.id = primaryKey;
  resource.createdBy = resource.updatedBy = username;
  resource.createdAt = resource.updatedAt = now;
  return resource;
}
