import { Epic } from 'redux-observable';

import { fetchSchema } from '../actions';

export const epic: Epic<any, {}> = (action$) => action$.ofType('ADD_SCHEMA_ENUM_FULFILLED').mapTo(fetchSchema);
