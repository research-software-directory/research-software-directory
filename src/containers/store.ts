import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { routerMiddleware } from 'react-router-redux';

import { rootEpic } from './rootEpic';
import { rootReducer } from './rootReducer';
import { history } from '../history';
import { IFetchAction, IFetchFailedAction, IFetchFulfilledAction } from '../services/async';
import { IUser } from './auth/reducer';
import { ISchema } from '../interfaces/json-schema';
import { ToastrState } from 'react-redux-toastr';
import { IResource } from '../interfaces/resource';

export const store = createStore(
  rootReducer,
  // tslint:disable-next-line:no-string-literal
  window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__'](),
  applyMiddleware(createEpicMiddleware(rootEpic), routerMiddleware(history))
);

if (process.env.NODE_ENV === 'development' && window) {
  // tslint:disable-next-line prefer-type-cast
  (window as any).store = store;
}

// tslint:disable:prefer-array-literal
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
