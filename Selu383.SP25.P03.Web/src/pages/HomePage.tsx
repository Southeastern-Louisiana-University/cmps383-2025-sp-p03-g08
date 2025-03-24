//import { Link } from 'react-router-dom'

import MovieCard from "../components/MovieCard";
import "../styles/HomePage.css";

export default function HomePage() {
  return (
    <div className="homePage">
      <section className="homePage__nowPlaying">
        <h1>Now Playing</h1>
        <div className="homePage__movieGrid">
          <MovieCard
            poster="/assets/anora-poster.jpg"
            title="Anora"
            linkUrl="/showtimes/anora"
          />
          <MovieCard
            poster="/assets/captainAmerica.jpg"
            title="Captain America Brave New World"
            linkUrl="/showtimes/captain-america"
          />
          <MovieCard
            poster="/assets/mickey17.jpg"
            title="Mickey 17"
            linkUrl="/showtimes/mickey17"
          />
          <MovieCard
            poster="/assets/the-monkey.jpg"
            title="The Monkey"
            linkUrl="/showtimes/the-monkey"
          />
          <MovieCard
            poster="/assets/last-breath.jpg"
            title="Last Breath"
            linkUrl="/showtimes/last-breath"
          />
        </div>
      </section>

      <section className="homePage__foodAndDrinks">
        <h2>Food & Drinks</h2>
        <div className="homePage__foodGrid">
          <div className="homePage__foodItem">
            <img src="/assets/mozarella-sticks.jpg" alt="Mozarella Sticks" />
            <h3>Mozarella Sticks</h3>
            <p>4 Fried Mozarella Sticks served with marinara sauce</p>
          </div>
          <div className="homePage__foodItem">
            <img src="/assets/sliders.jpg" alt="Cheeseburger Sliders" />
            <h3>Cheeseburger Sliders</h3>
            <p>
              3 Delicious Cheeseburger Sliders dressed with cheddar cheese and a
              pickle
            </p>
          </div>
          <div className="homePage__foodItem">
            <img src="/assets/egg-rolls.jpg" alt="Egg Rolls" />
            <h3>Southwest Egg Rolls</h3>
            <p>6 Tasty Southwest Egg Rolls served with dipping sauce</p>
          </div>
        </div>
      </section>

      <section className="homePage__aboutUs">
        <h2>About Us</h2>
        <p>
          Welcome to Lion’s Den Cinemas, where we are dedicated to providing an
          exceptional experience. Whether you're here for the latest blockbuster
          or an independent film, we strive to create a comfortable and
          enjoyable atmosphere for all moviegoers.
        </p>
      </section>

      <section className="homePage__testimonials">
        <h2>Hear From Our Happy Guests!</h2>
        <div className="homePage__testimonialGrid">
          <div className="homePage__testimonialCard">
            <p>“A Fantastic Experience Every Time!”</p>
            <span>- Marcus T.</span>
          </div>
          <div className="homePage__testimonialCard">
            <p>“A Perfect Night Out!”</p>
            <span>- Sarah L.</span>
          </div>
          <div className="homePage__testimonialCard">
            <p>“The Best Cinema Experience in Town!”</p>
            <span>- Natalie M.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
