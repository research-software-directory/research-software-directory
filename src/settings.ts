let BACKEND_URL = '';
if (window && window.location && window.location.href) {
  const s = window.location.href.replace(/https?:\/\//, '').split('.');
  // tslint:disable-next-line:no-http-string
  BACKEND_URL = process.env.REACT_APP_BACKEND || ('//' + 'api.' + s[s.length - 2] + '.' + s[s.length - 1]);
}
export {BACKEND_URL};
export const resourceTypes = ['software', 'person', 'project', 'organization'];
