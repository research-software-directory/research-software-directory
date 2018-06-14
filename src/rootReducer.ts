import { combineReducers, Reducer } from "redux";
import { routerReducer } from "react-router-redux";

import { reducer as toastrReducer, ToastrState } from "react-redux-toastr";

import { IData } from "./interfaces/resource";
import { ISchema } from "./interfaces/json-schema";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs";
import * as jwtDecode from "jwt-decode";
/**
 * General reducer that updates state with action.claims for type `actionType`
 * @param actionType  type of actions to process
 */
const saveDataReducer = (actionType: string): Reducer<any> => (state, action) =>
  action.type === actionType ? action.data : state || {};

/**
 * Init reducer, initialized -> true when initSaga is done
 */
const initReducer: Reducer<boolean> = (state, action) =>
  action.type === "INIT_DONE" ? true : state || false;

/**
 * Decode JWT, save token & claims
 */
const jwtReducer: Reducer<IJWT | null> = (state, action) => {
  if (action.type === "JWT_CHANGED") {
    return {
      token: action.data,
      claims: jwtDecode(action.data)
    };
  } else {
    return state || null;
  }
};

export const rootReducer = combineReducers({
  route: routerReducer as any,
  data: saveDataReducer("DATA_FETCHED"),
  schema: saveDataReducer("SCHEMA_FETCHED"),
  settings: saveDataReducer("SETTINGS_FETCHED"),
  jwt: jwtReducer,
  initialized: initReducer,
  toastr: toastrReducer as any
});

export interface ISettingResource {
  properties: { [key: string]: ISettingsProperty };
  readonly?: boolean;
  label: string;
  icon: SemanticICONS;
  itemLabelTemplate: string;
}

export interface ISettingsProperty {
  properties?: { [key: string]: ISettingsProperty };
  readonly?: boolean;
  label?: string;
  sortIndex?: number;
  multiline?: boolean;
  help?: string;
}

export interface ISettings {
  authUrl: string;
  backendUrl: string;
  resources: {
    [key: string]: ISettingsProperty;
  }[];
}

export interface IJWT {
  token: string;
  claims: {
    sub: string;
    subType: string;
    permissions: string[];
    iat: number;
    user: {
      name: string;
      image: string;
    };
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
