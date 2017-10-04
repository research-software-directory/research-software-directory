import { Action } from 'redux';

export enum types {
  CREATE_NEW_ITEM = 'CREATE_NEW_ITEM',
  UNDO_CHANGES    = 'UNDO_CHANGES'
}

export interface ICreateNewItem extends Action {
  type: types.CREATE_NEW_ITEM;
  resourceType: string;
  fields: object;
  id: string;
}

export const createNewItem = (resourceType: string, id: string, fields?: any): ICreateNewItem => ({
  id,
  resourceType,
  fields: fields || {},
  type: types.CREATE_NEW_ITEM
});

export interface IUndoChanges extends Action {
  type: types.UNDO_CHANGES;
  resourceType: string;
  id: string;
}

export const undoChanges = (resourceType: string, id: string): IUndoChanges => ({
  type: types.UNDO_CHANGES,
  resourceType,
  id
});
