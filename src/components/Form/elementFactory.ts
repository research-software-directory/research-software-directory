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

export function getElement(schema: ISchema): any {
  return isObjectSchema(schema)
    ? TypeObject
    : isArraySchema(schema)
      ? TypeArray
      : isStringSchema(schema)
        ? TypeString
        : isStringEnumSchema(schema)
          ? TypeEnum
          : isBooleanSchema(schema)
            ? TypeBoolean
            : isForeignKeySchema(schema) ? TypeForeignKey : TypeDummy;
}
