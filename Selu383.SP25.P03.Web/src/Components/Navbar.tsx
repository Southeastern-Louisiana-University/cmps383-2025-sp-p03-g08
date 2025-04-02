import { Link, useNavigate } from "react-router";
import "../styles/Navbar.css";
import { routes } from "../routes/routeIndex";
import { useAuth } from "../hooks/useAuth";
import { Flex } from "@mantine/core";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // for authentication

  const isLoggedIn = !!user; // Check if user is logged in

  const isAdmin = isLoggedIn && user?.roles.includes("Admin"); // if logged Keep track of whether user or admin
  const isUser = isLoggedIn && user?.roles.includes("User");

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to={routes.root} className="navbar__brand">
          <img
            src="/public/logo.png"
            alt="Lion Logo"
            className="navbar__icon"
          />
        </Link>
        <div className="navbar__brand">Lion's Den Cinema</div>
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
        {!isLoggedIn && ( // if not signed in, display sign in button
          <button
            onClick={() => navigate(routes.login)}
            className="navbar__signin"
          >
            Sign In
          </button>
        )}
        {isUser && ( // let user log out if logged in - MAKE PAGE FOR LOGOUT CONFIRMATION
          <button onClick={logout} className="navbar__signin">
            Log out
          </button>
        )}
        {isAdmin && ( // let admin log out and go to protected management route - MAKE
          <Flex>
            <button onClick={logout} className="navbar__signin">
              Log out
            </button>
            <button
              onClick={() => navigate("/manage")}
              className="navbar__signin"
            >
              Management
            </button>
          </Flex>
        )}
      </div>
    </nav>
  );
}
