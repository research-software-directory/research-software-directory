import * as React from 'react';

import {
  Route,
  Switch
} from 'react-router-dom';

import { ResourceForm } from './form/ResourceForm';

import { resourceTypes } from './constants';

const Resource = (type: string) => ({match}: any) =>
  <ResourceForm resourceType={type} id={`/${type}/${match.params.id}`} />;

const resourceRoute = (resourceType: string) =>
  <Route key={resourceType} exact={true} path={`/${resourceType}/:id`} component={Resource(resourceType)}/>;

export class Routes extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <Switch>
          <Route exact={true} path="/" component={() => <div>welcome</div>}/>
          {resourceTypes.map(resourceRoute)}
        </Switch>
      </div>
    );
  }
}
