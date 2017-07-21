import * as React from 'react';
import {Col, Well} from 'react-bootstrap';
import {connect, Dispatch} from 'react-redux';
import {fetchJson, IFetchJSON} from './actions';
import './App.css';
import {SoftwareForm} from './form/SoftwareForm';

const mapDispatchToProps = (dispatch: Dispatch<IFetchJSON>) => ({
  startFetch: () => dispatch(fetchJson)
});

const connector = connect((state) => state, mapDispatchToProps );
class AppComponent extends React.Component<{ startFetch: any}, { }> {
  componentWillMount() {
    console.log(this.props.startFetch());
  }

  render() {
    // console.log(this.props.startFetch());

    return (
      <div className="App">
        <Col md={8}>
          <SoftwareForm />
        </Col>
        <Col md={4}>
          <Well>
            test
          </Well>
        </Col>
      </div>
    );
  }
}

export const App = connector(AppComponent);
