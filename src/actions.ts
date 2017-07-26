import { createFetchAction, IFetchAction, Method } from './async';
import { BACKEND_URL } from './constants';

export const fetchRootJSON: IFetchAction = createFetchAction('FETCH_ROOT_JSON', Method.GET, `${BACKEND_URL}/all`);
export const fetchSchema: IFetchAction = createFetchAction('FETCH_SCHEMA', Method.GET, `${BACKEND_URL}/schema`);
