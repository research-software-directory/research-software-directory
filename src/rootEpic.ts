import { combineEpics } from 'redux-observable';
import { fetchRootJSONFailed, fetchRootJSONFulfilled } from './actions';
import { fetchSchemaFailed, fetchSchemaFulfilled } from './actions';
import { fetchEpic } from './async';
import { BACKEND_URL } from './constants';

const fetchRootJSONEpic = fetchEpic (
  'FETCH_ROOT_JSON',
  `${BACKEND_URL}/all`,
  fetchRootJSONFulfilled,
  fetchRootJSONFailed
);

const fetchSchemaEpic = fetchEpic (
  'FETCH_SCHEMA',
  `${BACKEND_URL}/schema`,
  fetchSchemaFulfilled,
  fetchSchemaFailed
);

export const rootEpic = combineEpics(fetchRootJSONEpic, fetchSchemaEpic);
