import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import { Action } from 'redux';
import {fetchRootJSON, fetchSchema } from './actions';

import { AppMenu } from './AppMenu';

import { Segment, Sidebar } from 'semantic-ui-react';

import {SoftwareForm} from './form/SoftwareForm';

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  fetchRootJSON:  (): Action => dispatch(fetchRootJSON),
  fetchSchema:    (): Action => dispatch(fetchSchema)
});

const mapStateToProps = (state: any) => ({
  data:   state.data,
  schema: state.schema
});

const connector = connect(mapStateToProps, mapDispatchToProps );

interface IProps {
  data: any;
  schema: any;
  fetchRootJSON(): Action;
  fetchSchema(): Action;
}

class AppComponent extends React.Component<IProps, {}> {
  componentWillMount() {
    this.props.fetchRootJSON();
    this.props.fetchSchema();
  }

  renderAppLoaded() {
    if (this.props.data && this.props.data.software && this.props.schema && this.props.schema.software) {
      return (
        <Sidebar.Pushable as={Segment}>
          <AppMenu />
          <Sidebar.Pusher>
            <Segment basic={true}>
              <SoftwareForm />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
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
