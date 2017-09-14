import {backend} from '../../services/async';

export const ADD_TO_SCHEMA_ENUM = 'ADD_TO_SCHEMA_ENUM';
export interface IAddToSchemaEnum { type: 'ADD_TO_SCHEMA_ENUM'; resourceType: string; field: string; value: string; }

export const addToSchemaEnum = (resourceType: string, field: string, value: string): IAddToSchemaEnum =>
  ({ type: ADD_TO_SCHEMA_ENUM, resourceType, field, value });

export const UPDATE_FIELD = 'UPDATE_FIELD';
export interface IUpdateField { type: 'UPDATE_FIELD'; resourceType: string; id: string; field: string; value: any; }
export const updateField = (resourceType: string, id: string, field: string, value: any): IUpdateField =>
  ({ type: UPDATE_FIELD, resourceType, id, field, value });

export const updateFieldFromBackend = (
  resourceType: string,
  id: string,
  field: string,
  route: string,
  mergeFunc: (oldValue: any, newValue: any) => any
) => backend.get('UPDATE_FIELD_FROM_URL', route, { resourceType, id, field, mergeFunc });
