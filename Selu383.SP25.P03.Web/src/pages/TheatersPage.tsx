import { Link, useParams } from 'react-router'
import '../styles/TheatersPage.css'
import { useWorkflow } from '../hooks/WorkflowContext'
import { useEffect, useState } from 'react';

interface Theater {
  id: number,
  name: string,
  address: string
}
export default function TheatersPage() {
let params = useParams();
const [theaters,setTheaters]=useState<Theater[]>([]);
const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch movies
      const theatersResponse = await fetch(`/api/theaters`);
      if (!theatersResponse.ok) {
        throw new Error(`Failed to fetch movies, status: ${theatersResponse.status}`);
      }
      const theatersData: Theater[] = await theatersResponse.json();

      setTheaters(theatersData);
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

  return (
    <div>    <div className = "heading-container"> <h1>Theaters</h1></div>
    <div className="theatersPage">

      <div className="theatersPage__list">
        {theaters.map(t => (
          <div key={t.id} className="theatersPage__card">
            <img src="https://imgur.com/ftrpBar.jpg" alt={t.name} />
            <div className = "theaterInfo">
            <h2>{t.name}</h2>
            <p>{t.address}</p>
            <Link to={`/showings/${params.movieId}/${t.id}`}>
            <button>Choose This Theater</button>
            </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}
