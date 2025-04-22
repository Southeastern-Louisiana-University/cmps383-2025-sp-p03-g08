import { useEffect, useState } from "react";
import { Container, Text, Button } from "@mantine/core";
import { Cart } from "../Components/Cart";

type SeatItem = {
  id: string;
  row: string;
  price?: number; 
};

export function CheckoutPage() {
  const [items, setItems] = useState<SeatItem[]>([]);

  useEffect(() => {
    const seatData = sessionStorage.getItem("selectedSeats");

    if (seatData) {
      const parsed = JSON.parse(seatData) as SeatItem[];
      setItems(parsed);
    }
  }, []);

  const handleCheckout = () => {
    alert("Checkout complete!");
    sessionStorage.removeItem("selectedSeats");
    setItems([]);
  };

  return (
    <div style={{ paddingTop: "120px", justifyContent:'center', display:'flex'}}>
      <Container style={{ width: "600px" }}>
        <div style={{ textAlign: "center" }}>
          <Text style={{ fontSize: "60px", fontWeight: 700, marginBottom:'0px'}}>
            Review Your Cart
          </Text>
  
          {items.length === 0 ? (
            <Text>No items found in your cart.</Text>
          ) : (
            <Cart items={items} onCheckout={handleCheckout} />
          )}
  
          {items.length > 0 && (
            <Button style={{
                backgroundColor: '#fdba74',
                borderRadius: '5px',
                border: 0,
                height: '40px',
                width: '100px',
                cursor: 'pointer',
                color: '#100e0e', 
                marginTop: '10px',
                marginBottom: '5px'
              }} onClick={() => window.history.back()}>
              Go back
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
  
}
