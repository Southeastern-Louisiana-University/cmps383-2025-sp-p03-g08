import { useEffect, useState } from 'react';
import { Container, Card, Text, Divider, Loader, Alert } from '@mantine/core';
import { useLocation } from 'react-router';

type FoodItem = {
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
};

export function ViewFoodOrderSuccessPage() {
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    const codeFromStorage = sessionStorage.getItem('confirmationCode');
    const codeFromState = (location.state as { confirmationCode?: string })?.confirmationCode;
    const finalCode = codeFromState || codeFromStorage;

    if (!finalCode) {
      setError('No confirmation code found.');
      setLoading(false);
      return;
    }

    setConfirmationCode(finalCode);

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/by-confirmation?code=${encodeURIComponent(finalCode)}`);
        if (!response.ok) throw new Error('Order not found. Please check the confirmation code.');

        const data = await response.json();

        if (data.foodItems && data.foodItems.length > 0) {
          setFoodItems(data.foodItems);
        } else {
          throw new Error('No food items found for this order.');
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location.state]);

  return (
    <Container size="md" style={{ paddingTop: '150px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Order Confirmation
      </h1>

      {loading && <Loader />}
      {error && <Alert color="red">{error}</Alert>}

      {confirmationCode && !loading && !error && (
        <Text size="lg" mb="md">
          <strong>Confirmation Code:</strong> {confirmationCode}
        </Text>
      )}

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
              <Text><strong>Item:</strong> {item.name}</Text>
              <Text><strong>Quantity:</strong> {item.quantity}</Text>
              <Text><strong>Total:</strong> ${(item.price * item.quantity).toFixed(2)}</Text>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && foodItems.length === 0 && (
        <Text color="dimmed">
          No food items found for this order.
        </Text>
      )}
    </Container>
  );
}
