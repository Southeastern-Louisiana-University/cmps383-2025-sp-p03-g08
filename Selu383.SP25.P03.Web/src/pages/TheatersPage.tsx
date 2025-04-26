import { useParams, useNavigate } from "react-router";
import "../styles/TheatersPage.css";
import { useEffect, useState } from "react";

interface TheaterDto {
  id: number;
  name: string;
  address: string;
  zipCode: string;
  managerId?: number;
}

interface Movie {
  id: number;
  title: string;
  description: string;
  posterURL: string;
}

export default function TheatersPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(true);
  const [theater, setTheater] = useState<TheaterDto | null>(null);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");

  // Fetch movie on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch movie details
        const movieResponse = await fetch(`/api/Movies/${movieId}`);
        if (!movieResponse.ok) {
          throw new Error(`Failed to fetch movie information`);
        }
        const movieData = await movieResponse.json();
        setMovie(movieData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  // Handle ZIP code search
  const handleFindTheater = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTheater(null);
    setSearchError("");
    setLoading(true);

    try {
      // Use the new nearest theater endpoint
      const response = await fetch(`/api/theaters/nearest/${zip}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Invalid Zip");
      }

      const data: TheaterDto = await response.json();
      setTheater(data);
    } catch (err: any) {
      setSearchError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleTheaterSelect = (theaterId: number) => {
    navigate(`/showings/${movieId}/${theaterId}`);
  };

  if (loading)
    return <div className="loading">Loading theater information...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Your current location:", latitude, longitude);
        alert(`Your location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location.");
      }
    );
  };
  
  return (
    <div className="movieTheaterPage">
      {/* Movie Header */}
      {movie && (
        <div className="movieHeader">
          <img
            src={movie.posterURL}
            alt={movie.title}
            className="moviePoster"
          />
          <div className="movieInfo">
            <h1>{movie.title}</h1>
            <p>{movie.description}</p>
          </div>
        </div>
      )}

      {/* Find Nearest Theater Section */}
      <div style={{ padding: "2rem" }}>
        <h1>Find Closest Theater</h1>
        <p>Enter your ZIP code to find the closest theater:</p>

        {/* ZIP Input Form */}
        <form onSubmit={handleFindTheater}>
          <input
            type="text"
            placeholder="Enter ZIP Code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            style={{ padding: "0.5rem", marginRight: "1rem", width: "120px" }}
          />
          <button
            className="button"
            type="submit"
            disabled={loading}
            style={{ padding: "0.5rem", marginRight: "1rem", width: "120px" }}
          >
            {loading ? "Searching..." : "Enter"}
          </button>
        </form>
        <button
  className="button"
  type="button"
  onClick={handleUseMyLocation}
  style={{ padding: "0.5rem", marginTop: "1rem" }}
>
  Use My Current Location
</button>


        {/* Display errors */}
        {searchError && <p style={{ color: "red" }}>{searchError}</p>}

        {/* Once a theater is found, show its details */}
        {theater && (
          <div style={{ marginTop: "2rem" }}>
            <h2>Closest Theater:</h2>
            <p>
              <strong>{theater.name}</strong>
            </p>
            <p>
              {theater.address}, {theater.zipCode}
            </p>
            <button
              onClick={() => handleTheaterSelect(theater.id)}
              disabled={loading}
            >
              See Showtimes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
