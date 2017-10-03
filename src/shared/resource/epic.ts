import { combineEpics } from 'redux-observable';
import { ICreateNewItem } from './actions';
import { push } from 'react-router-redux';

export const epic = combineEpics(
  (action$: any) => action$.ofType('CREATE_NEW_ITEM').map((action: ICreateNewItem) => { push(action.id); })
);
