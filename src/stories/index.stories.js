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
import { EmptyResource } from "../components/Resource/EmptyResource";

const settings = require("../fixtures/settings.json");
const data = require("../fixtures/data.json");
const schema = require("../fixtures/schema.json");
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");

// This sets the mock adapter on the default instance
var mockAxios = new MockAdapter(axios);

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

mockAxios
  .onGet("/api/software/xenon")
  .reply(200, data.software.find(d => d.primaryKey.id === "xenon"));

mockAxios
  .onGet("/api/project/andi")
  .reply(200, data.project.find(d => d.primaryKey.id === "andi"));

mockAxios
  .onGet("/api/mention/QLEK6HLW")
  .reply(200, data.mention.find(d => d.primaryKey.id === "QLEK6HLW"));

mockAxios
  .onGet("/api/organization/nlesc")
  .reply(200, data.organization.find(d => d.primaryKey.id === "nlesc"));

mockAxios
  .onGet("/api/person/s.verhoeven")
  .reply(200, data.person.find(d => d.primaryKey.id === "s.verhoeven"));

const RouteAndRedux = ({ children }) => (
  <Provider store={store}>
    <Router history={history}>{children}</Router>
  </Provider>
);

storiesOf("Full app", module).add("default", () => (
  <Provider store={store}>
    <App />
  </Provider>
));

storiesOf("Resource/Software", module)
  .add("xenon", () => (
    <Provider store={store}>
      <Resource
        jwt={jwtData}
        schema={schema}
        data={data}
        settings={settings}
        messageToastr={action("messageToastr")}
        errorToastr={action("errorToastr")}
        push={action("push")}
        match={{ params: { resourceType: "software", id: "xenon" } }}
      />
    </Provider>
  ))
  .add("empty", () => (
    <Provider store={store}>
      <EmptyResource
        jwt={jwtData}
        schema={schema}
        data={data}
        settings={settings}
        seed={{ id: "some random id", now: "2018-05-07T14:54:42Z" }}
        messageToastr={action("messageToastr")}
        errorToastr={action("errorToastr")}
        push={action("push")}
        match={{ params: { resourceType: "software" } }}
      />
    </Provider>
  ));

storiesOf("Resource/Project", module).add("andi", () => (
  <Provider store={store}>
    <Resource
      jwt={jwtData}
      schema={schema}
      data={data}
      settings={settings}
      messageToastr={action("messageToastr")}
      errorToastr={action("errorToastr")}
      push={action("push")}
      match={{ params: { resourceType: "project", id: "andi" } }}
    />
  </Provider>
));

storiesOf("Resource/Mention", module).add("xenon-tutorial", () => (
  <Provider store={store}>
    <Resource
      jwt={jwtData}
      schema={schema}
      data={data}
      settings={settings}
      messageToastr={action("messageToastr")}
      errorToastr={action("errorToastr")}
      push={action("push")}
      match={{ params: { resourceType: "mention", id: "QLEK6HLW" } }}
    />
  </Provider>
));

storiesOf("Resource/Organization", module).add(
  "Netherlands eScience Center",
  () => (
    <Provider store={store}>
      <Resource
        jwt={jwtData}
        schema={schema}
        data={data}
        settings={settings}
        messageToastr={action("messageToastr")}
        errorToastr={action("errorToastr")}
        push={action("push")}
        match={{ params: { resourceType: "organization", id: "nlesc" } }}
      />
    </Provider>
  )
);

storiesOf("Resource/Person", module).add("s.verhoeven", () => (
  <Provider store={store}>
    <Resource
      jwt={jwtData}
      schema={schema}
      data={data}
      settings={settings}
      messageToastr={action("messageToastr")}
      errorToastr={action("errorToastr")}
      push={action("push")}
      match={{ params: { resourceType: "person", id: "s.verhoeven" } }}
    />
  </Provider>
));
storiesOf("Menu", module)
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
