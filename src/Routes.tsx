import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ResourceFormContainer } from './containers/form/ResourceFormContainer';
import { Images } from './components/images';
import { Publication } from './components/publications/Publication';
import { ImpactReports } from './components/impact_reports/ImpactReports';
import { ZoteroImporter } from './components/zotero_import/ZoteroImporter';

import { resourceTypes } from './settings';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './assets/style.css';
import { IResourceType } from './interfaces/resource';
import { Stepper } from './components/zotero_import/Stepper';

const Resource = (type: IResourceType) => ({match}: any) => (
  <ResourceFormContainer
    resourceType={type}
    id={match.params.id}
    key={match.params.id}
  />
);

const resourceRoute = (resourceType: IResourceType) => (
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

const makeFunction = (component: JSX.Element) => () => component;

const routesRender = ({location}: {location: any}) => (
  <ReactCSSTransitionGroup
    transitionName="rt-fade"
    transitionEnterTimeout={500}
    transitionLeaveTimeout={300}
  >
    <Switch key={location.pathname} location={location}>
      {resourceTypes.map(resourceRoute)}
      <Route exact={true} path="/" component={makeFunction(<div>Welcome</div>)}/>
      <Route key={location.pathname} exact={true} path="/software/:id/report" component={impactReports} />
      <Route exact={true} path="/images" component={Images} />
      <Route exact={true} path="/publication/:id" component={publication} />
      <Route exact={true} path="/zotero_import" component={makeFunction(<ZoteroImporter />)} />
      <Route exact={true} path="/publication_stepper" component={makeFunction(<Stepper />)} />
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
