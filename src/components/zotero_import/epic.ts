// import { Observable } from 'rxjs/Observable';
import { backend } from '../../services/async';
import { combineEpics } from 'redux-observable';

// const wait = (time: number) => new Promise((_, reject) => setTimeout(reject, time));

export const epic = combineEpics(
  (action$: any) => action$.ofType('CHECK_PROJECT_ID')
    .map((action: any) => backend.get('GET_PROJECT', `project/${action.id}`, {originalActionType: 'CHECK_PROJECT_ID'})),

  (action$: any) => action$.ofType('GET_PROJECT/FAILED')
    .filter((action: any) => action.actionParams && action.actionParams.originalActionType === 'CHECK_PROJECT_ID')
    .map((action: any) => ({...action, type: 'CHECK_PROJECT_ID_OK'}))
);
