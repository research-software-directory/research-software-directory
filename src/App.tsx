import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import {fetchRootJSON, fetchSchema } from './actions';

import { Routes } from './Routes';

import { AppMenu } from './components/menu/AppMenu';

import { Segment } from 'semantic-ui-react';

const dispatchToProps = {
  fetchRootJSON,
  fetchSchema
};

const mapStateToProps = (state: any) => ({
  data:   state.data,
  schema: state.schema
});

interface IMappedProps {
  data: any;
  schema: any;
}

interface IDispatchProps {
  fetchRootJSON: any;
  fetchSchema: any;
}
type IProps = IMappedProps & IDispatchProps;

const connector = connect(mapStateToProps, dispatchToProps);

class AppComponent extends React.Component<IProps, {}> {
  componentWillMount() {
    this.props.fetchRootJSON();
    this.props.fetchSchema();
  }

  renderMenu = (routeParams: any) => <AppMenu routeParams={routeParams} />;

  renderAppLoaded() {
    if (this.props.data && this.props.data.software && this.props.schema && this.props.schema.software) {
      const locationParts = window.location.href.split('/');
      if (locationParts.length === 5) {
        const resourceType = locationParts[3];
        const id = locationParts[4];
        if (
          !this.props.data[resourceType] ||
          !this.props.data[resourceType].find((resource: any) => resource.id === id)
        ) {
          // resource not found...
          window.location.href = '/';

          return null;
        }
      }

      return (
        <BrowserRouter>
          <div style={{display: 'flex'}}>
            <Route component={this.renderMenu} />
            <Segment basic={true} style={{marginRight: '2em'}} id="main_content">
              <Routes />
            </Segment>
          </div>
        </BrowserRouter>
      );
    }

    return null;
  }

  render() {
    return (
      this.renderAppLoaded()
    );
  }
}

export const App = connector(AppComponent);
