import { Link, useNavigate } from "react-router";
import "../styles/Navbar.css";
import { routes } from "../routes/routeIndex";
import { useAuth } from "../hooks/useAuth";
import { Flex } from "@mantine/core";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar({
  theme,
  toggleTheme,
}: {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}) {

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
    <>
    <nav className="navbar">
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
      <div  style={{
    height: '150px',
    maxWidth: '100%',        // prevents overflow
    overflowX: 'hidden',     // hides horizontal scroll
    boxSizing: 'border-box'  // includes padding/border in width calculation
  }}>
  {!isLoggedIn && (
    <button
      onClick={() => navigate(routes.login)}
      className="navbar__signin"
    >
      Sign In
    </button>
  )}

  {isUser && (
    <Flex>
      {!logoutModalOpen && (
        <button onClick={handleLogoutClick} className="navbar__signin">
          Log out
        </button>
      )}
    </Flex>
  )}

  {isAdmin && (
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

  {/* Move the theme toggle button here */}
  <button onClick={toggleTheme} className={`slider-toggle ${theme}`}>
    <span className="slider-icon">
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </span>
    <span className="slider-label">
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </span>
  </button>
</div>
    </nav>
    
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
    </>
  );
}
