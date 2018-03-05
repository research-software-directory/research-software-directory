import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

// import { IResourceType } from '../interfaces/resource';

// const Resource = (type: IResourceType) => ({match}: any) => (
//   console.log(type, match) || null
// );
//
// const resourceRoute = (resourceType: IResourceType) => (
//   <Route
//     key={resourceType}
//     exact={true}
//     path={`/${resourceType}/:id`}
//     component={Resource(resourceType)}
//   />
// );

const makeFunction = (component: JSX.Element) => () => component;

const routesRender = ({location}: {location: any}) => (

  <Switch key={location.pathname} location={location}>
    <Route path="/:resource_type/:id" component={makeFunction(<div>Welcome (resourceType)</div>)}/>
    <Route exact={true} path="/" component={makeFunction(<div>Welcome</div>)}/>
  </Switch>
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
