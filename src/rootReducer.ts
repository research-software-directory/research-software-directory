import { combineReducers } from 'redux';
import { IFetchRootJSONFulfilled, IFetchSchemaFulfilled } from './actions';

const fetchRootJSONReducer = (state: any = {}, action: IFetchRootJSONFulfilled) => {
    switch (action.type) {
        case 'FETCH_ROOT_JSON_FULFILLED':
            return action.payload;
        default: return state;
    }
};

const fetchSchemaReducer = (state: any = {}, action: IFetchSchemaFulfilled) => {
    switch (action.type) {
        case 'FETCH_SCHEMA_FULFILLED':
            return action.payload;
        default: return state;
    }
};

export const rootReducer = combineReducers({data: fetchRootJSONReducer, schema: fetchSchemaReducer});
