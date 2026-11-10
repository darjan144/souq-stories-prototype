// Extends app.json. EXPO_BASE_URL lets the web build live under a subpath,
// e.g. EXPO_BASE_URL=/souq-stories for https://<user>.github.io/souq-stories
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...(config.experiments ?? {}),
    baseUrl: process.env.EXPO_BASE_URL ?? '',
  },
});
