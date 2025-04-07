//import { Link } from 'react-router-dom'


import { useFetch } from "@mantine/hooks";
import MovieCard from "../Components/MovieCard";
import "../styles/HomePage.css";
import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  releaseDate: string; // You can also parse it to Date if necessary.
  nowPlaying: boolean;
  duration: string; // As returned, this is a string e.g., "01:52:00"
  posterURL: string;
}



export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesResponse = await fetch('http://localhost:5249/api/Movies');
        const moviesData = await moviesResponse.json();
        // const menuItemsResponse = await fetch('http://localhost:5000/api/MenuItems');
        // const menuItemsData = await menuItemsResponse.json();
        setMovies(moviesData);
        console.log(moviesResponse);
        // setMenuItems(menuItemsData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unexpected error occurred."));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="homePage">
      <section className="homePage__nowPlaying">
        <h1>Now Playing</h1>
        <div className="homePage__movieGrid">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard
                key={movie.id} // Unique key for each item
                poster={movie.posterURL} // Use the URL from your movie data
                title={movie.title}
                // Optionally, generate a link URL based on the movie title
               
              />
            ))
          ) : (
            <p>No movies available.</p>
          )}
        </div>
      </section>

      <section className="homePage__foodAndDrinks">
        <h2>Food & Drinks</h2>
        <div className="homePage__foodGrid">
          <div className="homePage__foodItem">
            <img src="https://imgur.com/ZPJRaPj.jpg" alt="Mozarella Sticks" />
            <h3>Mozarella Sticks</h3>
            <p>4 Fried Mozarella Sticks served with marinara sauce</p>
          </div>
          <div className="homePage__foodItem">
            <img src="https://imgur.com/TkGozIU.jpg" alt="Cheeseburger Sliders" />
            <h3>Cheeseburger Sliders</h3>
            <p>
              3 Delicious Cheeseburger Sliders dressed with cheddar cheese and a
              pickle
            </p>
          </div>
          <div className="homePage__foodItem">
            <img src="https://imgur.com/nAikWFY.jpg" alt="Egg Rolls" />
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
