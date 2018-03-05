// tslint:disable:prefer-array-literal
import { IResource } from './resource';
import { IFetchAction, IFetchFailedAction, IFetchFulfilledAction} from '../services/async';
import { IUser } from '../containers/auth/reducer';
import { ISchema } from './json-schema';
import { ToastrState } from 'react-redux-toastr';

export interface IData {
  [key: string]: IResource[];
}

interface IZoteroItem {
  status: number;
  items: any[];
  error: string | null;
}

export interface IStoreState {
  route: { location: Location };
  async: Array<(IFetchAction | IFetchFailedAction | IFetchFulfilledAction) & {progress?: number}>;
  auth: { user: IUser | null };
  current: {
    data: IData;
    schema: { [key: string]: ISchema };
  };
  data: IData;
  schema: { [key: string]: ISchema };
  images: any[];
  toastr: ToastrState;
  reports: any[];
  zotero: { [key: string]: IZoteroItem };
}
