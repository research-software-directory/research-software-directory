/**
 * @file Saga to run on INIT, (get settings, JWT, schemas, data)
 * @todo Scenario where JWT is invalid
 */

import { put, call, select, all } from "redux-saga/effects";
import fetch, { AxiosRequestConfig } from "axios";
import { actions as toastrActions } from "react-redux-toastr";
import { push } from "react-router-redux";
import { IStoreState } from "./rootReducer";

const SETTINGS_URL = "/settings.json";

const errorAction = (message: string) =>
  toastrActions.add({
    message: message,
    options: { timeOut: 10000, showCloseButton: true },
    position: "top-center",
    title: "Error",
    type: "error"
  });

/**
 * Fetch runtime application settings from `SETTINGS_URL`.
 * @puts         SETTINGS_FETCHED action on success.
 * @puts         toastr error failure.
 */
function* fetchSettings() {
  try {
    const response = yield fetch(SETTINGS_URL);
    yield put({
      type: "SETTINGS_FETCHED",
      data: response.data
    });
  } catch (e) {
    yield put(
      errorAction(
        `Error getting ${e.config.url}: ${e.response.status} ${
          e.response.statusText
        }`
      )
    );
  }
}

/**
 * Check if current URL contains an JWT (eg http://localhost:3000/?jwt=[JWT_HERE]) and return it
 * @returns       JWT string if in URL, else null
 */
function getJWTfromURL(): string | null {
  const splitted = window.location.href.split("?");
  if (splitted.length === 2) {
    const argSplitted = splitted[1].split("=");
    if (argSplitted[0] === "jwt") {
      return argSplitted[1];
    }
  }
  return null;
}

/**
 * Get JWT from URL or localStorage, or forward user to authorization URL.
 * @param authUrl URL to go to for authorization if there is no JWT.
 * @puts          JWT_CHANGED action with JWT.
 */
const getJWT = (authUrl: string) =>
  function*() {
    let jwt = localStorage.getItem("jwt");
    if (!jwt) {
      jwt = getJWTfromURL();
      if (!jwt) {
        window.location.href = authUrl;
        return;
      }
      localStorage.setItem("jwt", jwt);
      yield put(push("/"));
    }
    yield put({
      type: "JWT_CHANGED",
      data: jwt
    });
  };

/**
 * Wraps axios fetch with authorization header using current JWT
 * @param url     url to fetch
 * @param config  Axios config
 * @returns       AxiosPromise result
 */
function* authorizedFetch(url: string, config?: AxiosRequestConfig) {
  const jwt = yield select((state: IStoreState) => state.jwt);
  return yield fetch(url, {
    headers: {
      Authorization: `Bearer ${jwt.token}`
    },
    ...config
  });
}

function* fetchData() {
  const settings = yield select((state: any) => state.settings);
  const result = yield authorizedFetch(settings.backendUrl);
  yield put({
    type: "DATA_FETCHED",
    data: result.data
  });
}

function* fetchSchema() {
  const settings = yield select((state: any) => state.settings);
  const result = yield authorizedFetch(settings.backendUrl + "/schema");
  yield put({
    type: "SCHEMA_FETCHED",
    data: result.data
  });
}

function* initSaga() {
  try {
    yield call(fetchSettings);
    const settings = yield select((state: any) => state.settings);
    yield call(getJWT(settings.authUrl));
    yield all([call(fetchData), call(fetchSchema)]);
    yield put({ type: "INIT_DONE" });
  } catch (e) {
    if (e.message === "Network Error") {
      yield put(errorAction("Network error connecting to " + e.config.url));
    } else if (e.response) {
      yield put(
        errorAction(
          `Error getting ${e.config.url}: ${e.response.data.class}: ${
            e.response.data.error
          }`
        )
      );
    } else {
      yield put(errorAction("error: " + e));
    }
  }
}

export default initSaga;
