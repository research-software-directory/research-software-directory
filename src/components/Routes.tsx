import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ResourceForm } from './form/ResourceForm';
import { Images } from './images';
import { Publication } from './publications/Publication';
import { ImpactReports } from './impact_reports/ImpactReports';
import {ZoteroImporter} from './zotero_import/ZoteroImporter';

import { resourceTypes } from '../settings';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import '../assets/style.css';

const Resource = (type: string) => ({match}: any) => (
  <ResourceForm
    resourceType={type}
    id={match.params.id}
    key={match.params.id}
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
  <Publication id={`${match.params.id}`} />
);

const zoteroImporter = () => <ZoteroImporter />;

const hello = () => <div>Welcome</div>;

const routesRender = ({location}: {location: any}) => (
  <ReactCSSTransitionGroup
    transitionName="rt-fade"
    transitionEnterTimeout={500}
    transitionLeaveTimeout={300}
  >
    <Switch key={location.pathname} location={location}>
      {resourceTypes.map(resourceRoute)}
      <Route exact={true} path="/" component={hello}/>
      <Route key={location.pathname} exact={true} path="/software/:id/report" component={impactReports} />
      <Route exact={true} path="/images" component={Images} />
      <Route exact={true} path="/publication/:id" component={publication} />
      <Route exact={true} path="/zotero_import" component={zoteroImporter} />
    </Switch>
  </ReactCSSTransitionGroup>
);

export class Routes extends React.Component<{}, {}> {

  render() {
    return (
      <div style={{position: 'relative'}}>
        <Route render={routesRender} />
      </div>
    );
  }
}
