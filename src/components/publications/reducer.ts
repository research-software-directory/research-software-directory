import * as update from 'immutability-helper';

export const reducer = (state: any = {}, action: any) => {
  if (action.type === 'GET_AUTHOR_MAPPING/FULFILLED') {
    return {...state, [action.response.id]: action.response};
  }

  if (action.type === 'SAVE_AUTHOR_MAPPING/FULFILLED') {
    return update(state, {
      [action.response.id]: { type: { $set: 'saved' } }
    });
  }

  if (action.type === 'SET_AUTHOR_MAPPING') {
    const newRecord = {
      creator: action.payload.creator,
      person: action.payload.person
    };

    const oldIndex = state[action.payload.publication].mapping.findIndex((row: any) =>
      row.creator.firstName === action.payload.creator.firstName &&
      row.creator.lastName === action.payload.creator.lastName
    );
    if (oldIndex !== -1) {
      return update(state, {
        [action.payload.publication]: {
          mapping: {
            [oldIndex]: {
              $set: newRecord
            }
          }
        }
      });
    } else { // new record
      return update(state, {
        [action.payload.publication]: { mapping: { $push: [newRecord]} }
      });
    }
  }

  return state;
};
