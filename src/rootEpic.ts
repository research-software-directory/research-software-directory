import { ActionsObservable, combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { IFetchJSON } from './actions';

interface IAction {
  type: string;
  oldType?: string;
}

const jsonEpic = (action$: ActionsObservable<IFetchJSON>): Observable<IAction> =>
  action$.ofType('FETCH_JSON').map(
    (action: IFetchJSON): IAction => ({oldType: action.type, type: 'EPIC_TEST'})
  );

export const rootEpic = combineEpics(jsonEpic);
