import { combineEpics } from 'redux-observable';

import { GITHUB_AUTH_URL, GITHUB_CLIENT_ID } from '../settings';

import * as actions from './actions';

import { actions as toastrActions } from 'react-redux-toastr';

import createHistory from 'history/createBrowserHistory';

export const epic = combineEpics(
  (action$: any) => action$.ofType('LOGIN')
    .map(() => {
      const token = localStorage.getItem('access_token');
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
    .do(() => localStorage.removeItem('access_token'))
    .mapTo(actions.redirect(`${GITHUB_AUTH_URL}?client_id=${GITHUB_CLIENT_ID}`)),

  (action$: any) => action$.ofType('GET_ACCESS_TOKEN_FAILED')
    .map((action: any) =>
      toastrActions.add({
        message: `${action.response && action.response.error ? `Server response: ${action.response.error}` : ''}`,
        options: { timeOut: 0 },
        position: 'top-center',
        title: `Failed to get access token (${action.error})`,
        type: 'error'
      })
    ),

  (action$: any) => action$.ofType('GET_ACCESS_TOKEN_FULFILLED')
    .do ((action: any) => localStorage.setItem('access_token', action.response.access_token) )
    .map((action: any) => actions.loggedIn(action.response.user)),

  (action$: any) => action$.ofType('VERIFY_ACCESS_TOKEN_FULFILLED')
    .map((action: any) => actions.loggedIn(action.response.user)),

  (action$: any) => action$.ofType('VERIFY_ACCESS_TOKEN_FAILED')
    .mapTo(actions.getAuthToken),

  (action$: any) => action$.ofType('LOGGED_IN')
    .map((action: actions.ILoggedIn) =>
      toastrActions.add({
        message: `Logged in as ${action.user.name}`,
        position: 'top-center',
        title: 'Logged in',
        type: 'info'
      })
    )
);

// login
//  - empty:       code in url ? getAccessToken : getAuthToken (redirect)
//                               -> fail: ERROR
//  - accessToken: verifyAccessToken -> logged in
//                                   -> fail: getAuthToken (redirect)
