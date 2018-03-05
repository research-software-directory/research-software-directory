import { combineReducers } from 'redux';

const reducers = {};

['projects', 'software', 'publications'].forEach((type: string) => {
  const defaultState = ({
    status: 0,
    items: [],
    error: null
  });

  reducers[type] = (state: any = defaultState, action: any) => {
    switch (action.type) {
      case `GET_NEW_${type.toUpperCase()}`:
        return { ...state, status: 1};
      case `GET_NEW_${type.toUpperCase()}/FULFILLED`:
        return { items: action.response, status: 2};
      case `GET_NEW_${type.toUpperCase()}/FAILED`:
        return { items: [], error: action.error, status: 3};
      default:
        return state;
    }
  };
});

export const reducer = combineReducers(reducers);
