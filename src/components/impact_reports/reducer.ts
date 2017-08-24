export const reducer = (state: any = [], action: any) => {
  // console.log('action', action);
  if (action.type === 'FETCH_REPORTS/FULFILLED') {
    return action.response;
  }

  return state;
};
