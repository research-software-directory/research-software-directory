import { combineEpics } from 'redux-observable';

import { actions as toastrActions } from 'react-redux-toastr';

export const epic = combineEpics(
(action$: any) => action$.ofType('SAVE_AUTHOR_MAPPING/FAILED')
  .map((action: any) =>
    toastrActions.add({
      message: `${action.response && action.response.error ? `Server response: ${action.response.error}` : ''}`,
      options: { timeOut: 3000, showCloseButton: true },
      position: 'top-center',
      title: `Failed to save mapping (${action.error})`,
      type: 'error'
    })
  ),
  (action$: any) => action$.ofType('SAVE_AUTHOR_MAPPING/FULFILLED')
    .mapTo(toastrActions.add({
      message: '',
      options: { timeOut: 3000, showCloseButton: true },
      position: 'top-center',
      title: 'Mapping saved',
      type: 'info'
    })
  )
);
