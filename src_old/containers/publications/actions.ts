export enum types {
  SET_MAPPING = 'SET_MAPPING'
}

export interface IAuthor {
  firstName: string;
  lastName: string;
  person?: string;
}

export interface ISetMapping {
  type: types.SET_MAPPING;
  id: string;
  author: IAuthor;
  person: string;
}

export const setMapping = (id: string, author: IAuthor, person: string): ISetMapping => ({
  id,
  author,
  person,
  type: types.SET_MAPPING
});
