import { connect } from 'react-redux';
import { login } from './actions';
import { IUser } from './reducer';
import { Auth } from '../../components/Auth';
import { IStoreState } from '../../interfaces/misc';

interface IStateProps {
  user: null | IUser;
}
const mapStateToProps = (state: IStoreState) => ({
  user:   state.auth.user
});

interface IDispatchProps {
  login(): void;
}
const mapDispatchToProps = {
  login
};

export const AuthContainer = connect<IStateProps, IDispatchProps>(mapStateToProps, mapDispatchToProps)(Auth);
