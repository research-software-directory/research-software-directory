import * as React from 'react';

import {
  Route,
  Switch
} from 'react-router-dom';

import { ResourceForm } from './form/ResourceForm';

import { resourceTypes } from './constants';

import { Images } from './images';

const Resource = (type: string, isNew: boolean = false) => ({match}: any) => (
  <ResourceForm
    isNew={isNew}
    resourceType={type}
    id={isNew ? '_new' : `/${type}/${match.params.id}`}
  />
);

const resourceRoute = (isNew: boolean = false) => (resourceType: string) => (
  <Route
    key={resourceType}
    exact={true}
    path={isNew ? `/new/${resourceType}` : `/${resourceType}/:id`}
    component={Resource(resourceType, isNew)}
  />
);

export class Routes extends React.Component<{}, {}> {
  hello = () => <div>Welcome</div>;
  render() {
    return (
      <div>
        <Switch>
          <Route exact={true} path="/" component={this.hello}/>
          {resourceTypes.map(resourceRoute(false))}
          {resourceTypes.map(resourceRoute(true))}
          <Route exact={true} path="/images" component={Images} />
        </Switch>
      </div>
    );
  }
}
