import { useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../hooks/cartContext";
import { routes } from "../routes/routeIndex";
import "../styles/navbarCart.css";

export function NavbarCart() {
  const {
    items,
    isCartOpen,
    toggleCart,
    removeItem,
    updateFoodItemQuantity,
  } = useCart();

  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate total quantity
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  // Close cart when clicking outside
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen, toggleCart]);

  const handleCheckout = () => {
    toggleCart();
    navigate(routes.checkout);
  };

  return (
    <div className="navbar-cart" style={{ position: "relative" }}>
      <button
        onClick={toggleCart}
        className={`cart-button ${items.length > 0 ? "has-items" : ""}`}
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

        {items.length > 0 && <span className="cart-badge">{itemCount}</span>}
      </button>

      {isCartOpen && items.length > 0 && (
        <div ref={dropdownRef} className="cart-dropdown">
          <div className="cart-modal">
            <div className="cart-header">
              <h3>Your Cart</h3>
              <button className="close-button" onClick={toggleCart}>
                ×
              </button>
            </div>

            <div className="cart-content">
              {/* Render Food Items */}
              {items.map((item) => (
                <div key={item.id} className="cart-item food-item">
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          updateFoodItemQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateFoodItemQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="item-actions">
                    <span className="item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      className="remove-button"
                      onClick={() => removeItem(item.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                Total: $
                {items
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              </div>
              <button className="checkout-button" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
