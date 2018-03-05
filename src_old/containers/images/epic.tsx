import * as React from 'react';
import { combineEpics } from 'redux-observable';
import { actions as toastrActions } from 'react-redux-toastr';
import { loadImages } from './actions';
import { BACKEND_URL } from '../../settings';

const image = (action: any) => () => <img alt="image" src={`${BACKEND_URL}/thumbnail/${action.response.filename}`} />;

export const epic = combineEpics(
  (action$: any) => action$.ofType('UPLOAD_IMAGE/FULFILLED').flatMap((action: any) => [
    loadImages(),
    (toastrActions as any).add({
      options: {timeOut: 3000, showCloseButton: true, component: image(action)},
      position: 'top-center',
      title: 'Image saved:',
      type: 'info'
    })]
  ),

  (action$: any) => action$.ofType('UPLOAD_IMAGE/FAILED').map((action: any) =>
    toastrActions.add({
      message: `File upload failed (${action.response.error})`,
      options: {timeOut: 3000, showCloseButton: true},
      position: 'top-center',
      title: 'Error',
      type: 'error'
    })
  )
);
