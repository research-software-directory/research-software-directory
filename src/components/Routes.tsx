import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ResourceForm } from './form/ResourceForm';
import { Images } from './images';
import { Publications } from './publications/Publications';
import { Publication } from './publications/Publication';
import { ImpactReports } from './impact_reports/ImpactReports';
import { resourceTypes } from '../settings';

const Resource = (type: string) => ({match}: any) => (
  <ResourceForm
    resourceType={type}
    id={`/${type}/${match.params.id}`}
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

const impactReports = ({match}: any) => (
  <ImpactReports id={`${match.params.id}`} />
);

const publication = ({match}: any) => (
  <Publication id={`/publication/${match.params.id}`} />
);

export class Routes extends React.Component<{}, {}> {
  hello = () => <div>Welcome</div>;
  render() {
    return (
      <div>
        <Switch>
          {resourceTypes.map(resourceRoute)}
          <Route exact={true} path="/" component={this.hello}/>
          <Route exact={true} path="/software/:id/report" component={impactReports} />
          <Route exact={true} path="/images" component={Images} />
          <Route exact={true} path="/publications" component={Publications} />
          <Route exact={true} path="/publication/:id" component={publication} />
        </Switch>
      </div>
    );
  }
}
