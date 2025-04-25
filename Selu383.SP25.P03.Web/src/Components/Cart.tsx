import "../styles/Cart.css";
import { isSeatItem, isFoodItem, CartItem } from "../hooks/cartContext";

const PRICE_MAP: Record<"Adult" | "Child" | "Senior", number> = {
  Adult: 12,
  Child: 8,
  Senior: 10,
};

interface CartProps {
  items: CartItem[];
  onCheckout: () => void;
  title?: string;
  onTicketTypeChange?: (
    seatId: string,
    type: "Adult" | "Child" | "Senior"
  ) => void;
  onRemoveItem?: (id: string) => void;
  onUpdateFoodQuantity?: (id: string, quantity: number) => void;
  isDropdown?: boolean;
}

export function Cart({
  items,
  onCheckout,
  title = "Your Cart",
  onTicketTypeChange,
  onRemoveItem,
  onUpdateFoodQuantity,
  isDropdown = false,
}: CartProps) {
  // Calculate total price
  const total = items.reduce((sum, item) => {
    if (isSeatItem(item)) {
      return sum + PRICE_MAP[item.ticketType];
    } else if (isFoodItem(item)) {
      return sum + item.price * item.quantity;
    }
    return sum;
  }, 0);

  // Count items in cart
  const itemCount = items.reduce((count, item) => {
    if (isFoodItem(item)) {
      return count + item.quantity;
    }
    return count + 1; // Each ticket counts as 1
  }, 0);

  return (
    <div className="cart-card">
      <div className="cart-header">
        <h2
          className="cart-title"
          style={{
            fontSize: isDropdown ? "24px" : "32px",
          }}
        >
          {title}
        </h2>
        {!isDropdown && <span className="items-badge">{itemCount} items</span>}
      </div>

      <hr className="cart-divider" />

      {items.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty</p>
      ) : (
        <div
          className="cart-items"
          style={{
            maxHeight: isDropdown ? "300px" : "auto",
          }}
        >
          {/* Render Ticket Items */}
          {items.filter(isSeatItem).map((seat) => (
            <div key={seat.id} className="ticket-item">
              <div className="item-row">
                <p
                  className="item-name"
                  style={{
                    fontSize: isDropdown ? "16px" : "20px",
                  }}
                >
                  Seat {seat.row}-{seat.id}
                </p>

                {onTicketTypeChange && (
                  <select
                    value={seat.ticketType}
                    onChange={(e) =>
                      onTicketTypeChange(
                        seat.id,
                        e.target.value as "Adult" | "Child" | "Senior"
                      )
                    }
                    className="ticket-type-select"
                  >
                    <option value="Adult">Adult</option>
                    <option value="Child">Child</option>
                    <option value="Senior">Senior</option>
                  </select>
                )}

                <p className="item-price">
                  ${PRICE_MAP[seat.ticketType].toFixed(2)}
                </p>

                {onRemoveItem && (
                  <button
                    onClick={() => onRemoveItem(seat.id)}
                    className="remove-button"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Render Food Items */}
          {items.filter(isFoodItem).map((food) => (
            <div key={food.id} className="food-item">
              <div className="item-row">
                <div className="food-item-info">
                  {!isDropdown && (
                    <img
                      src={food.image}
                      alt={food.name}
                      className="food-image"
                    />
                  )}
                  <div>
                    <p className="item-name food-name">{food.name}</p>
                    <span className="food-price-each">
                      ${food.price.toFixed(2)} each
                    </span>
                  </div>
                </div>

                <div className="item-controls">
                  {onUpdateFoodQuantity && (
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          food.quantity > 1 &&
                          onUpdateFoodQuantity(food.id, food.quantity - 1)
                        }
                        className="quantity-button"
                      >
                        -
                      </button>
                      <span className="quantity-display">{food.quantity}</span>
                      <button
                        onClick={() =>
                          onUpdateFoodQuantity(food.id, food.quantity + 1)
                        }
                        className="quantity-button"
                      >
                        +
                      </button>
                    </div>
                  )}

                  <p className="item-price">
                    ${(food.price * food.quantity).toFixed(2)}
                  </p>

                  {onRemoveItem && (
                    <button
                      onClick={() => onRemoveItem(food.id)}
                      className="remove-button"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr className="cart-divider" />

      <div className="cart-footer">
        <p className="total-price">Total: ${total.toFixed(2)}</p>
        <button onClick={onCheckout} className="btn-orange">
          Checkout
        </button>
      </div>
    </div>
  );
}
