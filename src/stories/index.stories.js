import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import JsonEditor from "../components/Resource/JsonEditor";
import App from "../components/App";
import { store } from "../store";
import { Provider } from "react-redux";
import MainMenu from "../components/Menu";
import { Router } from "react-router";
import ResourceList from "../components/Menu/ResourceList";
import ResourceType from "../components/Menu/ResourceType";
import Resource from "../components/Resource";
import { history } from "../history";

const settings = require("../fixtures/settings.json");
const data = require("../fixtures/data.json");
const schema = require("../fixtures/schema.json");

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

storiesOf("JsonEditor").add("default", () => (
  <div style={{ height: "200px" }}>
    <JsonEditor value="Asdasdasd" />
  </div>
));

storiesOf("Resource").add("default", () => (
  <Resource
    jwt={store.getState().jwt}
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
        jwt={store.getState().jwt}
        schema={schema}
        data={data}
        settings={settings}
        push={action("push")}
      />
    </RouteAndRedux>
  ));
