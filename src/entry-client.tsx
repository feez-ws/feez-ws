import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, RouteProps } from "react-router-dom";
import createRoutes from "./routes";
import Async from "~/components/Async";
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
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route}></Route>
          ))}
        </Routes>
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
