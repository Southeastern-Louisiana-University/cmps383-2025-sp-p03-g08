import '../styles/App.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src="/assets/react.svg" alt="Logo" />
        <h1>Lion's Den Cinema</h1>
      </div>
      <ul className="navbar__links">
        <li>Get Tickets</li>
        <li>Food &amp; Drinks</li>
        <li>About Us</li>
      </ul>
      <button className="navbar__signIn">Sign In</button>
    </nav>
  )
}
