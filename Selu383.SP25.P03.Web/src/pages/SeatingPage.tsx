import { Button, Text } from '@mantine/core';
import '../styles/SeatingPage.css';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';


interface Seat {
  id: string;
  row: string;      
  status: string;  
  selected: boolean;
}

// Helper function to group seats by their "row" property.
const groupSeatsByRow = (seats: Seat[]): Seat[][] => {
  const rows: { [key: string]: Seat[] } = {};
  seats.forEach((seat) => {
    if (!rows[seat.row]) {
      rows[seat.row] = [];
    }
    rows[seat.row].push(seat);
  });

  // Convert the grouped object into an array of arrays.
  const groupedRows = Object.keys(rows)
    .sort((a, b) => a.localeCompare(b)) // sort row keys alphabetically
    .map((rowKey) => rows[rowKey]);

  return groupedRows;
};

export function SeatingPage() {
  // State for the flat list of seats from the backend
  const [seats, setSeats] = useState<Seat[]>([]);
  // Get route parameters (assume showingId exists)
  const params = useParams<{ showingId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // State to hold the grouped seats (an array of Seat arrays)
  const [groupedSeats, setGroupedSeats] = useState<Seat[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seatsResponse = await fetch(`/api/seats/by-showing/${params.showingId}`);
        if (!seatsResponse.ok) {
          throw new Error(`Failed to fetch seats, status: ${seatsResponse.status}`);
        }
        const seatsData: Seat[] = await seatsResponse.json();
        setSeats(seatsData);
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
  }, [params.showingId]);

  // Group the seats by their row value whenever the flat seats array changes.
  useEffect(() => {
    if (seats.length > 0) {
      setGroupedSeats(groupSeatsByRow(seats));
    }
  }, [seats]);

  // Handle seat selection: toggles "selected" when available.
  const handleSelectSeat = (seatId: string) => {
    setSeats((prevSeats: Seat[]) =>
      prevSeats.map((seat: Seat) => {
        if (seat.id === seatId && seat.status.toLowerCase() === 'available') {
          return { ...seat, selected: !seat.selected };
        }
        return seat;
      })
    );
  };

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div className="seating-page">
      <div className="heading-container">
        <h1>Choose Your Seats</h1>
      </div>
      
      <div className="seating-container">
        <div className="screen">Screen</div>
        {groupedSeats.map((row, rowIndex) => (
          <div key={rowIndex} className="seating-row">
            {row.map((seat: Seat) => (
              <Button
                key={seat.id}
                className={`seat ${seat.selected ? 'selected' : (seat.status.toLowerCase() === 'available' ? '' : 'unavailable')}`}
                onClick={() => handleSelectSeat(seat.id)}
                variant={seat.selected ? 'filled' : 'outline'}
                color={seat.selected ? 'teal' : 'gray'}
                disabled={seat.status.toLowerCase() === 'occupied' || seat.status.toLowerCase() === 'reserved'}
                radius={0}
              >
                {seat.id}
              </Button>
            ))}
          </div>
        ))}
      </div>
      
      <div className="seating-container">
        <Text size="lg">
          {seats.filter((seat) => seat.selected).length > 0
            ? `You have selected ${seats.filter((seat) => seat.selected).length} seat(s).`
            : 'No seats selected yet.'}
        </Text>
        {seats.filter((seat) => seat.selected).length > 0 && (
          <Link to={"/checkout"}>
          <Button className="purchaseButton" onClick={()=> {
           const selectedSeats = seats
           .filter((seat) => seat.selected)
           .map((seat) => ({
            id: seat.id,
            row: seat.row, // ✅ restore this!
            ticketType: "Adult"
          }));          
            sessionStorage.setItem('selectedSeats',JSON.stringify(selectedSeats))
            if (params.showingId) {
              sessionStorage.setItem('showingId', params.showingId); // ✅ store it
            }
          }}>Continue</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
