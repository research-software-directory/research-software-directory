import Axios, { AxiosResponse } from 'axios';
import { Action } from 'redux';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Rx';

export enum Method {
    GET,
    POST
}
export interface IFetchAction extends Action {
  id: number;
  fetchAction: boolean;
  method: Method;
  url: string;
  data?: any;
}

export interface IFetchFulfilledAction extends IFetchAction { status: number; response?: any; }
export interface IFetchFailedAction extends IFetchAction { status: number; response?: any; }

let incrementalID = 0;
export const createFetchAction = (type: string, method: Method, url: string, data: any = {}): IFetchAction => {
  incrementalID += 1;

  return {id: incrementalID, fetchAction: true, type, method, url, data};
};

export const fetchEpic: Epic<IFetchAction, {}> = (action$) =>
  action$.filter((action) => action.fetchAction).mergeMap(
      (action: IFetchAction): Observable<any> => {
        const req = (action.method === Method.GET)
          ? Axios.get(action.url, { responseType: 'json', headers: { 'Content-Type' : 'application/json' } })
          : Axios.post(action.url, {
            data: JSON.stringify(action.data),
            headers: { 'Content-Type' : 'application/json' },
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
              fetchAction: false,
              response: e.toString(),
              status: (e.response && e.response.status) || null,
              type: `${action.type}_FAILED`
            })
          );
      }
  );
