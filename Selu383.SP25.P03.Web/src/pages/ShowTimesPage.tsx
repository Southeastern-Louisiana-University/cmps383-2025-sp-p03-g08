import { useParams } from "react-router";
import { useState } from "react";

interface TheaterDto {
  id: number;
  name: string;
  address: string;
  zipCode: string;
  managerId?: number;
}

interface ShowTime {
  id: number;
  time: string;
  // You might later add more info about the showtime,
  // such as a link to the seating page or pricing details.
}

export default function ShowTimesPage() {
  const { movieId } = useParams(); // movie identifier from the URL
  const [zip, setZip] = useState("");
  const [theater, setTheater] = useState<TheaterDto | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Dummy list of showtimes
  const showTimes: ShowTime[] = [
    { id: 1, time: "6:30 PM" },
    { id: 2, time: "9:00 PM" },
    { id: 3, time: "11:00 PM" },
  ];

  const handleFindTheater = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTheater(null);
    setError("");
    setLoading(true);

    try {
      // Use the new nearest theater endpoint
      const response = await fetch(`/api/theaters/nearest/${zip}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("No theater found near that ZIP");
      }

      const data: TheaterDto = await response.json();
      setTheater(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChooseShowtime = (showTime: ShowTime) => {
    // navigate to seating page
    // navigate(`/seating/${movieId}/${theater?.id}/${showTime.id}`);
    alert(`You chose the ${showTime.time} show at ${theater?.name}`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Show Times</h1>
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
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Find Theater"}
        </button>
      </form>

      {/* Display errors */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Once a theater is found, show its details and list showtimes */}
      {theater && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Closest Theater:</h2>
          <p>
            <strong>{theater.name}</strong>
          </p>
          <p>
            {theater.address}, {theater.zipCode}
          </p>

          <h3>Available Showtimes for "{movieId}":</h3>
          {showTimes.map((st) => (
            <div key={st.id} style={{ marginBottom: "1rem" }}>
              <p>{st.time}</p>
              <button onClick={() => handleChooseShowtime(st)}>
                Choose Seats
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
