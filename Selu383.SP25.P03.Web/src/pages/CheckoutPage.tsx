import { Container, Text } from "@mantine/core";
import { Cart } from "../Components/Cart";
import { useNavigate } from "react-router";
import { useCart } from "../hooks/cartContext";
import "../styles/CheckoutPage.css";

export function CheckoutPage() {
  const { items, updateTicketType, removeItem, updateFoodItemQuantity } =
    useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/payment");
  };

  return (
    <div className="checkout-page">
      <Container className="checkout-container">
        <div className="checkout-header">
          <Text className="checkout-title">Review Your Cart</Text>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart-message">
            <Text>No items found in your cart.</Text>
            <button className="btn-orange" onClick={() => navigate("/tickets")}>
              Get Tickets
            </button>
          </div>
        ) : (
          <div className="cart-section">
            {/* Using the same Cart component as in dropdown, but with isDropdown=false */}
            <Cart
              items={items}
              onCheckout={handleCheckout}
              onTicketTypeChange={updateTicketType}
              onRemoveItem={removeItem}
              onUpdateFoodQuantity={updateFoodItemQuantity}
              isDropdown={false}
              title="Your Items"
            />
          </div>
        )}
      </Container>
    </div>
  );
}
