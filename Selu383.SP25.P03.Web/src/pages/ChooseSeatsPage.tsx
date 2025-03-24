import { useState } from "react";
import { useParams } from "react-router";

export default function ChooseSeatsPage() {
  const { showtimeId } = useParams();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  const seatsPerRow = 10;

  function toggleSeat(seat: string) {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Choose Your Seats</h1>
      <p>Showtime ID: {showtimeId}</p>
      <div style={{ display: "grid", gap: "1rem", marginTop: "2rem" }}>
        {rows.map((row) => (
          <div key={row} style={{ display: "flex", gap: "0.5rem" }}>
            {[...Array(seatsPerRow)].map((_, i) => {
              const seatName = `${row}${i + 1}`;
              const isSelected = selectedSeats.includes(seatName);
              return (
                <button
                  key={seatName}
                  style={{
                    backgroundColor: isSelected ? "#EFBF04" : "#ccc",
                    border: "1px solid #333",
                    borderRadius: "4px",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleSeat(seatName)}
                >
                  {seatName}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "2rem" }}>
        <button
          style={{
            backgroundColor: "#EFBF04",
            border: "none",
            borderRadius: "8px",
            padding: "0.6rem 1rem",
            cursor: "pointer",
          }}
        >
          Buy Selected Tickets
        </button>
      </div>
    </div>
  );
}
