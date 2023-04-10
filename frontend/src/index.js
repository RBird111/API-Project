import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import * as sessionActions from "./store/session";
import * as spotActions from "./store/spot";
import { restoreCSRF, csrfFetch } from "./store/csrf";
import { ModalProvider, Modal } from "./context/Modal";
import App from "./App";
import "./index.scss";

import configureStore from "./store";

const store = configureStore();
const root = ReactDOM.createRoot(document.getElementById("root"));

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
  window.spotActions = spotActions;
}

const Root = () => {
  return (
    <ModalProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />

          <Modal />
        </BrowserRouter>
      </Provider>
    </ModalProvider>
  );
};

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
