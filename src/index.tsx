import * as React from 'react';
import * as ReactDOM from 'react-dom';
// tslint:disable-next-line:no-import-side-effect
import 'rxjs';
import { register as registerServiceWorker } from './services/registerServiceWorker';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';

import { App } from './App';
import { store } from './store';
import { Auth } from './components/auth/Auth';

import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
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
