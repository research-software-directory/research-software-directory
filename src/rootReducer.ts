import { combineReducers } from 'redux';
import { IFetchFulfilledAction } from './async';

const fetchRootJSONReducer = (state: any = {}, action: IFetchFulfilledAction) => {
    switch (action.type) {
        case 'FETCH_ROOT_JSON_FULFILLED':
            return action.response;
        default: return state;
    }
};

const fetchSchemaReducer = (state: any = {}, action: IFetchFulfilledAction) => {
    switch (action.type) {
        case 'FETCH_SCHEMA_FULFILLED':
            return action.response;
        default: return state;
    }
};

export const rootReducer = combineReducers({data: fetchRootJSONReducer, schema: fetchSchemaReducer});
