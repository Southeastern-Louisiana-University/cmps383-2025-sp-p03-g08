import '../styles/Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__sections">
        <div className="footer__section">
          <h4>Our Company</h4>
          <p>About Us</p>
          <p>Contact Us</p>
        </div>
        <div className="footer__section">
          <h4>Movies</h4>
          <p>Now Playing</p>
          <p>Theaters</p>
        </div>
        <div className="footer__section">
          <h4>More</h4>
          <p>Mobile App</p>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© 2025 Lion’s Den Cinemas</p>
      </div>
    </footer>
  )
}
