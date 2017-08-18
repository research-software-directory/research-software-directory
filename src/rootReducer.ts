import {reducer as toastrReducer} from 'react-redux-toastr';
import {reducer as asyncReducer} from './async';
import {reducer as authReducer} from './auth/reducer';
import {reducer as formReducer} from './form/reducer';
import {reducer as imageReducer} from './images/reducer';

import {combineReducers} from 'redux';
import {IFetchFulfilledAction} from './async';

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

export const rootReducer = combineReducers({
  async: asyncReducer,
  auth: authReducer,
  current: formReducer,
  data: dataReducer,
  images: imageReducer,
  schema: schemaReducer,
  toastr: toastrReducer

});
