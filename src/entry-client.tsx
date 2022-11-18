import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import createRoutes from "./routes";
import "./index.css";

async function createRoot() {
  const routes = await createRoutes();

  ReactDOM.hydrateRoot(
    document.getElementById("root") as HTMLElement,
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
}

(async () => {
  await createRoot();
})();
