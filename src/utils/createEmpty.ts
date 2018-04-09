import { ISchema } from "../interfaces/json-schema";

export function createEmpty(schema: ISchema) {
  console.log("creating empty for", schema);
  return "";
}
