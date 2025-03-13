// Render page when the path matches the specified route
import { Route, Routes } from "react-router";
import { routes } from "./routeIndex";
import App from "../App";
import HomePage from "../pages/home-page";

export const RoutesConfig = () => {
  return (
    <Routes>
      <Route path={routes.root} element={<App />} />
      <Route path={routes.home} element={<HomePage />} />
    </Routes>
  );
};
