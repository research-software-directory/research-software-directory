import * as React from 'react';

import {
  Link,
  Route,
  Switch
} from 'react-router-dom';

import { ResourceForm } from './form/ResourceForm';

const Resource = (type: string) => ({match}: any) =>
  <ResourceForm resourceType={type} id={`/${type}/${match.params.id}`} />;

const resourceTypes = ['software', 'person', 'project'];

const resourceRoute = (resourceType: string) =>
  <Route key={resourceType} exact={true} path={`/${resourceType}/:id`} component={Resource(resourceType)}/>;

export class Routes extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <Link to="/person/23">Person</Link>
        <Switch>
          <Route exact={true} path="/" component={Resource('software')}/>
          {resourceTypes.map(resourceRoute)}
        </Switch>
      </div>
    );
  }
}
