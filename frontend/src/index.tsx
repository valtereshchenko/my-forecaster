import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundry from "./components/ErrorBoundry";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <ErrorBoundry>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ErrorBoundry>
  </>
);
