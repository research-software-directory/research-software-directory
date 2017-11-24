export interface ISchema {
  id: string;
  required?: string[];
  type: 'object';
  '#schema': 'http://json-property.org/draft-04/property#';
  properties: { [key: string]: IProperty };
  additionalProperties: boolean;
}

export type IProperty = IArrayProperty | ILinkProperty | IStringProperty | IReferenceProperty |
                        IEnumProperty | IAnyOfProperty;

interface IBaseProperty {
  description?: string;
  htmlDescription?: string;
  sortIndex?: number;
  // type?: string;
}

export interface IAnyOfProperty extends IBaseProperty {
  anyOf: IProperty[];
}

export function isAnyOfProperty(property: any): property is IAnyOfProperty {
  return 'anyOf' in property;
}

export interface IArrayProperty extends IBaseProperty {
  type: 'array';
  items: IProperty;
}

export function isArrayProperty(property: any): property is IArrayProperty {
  return 'type' in property && property.type === 'array';
}

interface IReferenceProperty extends IBaseProperty {
  reference: string;
}

export function isReferenceProperty(property: any): property is IReferenceProperty {
  return 'reference' in property;
}

export interface IEnumProperty extends IBaseProperty {
  type: 'string';
  'enum': string[];
}

export function isEnumProperty(property: any): property is IEnumProperty {
  return 'enum' in property;
}

interface IBooleanProperty extends IBaseProperty {
  type: 'boolean';
}

export function isBooleanProperty(property: any): property is IBooleanProperty {
  return 'type' in property && property.type === 'boolean';
}

interface IStringProperty extends IBaseProperty {
  type: 'string';
  format?: string;
  markdown?: boolean;
  long?: boolean;
}

export function isStringProperty(property: any): property is IStringProperty {
  return 'type' in property &&
    !isArrayProperty(property) &&
    !isEnumProperty(property) &&
    !isLinkProperty(property) &&
    !isBooleanProperty(property);
}

interface ILinkProperty extends IBaseProperty {
  type: 'string';
  resType: string;
}

export function isLinkProperty(property: any): property is ILinkProperty {
  return 'type' in property && property.type === 'string' && 'resType' in property;
}
