import { Link, useNavigate } from "react-router";
import "../styles/Navbar.css";
import { routes } from "../routes/routeIndex";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to={routes.root} className="navbar__brand">
          <img
            src="https://imgur.com/cC4rCCG.jpg"
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
        <button
          onClick={() => navigate(routes.login)}
          className="navbar__signin"
        >
          Sign In
        </button>
      </div>
    </nav>
  );
}
