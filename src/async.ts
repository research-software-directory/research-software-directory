import Axios, { AxiosResponse } from 'axios';
import { Action } from 'redux';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Rx';
import { BACKEND_URL } from './constants';

export enum Method {
    GET,
    POST
}

export interface IFetchAction extends Action {
  id: number;
  fetchAction: boolean;
  method: Method;
  url: string;
  headers?: any;
  data?: any;
}

export interface IFetchFulfilledAction extends IFetchAction { status: number; response?: any; }
export interface IFetchFailedAction extends IFetchAction { status: number; response?: any; error: string; }

let incrementalID = 0;
export const createFetchAction = (
  type: string,
  method: Method,
  url: string,
  data: any = {},
  headers: any = {}
): IFetchAction => {
  incrementalID += 1;

  return {id: incrementalID, fetchAction: true, type, method, url, data, headers};
};

export const backend = {
  get: (name: string, params: string): IFetchAction => createFetchAction(
    name,
    Method.GET,
    `${BACKEND_URL}/${params}`,
    {},
    { token: localStorage.getItem('access_token') }
  ),
  post: (name: string, params: string, data: any): IFetchAction => createFetchAction(
    name,
    Method.POST,
    `${BACKEND_URL}/${params}`,
    data,
    { token: localStorage.getItem('access_token') }
  )
};

export const fetchEpic: Epic<IFetchAction, {}> = (action$) =>
  action$.filter((action) => action.fetchAction).mergeMap(
      (action: IFetchAction): Observable<any> => {
        const req = (action.method === Method.GET)
          ? Axios.get(action.url, {
            headers: { ...action.headers, 'Content-Type' : 'application/json' },
            responseType: 'json'
          })
          : Axios.post(action.url, action.data, {
            headers: { ...action.headers, 'Content-Type' : 'application/json' },
            responseType: 'json'
          });

        return Observable.fromPromise(req)
          .map((response: AxiosResponse): IFetchFulfilledAction => ({
            ...action,
            fetchAction: false,
            response: response.data,
            status: response.status,
            type: `${action.type}_FULFILLED`
          }))
          .catch((e: any): Observable<IFetchFailedAction> =>
            Observable.of({
              ...action,
              error: e.toString(),
              fetchAction: false,
              response: (e.response && e.response.data) || null,
              status: (e.response && e.response.status) || null,
              type: `${action.type}_FAILED`
            })
          );
      }
  );
