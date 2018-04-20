import { ISettingsProperty } from "../../rootReducer";
import { IData } from "../../interfaces/resource";
import * as Ajv from "ajv";

export interface IProps<T> {
  schema: T;
  data: IData;
  value: any;
  readonly: boolean;
  settings: ISettingsProperty;
  onChange: (data: any) => any;
  label: string;
  showLabel?: boolean;
  validationErrors?: Ajv.ErrorObject[];
}
