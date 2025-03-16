import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/" className="navbar__brand">
          <img src="/assets/lion-logo.png" alt="Lion Logo" className="navbar__icon" />
          Lion's Den Cinema
        </Link>
      </div>
      <ul className="navbar__links">
        <li><Link to="/tickets">Get Tickets</Link></li>
        <li><Link to="/food-and-drinks">Food & Drinks</Link></li>
        <li><Link to="/about-us">About Us</Link></li>
      </ul>
      <div className="navbar__auth">
        <button className="navbar__signin">Sign In</button>
      </div>
    </nav>
  )
}
