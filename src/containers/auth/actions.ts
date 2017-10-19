import { Action } from 'redux';
import { createFetchAction, IFetchAction, Method } from '../../services/async';
import { BACKEND_URL } from '../../settings';

export enum types {
  LOGIN                         = 'LOGIN',
  LOGGED_IN                     = 'LOGGED_IN',
  LOGIN_ERROR                   = 'LOGIN_ERROR',
  GET_AUTH_TOKEN                = 'GET_AUTH_TOKEN',
  GET_AUTH_TOKEN_FAILED         = 'GET_AUTH_TOKEN/FAILED',
  GET_AUTH_TOKEN_FULFILLED      = 'GET_AUTH_TOKEN/FULFILLED',
  REDIRECT                      = 'REDIRECT',
  GET_ACCESS_TOKEN              = 'GET_ACCESS_TOKEN',
  GET_ACCESS_TOKEN_FAILED       = 'GET_ACCESS_TOKEN/FAILED',
  GET_ACCESS_TOKEN_FULFILLED    = 'GET_ACCESS_TOKEN/FULFILLED',
  VERIFY_ACCESS_TOKEN           = 'VERIFY_ACCESS_TOKEN',
  VERIFY_ACCESS_TOKEN_FAILED    = 'VERIFY_ACCESS_TOKEN/FAILED',
  VERIFY_ACCESS_TOKEN_FULFILLED = 'VERIFY_ACCESS_TOKEN/FULFILLED'
}

export const login: () => Action = () => ({ type: types.LOGIN });

export interface ILoggedIn extends Action { type: types.LOGGED_IN; user: any; }
export const loggedIn = (user: any): ILoggedIn => ({ type: types.LOGGED_IN, user });

export const logInError: Action = { type: types.LOGIN_ERROR };
export const getAuthToken: Action = { type: types.GET_AUTH_TOKEN };

export interface IRedirect extends Action { type: types.REDIRECT; url: string; }
export const redirect = (url: string): IRedirect => ({ type: types.REDIRECT, url });

export const getAccessToken = (authToken: string): IFetchAction =>
  createFetchAction(types.GET_ACCESS_TOKEN, Method.GET, `${BACKEND_URL}/get_access_token/${authToken}`);

export const verifyAccessToken = (accessToken: string): IFetchAction =>
  createFetchAction(types.VERIFY_ACCESS_TOKEN, Method.GET, `${BACKEND_URL}/verify_access_token/${accessToken}`);
