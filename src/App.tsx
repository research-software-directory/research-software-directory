import * as React from 'react';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import { fetchRootJSON, fetchSchema } from './actions';
import { Routes } from './components/Routes';
import { history } from './history';

import { AppMenu } from './components/menu/AppMenu';
import { Dimmer, Segment, Loader } from 'semantic-ui-react';

const mapStateToProps = (state: any) => ({
  data:   state.data,
  schema: state.schema
});

interface IMappedProps {
  data: any;
  schema: any;
}

const dispatchToProps = {
  fetchRootJSON,
  fetchSchema
};
type IDispatchProps = typeof dispatchToProps;
type IProps = IMappedProps & IDispatchProps;
const connector = connect(mapStateToProps, dispatchToProps);

class AppComponent extends React.PureComponent<IProps, {}> {
  componentWillMount() {
    this.props.fetchRootJSON();
    this.props.fetchSchema();
  }

  requestedResourceExists = () => {
    const locationParts = window.location.href.split('/');
    if (locationParts.length === 5) {
      const resourceType = locationParts[3];
      const id = locationParts[4];

      return (
        this.props.data[resourceType] &&
        this.props.data[resourceType].find((resource: any) => resource.id === id)
      );
    }

    return true; // not a resource
  }

  dataHasLoaded = () => this.props.data && this.props.data.software && this.props.schema && this.props.schema.software;

  render() {
    if (this.dataHasLoaded()) {
      if (!this.requestedResourceExists()) {
        return <div>not found</div>;
      }

      return (
        <ConnectedRouter history={history}>
          <div style={{display: 'flex'}}>
            <AppMenu/>
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

export const App = connector(AppComponent);
