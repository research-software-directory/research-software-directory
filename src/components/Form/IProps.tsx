import { ISettingsProperty } from "../../rootReducer";
import { IData } from "../../interfaces/misc";

export interface IProps<T> {
  schema: T;
  data: IData;
  value: any;
  settings: ISettingsProperty;
  onChange: (data: any) => any;
  label: string;
  showLabel?: boolean;
}
