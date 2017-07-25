import { Action } from 'redux';
import { IFailedAction, IFulfilledAction } from '../async';

export interface IAddEnumValue extends Action { type: string; resourceType: string; fieldName: string; value: string; }
export const addEnumValue = (resourceType: string, fieldName: string, value: string):
 IAddEnumValue => ({type: 'ADD_ENUM_VALUE', resourceType, fieldName, value});

export interface IAddEnumValueFulfilled extends IFulfilledAction { type: string; payload: any; }
export const addEnumValueFulfilled = (payload: any): IAddEnumValueFulfilled =>
    ({type: 'ADD_ENUM_VALUE_FULFILLED', payload});

export interface IAddEnumValueFailed extends IFailedAction { type: string; error: any; }
export const fetchRootJSONFailed = (error: any): IFetchRootJSONFailed =>
    ({type: 'ADD_ENUM_VALUE_FAILED', error});


interface ICreatorTypePair { type: string; create(data?: any): Action; }

class AsyncAction {
    name: string = '';
    start: ICreatorTypePair;
    constructor(name: string) {
        this.name = name;
        this.start = {
            create: (data) => ({ type: `${this.name}_START`, data }),
            type: `${this.name}_START`
        };
    }
}
let a = new AsyncAction('FETCH_SOMETHING');
a.start.create();
a.start.type;
