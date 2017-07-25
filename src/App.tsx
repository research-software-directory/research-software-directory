import * as React from 'react';
import {Col, Row, Well} from 'react-bootstrap';
import {connect, Dispatch} from 'react-redux';
import { Action } from 'redux';
import {fetchRootJSON, fetchSchema} from './actions';
import './App.css';
import {SoftwareForm} from './form/SoftwareForm';

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  fetchRootJSON: (): Action => dispatch(fetchRootJSON),
  fetchSchema: (): Action => dispatch(fetchSchema)
});

const mapStateToProps = (state: any) => ({
  data: state.data,
  schema: state.schema
});

const connector = connect(mapStateToProps, mapDispatchToProps );

interface IProps {
  data: any;
  schema: any;
  fetchRootJSON(): Action;
  fetchSchema(): Action;
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
    return (
      <div className="App">
        {this.renderAppLoaded()}
      </div>
      );
    }
  }

export const App = connector(AppComponent);
