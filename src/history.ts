import createHistory from "history/createBrowserHistory";
export const history = createHistory({ basename: process.env.PUBLIC_URL });
