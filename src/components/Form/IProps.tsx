import { ISettings } from "../../rootReducer";
import { IResource } from "../../interfaces/resource";
import { IData } from "../../interfaces/misc";

export interface IProps<T> {
  schema: T;
  data: IData;
  value: IResource;
  settings: ISettings;
  onChange: (data: IResource) => any;
  label: string;
}
