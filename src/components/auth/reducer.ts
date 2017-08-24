import { ILoggedIn } from './actions';

export const reducer = (state: any = {}, action: ILoggedIn) => {
    switch (action.type) {
        case 'LOGGED_IN':
            return { user: action.user };
        default: return state;
    }
};
