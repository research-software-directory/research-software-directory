import * as update from 'immutability-helper';
import * as actions from './actions';

// tslint:disable-next-line no-var-requires no-require-imports
const reduceReducer = require('reduce-reducers');

const updateItemReducer = (state: any = {}, action: actions.IUpdateField) => {
  switch (action.type) {
    case actions.types.UPDATE_FIELD:
      const rowIndex = state.current.data[action.resourceType].findIndex((row: any) => row.id === action.id);

      return update(state, {
        current: {
          data: {
            [action.resourceType] : {
              [ rowIndex ] : {
                [action.field] : {
                  $set: action.value
        } } } } }
      });

    default:
      return state;
  }
};

const newItemReducer = (state: any = {}, action: actions.ICreateNewItem) => {
  if (action.type === actions.types.CREATE_NEW_ITEM) {
    let newItem: any = {};
    const schema = state.schema[action.resourceType];
    Object.keys(schema.properties).forEach((propName: string) => {
      newItem[propName] = schema.properties[propName].type === 'array' ? [] : '';
      if (schema.properties[propName].enum && schema.properties[propName].enum.length === 1) {
        newItem[propName] = schema.properties[propName].enum[0];
      }
    });
    newItem.id = action.id;
    newItem.name = action.id;
    newItem = { ...newItem, ...action.fields };

    return update(state, {
      current: {
        data: {
          [action.resourceType]: {
            $unshift: [newItem]
      } } }
    });
  }

  return state;
};

const undoChangesReducer = (state: any = {}, action: actions.IUndoChanges) => {
  if (action.type === actions.types.UNDO_CHANGES) {
    const currentIndex = state.current.data[action.resourceType].findIndex((row: any) => row.id === action.id);
    const originalResource = state.data[action.resourceType].find((row: any) => row.id === action.id);
    if (originalResource) {
      return update(state, {
        current: {
          data: {
            [action.resourceType]: {
              [ currentIndex ]: {
                $set: originalResource
        } } } }
      });
    } else { // this is a new resource, remove it
      return update(state, {
        current: {
          data: {
            [action.resourceType]: {
              $splice: [[currentIndex, 1]]
        } } }
      });
    }
  }

  return state;
};

export const reducer = reduceReducer(newItemReducer, undoChangesReducer, updateItemReducer);
