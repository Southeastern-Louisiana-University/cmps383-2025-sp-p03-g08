import { Link, useNavigate } from "react-router";
import "../styles/Navbar.css";
import { routes } from "../routes/routeIndex";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { NavbarCart } from "./navbarCart";

export default function Navbar({
  theme,
  toggleTheme,
}: {
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const isLoggedIn = !!user;
  const isAdmin = isLoggedIn && user?.roles.includes("Admin");

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    await logout();
    setLogoutModalOpen(false);
    navigate(routes.home);
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__content">
        <div className="navbar__logo">
          <Link to={routes.root}>
            <img
              src="https://imgur.com/auq9VgV.jpg"
              alt="Lion Logo"
              className="navbar__icon"
            />
          </Link>
          <div>Lion's Den Cinema</div>
        </div>

        <ul className="navbar__links">
          <li>
            <Link to="/tickets">Get Tickets</Link>
          </li>
          <li>
            <Link to={routes.foodndrinks}>Food & Drinks</Link>
          </li>
          <li>
            <Link to={routes.about}>About Us</Link>
          </li>
        </ul>

        <div className="navbar__auth">
          <NavbarCart />
          {!isLoggedIn && (
            <button
              onClick={() => navigate(routes.login)}
              className="navbar__signin"
            >
              Sign In
            </button>
          )}

          {isLoggedIn && (
            <button onClick={handleLogoutClick} className="navbar__signin">
              Log out
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => navigate("/manage")}
              className="navbar__signin"
            >
              Management
            </button>
          )}

          <button onClick={toggleTheme} className={`slider-toggle ${theme}`}>
            <span className="slider-icon">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </span>
            <span className="slider-label">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>
      </div>

      {logoutModalOpen && (
        <div className="logout-confirm-overlay">
          <div className="logout-confirm-dialog">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="logout-confirm-buttons">
              <button
                className="logout-confirm-button"
                onClick={handleCancelLogout}
              >
                No, Cancel
              </button>
              <button
                className="logout-confirm-button"
                onClick={handleConfirmLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
