import { combineReducers } from 'redux';

// import * as actions from './actions';

const dataReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case 'FETCH_ROOT_JSON/FULFILLED':
      return action.response;
    default: return state;
  }
};

const schemaReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case 'FETCH_SCHEMA/FULFILLED':
      return action.response;
    // case actions.ADD_TO_SCHEMA_ENUM:
    //   return update(state, {
    //     [action.resourceType]: {
    //       properties: {
    //         [action.field]: {
    //           items: {
    //             enum: {
    //               $push: [action.value]
    //             }
    //     } } } }
    //   });

    default: return state;
  }
};

export const reducer = combineReducers({ data: dataReducer, schema: schemaReducer });
