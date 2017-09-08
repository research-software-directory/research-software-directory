import * as update from 'immutability-helper';

export const reducer = (state: any = {}, action: any) => {
  if (action.type === 'GET_AUTHOR_MAPPING/FULFILLED') {
    return {...state, [action.response.id]: action.response.mapping};
  }

  if (action.type === 'SET_AUTHOR_MAPPING') {
    const newRecord = {
      creator: action.payload.creator,
      person: action.payload.person
    };

    const oldIndex = state[action.payload.publication].findIndex((row: any) =>
      row.creator.firstName === action.payload.creator.firstName &&
      row.creator.lastName === action.payload.creator.lastName
    );
    if (oldIndex !== -1) {
      return update(state, {
        [action.payload.publication]: {
          [oldIndex]: {$set: newRecord}
        }
      });
    } else { // new record
      return update(state, {
        [action.payload.publication]: {$push: [newRecord]}
      });
    }
  }

  return state;
};
