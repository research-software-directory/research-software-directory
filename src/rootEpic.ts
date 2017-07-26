import { combineEpics } from 'redux-observable';
import { fetchEpic } from './async';
import { epic as softwareFormEpic } from './form/epic';
export const rootEpic = combineEpics(fetchEpic, softwareFormEpic);
