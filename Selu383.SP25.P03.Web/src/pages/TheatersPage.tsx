import { Link, useParams } from 'react-router'
import '../styles/TheatersPage.css'
import { useEffect, useState } from 'react';

interface Theater {
  id: number,
  name: string,
  address: string
}
export default function TheatersPage() {
let params = useParams();
const [theaters,setTheaters]=useState<Theater[]>([]);
useEffect(() => {
  const fetchData = async () => {
    
      // Fetch movies
      const theatersResponse = await fetch(`/api/theaters`);
      if (!theatersResponse.ok) {
        throw new Error(`Failed to fetch movies, status: ${theatersResponse.status}`);
      }
      const theatersData: Theater[] = await theatersResponse.json();

      setTheaters(theatersData);
    
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
