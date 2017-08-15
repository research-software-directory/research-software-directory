export interface ICreateNewItem {
  type: 'CREATE_NEW_ITEM';
  resourceType: string;
  schema: any;
  id: string;
  history: History;
}

export const createNewItem = (resourceType: string, id: string, schema: any, history: History) => ({
  history,
  id,
  resourceType,
  schema,
  type: 'CREATE_NEW_ITEM'
});

export const saveChanges = { type: 'SAVE_CHANGES' };
