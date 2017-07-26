import { combineEpics } from 'redux-observable';
import { fetchEpic } from './async';

export const rootEpic = combineEpics(fetchEpic);
