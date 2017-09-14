import * as React from 'react';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import { fetchRootJSON, fetchSchema } from './actions';
import { Routes } from './components/Routes';
import { history } from './history';

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

class AppComponent extends React.PureComponent<IProps, {}> {
  componentWillMount() {
    this.props.fetchRootJSON();
    this.props.fetchSchema();
  }

  renderAppLoaded() {
    if (this.props.data && this.props.data.software && this.props.schema && this.props.schema.software) {
      const locationParts = window.location.href.split('/');
      if (locationParts.length === 5) {
        const resourceType = locationParts[3];
        const id = locationParts[4];
        if (
          !this.props.data[resourceType] ||
          !this.props.data[resourceType].find((resource: any) => resource.id === `/${resourceType}/${id}`)
        ) {

          return <div>not found</div>;
        }
      }

      return (
        <ConnectedRouter history={history}>
          <div style={{display: 'flex'}}>
            <AppMenu />
            <Segment basic={true} style={{marginRight: '2em'}} id="main_content">
              <Routes />
            </Segment>
          </div>
        </ConnectedRouter>
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
