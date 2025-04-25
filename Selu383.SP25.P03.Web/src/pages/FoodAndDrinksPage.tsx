import { useState } from "react";
import "../styles/MenuItem.css";
import { useCart, FoodItem } from "../hooks/cartContext";
import { Button, Text, Notification } from "@mantine/core";

export default function FoodAndDrinksPage() {
  const { addItem } = useCart();
  const [notification, setNotification] = useState<{
    visible: boolean;
    item: string;
  }>({
    visible: false,
    item: "",
  });

  // Food items from seed data
  const items = [
    {
      id: "1",
      name: "Mozarella Sticks",
      description: "4 Fried Mozarella Sticks served with marinara sauce",
      image: "https://imgur.com/ZPJRaPj.jpg",
      price: 5.99,
    },
    {
      id: "2",
      name: "Cheeseburger Sliders",
      description:
        "3 Delicious Cheeseburger Sliders dressed with cheddar cheese and a pickle",
      image: "https://imgur.com/TkGozIU.jpg",
      price: 7.99,
    },
    {
      id: "3",
      name: "Southwest Egg Rolls",
      description: "6 Tasty Southwest Egg Rolls served with dipping sauce",
      image: "https://imgur.com/nAikWFY.jpg",
      price: 4.99,
    },
  ];

  const handleAddToCart = (item: (typeof items)[0]) => {
    const foodItem: FoodItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
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
    <div style={{ padding: "2rem", marginTop: "150px" }}>
      <h1>Food & Drinks</h1>
      <p style={{ marginBottom: "30px" }}>
        Have your favorite meal delivered to your seat!
      </p>

      {/* Notification */}
      {notification.visible && (
        <Notification
          color="green"
          onClose={() => setNotification({ visible: false, item: "" })}
          style={{
            position: "fixed",
            top: "100px",
            right: "20px",
            zIndex: 1000,
            maxWidth: "300px",
          }}
        >
          <Text>{notification.item} added to cart!</Text>
        </Notification>
      )}

      <div
        style={{
          display: "flex",
          gap: "3rem",
          flexWrap: "wrap",
          marginTop: "1rem",
          justifyContent: "center",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              width: "300px",
              borderRadius: "8px",
              padding: "1rem",
              backgroundColor: "black",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100%",
                borderRadius: "8px",
                height: "180px",
                objectFit: "cover",
              }}
            />
            <h2>{item.name}</h2>
            <p
              style={{
                height: "4rem",
                maxWidth: "100%",
                overflow: "hidden",
                marginBottom: "1rem",
              }}
            >
              {item.description}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "auto",
              }}
            >
              <Text size="xl" w={700}>
                ${item.price.toFixed(2)}
              </Text>
              <Button
                className="menu-item-button"
                onClick={() => handleAddToCart(item)}
                style={{
                  backgroundColor: "#fdba74",
                  color: "#100e0e",
                  width: "500px",
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
