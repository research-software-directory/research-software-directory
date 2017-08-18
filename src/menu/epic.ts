import { combineEpics } from 'redux-observable';

import { ICreateNewItem } from './actions';

import { resourceTypes } from '../constants';

import { backend } from '../async';

import { actions as toastrActions } from 'react-redux-toastr';

const saveEpic = (action$: any, state: any) => action$.ofType('SAVE_CHANGES').map(() => {
  const store =  state.getState();
  const currentData = store.current.data;
  const oldData = store.data;

  const changes = {};
  resourceTypes.forEach((type: string) => {
    const changedItems: any[] = [];
    currentData[type].forEach((item: any) => {
      if (item !== oldData[type].find((oldItem: any) => oldItem.id === item.id)) {
        changedItems.push(item);
      }
    });
    if (changedItems.length > 0) {
      changes[type] = changedItems;
    }
  });

  return backend.post('SAVE_CHANGES_POST', 'update', changes);
});

export const epic = combineEpics(
  saveEpic,

  (action$: any, state: any) => action$.ofType('SAVE_CHANGES_POST/FULFILLED').flatMap(() => {
    const store = state.getState();

    return [
      toastrActions.add({
        message: 'Changes saved!',
        options: { timeOut: 3000 },
        position: 'top-center',
        title: 'Done',
        type: 'info'
      }),
      {
        currentData: store.current.data,
        type: 'UPDATE_OLD_DATA'
      }
    ];
  }),

  (action$: any) => action$.ofType('SAVE_CHANGES_POST/FAILED').map((action: any) =>
    toastrActions.add({
      message: `${action.error} (${action.response.error})`,
      options: { timeOut: 3000, showCloseButton: true },
      position: 'top-center',
      title: 'Error',
      type: 'error'
    })
  ),

  (action$: any) => action$.ofType('CREATE_NEW_ITEM').do((action: ICreateNewItem) => {
    // tslint:disable-next-line:prefer-type-cast
    if (action.history) { (action.history as any).push(action.id); }
    // push is not available in History @types, so cast to any
  }).ignoreElements()
);
