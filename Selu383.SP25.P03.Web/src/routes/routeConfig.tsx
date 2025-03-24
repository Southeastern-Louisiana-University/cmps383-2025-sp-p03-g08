// Render page when the path matches the specified route
import { Route, Routes } from "react-router";
import { routes } from "./routeIndex";
import { NotFoundTitle } from "../pages/page-not-found/not-found";

import TheaterPage from "../pages/TheatersPage";
import ShowTimesPage from "../pages/ShowTimesPage";
import ChooseSeatsPage from "../pages/ChooseSeatsPage";
import FoodAndDrinksPage from "../pages/FoodAndDrinksPage";
import FullMenuPage from "../pages/FullMenuPage";
import AboutUsPage from "../pages/AboutUsPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";

export const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFoundTitle />} />
      <Route path={routes.root} element={<HomePage />} />
      <Route path={routes.home} element={<HomePage />} />
      <Route path={routes.login} element={<LoginPage />} />
      <Route path={routes.theaters} element={<TheaterPage />} />
      <Route path={routes.showtimes} element={<ShowTimesPage />} />
      <Route path={routes.chooseseats} element={<ChooseSeatsPage />} />
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
