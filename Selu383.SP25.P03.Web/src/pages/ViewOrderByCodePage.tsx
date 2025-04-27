import { useState } from 'react';
import { Container, TextInput, Button, Card, Text, Divider, Loader, Alert } from '@mantine/core';
import Barcode from 'react-barcode';

type Ticket = {
  id: number;
  seatId: number;
  seatLabel: string;
  ticketType: string;
  showingTime: string;
  purchasedDate: string;
  ticketCode: string;
  movieName: string;
  cinemaHallName: string;
  price: number;
};

type FoodItem = {
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
};

export function ViewOrderByCodePage() {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setTickets([]);
    setFoodItems([]);

    try {
      const response = await fetch(`/api/orders/by-confirmation?code=${encodeURIComponent(confirmationCode)}`);
      if (!response.ok) throw new Error('Order not found. Please check the confirmation code.');

      const data = await response.json();

      if (data.tickets && data.tickets.length > 0) {
        setTickets(data.tickets);
      } else if (data.foodItems && data.foodItems.length > 0) {
        setFoodItems(data.foodItems);
      } else {
        throw new Error('No tickets or food items found for this order.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" style={{ paddingTop: '150px', justifyContent: 'center',alignItems:'center'}}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Find Your Order
      </h1>

      <div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // ✅ Center horizontally
    justifyContent: 'center', // ✅ Center vertically
    marginBottom: '2rem',
    width: '100%', // Make it responsive
  }}
>
  <div style={{ display: 'flex', gap: '1rem', width: '300px',alignItems:'center' }}>
    <TextInput
      placeholder="Enter your confirmation code"
      value={confirmationCode}
      onChange={(e) => setConfirmationCode(e.currentTarget.value)}
      style={{ flexGrow: 1 }}
    />
    <button className="btn-orange" onClick={handleSearch}>Search</button>
  </div>
</div>

      {loading && <Loader />}
      {error && <Alert color="red">{error}</Alert>}

      {/* Tickets */}
      {tickets.length > 0 && (
        <>
          <Button
            onClick={() => window.print()}
            className="btn-orange"
            style={{ marginBottom: '1rem', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          >
            Print Tickets
          </Button>

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
                key={ticket.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  backgroundColor: '#f9f9f9',
                  color: 'black',
                  width: '100%',
                  maxWidth: '500px',
                  borderRadius: '20px',
                  paddingLeft: '1.5rem',
                }}
              >
                <Text size="lg"><strong> Lion's Den Cinema</strong></Text>
                <Text size="lg"><strong>Ticket #</strong> {ticket.ticketCode}</Text>
                <Divider my="sm" />
                <Text><strong>Movie:</strong> {ticket.movieName}</Text>
                <Text><strong>Cinema Hall:</strong> {ticket.cinemaHallName}</Text>
                <Text><strong>Seat:</strong> {ticket.seatLabel}</Text>
                <Text><strong>Type:</strong> {ticket.ticketType}</Text>
                <Text><strong>Showing Time:</strong> {new Date(ticket.showingTime).toLocaleString()}</Text>
                <Text><strong>Purchase Date:</strong> {new Date(ticket.purchasedDate).toLocaleString()}</Text>
                <Text><strong>Price:</strong> ${ticket.price.toFixed(2)}</Text>

                <div style={{ marginTop: '1.5rem', display: 'flex', width: '100%' }}>
                  <Barcode value={ticket.ticketCode} height={60} width={2} />
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Food Items */}
      {foodItems.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {foodItems.map((item) => (
            <Card
              key={item.menuItemId}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                backgroundColor: '#f9f9f9',
                color: 'black',
                width: '100%',
                maxWidth: '500px',
                borderRadius: '20px',
                paddingLeft: '1.5rem',
              }}
            >
              <Text size="lg"><strong> Lion's Den Cinema</strong></Text>
              <Divider my="sm" />
              <Text><strong>Confirmation Code: #{confirmationCode}</strong></Text>
              <Text><strong>Item:</strong> {item.name}</Text>
              <Text><strong>Quantity:</strong> {item.quantity}</Text>
              <Text><strong>Total:</strong> ${(item.price * item.quantity).toFixed(2)}</Text>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
