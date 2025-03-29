// Render page when the path matches the specified route
import { Route, Routes } from "react-router";
import { routes } from "./routeIndex";
import { NotFoundTitle } from "../pages/page-not-found/not-found";

import TheaterPage from "../pages/TheatersPage";
import ShowTimesPage from "../pages/ShowTimesPage";
import FoodAndDrinksPage from "../pages/FoodAndDrinksPage";
import FullMenuPage from "../pages/FullMenuPage";
import AboutUsPage from "../pages/AboutUsPage";
import LoginPage from "../pages/LoginPage";

import HomePage from "../pages/HomePage";
import ProtectedRoute from "../Components/ProtectedRoute";
import { SeatingPage } from "../pages/SeatingPage";

export const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFoundTitle />} />
      <Route path={routes.root} element={<HomePage />} />
      <Route path={routes.home} element={<HomePage />} />
      <Route path={routes.login} element={<LoginPage />} />
      <Route path={routes.theaters} element={<TheaterPage />} />
      <Route path={routes.showtimes} element={<ShowTimesPage />} />
      <Route path={routes.seating} element={<SeatingPage />} />
      <Route path={routes.foodndrinks} element={<FoodAndDrinksPage />} />
      <Route path={routes.menu} element={<FullMenuPage />} />
      <Route path={routes.about} element={<AboutUsPage />} />

      {/* Example protected route */}
      <Route
        path="/secret-admin"
        element={
          <ProtectedRoute>
            <h1>Admin Only</h1>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
