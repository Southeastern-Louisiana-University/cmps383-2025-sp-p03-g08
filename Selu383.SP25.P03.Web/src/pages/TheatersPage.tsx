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
const[maxDistance,setMaxDistance]=useState<number>(50);

//Original code that returned all theaters by default 

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const theatersResponse = await fetch(`/api/theaters`);
//       if (!theatersResponse.ok) {
//         throw new Error(`Failed to fetch movies, status: ${theatersResponse.status}`);
//       }
//       const theatersData: Theater[] = await theatersResponse.json();

//       setTheaters(theatersData);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch theaters");
//     }
//   }
//   fetchData();
// }, []);


// const handleUseMyLocation = () => {
//   if (!navigator.geolocation) {
//     alert("Geolocation is not supported by your browser.");
//     return;
//   }

//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const { latitude, longitude } = position.coords;
//       console.log("Your current location:", latitude, longitude);
//       alert(`Your location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
//     },
//     (error) => {
//       console.error("Error getting location:", error);
//       alert("Unable to retrieve your location.");
//     }
//   );
// };

const handleUseMyCurrentLocation = () => {
  console.log("Button clicked");

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    console.error("Geolocation API not available in this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        console.log("Successfully got position:", latitude, longitude);

        const response = await fetch(`/api/theaters/nearest-location?lat=${latitude}&lng=${longitude}&maxDistance=${maxDistance}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to find nearby theaters. Status: ${response.status}`);
        }

        const data: Theater[] = await response.json();
        console.log("Fetched nearest theaters:", data);
        setTheaters(data);
      } catch (error) {
        console.error("Error fetching theaters:", error);
        alert("Error fetching theaters based on your location.");
      }
    },
    (error) => {
      console.error("Geolocation FAILED.");
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);

      if (error.code === 1) {
        console.error("PERMISSION_DENIED: User denied the request for Geolocation.");
      } else if (error.code === 2) {
        console.error("POSITION_UNAVAILABLE: Location information is unavailable.");
      } else if (error.code === 3) {
        console.error("TIMEOUT: The request to get user location timed out.");
      } else {
        console.error("UNKNOWN_ERROR: An unknown error occurred.");
      }

      alert("Failed to get your location. Check console logs for details.");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 0
    }
  );
};




const handleMaxDistanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setMaxDistance(Number(e.target.value));
  console.log("Max distance is now:"+Number(e.target.value));

}

  return (
    <div>    <div className = "heading-container"> <h1>Theaters</h1></div>
    <div className="theatersPage">
    <h1>Find Theaters Near You</h1>
    <div className="findTheaters">
    <select
  value={maxDistance}
  onChange={handleMaxDistanceChange}
  style={{ padding: "0.5rem", marginBottom: "1rem" }}
>
  <option value={25}>Within 25 miles</option>
  <option value={50}>Within 50 miles</option>
  <option value={100}>Within 100 miles</option>
</select>

    <button
  className="btn-orange"
  type="button"
  onClick={handleUseMyCurrentLocation}
  style={{ padding: "0.5rem", marginTop: "1rem" }}
>
  Use My Current Location
</button>
</div>
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
