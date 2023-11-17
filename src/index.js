import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "../src/asserts/css/index.css";
import { BrowserRouter } from "react-router-dom";
import "./components/language/i18n";
import Dashboard from "./StudentDashboard/Dashboard";
import { Provider } from "react-redux";
import { store } from "./Store/Store";
import NoInternetConnection from "./views/nointernet/Nointernet";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      {/* <NoInternetConnection> */}
      <App />
      {/* </NoInternetConnection> */}
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
