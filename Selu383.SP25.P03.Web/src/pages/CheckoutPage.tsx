import { Container, Text, Button } from "@mantine/core";
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
            <Button
              style={{
                backgroundColor: "#fdba74",
                borderRadius: "5px",
                border: 0,
                height: "40px",
                width: "100px",
                cursor: "pointer",
                color: "#100e0e",
                marginTop: "10px",
                marginBottom: "5px",
              }}
              onClick={() => navigate(routes.foodndrinks)}
            >
              Go back
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
}
