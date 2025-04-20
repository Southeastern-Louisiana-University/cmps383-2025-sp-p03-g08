import { Card, Group, Text, Button, Divider, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';

type SeatItem = {
  id: string;
  row: string;
};

interface CartProps {
  items: SeatItem[];
  onCheckout: () => void;
  title?: string;
}

type AgeType = 'Adult' | 'Child' | 'Senior';

const PRICE_MAP: Record<AgeType, number> = {
  Adult: 12,
  Child: 8,
  Senior: 10,
};

export function Cart({ items, onCheckout, title = 'Your Cart' }: CartProps) {
  const [seatItems, setSeatItems] = useState<
    (SeatItem & { ageType: AgeType })[]
  >([]);

  useEffect(() => {
    const initialized = items.map((seat) => ({
      ...seat,
      ageType: 'Adult' as AgeType,
    }));
    setSeatItems(initialized);
  }, [items]);

  const handleAgeTypeChange = (seatId: string, newType: AgeType) => {
    setSeatItems((prev) =>
      prev.map((seat) =>
        seat.id === seatId ? { ...seat, ageType: newType } : seat
      )
    );
  };

  const total = seatItems.reduce((sum, seat) => {
    return sum + PRICE_MAP[seat.ageType];
  }, 0);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={600} style={{ fontSize: '32px', marginBottom: '1rem',marginTop:'10px' }}>
        {title}
      </Text>
      <Divider my="xs" />

      <Stack gap="sm">
        {seatItems.map((seat) => (
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
              <Text style={{ fontSize: '20px',marginTop:'0', marginBottom: '5px'}}>{`Seat ${seat.row}-${seat.id}`}</Text>

              {/* Native select dropdown */}
              <select
                value={seat.ageType}
                onChange={(e) =>
                  handleAgeTypeChange(seat.id, e.target.value as AgeType)
                }
                style={{
                  padding: '4px 8px',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              >
                <option value="Adult">Adult</option>
                <option value="Child">Child</option>
                <option value="Senior">Senior</option>
              </select>

              <Text style={{marginTop:'5px', marginBottom:'0px'}}>${PRICE_MAP[seat.ageType].toFixed(2)}</Text>
            </Group>
          </div>
        ))}
      </Stack>

      <Divider my="sm" />

      <Group justify="space-between" mt="md">
        <Text fw={600}>Total: ${total.toFixed(2)}</Text>
        <Button
  onClick={onCheckout}
  style={{
    backgroundColor: '#fdba74',
    borderRadius: '5px',
    border: 0,
    height: '40px',
    width: '100px',
    cursor: 'pointer',
    color: '#100e0e', // optional: add dark text for contrast
  }}
>
  Checkout
</Button>

      </Group>
    </Card>
  );
}
