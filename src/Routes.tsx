import * as React from 'react';

import {
  Route,
  Switch
} from 'react-router-dom';

import { ResourceForm } from './components/form/ResourceForm';

import { resourceTypes } from './settings';

import { Images } from './components/images';

import {ImpactReports} from './components/ImpactReports';

const Resource = (type: string, isNew: boolean = false) => ({match}: any) => (
  <ResourceForm
    isNew={isNew}
    resourceType={type}
    id={isNew ? '_new' : `/${type}/${match.params.id}`}
  />
);

const resourceRoute = (resourceType: string) => (
  <Route
    key={resourceType}
    exact={true}
    path={`/${resourceType}/:id`}
    component={Resource(resourceType)}
  />
);

export class Routes extends React.Component<{}, {}> {
  hello = () => <div>Welcome</div>;
  render() {
    return (
      <div>
        <Switch>
          {resourceTypes.map(resourceRoute)}
          <Route exact={true} path="/" component={this.hello}/>
          <Route exact={true} path="/software/:id/report" component={ImpactReports} />
          <Route exact={true} path="/images" component={Images} />
        </Switch>
      </div>
    );
  }
}
