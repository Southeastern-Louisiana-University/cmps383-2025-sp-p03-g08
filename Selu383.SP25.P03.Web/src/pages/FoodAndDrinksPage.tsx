import { useState, useEffect } from "react";
import "../styles/MenuItem.css";
import { useCart, FoodItem } from "../hooks/cartContext";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  price: number;
  category: string;
  calories: number;
}

export default function FoodAndDrinksPage() {
  const { addItem } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    visible: boolean;
    item: string;
  }>({
    visible: false,
    item: "",
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/MenuItems");

        if (!response.ok) {
          throw new Error(`Failed to fetch menu items: ${response.status}`);
        }

        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching menu items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    const foodItem: FoodItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.imageURL,
    };

    addItem(foodItem);

    // Show notification
    setNotification({ visible: true, item: item.name });

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ visible: false, item: "" });
    }, 3000);
  };

  return (
    <div className="food-page">
      <h1 className="food-page-title">Food & Drinks</h1>
      <p className="food-page-subtitle">
        Have your favorite meal delivered to your seat!
      </p>

      {/* Notification */}
      {notification.visible && (
        <div className="notification">
          <div className="notification-content">
            <span>{notification.item} added to cart!</span>
            <button
              className="notification-close"
              onClick={() => setNotification({ visible: false, item: "" })}
            >
              ×
            </button>
          </div>
        </div>
      )}
      {loading && (
        <div className="loading-indicator">Loading menu items...</div>
      )}

      {error && <div className="error-message">Error: {error}</div>}

      {!loading && !error && (
        <div className="menu-grid">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-item">
              <img
                src={item.imageURL}
                alt={item.name}
                className="menu-item-image"
              />
              <h2 className="menu-item-name">{item.name}</h2>
              <p className="menu-item-description">{item.description}</p>
              <div className="menu-item-footer">
                <span className="menu-item-price">
                  ${item.price.toFixed(2)}
                </span>
                <span className="menu-item-calories">{item.calories} cal</span>
                <button
                  className="menu-item-button"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && menuItems.length === 0 && (
        <div className="no-items-message">
          No menu items available at this time.
        </div>
      )}
    </div>
  );
}
