import * as React from "react";
import {
  isArraySchema,
  isBooleanSchema,
  ISchema,
  isStringEnumSchema,
  isForeignKeySchema,
  isObjectSchema,
  isStringSchema
} from "../../interfaces/json-schema";
import TypeString from "./TypeString";
import TypeDummy from "./TypeDummy";
import TypeObject from "./TypeObject";
import TypeArray from "./TypeArray";
import TypeBoolean from "./TypeBoolean";
import TypeEnum from "./TypeStringEnum";
import TypeForeignKey from "./TypeForeignKey";
import { ISettingsProperty } from "../../rootReducer";
import { IProps } from "./IProps";
import TypeImage from "./TypeImage";

abstract class FormComponentDummy extends React.Component<IProps<ISchema>> {}
type FormComponent = typeof FormComponentDummy;

type IFilterFunction = (
  schema: ISchema,
  settings: ISettingsProperty
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
  settings: ISettingsProperty
): FormComponent =>
  registry.find(({ filter }) => filter(schema, settings))!.component;

[
  [() => true, TypeDummy],
  [isObjectSchema, TypeObject],
  [isArraySchema, TypeArray],
  [isStringSchema, TypeString],
  [isStringEnumSchema, TypeEnum],
  [isBooleanSchema, TypeBoolean],
  [isForeignKeySchema, TypeForeignKey],
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
