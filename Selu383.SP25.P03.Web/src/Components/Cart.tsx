import { Card, Group, Text, Divider, Stack } from '@mantine/core';
import '../styles/Cart.css';

type SeatItem = {
  id: string;
  row: string;
  ticketType: "Adult" | "Child" | "Senior";
};

interface CartProps {
  items: SeatItem[];
  onCheckout: () => void;
  title?: string;
  onTicketTypeChange: (seatId: string, type: "Adult" | "Child" | "Senior") => void;
}

const PRICE_MAP: Record<SeatItem["ticketType"], number> = {
  Adult: 12,
  Child: 8,
  Senior: 10,
};

export function Cart({ items, onCheckout, title = 'Your Cart', onTicketTypeChange }: CartProps) {
  const total = items.reduce((sum, seat) => sum + PRICE_MAP[seat.ticketType], 0);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={600} style={{ fontSize: '32px', marginBottom: '1rem', marginTop: '10px' }}>
        {title}
      </Text>
      <Divider my="xs" />

      <Stack gap="sm">
        {items.map((seat) => (
          <div
            key={seat.id}
            style={{
              backgroundColor: '#f5f5f5',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '10px'
            }}
          >
            <Group justify="space-between">
              <div className='cartText'>
                {`Seat ${seat.row}-${seat.id}`}
              </div>

              <select
                value={seat.ticketType}
                onChange={(e) =>
                  onTicketTypeChange(seat.id, e.target.value as "Adult" | "Child" | "Senior")
                }
                className='custom-select'
              >
                <option value="Adult">Adult</option>
                <option value="Child">Child</option>
                <option value="Senior">Senior</option>
              </select>

              <div className='cartText'>
                ${PRICE_MAP[seat.ticketType].toFixed(2)}
              </div>
            </Group>
          </div>
        ))}
      </Stack>

      <Divider my="sm" />

      <Group justify="space-between" mt="md">
        <Text fw={600}>Total: ${total.toFixed(2)}</Text>
        <button
          onClick={onCheckout}
          className='btn-orange'
        >
          Checkout
        </button>
      </Group>
    </Card>
  );
}
