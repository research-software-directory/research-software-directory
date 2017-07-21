import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './App';
import { register as registerServiceWorker } from './registerServiceWorker';

import { Provider } from 'react-redux';
import { configureStore } from './configureStore';

// tslint:disable-next-line:no-import-side-effect
import 'rxjs';

const store = configureStore();

import './index.css';

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
);
registerServiceWorker();
