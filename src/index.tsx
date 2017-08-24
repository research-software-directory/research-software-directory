import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './App';
import { Auth } from './components/auth/Auth';
import { register as registerServiceWorker } from './services/registerServiceWorker';

import { Provider } from 'react-redux';
import { configureStore } from './configureStore';

import ReduxToastr from 'react-redux-toastr';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

// tslint:disable-next-line:no-import-side-effect
import 'rxjs';

const store = configureStore();

import './assets/reset.css';

import './assets/index.css';

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Auth>
        <App />
      </Auth>
      <ReduxToastr
        timeOut={4000}
        newestOnTop={false}
        preventDuplicates={true}
        position="top-left"
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        progressBar={false}
        options={{showCloseButton: true}}
      />
      </div>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
