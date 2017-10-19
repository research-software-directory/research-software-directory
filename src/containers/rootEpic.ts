import { combineEpics } from 'redux-observable';

import { fetchEpic } from '../services/async';

import { epic as authEpic } from './auth/epic';
import { epic as imageEpic } from '../components/images/epic';
import { epic as menuEpic } from '../components/menu/epic';
import { epic as formEpic } from './form/epic';
import { epic as zoteroEpic } from '../components/zotero_import/epic';
import { epic as resourceEpic } from './shared/resource/epic';

export const rootEpic = combineEpics(
  fetchEpic,
  imageEpic,
  menuEpic,
  authEpic,
  formEpic,
  zoteroEpic,
  resourceEpic
);
