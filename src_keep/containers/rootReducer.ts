import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { reducer as toastrReducer } from 'react-redux-toastr';

export const rootReducer =
  combineReducers({
    route: routerReducer,
    data: dataReducer,
    images: imageReducer,
    schema: schemaReducer,
    toastr: toastrReducer
  });
