import { combineEpics } from 'redux-observable';

import { fetchEpic } from './async';
import { epic as authEpic } from './auth/epic';
import { epic as softwareFormEpic } from './form/epic';
export const rootEpic = combineEpics(fetchEpic, softwareFormEpic, authEpic);
