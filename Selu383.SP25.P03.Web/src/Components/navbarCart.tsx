import { useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Badge, Button } from "@mantine/core";
import { routes } from "../routes/routeIndex";
import { useCart } from "../hooks/cartContext";
import { Cart } from "./Cart";

export function NavbarCart() {
  const {
    items,
    isCartOpen,
    toggleCart,
    removeItem,
    updateTicketType,
    updateFoodItemQuantity,
  } = useCart();

  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate total items in cart
  const itemCount = items.reduce((count, item) => {
    if ("quantity" in item) {
      return count + item.quantity;
    }
    return count + 1; // Each ticket counts as 1
  }, 0);

  // Close the cart dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isCartOpen
      ) {
        toggleCart();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, toggleCart]);

  const handleCheckout = () => {
    toggleCart(); // Close dropdown
    navigate(routes.checkout); // Navigate to checkout page
  };

  return (
    <div className="navbar-cart" style={{ position: "relative" }}>
      <Button
        onClick={toggleCart}
        className="navbar__cart-button"
        style={{
          backgroundColor: items.length > 0 ? "#fdba74" : "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          borderRadius: "4px",
          marginLeft: "12px",
          color: "#100e0e",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>

        {items.length > 0 && (
          <Badge
            color="red"
            size="sm"
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
            }}
          >
            {itemCount}
          </Badge>
        )}
      </Button>

      {isCartOpen && items.length > 0 && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            zIndex: 1000,
            width: "350px",
            marginTop: "8px",
          }}
        >
          <Cart
            items={items}
            onCheckout={handleCheckout}
            onRemoveItem={removeItem}
            onTicketTypeChange={updateTicketType}
            onUpdateFoodQuantity={updateFoodItemQuantity}
            isDropdown={true}
            title="Cart"
          />
        </div>
      )}
    </div>
  );
}
