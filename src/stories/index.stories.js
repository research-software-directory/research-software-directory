import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { createStore } from "redux";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { history } from "../history";

import App from "../components/App";
import MainMenu from "../components/Menu";
import ResourceList from "../components/Menu/ResourceList";
import ResourceType from "../components/Menu/ResourceType";
import Resource from "../components/Resource";

const settings = require("../fixtures/settings.json");
const data = require("../fixtures/data.json");
const schema = require("../fixtures/schema.json");
const jwtData = {
  token: "asdasd",
  claims: {
    sub: "Tommos0",
    subType: "GITHUB",
    permissions: ["read", "write"],
    iat: 1520588504,
    user: {
      name: "Tom Klaver",
      image: "https://avatars0.githubusercontent.com/u/9217533?v=4"
    }
  }
};

const store = createStore(state => state, {
  jwt: jwtData,
  schema,
  data,
  settings,
  route: {
    location: {}
  },
  initialized: true
});

history.listen(action("routing event"));

const RouteAndRedux = ({ children }) => (
  <Provider store={store}>
    <Router history={history}>{children}</Router>
  </Provider>
);

storiesOf("Full app").add("default", () => (
  <Provider store={store}>
    <App />
  </Provider>
));

storiesOf("Resource").add("default", () => (
  <Resource
    jwt={jwtData}
    schema={schema}
    data={data}
    settings={settings}
    messageToastr={action("messageToastr")}
    errorToastr={action("errorToastr")}
    push={action("push")}
  />
));

storiesOf("Menu")
  .add("ResourceList", () => (
    <RouteAndRedux>
      <ResourceList
        search=""
        type="software"
        data={data.software}
        schema={schema}
        location={null}
        settings={settings.resources["software"]}
        push={action("push")}
      />
    </RouteAndRedux>
  ))
  .add("ResourceType", () => (
    <RouteAndRedux>
      <ResourceType
        type="software"
        icon="user"
        defaultOpen={true}
        search=""
        push={action("push")}
      />
    </RouteAndRedux>
  ))
  .add("Full menu", () => (
    <RouteAndRedux>
      <MainMenu
        jwt={jwtData}
        schema={schema}
        data={data}
        settings={settings}
        push={action("push")}
      />
    </RouteAndRedux>
  ));
