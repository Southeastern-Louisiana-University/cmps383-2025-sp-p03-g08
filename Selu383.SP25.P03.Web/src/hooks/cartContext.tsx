import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define types for cart items
export type SeatItem = {
  id: string;
  row: string;
  ticketType: "Adult" | "Child" | "Senior";
};

export type FoodItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type CartItem = SeatItem | FoodItem;

// Function to determine if an item is a SeatItem
export const isSeatItem = (item: CartItem): item is SeatItem => {
  return "row" in item && "ticketType" in item;
};

// Function to determine if an item is a FoodItem
export const isFoodItem = (item: CartItem): item is FoodItem => {
  return "name" in item && "quantity" in item;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateFoodItemQuantity: (id: string, quantity: number) => void;
  updateTicketType: (seatId: string, newType: SeatItem["ticketType"]) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize the cart with items from sessionStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load ticket items
    const ticketData = sessionStorage.getItem("selectedSeats");
    let initialItems: CartItem[] = [];

    if (ticketData) {
      const parsedTickets = JSON.parse(ticketData) as Omit<
        SeatItem,
        "ticketType"
      >[];
      const ticketsWithType = parsedTickets.map((seat) => ({
        ...seat,
        ticketType: "Adult" as "Adult" | "Child" | "Senior",
      }));
      initialItems = [...ticketsWithType];
    }

    // Load food items
    const foodData = sessionStorage.getItem("cartFoodItems");
    if (foodData) {
      const parsedFoodItems = JSON.parse(foodData) as FoodItem[];
      initialItems = [...initialItems, ...parsedFoodItems];
    }

    return initialItems;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Update sessionStorage when items change
  useEffect(() => {
    // Separate items by type
    const seatItems = items.filter(isSeatItem);
    const foodItems = items.filter(isFoodItem);

    // Update sessionStorage
    sessionStorage.setItem("selectedSeats", JSON.stringify(seatItems));
    sessionStorage.setItem("cartFoodItems", JSON.stringify(foodItems));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      // If it's a food item, check if it already exists and just update quantity
      if (isFoodItem(newItem)) {
        const existingItemIndex = prevItems.findIndex(
          (item) => isFoodItem(item) && item.id === newItem.id
        );

        if (existingItemIndex >= 0) {
          const updatedItems = [...prevItems];
          const existingItem = updatedItems[existingItemIndex] as FoodItem;
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + (newItem as FoodItem).quantity,
          };
          return updatedItems;
        }
      }

      // For new items or seat items, just add to the array
      return [...prevItems, newItem];
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateFoodItemQuantity = (id: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (isFoodItem(item) && item.id === id) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const updateTicketType = (
    seatId: string,
    newType: SeatItem["ticketType"]
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (isSeatItem(item) && item.id === seatId) {
          return { ...item, ticketType: newType };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    sessionStorage.removeItem("selectedSeats");
    sessionStorage.removeItem("cartFoodItems");
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateFoodItemQuantity,
        updateTicketType,
        clearCart,
        isCartOpen,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
