import * as React from 'react';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import { Routes } from './Routes';
import { history } from '../history';

import { Dimmer, Segment, Loader } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import { IStoreState } from '../rootReducer';
import Menu from '../containers/Menu';

class App extends React.PureComponent<IProps, {}> {
  render() {
    if (this.props.initialized) {
      return (
        <ConnectedRouter history={history}>
          <div style={{display: 'flex'}}>
            <Menu />
            <Segment basic={true} id="main_content">
              <Routes/>
            </Segment>
          </div>
        </ConnectedRouter>
      );
    }

    return (
      <Dimmer active={true}>
        <Loader>Loading</Loader>
      </Dimmer>
    );
  }
}

const mapStateToProps = (state: IStoreState) => ({
  initialized: state.initialized
});

interface IMappedProps {
  initialized: boolean;
}

const dispatchToProps = {
};

type IDispatchProps = typeof dispatchToProps;
type IProps = IMappedProps & IDispatchProps;
export default connect(mapStateToProps, dispatchToProps)(App);
