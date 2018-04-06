// tslint:disable:no-string-literal

import { applyMiddleware, createStore } from "redux";
import { routerMiddleware } from "react-router-redux";

import { rootReducer } from "./rootReducer";
import { history } from "./history";

import createSagaMiddleware from "redux-saga";
import initSaga from "./saga";

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  rootReducer,
  window["__REDUX_DEVTOOLS_EXTENSION__"] &&
    window["__REDUX_DEVTOOLS_EXTENSION__"](),
  applyMiddleware(sagaMiddleware, routerMiddleware(history))
);

if (process.env.NODE_ENV === "development" && window) {
  // tslint:disable-next-line prefer-type-cast
  (window as any).store = store;
}

sagaMiddleware.run(initSaga);
