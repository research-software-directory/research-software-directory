/* Auth component should only contain a single child. It will
   - Try to login when mounting
   - Render its child if the user is authenticated, otherwise null
*/
import * as React from 'react';
import {connect} from 'react-redux';
import { login } from './actions';

const mapDispatchToProps = {
  login
};

const mapStateToProps = (state: any) => ({
  user:   state.auth.user
});

const connector = connect(mapStateToProps, mapDispatchToProps );

interface IProps {
  user: any;
  login: typeof login;
}

class AuthComponent extends React.PureComponent<IProps, { }> {
  componentWillMount() {
    this.props.login();
  }
  render() {
    return this.props.user ? React.Children.only(this.props.children) : null;
  }
}

export const Auth = connector(AuthComponent);
