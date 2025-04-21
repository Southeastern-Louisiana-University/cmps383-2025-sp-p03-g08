import { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Text,
  Loader,
  Alert,
  Divider,
  Button,
} from '@mantine/core';
import Barcode from 'react-barcode';

type Ticket = {
  id: number;
  seatId: number;
  seatLabel: string;
  ticketType: string;
  showingTime: string;
  purchasedDate: string;
  ticketCode: string;
  movieTitle: string;
  cinemaHallName: string;
  price: number;
};

export function ViewTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const guestName = sessionStorage.getItem('guestName');
        const url = guestName
          ? `/api/tickets/for-user?guestName=${encodeURIComponent(guestName)}`
          : '/api/tickets/for-user';

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch tickets');

        const data: Ticket[] = await response.json();
        setTickets(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <Container size="md" style={{ paddingTop: '150px' }}>
      <Text size="xl" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        Your Tickets
      </Text>

      {loading && <Loader />}
      {error && <Alert color="red">{error}</Alert>}

      {!loading && !error && tickets.length === 0 && (
        <Text style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          No tickets found.
        </Text>
      )}

      {/* ✅ Print Button */}
      {tickets.length > 0 && (
        <Button
          onClick={() => window.print()}
          style={{
            display: 'block',
            margin: '0 auto 2rem auto',
            backgroundColor: '#4caf50',
            color: '#fff',
          }}
        >
          Print Tickets
        </Button>
      )}

      {/* ✅ Printable Area */}
      <div
        id="print-area"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {tickets.map((ticket) => (
         <Card
         className="ticket-card"
         key={ticket.id}
         shadow="sm"
         padding="lg"
         radius="md"
         withBorder
         style={{
           backgroundColor: '#f9f9f9',
           width: '100%',
           maxWidth: '500px',
           borderRadius: '20px',
           paddingLeft: '1.5rem',
         }}
       >
       
            <Text size="lg"><strong> Lion's Den Cinema</strong></Text>
            <Text size="lg">
              <strong>Ticket #</strong> {ticket.ticketCode}
            </Text>
            <Divider my="sm" />
            <Text>
              <strong>Movie:</strong> {ticket.movieTitle}
            </Text>
            <Text>
              <strong>Cinema Hall:</strong> {ticket.cinemaHallName}
            </Text>
            <Text>
              <strong>Seat:</strong> {ticket.seatLabel}
            </Text>
            <Text>
              <strong>Type:</strong> {ticket.ticketType}
            </Text>
            <Text>
              <strong>Showing Time:</strong>{' '}
              {new Date(ticket.showingTime).toLocaleString()}
            </Text>
            <Text>
              <strong>Purchase Date:</strong>{' '}
              {new Date(ticket.purchasedDate).toLocaleString()}
            </Text>
            <Text>
              <strong>Price:</strong> ${ticket.price.toFixed(2)}
            </Text>

            <div
              style={{
                marginTop: '1.5rem',
                display: 'flex',
                width: '100%',
              }}
            >
              <Barcode value={ticket.ticketCode} height={60} width={2} />
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
