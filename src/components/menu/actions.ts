export interface ICreateNewItem {
  type: 'CREATE_NEW_ITEM';
  resourceType: string;
  schema: any;
  id: string;
  history: History;
}

export const createNewItem = (resourceType: string, id: string, schema: any) => ({
  id,
  resourceType,
  schema,
  type: 'CREATE_NEW_ITEM'
});

export type IUndoChanges = (resourceType: string, id: string, oldData: any) => {
  type: 'UNDO_CHANGES';
  oldData: any;
  resourceType: string;
  id: string;
};

export const undoChanges: IUndoChanges = (resourceType: string, id: string, oldData: any) => ({
  type: 'UNDO_CHANGES',
  resourceType,
  id,
  oldData
});

export const saveChanges = () => ({ type: 'SAVE_CHANGES' });
