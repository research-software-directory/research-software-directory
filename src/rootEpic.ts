import { combineEpics } from 'redux-observable';

import { fetchEpic } from './services/async';

import { epic as authEpic } from './components/auth/epic';
import { epic as imageEpic } from './components/images/epic';
import { epic as menuEpic } from './components/menu/epic';
import { epic as publicationsEpic } from './components/publications/epic';
import { epic as formEpic } from './components/form/epic';

export const rootEpic = combineEpics(fetchEpic, imageEpic, menuEpic, authEpic, publicationsEpic, formEpic);
