import { Action } from 'redux';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Rx';

export interface IFulfilledAction extends Action { type: string; payload: any; }
export interface IFailedAction extends Action { type: string; error: any; }

export type IFulfilledActionCreator = (payload: any) => IFulfilledAction;
export type IFailedActionCreator = (payload: any) => IFailedAction;

export const fetchEpic = <T>(
    type: string,
    url: string,
    actionFulfilled: IFulfilledActionCreator,
    actionFailed: IFailedActionCreator
  ): Epic<T, {}> => (action$) =>
    action$.ofType(type).mergeMap(
      (): Observable<any> => {
        const req = fetch(url).then((resp) => resp.json());

        return Observable.fromPromise(req)
          .map(actionFulfilled)
          .catch((error) => Observable.of(actionFailed(error.toString())));
      }
    );
