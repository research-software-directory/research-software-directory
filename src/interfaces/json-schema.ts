export type ISchema =
  | IObjectSchema
  | IArraySchema
  | IBooleanSchema
  | IStringSchema
  | IStringEnumSchema;

export interface IObjectSchema {
  type: "object";
  properties: {
    [key: string]: ISchema;
  };
  required?: string[];
  definitions?: any;
  additionalProperties?: boolean;
}

export interface IRootSchema extends IObjectSchema {
  $schema: "http://json-schema.org/draft-04/schema";
  additionalProperties: false;
}

export interface IArraySchema {
  type: "array";
  items: ISchema;
}

export interface IStringEnumSchema {
  type: "string";
  enum: string[];
}

export interface IBooleanSchema {
  type: "boolean";
}

export interface IStringSchema {
  type: "string";
  format?: string;
}

export interface IForeignKey {
  type: "object";
  required: ["collection", "id"];
  properties: {
    collection: {
      enum: string[];
      type: "string";
    };
    id: {
      type: "string";
    };
  };
}

export function isRootSchema(schema: any): schema is IRootSchema {
  return (
    schema.type === "object" &&
    schema.$schema === "http://json-schema.org/draft-04/schema"
  );
}

export function isObjectSchema(schema: any): schema is IObjectSchema {
  return (
    (schema.type === "object" || !schema.type) && !isForeignKeySchema(schema)
  );
}

export function isArraySchema(schema: any): schema is IArraySchema {
  return schema.type === "array";
}

export function isStringEnumSchema(schema: any): schema is IStringEnumSchema {
  return schema.type === "string" && schema.enum;
}

export function isBooleanSchema(schema: any): schema is IBooleanSchema {
  return schema.type === "boolean";
}

export function isStringSchema(schema: any): schema is IStringSchema {
  return (
    (schema.type === "string" && !isStringEnumSchema(schema)) ||
    (Array.isArray(schema.type) && schema.type.indexOf("string") > -1)
  );
}

export function isForeignKeySchema(schema: any): schema is IForeignKey {
  return (
    schema.type === "object" &&
    "collection" in schema.properties &&
    "id" in schema.properties
  );
}
