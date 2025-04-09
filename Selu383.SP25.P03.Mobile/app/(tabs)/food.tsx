import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";

interface FoodItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

const sampleFoodItems: FoodItem[] = [
  { id: "1", name: "Pizza", price: 10.99, category: "Pizza" },
  { id: "2", name: "Burger", price: 7.99, category: "Burgers" },
  { id: "3", name: "Salad", price: 5.99, category: "Salads" },
  { id: "4", name: "Sushi", price: 12.99, category: "Sushi" },
  { id: "5", name: "Pasta", price: 8.99, category: "Pasta" },
];

export default function FoodScreen() {
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [searchText, setSearchText] = useState("");
  const categories = useMemo(() => {
    const cats = Array.from(new Set(sampleFoodItems.map((i) => i.category)));
    return ["All", ...cats];
  }, []);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const addToCart = (item: FoodItem) => {
    setCart((prev) => {
      const qty = prev[item.id] || 0;
      return { ...prev, [item.id]: qty + 1 };
    });
  };
  const removeFromCart = (item: FoodItem) => {
    setCart((prev) => {
      const qty = prev[item.id] || 0;
      if (qty <= 1) {
        const { [item.id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [item.id]: qty - 1 };
    });
  };

  const filteredItems = useMemo(() => {
    return sampleFoodItems.filter((item) => {
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [searchText, selectedCategory]);

  const totalItems = useMemo(
    () => Object.values(cart).reduce((sum, q) => sum + q, 0),
    [cart]
  );
  const totalPrice = useMemo(
    () =>
      sampleFoodItems.reduce((sum, item) => {
        const qty = cart[item.id] || 0;
        return sum + qty * item.price;
      }, 0),
    [cart]
  );

  const handleCheckout = () => {
    if (totalItems === 0) {
      Alert.alert("Cart is empty", "Please add items before checking out.");
      return;
    }
    let msg = `You have ${totalItems} item(s):\n`;
    sampleFoodItems.forEach((item) => {
      const qty = cart[item.id];
      if (qty) msg += `${item.name} x ${qty} = $${(qty * item.price).toFixed(2)}\n`;
    });
    msg += `\nTotal: $${totalPrice.toFixed(2)}`;
    Alert.alert("Checkout", msg);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Food Menu</Text>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.chip,
              selectedCategory === cat && styles.chipSelected,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.chipText,
                selectedCategory === cat && styles.chipTextSelected,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Items */}
      {filteredItems.map((item) => {
        const qty = cart[item.id] || 0;
        return (
          <View key={item.id} style={styles.itemContainer}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>Image</Text>
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              {qty > 0 ? (
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => removeFromCart(item)}
                  >
                    <Text style={styles.qtyButtonText}>–</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{qty}</Text>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => addToCart(item)}
                  >
                    <Text style={styles.qtyButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToCart(item)}
                >
                  <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}

      {/* Cart Summary */}
      {totalItems > 0 && (
        <View style={styles.cartSummaryContainer}>
          <Text style={styles.cartSummaryText}>
            {`Items: ${totalItems}   Total: $${totalPrice.toFixed(2)}`}
          </Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Check Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fdba74",
    marginBottom: 12,
    textAlign: "center",
  },

  searchContainer: {
    backgroundColor: "#222",
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    height: 40,
    color: "#fff",
  },

  chipContainer: { marginBottom: 16 },
  chip: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  chipSelected: { backgroundColor: "#fdba74" },
  chipText: { color: "#fff", fontWeight: "600" },
  chipTextSelected: { color: "#000" },

  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#121212",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: { color: "#888" },

  itemDetails: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  itemName: { fontSize: 20, color: "#fff", fontWeight: "600" },
  itemPrice: { fontSize: 16, color: "#fff", marginVertical: 4 },

  addButton: {
    backgroundColor: "#fdba74",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  addButtonText: { color: "#000", fontWeight: "600" },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyButtonText: { color: "#fff", fontSize: 20, fontWeight: "600" },
  qtyText: {
    color: "#fff",
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
  },

  cartSummaryContainer: {
    backgroundColor: "#121212",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  cartSummaryText: { color: "#fff", fontSize: 16, marginBottom: 8 },

  checkoutButton: {
    backgroundColor: "#fdba74",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  checkoutButtonText: { color: "#000", fontSize: 16, fontWeight: "bold" },
});