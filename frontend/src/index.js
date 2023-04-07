import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import * as sessionActions from "./store/session";
import { restoreCSRF, csrfFetch } from "./store/csrf";
import App from "./App";
import "./index.css";

import configureStore from "./store";

const store = configureStore();
const root = ReactDOM.createRoot(document.getElementById("root"));

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

const Root = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
};

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);