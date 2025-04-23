import { useEffect, useState } from "react";
import { Container, Text, Button } from "@mantine/core";
import { Cart } from "../Components/Cart";
import { useNavigate } from "react-router";

type SeatItem = {
  id: string;
  row: string;
  price?: number; 
  ticketType: "Adult" | "Child" | "Senior";
};

export function CheckoutPage() {
  const [items, setItems] = useState<SeatItem[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const seatData = sessionStorage.getItem("selectedSeats");
  
    if (seatData) {
      const parsed = JSON.parse(seatData) as Omit<SeatItem, "ticketType">[];
      const withTicketType = parsed.map(seat => ({
        ...seat,
        ticketType: "Adult" as "Adult" | "Child" | "Senior",
      }));
      setItems(withTicketType);
    }
  }, []);

  const updateTicketType = (seatId: string, newType: SeatItem["ticketType"]) => {
    const updated = items.map(item =>
      item.id === seatId ? { ...item, ticketType: newType } : item
    );
  
    setItems(updated);
    sessionStorage.setItem("selectedSeats", JSON.stringify(updated));
  };
  
  

  const handleCheckout = () => {
    navigate("/payment");
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
            <Cart items={items} onCheckout={handleCheckout} onTicketTypeChange={updateTicketType}/>
          )}
  
          {items.length > 0 && (
            <button className='btn-orange' style={{marginTop:'5px'}}onClick={() => window.history.back()}>
              Go back
            </button>
          )}
        </div>
      </Container>
    </div>
  );
  
}
