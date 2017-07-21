import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import { rootEpic } from './rootEpic';
import { rootReducer} from './rootReducer';

const epicMiddleware = createEpicMiddleware(rootEpic);

export const configureStore = () =>
  createStore(
    rootReducer,
    // tslint:disable-next-line:no-string-literal
    window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__'](),
    applyMiddleware(epicMiddleware)
  )
;
