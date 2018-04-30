import * as React from "react";
import { Route, Switch } from "react-router-dom";
import Resource from "../containers/Resource";

const routesRender = ({ location }: { location: any }) => (
  <Switch key={location.pathname} location={location}>
    <Route path="/:resourceType/:id" component={Resource} />
    <Route exact={true} path="/" component={() => <div>Welcome</div>} />
  </Switch>
);

export class Routes extends React.Component<{}, {}> {
  render() {
    return <Route render={routesRender} />;
  }
}
