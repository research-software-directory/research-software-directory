import { combineEpics } from 'redux-observable';

import { GITHUB_AUTH_URL, GITHUB_CLIENT_ID } from '../../settings';

import * as actions from './actions';

import { actions as toastrActions } from 'react-redux-toastr';

import createHistory from 'history/createBrowserHistory';

import { accessToken } from '../../async';

export const epic = combineEpics(
  (action$: any) => action$.ofType('LOGIN')
    .map(() => {
      /* Try to find ACCESS TOKEN in local storage
         If not found, check if url contains ?code=...
         which contains AUTHORIZATION CODE (forwarded
         from from GitHub.
      */
      const token = accessToken.get();
      if (token) { return actions.verifyAccessToken(token); }
      const query = window.location.search.substr(1);
      const reResult = query.match(/code=(.*?)($|&)/);
      if (reResult) {
        createHistory().replace('/'); // removes ?code=... from url

        return actions.getAccessToken(reResult[1]);
      }

      return actions.getAuthToken;
    }),

  (action$: any) => action$.ofType('REDIRECT')
    .do((action: actions.IRedirect) => {
      document.location.href = action.url;
    })
    .ignoreElements(),

  (action$: any) => action$.ofType('GET_AUTH_TOKEN')
    .do(accessToken.clear)
    .mapTo(actions.redirect(`${GITHUB_AUTH_URL}?client_id=${GITHUB_CLIENT_ID}`)),

  (action$: any) => action$.ofType('GET_ACCESS_TOKEN/FAILED')
    .map((action: any) =>
      toastrActions.add({
        message: `${action.response && action.response.error ? `Server response: ${action.response.error}` : ''}`,
        options: { timeOut: 0 },
        position: 'top-center',
        title: `Failed to get access token (${action.error})`,
        type: 'error'
      })
    ),

  (action$: any) => action$.ofType('GET_ACCESS_TOKEN/FULFILLED')
    .do ((action: any) => accessToken.set(action.response.access_token) )
    .map((action: any) => actions.loggedIn(action.response.user)),

  (action$: any) => action$.ofType('VERIFY_ACCESS_TOKEN/FULFILLED')
    .map((action: any) => actions.loggedIn(action.response.user)),

  (action$: any) => action$.ofType('VERIFY_ACCESS_TOKEN/FAILED')
    .mapTo(actions.getAuthToken),

  (action$: any) => action$.ofType('LOGGED_IN')
    .map((action: actions.ILoggedIn) =>
      toastrActions.add({
        message: `Logged in as ${action.user.name}`,
        options: { timeOut: 3000, showCloseButton: true },
        position: 'top-center',
        title: 'Logged in',
        type: 'info'
      })
    )
);
