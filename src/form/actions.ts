import { createFetchAction, IFetchAction, Method } from '../async';
import { BACKEND_URL } from '../constants';

export const otherAction = '';
export const addToSchemaEnum = (resourceType: string, field: string, value: string): IFetchAction =>
  createFetchAction('ADD_SCHEMA_ENUM', Method.POST, `${BACKEND_URL}/enum/${resourceType}/${field}`, {value});
