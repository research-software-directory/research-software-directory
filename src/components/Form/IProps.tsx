import { ISettings } from "../../rootReducer";
import { IData } from "../../interfaces/misc";

export interface IProps<T> {
  schema: T;
  data: IData;
  value: any;
  settings: ISettings;
  onChange: (data: any) => any;
  label: string;
}
