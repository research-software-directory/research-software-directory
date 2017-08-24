import { Action } from 'redux';
import { createFetchAction, IFetchAction, Method } from '../../services/async';
import { BACKEND_URL } from '../../settings';

export const logIn: Action = { type: 'LOGIN' };

export interface ILoggedIn extends Action { type: 'LOGGED_IN'; user: any; }
export const loggedIn = (user: any): ILoggedIn => ({ type: 'LOGGED_IN', user });

export const logInError: Action = { type: 'LOGIN_ERROR' };
export const getAuthToken: Action = { type: 'GET_AUTH_TOKEN' };

export interface IRedirect extends Action { type: 'REDIRECT'; url: string; }
export const redirect = (url: string): IRedirect => ({ type: 'REDIRECT', url });

export const getAccessToken = (authToken: string): IFetchAction =>
  createFetchAction('GET_ACCESS_TOKEN', Method.GET, `${BACKEND_URL}/get_access_token/${authToken}`);

export const verifyAccessToken = (accessToken: string): IFetchAction =>
  createFetchAction('VERIFY_ACCESS_TOKEN', Method.GET, `${BACKEND_URL}/verify_access_token/${accessToken}`);
