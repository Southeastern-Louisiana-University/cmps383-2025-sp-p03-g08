import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";

interface Theater {
  id: number;
  name: string;
  address: string;
  zipCode: string;
}

interface Movie {
  id: number;
  title: string;
  posterURL: string;
  duration: string;
}

interface showTimes {
  id: number;
  movieId: number;
  theaterId: number;
  startTime: string;
  showType: string;
  isSoldOut: boolean;
}

export default function ShowTimesPage() {
  const { movieId, theaterId } = useParams();

  const [showTime, setShowTime] = useState<showTimes[]>([]);
  const [theater, setTheater] = useState<Theater | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch theater details
        const theaterResponse = await fetch(`/api/theaters/${theaterId}`);
        if (!theaterResponse.ok) {
          throw new Error("Failed to fetch theater details");
        }
        const theaterData = await theaterResponse.json();
        setTheater(theaterData);

        // Fetch movie details
        const movieResponse = await fetch(`/api/Movies/${movieId}`);
        if (!movieResponse.ok) {
          throw new Error("Failed to fetch movie details");
        }
        const movieData = await movieResponse.json();
        setMovie(movieData);

        // Fetch showings for this movie at this theater
        const showingsResponse = await fetch(
          `/api/Showings/${movieId}/${theaterId}`
        );
        if (!showingsResponse.ok) {
          console.warn("Could not fetch showings");
        } else {
          const showingsData = await showingsResponse.json();
          setShowTime(showingsData);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movieId, theaterId]);

  const handleSelectShowtime = (showingId: number) => {
    navigate(`/seating/${showingId}`);
  };

  // Format time from ISO string to readable time
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date from ISO string to readable date
  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <div className="loading">Loading showtimes...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="showtimesPage">
      {movie && theater && (
        <>
          <div className="movieTheaterHeader">
            <img
              src={movie.posterURL}
              alt={movie.title}
              className="moviePoster"
            />
            <div className="headerInfo">
              <h1>{movie.title}</h1>
              <h2>at {theater.name}</h2>
              <p>
                {theater.address}, {theater.zipCode}
              </p>
              <p>Runtime: {movie.duration}</p>
            </div>
          </div>

          <div className="showtimesContainer">
            <h2>Available Showtimes</h2>

            {/* Group showings by date */}
            {showTime.length > 0 ? (
              [...new Set(showTime.map((s) => formatDate(s.startTime)))].map(
                (date) => (
                  <div key={date} className="showtimesDate">
                    <h3>{date}</h3>
                    <div className="showtimesGrid">
                      {showTime
                        .filter((s) => formatDate(s.startTime) === date)
                        .map((showing) => (
                          <div
                            key={showing.id}
                            className={`showtimeCard ${
                              showing.isSoldOut ? "soldOut" : ""
                            }`}
                          >
                            <div className="showtimeInfo">
                              <span className="showtimeTime">
                                {formatTime(showing.startTime)}
                              </span>
                              <span className="showtimeType">
                                {showing.showType}
                              </span>
                            </div>
                            <button
                              onClick={() => handleSelectShowtime(showing.id)}
                              disabled={showing.isSoldOut}
                            >
                              {showing.isSoldOut ? "Sold Out" : "Select Seats"}
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="noShowtimes">
                No showtimes available for this movie at this theater.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
