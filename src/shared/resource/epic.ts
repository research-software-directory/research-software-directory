import { combineEpics } from 'redux-observable';
import * as actions from './actions';
import { push } from 'react-router-redux';

export const epic = combineEpics(
  (action$: any) => action$
    .ofType(actions.types.CREATE_NEW_ITEM)
    .map((action: actions.ICreateNewItem) =>
      push(`/${action.resourceType}/${action.id}`)
    )
);
