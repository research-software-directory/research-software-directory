import { combineReducers } from 'redux';

import * as update from 'immutability-helper';

import * as actions from './actions';

const dataReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case 'FETCH_ROOT_JSON_FULFILLED':
      return action.response;
    case 'UPDATE_FIELD':
      const rowIndex = state[action.resourceType].findIndex((row: any) => row.id === action.id);

      return update(state, {
        [action.resourceType] : {
          [ rowIndex ] : {
            [action.field] : {
              $set : action.value
        } } }
      });
    case 'CREATE_NEW_ITEM':
      const newItem: any = {};
      Object.keys(action.schema.properties).forEach((propName: string) => {
        newItem[propName] = action.schema.properties[propName].type === 'array' ? [] : '';
      });
      newItem.id = action.id;
      newItem.name = action.id;

      return update(state, {
        [action.resourceType] : {
          $unshift: [newItem]
        }
      });
    default: return state;
  }
};

const schemaReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case 'FETCH_SCHEMA_FULFILLED':
      return action.response;
    case actions.ADD_TO_SCHEMA_ENUM:
      return update(state, {
        [action.resourceType]: {
          properties: {
            [action.field]: {
              items: {
                enum: {
                  $push: [action.value]
                }
        } } } }
      });

    default: return state;
  }
};

export const reducer = combineReducers({ data: dataReducer, schema: schemaReducer });
