import * as React from "react";
import {
  isArraySchema,
  isBooleanSchema,
  ISchema,
  isStringEnumSchema,
  isForeignKeySchema,
  isObjectSchema,
  isStringSchema,
  isNumberSchema,
  isPrimaryKeySchema
} from "../../interfaces/json-schema";
import TypeString from "./TypeString";
import TypeDummy from "./TypeDummy";
import TypeObject from "./TypeObject";
import TypeArray from "./TypeArray";
import TypeBoolean from "./TypeBoolean";
import TypeEnum from "./TypeStringEnum";
import TypeForeignKey from "./TypeForeignKey";
import { TypeNumber } from "./TypeNumber";
import { ISettingsProperty } from "../../rootReducer";
import { IProps } from "./IProps";
import TypeImage from "./TypeImage";
import { TypePrimaryKey } from "./TypePrimaryKey";

abstract class FormComponentDummy extends React.Component<IProps<ISchema>> {}
type FormComponent = typeof FormComponentDummy;

type IFilterFunction = (
  schema: ISchema,
  settings: ISettingsProperty,
  key: string
) => boolean;

const registry: {
  filter: IFilterFunction;
  component: FormComponent;
}[] = [];

export function registerFormComponent(
  filter: IFilterFunction,
  component: FormComponent
) {
  registry.unshift({ filter, component });
}

export const getComponent = (
  schema: ISchema,
  settings: ISettingsProperty,
  key: string
): FormComponent =>
  registry.find(({ filter }) => filter(schema, settings, key))!.component;

[
  [() => true, TypeDummy],
  [isObjectSchema, TypeObject],
  [isArraySchema, TypeArray],
  [isStringSchema, TypeString],
  [isStringEnumSchema, TypeEnum],
  [isBooleanSchema, TypeBoolean],
  [isNumberSchema, TypeNumber],
  [isForeignKeySchema, TypeForeignKey],
  [isPrimaryKeySchema, TypePrimaryKey],
  [isObjectSchema, TypeObject]
].forEach(([filter, component]) => {
  registerFormComponent(filter as IFilterFunction, component as FormComponent);
});

/* For images */
registerFormComponent(
  (schema, _settings) =>
    (isObjectSchema(schema) &&
      schema.properties.data &&
      isStringSchema(schema.properties.data) &&
      schema.properties.data.format === "base64" &&
      schema.properties.mimeType) as boolean,
  TypeImage
);
