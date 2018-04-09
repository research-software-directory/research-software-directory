const config = {
  useFixtures: false
};

if (process.env.NODE_ENV === "test" || process.env.STORYBOOK_ENABLED) {
  config.useFixtures = true;
}

export default config;
