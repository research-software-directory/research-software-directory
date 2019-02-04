import createHistory from "history/createBrowserHistory";
// process.env.PUBLIC_URL is /admin when the project is built with yarn build,
// otherwise it is "" with yarn start
export const history = createHistory({ basename: process.env.PUBLIC_URL });
