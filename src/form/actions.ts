// import { createFetchAction, IFetchAction, Method } from '../async';
// import { BACKEND_URL } from '../constants';

export const ADD_TO_SCHEMA_ENUM = 'ADD_TO_SCHEMA_ENUM';
export interface IAddToSchemaEnum { type: 'ADD_TO_SCHEMA_ENUM'; resourceType: string; field: string; value: string; }

export const addToSchemaEnum = (resourceType: string, field: string, value: string): IAddToSchemaEnum =>
  ({ type: ADD_TO_SCHEMA_ENUM, resourceType, field, value });
  // createFetchAction('ADD_SCHEMA_ENUM', Method.POST, `${BACKEND_URL}/enum/${resourceType}/${field}`, {value});
