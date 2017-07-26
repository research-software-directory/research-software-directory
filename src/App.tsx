import * as React from 'react';
import {Col, Row, Well} from 'react-bootstrap';
import {connect, Dispatch} from 'react-redux';
import { Action } from 'redux';
import {fetchRootJSON, fetchSchema, login} from './actions';
import './App.css';
import {SoftwareForm} from './form/SoftwareForm';
import { GITHUB_AUTH_URL, GITHUB_CLIENT_ID } from './settings';
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  fetchRootJSON: (): Action => dispatch(fetchRootJSON),
  fetchSchema: (): Action => dispatch(fetchSchema),
  login: (token: string): Action => dispatch(login(token))
});

const mapStateToProps = (state: any) => ({
  data: state.data,
  schema: state.schema,
  user: state.user
});

const connector = connect(mapStateToProps, mapDispatchToProps );

interface IProps {
  data: any;
  schema: any;
  user: any;
  fetchRootJSON(): Action;
  fetchSchema(): Action;
  login(token: string): Action;
}

class AppComponent extends React.Component<IProps, { }> {
  componentWillMount() {
    this.props.fetchRootJSON();
    this.props.fetchSchema();
  }

  renderAppLoaded() {
    if (this.props.data && this.props.data.software && this.props.schema && this.props.schema.software) {
      return (
        <Row>
          <Col md={8}>
            <SoftwareForm />
          </Col>
          <Col md={4}>
            <Well>
              {JSON.stringify(this.props)}
            </Well>
          </Col>
        </Row>
      );
    }

    return null;
  }

  render() {
    if (this.props.user) {
      return (
        <div className="App">
          {this.renderAppLoaded()}
        </div>
        );
    } else {
      const query = window.location.search.substr(1);
      const reResult = query.match(/code=(.*?)($|&)/);
      if (reResult) {
        localStorage.setItem('auth_token', reResult[1]);
      }
      const token = localStorage.getItem('auth_token');
      if (!token) {
        document.location.href = `${GITHUB_AUTH_URL}?client_id=${GITHUB_CLIENT_ID}`;

        return null;
      }
      this.props.login(token);

      return null;
    }
  }
}

export const App = connector(AppComponent);
