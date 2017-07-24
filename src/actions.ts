import { Action } from 'redux';
import { IFailedAction, IFulfilledAction } from './async';

export interface IFetchRootJSON extends Action { type: string; }
export const fetchRootJSON: IFetchRootJSON = {type: 'FETCH_ROOT_JSON'};

export interface IFetchRootJSONFulfilled extends IFulfilledAction { type: string; payload: any; }
export const fetchRootJSONFulfilled = (payload: any): IFetchRootJSONFulfilled =>
    ({type: 'FETCH_ROOT_JSON_FULFILLED', payload});

export interface IFetchRootJSONFailed extends IFailedAction { type: string; error: any; }
export const fetchRootJSONFailed = (error: any): IFetchRootJSONFailed =>
    ({type: 'FETCH_ROOT_JSON_FAILED', error});

export interface IFetchSchema extends Action { type: string; }
export const fetchSchema: IFetchSchema = {type: 'FETCH_SCHEMA'};

export interface IFetchSchemaFulfilled extends IFulfilledAction { type: string; payload: any; }
export const fetchSchemaFulfilled = (payload: any): IFetchSchemaFulfilled =>
    ({type: 'FETCH_SCHEMA_FULFILLED', payload});

export interface IFetchSchemaFailed extends IFailedAction { type: string; error: any; }
export const fetchSchemaFailed = (error: any): IFetchSchemaFailed =>
    ({type: 'FETCH_SCHEMA_FAILED', error});
