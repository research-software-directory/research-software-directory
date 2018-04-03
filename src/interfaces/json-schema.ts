export type ISchema = IObjectSchema | IArraySchema | IBooleanSchema | IStringSchema | IEnumSchema;

export interface IObjectSchema {
  type: 'object';
  properties: {
    [key: string]: ISchema
  };
  required?: string[];
  definitions?: any;
  additionalProperties?: boolean;
}

export interface IRootSchema extends IObjectSchema {
  $schema: 'http://json-schema.org/draft-04/schema';
  additionalProperties: false;
}

export interface IArraySchema {
  type: 'array';
  items: ISchema;
}

export interface IEnumSchema {
  type: 'string';
  'enum': string[];
}

export interface IBooleanSchema {
  type: 'boolean';
}

export interface IStringSchema {
  type: 'string';
  format?: string;
}

export function isRootSchema(schema: any): schema is IRootSchema {
  return schema.type === 'object' && schema.$schema === 'http://json-schema.org/draft-04/schema';
}

export function isObjectSchema(schema: any): schema is IObjectSchema {
  return schema.type === 'object';
}

export function isArraySchema(schema: any): schema is IArraySchema {
  return schema.type === 'array';
}

export function isEnumSchema(schema: any): schema is IEnumSchema {
  return 'enum' in schema;
}

export function isBooleanSchema(schema: any): schema is IBooleanSchema {
  return schema.type === 'boolean';
}

export function isStringSchema(schema: any): schema is IStringSchema {
  return schema.type === 'string';
}
