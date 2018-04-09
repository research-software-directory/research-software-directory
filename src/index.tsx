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

/* allows for faster reloading, although it doesn't restore react state,
   react-hot-loader can be added, but then app needs to be ejected.
   https://github.com/gaearon/react-hot-loader#add-babel-after-typescript
   https://github.com/gaearon/react-hot-loader/issues/884
 */
if (process.env.NODE_ENV === "development" && (module as any).hot) {
  (module as any).hot.accept();
}

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
