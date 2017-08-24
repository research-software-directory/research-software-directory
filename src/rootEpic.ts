import { combineEpics } from 'redux-observable';

import { fetchEpic } from './async';
import { epic as authEpic } from './components/auth/epic';
import { epic as imageEpic } from './components/images/epic';
import { epic as menuEpic } from './components/menu/epic';

export const rootEpic = combineEpics(fetchEpic, imageEpic, menuEpic, authEpic);
