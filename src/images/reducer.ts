export const reducer = (state: any = [], action: any) => {
  if (action.type === 'GET_IMAGES/FULFILLED') {
    return action.response;
  }

  return state;
}
