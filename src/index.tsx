import * as React from "react";
import * as ReactDOM from "react-dom";
// tslint:disable-next-line:no-import-side-effect
import { Provider } from "react-redux";
import ReduxToastr from "react-redux-toastr";

import App from "./components/App";
import { store } from "./store";

import "react-redux-toastr/lib/css/react-redux-toastr.min.css";
import "./style/reset.css";
import "./style/index.css";
import "./style/style.css";

ReactDOM.render(
  <Provider store={store}>
    <div>
      <App />
      <ReduxToastr
        timeOut={4000}
        newestOnTop={false}
        preventDuplicates={true}
        position="top-left"
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        progressBar={false}
        options={{ showCloseButton: true }}
      />
    </div>
  </Provider>,
  document.getElementById("root")
);
