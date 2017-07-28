import { Epic } from 'redux-observable';

// import { actions as toastrActions } from 'react-redux-toastr';
// import { fetchSchema } from '../actions';

export const epic: Epic<any, {}> = (action$) => action$.ofType('ADD_SCHEMA_ENUM_FULFILLED').ignoreElements();
  // .mergeMap((action: any) => [
  //   toastrActions.add({
  //     message: `Option '${action.data.value}' added`,
  //     position: 'top-center',
  //     title: 'Added',
  //     type: 'info'
  //   }),
  //   fetchSchema
  // ]);
