import React, { useState } from 'react';
import { Button, Group, Text } from '@mantine/core';
import '../styles/SeatingPage.css';

type SeatStatus = 'available' | 'reserved' | 'occupied';

interface Seat {
  id: string;
  status: SeatStatus;
  selected: boolean;
}

const seatingLayout: Seat[][] = [
  // Row A
  [
    { id: 'A1', status: 'available', selected: false },
    { id: 'A2', status: 'available', selected: false },
    { id: 'A3', status: 'reserved', selected: false },
    { id: 'A4', status: 'available', selected: false },
    { id: 'A5', status: 'occupied', selected: false },
    { id: 'A6', status: 'available', selected: false },
    { id: 'A7', status: 'available', selected: false },
    { id: 'A8', status: 'available', selected: false },

  ],
  // Row B
  [
    { id: 'B1', status: 'available', selected: false },
    { id: 'B2', status: 'available', selected: false },
    { id: 'B3', status: 'available', selected: false },
    { id: 'B4', status: 'reserved', selected: false },
    { id: 'B5', status: 'occupied', selected: false },
    { id: 'B6', status: 'available', selected: false },
    { id: 'B7', status: 'available', selected: false },
    { id: 'B8', status: 'available', selected: false },
    { id: 'B9', status: 'available', selected: false },
    { id: 'B10', status: 'available', selected: false },
  ],
  [
    { id: 'C1', status: 'available', selected: false },
    { id: 'C2', status: 'available', selected: false },
    { id: 'C3', status: 'available', selected: false },
    { id: 'C4', status: 'available', selected: false },
    { id: 'C5', status: 'available', selected: false },
    { id: 'C6', status: 'available', selected: false },
    { id: 'C7', status: 'available', selected: false },
    { id: 'C8', status: 'available', selected: false },
    { id: 'C9', status: 'reserved', selected: false },
    { id: 'C10', status: 'reserved', selected: false },
  ],
  [
    { id: 'D1', status: 'available', selected: false },
    { id: 'D2', status: 'available', selected: false },
    { id: 'D3', status: 'reserved', selected: false },
    { id: 'D4', status: 'reserved', selected: false },
    { id: 'D5', status: 'available', selected: false },
    { id: 'D6', status: 'available', selected: false },
    { id: 'D7', status: 'available', selected: false },
    { id: 'D8', status: 'available', selected: false },
    { id: 'D9', status: 'reserved', selected: false },
    { id: 'D10', status: 'available', selected: false },
  ],
  [
    { id: 'E1', status: 'reserved', selected: false },
    { id: 'E2', status: 'available', selected: false },
    { id: 'E3', status: 'available', selected: false },
    { id: 'E4', status: 'reserved', selected: false },
    { id: 'E5', status: 'occupied', selected: false },
    { id: 'E6', status: 'available', selected: false },
    { id: 'E7', status: 'available', selected: false },
    { id: 'E8', status: 'available', selected: false },
    { id: 'E9', status: 'available', selected: false },
    { id: 'E10', status: 'available', selected: false },
  ],
  // Add more rows here...
];

export function SeatingPage() {
  const [seats, setSeats] = useState(seatingLayout);

  const handleSelectSeat = (seatId: string) => {
    setSeats((prevSeats) => {
      return prevSeats.map((row) =>
        row.map((seat) => {
          if (seat.id === seatId && seat.status === 'available') {
            return { ...seat, selected: !seat.selected };
          }
          return seat;
        })
      );
    });
  };

  return (
    <div className="seating-page">
      <div className="heading-container">
        <h1>Choose Your Seats</h1>
      </div>
      
      <div className="seating-container">
      <div className = "screen">Screen</div>
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="seating-row">
            {row.map((seat) => (
              <Button
                key={seat.id}
                className={`seat ${seat.selected ? 'selected' : ''}`}
                onClick={() => handleSelectSeat(seat.id)}
                variant={seat.selected ? 'filled' : 'outline'}
                color={seat.selected ? 'teal' : 'gray'}
                disabled={seat.status === 'occupied' || seat.status === 'reserved'}
                radius={0}
              >
                {seat.id}
              </Button>
            ))}
          </div>
        ))}
      </div>
      <div className= "seating-container">
        <Text size="lg">
          {seats.flat().filter((seat) => seat.selected).length > 0
            ? `You have selected ${seats.flat().filter((seat) => seat.selected).length} seat(s).`
            : 'No seats selected yet.'}
        </Text>
        {seats.flat().filter((seat) => seat.selected).length > 0
            && <Button className = "purchaseButton">Continue</Button>
        }
      </div>
    </div>
  );
}
