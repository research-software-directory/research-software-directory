import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// tslint:disable-next-line no-var-requires no-require-imports
const reduceReducer = require('reduce-reducers');

import { reducer as toastrReducer } from 'react-redux-toastr';
import { reducer as authReducer } from './auth/reducer';
import { reducer as formReducer } from './form/reducer';
import { reducer as imageReducer } from '../components/images/reducer';
import { reducer as asyncReducer } from '../services/async';
import { reducer as impactReportReducer } from '../components/impact_reports/reducer';
import { reducer as zoteroImportReducer } from '../components/zotero_import/reducer';

import { reducer as publicationReducer } from '../components/publications/reducer';
import { reducer as resourceReducer } from './shared/resource/reducer';

import { IFetchFulfilledAction } from '../services/async';

const dataReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case 'FETCH_ROOT_JSON/FULFILLED':
      return action.response;
    case 'UPDATE_OLD_DATA':
      return action.currentData;
    default:
      return state;
  }
};

const schemaReducer = (state: any = {}, action: IFetchFulfilledAction) => {
  switch (action.type) {
    case 'FETCH_SCHEMA/FULFILLED':
      return action.response;
    default:
      return state;
  }
};

export const rootReducer = reduceReducer(
  combineReducers({
    route: routerReducer,
    async: asyncReducer,
    auth: authReducer,
    current: formReducer,
    data: dataReducer,
    images: imageReducer,
    schema: schemaReducer,
    toastr: toastrReducer,
    reports: impactReportReducer,
    zotero: zoteroImportReducer
  }),

  resourceReducer,
  publicationReducer
);
