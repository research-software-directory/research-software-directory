import {updateField} from './actions';

export const epic =
  (action$: any, store: any) => action$.ofType('UPDATE_FIELD_FROM_URL/FULFILLED').map((action: any) => {
    const mergeFunc = action.actionParams.mergeFunc || ((_: any, newValue: any) => newValue);
    const { resourceType, id, field } = action.actionParams;
    const oldValue = store.getState()
      .current
      .data[resourceType]
      .find((resource: any) => resource.id === id)[field];

    return updateField(resourceType, id, field, mergeFunc(oldValue, action.response));
  });
