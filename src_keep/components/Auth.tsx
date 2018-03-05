/* Auth component should only contain a single child. It will
   - Try to login when mounting
   - Render its child if the user is authenticated, otherwise null
*/
import * as React from 'react';
import { IUser } from '../containers/auth/reducer';

interface IProps {
  user: null | IUser;
  login(): void;
}

export class Auth extends React.PureComponent<IProps, { }> {
  componentWillMount() {
    this.props.login();
  }
  render() {
    return this.props.user ? React.Children.only(this.props.children) : null;
  }
}
