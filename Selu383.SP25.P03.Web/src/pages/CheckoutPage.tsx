import { useEffect, useState } from "react";
import { Container, Text } from "@mantine/core";
import { Cart } from "../Components/Cart";
import { useNavigate } from "react-router";
import { useCart } from "../hooks/cartContext";
import { routes } from "../routes/routeIndex";

export function CheckoutPage() {
  const { items, updateTicketType, removeItem, updateFoodItemQuantity } =
    useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/payment");
  };

  return (
    <div
      style={{ paddingTop: "120px", justifyContent: "center", display: "flex" }}
    >
      <Container style={{ width: "600px" }}>
        <div style={{ textAlign: "center" }}>
          <Text
            style={{ fontSize: "60px", fontWeight: 700, marginBottom: "0px" }}
          >
            Review Your Cart
          </Text>

          {items.length === 0 ? (
            <Text>No items found in your cart.</Text>
          ) : (
            <Cart
              items={items}
              onCheckout={handleCheckout}
              onTicketTypeChange={updateTicketType}
              onRemoveItem={removeItem}
              onUpdateFoodQuantity={updateFoodItemQuantity}
            />
          )}

          {items.length > 0 && (
            <button
              className="btn-orange"
              style={{ marginTop: "5px" }}
              onClick={() => window.history.back()}
            >
              Go back
            </button>
          )}
        </div>
      </Container>
    </div>
  );
}
