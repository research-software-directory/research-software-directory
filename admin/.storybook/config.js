import { configure } from "@storybook/react";

import fixtures from "../src/fixtures";

//setup fixtures
const keyFromFilename = filename =>
  filename.replace(".json", "").replace("./", "");
const reqFixtures = require.context("../src/fixtures", true, /.json$/);
reqFixtures.keys().forEach(filename => {
  fixtures[keyFromFilename(filename)] = reqFixtures(filename);
});

// automatically import all files ending in *.stories.js
const req = require.context("../src/stories", true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
