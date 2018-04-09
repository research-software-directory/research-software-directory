const config = {
  useFixtures: false
};

if (process.env.NODE_ENV === "development") {
  config.useFixtures = true;
}

export default config;
