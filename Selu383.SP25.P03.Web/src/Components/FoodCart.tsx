import "../styles/Cart.css";
import { useCart } from "../hooks/cartContext"; // ✅ Pull from context
import { FoodItem } from "../hooks/cartContext";

interface FoodCartProps {
  onCheckout: () => void;
  title?: string;
  onRemoveItem?: (id: string) => void;
  onUpdateFoodQuantity?: (id: string, quantity: number) => void;
  isDropdown?: boolean;
}

export function FoodCart({
  onCheckout,
  title = "Your Cart",
  onRemoveItem,
  onUpdateFoodQuantity,
  isDropdown = false,
}: FoodCartProps) {
  const { items } = useCart(); // ✅ Access full cart items from context

  // Only pick food items
  const foodItems = items;

  const total = foodItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = foodItems.reduce((count, item) => count + item.quantity, 0);

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

      {foodItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty</p>
      ) : (
        <div
          className="cart-items"
          style={{
            maxHeight: isDropdown ? "300px" : "auto",
          }}
        >
          {foodItems.map((food) => (
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
