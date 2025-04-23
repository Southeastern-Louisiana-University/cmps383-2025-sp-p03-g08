import { Link, useParams } from "react-router";
import "../styles/Showtime.css";
import "../styles/App.css";
import { useEffect, useState } from "react";

interface Showing {
  id: number;
  showTime: string;
  showType: string;
  isSoldOut: Boolean;
}

export default function ShowTimesPage() {
  let params = useParams();
  const [showings, setShowings] = useState<Showing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch movies
        const showingsResponse = await fetch(`/api/showings/${params.movieId}/${params.theaterId}`);
        if (!showingsResponse.ok) {
          throw new Error(`Failed to fetch movies, status: ${showingsResponse.status}`);
        }
        const showingsData: Showing[] = await showingsResponse.json();
  
        setShowings(showingsData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unexpected error occurred."));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;


  return (
    <div className="showTimes">
      <h1>Show Times for {"Anora"}</h1>
      <div>
        {showings.map((s, i) => (
          <div key={i} className="showingOptions">
            <p>{s.showType} {s.showTime}</p>
            <Link to={`/seating/${s.id}`}>
            <button className="btn-orange">Choose Seats</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
