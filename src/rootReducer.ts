import { combineReducers, Reducer } from 'redux';
import { routerReducer } from 'react-router-redux';

import { reducer as toastrReducer, ToastrState } from 'react-redux-toastr';

import { IData } from './interfaces/misc';
import { ISchema } from './interfaces/json-schema';

/**
 * General reducer that updates state with action.claims for type `actionType`
 * @param actionType  type of actions to process
 */
const saveDataReducer = (actionType: string): Reducer<any> => (state, action) =>
    action.type === actionType ? action.data : (state || {});

/**
 * Init reducer, initialized -> true when initSaga is done
 */
const initReducer: Reducer<boolean> = (state, action) =>
  action.type === 'INIT_DONE' ? true : (state || false);

/**
 * Decode JWT, save token & claims
 */
const jwtReducer: Reducer<IJWT> = (state, action) => {
  if (action.type === 'JWT_CHANGED') {
    return {
      token: action.data,
      claims: JSON.parse(atob(action.data.split('.')[1]))
    };
  } else {
      return state || null;
  }
};

export const rootReducer =
  combineReducers({
    route: routerReducer,
    data: saveDataReducer('DATA_FETCHED'),
    schema: saveDataReducer('SCHEMA_FETCHED'),
    settings: saveDataReducer('SETTINGS_FETCHED'),
    jwt: jwtReducer,
    initialized: initReducer,
    toastr: toastrReducer
  });

export interface ISettings {
  authUrl: string;
  backendUrl: string;
  resources: {
    [key: string]: {
      name: string,
      icon: string
    }
  }[];
}

export interface IJWT {
  token: string;
  claims: {
    sub: string,
    subType: string,
    permissions: string[],
    iat: number,
    user: {
      name: string,
      image: string
    }
  };
}

export interface IStoreState {
  route: { location: Location };
  data: IData;
  schema: { [key: string]: ISchema };
  toastr: ToastrState;
  jwt: IJWT | null;
  initialized: boolean;
  settings: ISettings;
}
