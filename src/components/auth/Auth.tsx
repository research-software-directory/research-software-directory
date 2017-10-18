/* Auth component should only contain a single child. It will
   - Try to login when mounting
   - Render its child if the user is authenticated, otherwise null
*/
import * as React from 'react';
import {connect} from 'react-redux';
import { login } from './actions';
import { IUser } from './reducer';
import {IStoreState} from '../../store';

const mapDispatchToProps = {
  login
};

const mapStateToProps = (state: IStoreState) => ({
  user:   state.auth.user
});

interface IMappedProps {
  user: null | IUser;
}

type IDispatchProps = typeof mapDispatchToProps;

const connector = connect(mapStateToProps, mapDispatchToProps );

class AuthComponent extends React.PureComponent<IMappedProps & IDispatchProps, { }> {
  componentWillMount() {
    this.props.login();
  }
  render() {
    return this.props.user ? React.Children.only(this.props.children) : null;
  }
}

export const Auth = connector(AuthComponent);
