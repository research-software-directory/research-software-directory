import * as actions from './actions';

export interface IUser {
  id: string;
  avatar_url: string;
  name: string;
}

export interface IState {
  user?: IUser;
}

export const reducer = (state: IState = {}, action: actions.ILoggedIn) =>
  action.type === actions.types.LOGGED_IN ? { user: action.user } : state;
