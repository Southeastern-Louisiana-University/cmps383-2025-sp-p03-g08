// Render page when the path matches the specified route
import { Route, Routes } from "react-router";
import { routes } from "./routeIndex";
import { NotFoundTitle } from "../pages/page-not-found/not-found";
import HomePage from "../pages/home-page/home-page";

export const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFoundTitle />} />
      <Route path={routes.root} element={<HomePage />} />
      <Route path={routes.home} element={<HomePage />} />
    </Routes>
  );
};
