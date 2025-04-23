import { Link, useNavigate } from "react-router";
import "../styles/Navbar.css";
import { routes } from "../routes/routeIndex";
import { useAuth } from "../hooks/useAuth";
import { Flex } from "@mantine/core";
import { useState } from "react";
import { NavbarCart } from "./navbarCart";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // for authentication
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const isLoggedIn = !!user; // Check if user is logged in

  const isAdmin = isLoggedIn && user?.roles.includes("Admin"); // if logged Keep track of whether user or admin
  const isUser = isLoggedIn && user?.roles.includes("User");

  const handleLogoutClick = () => {
    // functions handle the modal
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
      <div className="navbar__logo">
        <Link to={routes.root} className="navbar__brand">
          <img
            src="https://imgur.com/uBaK4nV.jpg"
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
        {/* Add NavbarCart component */}
        <NavbarCart />

        {!isLoggedIn && ( // if not signed in, display sign in button
          <button
            onClick={() => navigate(routes.login)}
            className="navbar__signin"
          >
            Sign In
          </button>
        )}
        {isUser && ( // let user log out if logged in - MAKE PAGE FOR LOGOUT CONFIRMATION
          <Flex>
            {!logoutModalOpen && (
              <button onClick={handleLogoutClick} className="navbar__signin">
                Log out
              </button>
            )}
          </Flex>
        )}
        {isAdmin && ( // let admin log out and go to protected management route - MAKE
          <Flex>
            {!logoutModalOpen && (
              <button onClick={handleLogoutClick} className="navbar__signin">
                Log out
              </button>
            )}
            <button
              onClick={() => navigate("/manage")}
              className="navbar__signin"
            >
              Management
            </button>
          </Flex>
        )}
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
