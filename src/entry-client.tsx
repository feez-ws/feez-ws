import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, RouteProps } from "react-router-dom";
import { CacheProvider } from "@emotion/react";
import createRoutes from "./routes";
import Async from "~/components/Async";
import App from "./App";
import "./index.css";

interface Props {
  routes: RouteProps[];
}

const Root: React.FC<Props> = ({ routes }) => {
  useEffect(() => {
    Async.shouldSuspend(true);
  }, []);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <App routes={routes} />
      </BrowserRouter>
    </React.StrictMode>
  );
};

(async () => {
  const routes = await createRoutes();

  ReactDOM.hydrateRoot(
    document.getElementById("root") as HTMLElement,
    <Root routes={routes} />
  );
})();
