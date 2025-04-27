import { useEffect, useState } from "react";
import { Container, Text } from "@mantine/core";
import { Cart } from "../Components/Cart";
import { useNavigate } from "react-router";
import { FoodCart } from "../Components/FoodCart";

type SeatItem = {
  id: string;
  row: string;
  price?: number;
  ticketType: "Adult" | "Child" | "Senior";
};

export function CheckoutPage() {
  const [seatItems, setSeatItems] = useState<SeatItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const seatData = sessionStorage.getItem("selectedSeats");

    if (seatData) {
      const parsed = JSON.parse(seatData) as Omit<SeatItem, "ticketType">[];
      const withTicketType = parsed.map(seat => ({
        ...seat,
        ticketType: "Adult" as "Adult" | "Child" | "Senior",
      }));
      setSeatItems(withTicketType);
    }
  }, []);

  const updateTicketType = (seatId: string, newType: SeatItem["ticketType"]) => {
    const updated = seatItems.map(item =>
      item.id === seatId ? { ...item, ticketType: newType } : item
    );

    setSeatItems(updated);
    sessionStorage.setItem("selectedSeats", JSON.stringify(updated));
  };

  const handleCheckout = () => {
    navigate("/payment");
  };

  return (
    <div style={{ paddingTop: "120px", justifyContent: "center", display: "flex" }}>
      <Container style={{ width: "600px" }}>
        <div style={{ textAlign: "center" }}>
          <Text style={{ fontSize: "60px", fontWeight: 700, marginBottom: "0px" }}>
            Review Your Cart
          </Text>

          {seatItems.length > 0 ? (
            <Cart
              items={seatItems}
              onCheckout={handleCheckout}
              onTicketTypeChange={updateTicketType}
            />
          ) : (
            <FoodCart onCheckout={handleCheckout} />
          )}

          <button
            className="btn-orange"
            style={{ marginTop: "5px" }}
            onClick={() => {sessionStorage.removeItem("selectedSeats"); // ✅ Clear selected seats
              window.history.back(); } }
          >
            Go back
          </button>
        </div>
      </Container>
    </div>
  );
}
