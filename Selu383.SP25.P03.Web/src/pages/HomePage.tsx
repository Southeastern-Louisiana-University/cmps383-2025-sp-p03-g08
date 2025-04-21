import { useEffect, useState } from "react";
import MovieCard from "../Components/MovieCard";
import "../styles/HomePage.css";

interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  releaseDate: string;
  nowPlaying: boolean;
  duration: string;
  posterURL: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  imageURL: string;
  price: number;
  calories: number;
  category: string;
}

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch movies
        const moviesResponse = await fetch("/api/Movies");
        if (!moviesResponse.ok) {
          throw new Error(
            `Failed to fetch movies, status: ${moviesResponse.status}`
          );
        }
        const moviesData: Movie[] = await moviesResponse.json();

        // Fetch menu items
        const menuItemsResponse = await fetch("/api/MenuItems");
        if (!menuItemsResponse.ok) {
          throw new Error(
            `Failed to fetch menu items, status: ${menuItemsResponse.status}`
          );
        }
        const menuItemsData: MenuItem[] = await menuItemsResponse.json();

        setMovies(moviesData);
        setMenuItems(menuItemsData);
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

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div className="homePage">
      {/* Now Playing Section */}
      <section className="homePage__nowPlaying">
        <h1>Now Playing</h1>
        <div className="homePage__movieGrid">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard
                key={movie.id}
                poster={movie.posterURL}
                title={movie.title}
                linkUrl={`/showtimes/${movie.title}`}
              />
            ))
          ) : (
            <p>No movies available.</p>
          )}
        </div>
      </section>

      {/* Food & Drinks Section */}
      <section className="homePage__foodAndDrinks">
        <h2>Food & Drinks</h2>
        <div className="homePage__foodGrid">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div key={item.id} className="homePage__foodItem">
                <img src={item.imageURL} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            ))
          ) : (
            <p>No menu items available.</p>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section className="homePage__aboutUs">
        <h2>About Us</h2>
        <p>
          Welcome to Lion’s Den Cinemas, where we are dedicated to providing an
          exceptional experience. Whether you're here for the latest blockbuster
          or an independent film, we strive to create a comfortable and
          enjoyable atmosphere for all moviegoers.
        </p>
      </section>

      {/* Testimonials Section */}
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
