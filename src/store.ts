import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { routerMiddleware } from 'react-router-redux';

import { rootEpic } from './rootEpic';
import { rootReducer} from './rootReducer';
import { history } from './history';

export const store = createStore(
  rootReducer,
  // tslint:disable-next-line:no-string-literal
  window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__'](),
  applyMiddleware(createEpicMiddleware(rootEpic), routerMiddleware(history))
);
