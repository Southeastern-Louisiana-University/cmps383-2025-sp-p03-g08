import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function BuffetScreen() {
  const router = useRouter();
  const { movieId } = useSearchParams(); // e.g. /buy/123/buffet => movieId = "123"

  // Example: Step 2 combos data
  // Each item has an id, name, image, base price, quantity, etc.
  const [combos, setCombos] = useState([
    {
      id: "large",
      name: "Large Menu",
      details: "Large Popcorn (400 ml) + Coca Cola (400 ml)",
      price: 30,
      quantity: 0,
      image: "https://example.com/large-menu.png",
    },
    {
      id: "medium",
      name: "Medium Menu",
      details: "Medium Popcorn + Medium Coca Cola (330 ml)",
      price: 20,
      quantity: 0,
      image: "https://example.com/medium-menu.png",
    },
    {
      id: "small",
      name: "Small Menu",
      details: "Small Popcorn + Small Coca Cola (250 ml)",
      price: 15,
      quantity: 0,
      image: "https://example.com/small-menu.png",
    },
    {
      id: "double",
      name: "M. Double Menu",
      details: "2x Medium Popcorn + 2x Medium Coca Cola",
      price: 30,
      quantity: 0,
      image: "https://example.com/double-menu.png",
    },
  ]);

  // Increment or decrement quantity
  const handleIncrement = (id: string) => {
    setCombos((prev) =>
      prev.map((combo) =>
        combo.id === id ? { ...combo, quantity: combo.quantity + 1 } : combo
      )
    );
  };

  const handleDecrement = (id: string) => {
    setCombos((prev) =>
      prev.map((combo) =>
        combo.id === id && combo.quantity > 0
          ? { ...combo, quantity: combo.quantity - 1 }
          : combo
      )
    );
  };

  // Calculate total
  const totalPrice = combos.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Clear cart
  const handleClear = () => {
    setCombos((prev) => prev.map((combo) => ({ ...combo, quantity: 0 })));
  };

  // Proceed to next step
  const handleAddToCart = () => {
    // If user hasn't selected anything, you could show an alert or allow zero combos
    // For example:
    if (totalPrice === 0) {
      Alert.alert("No Items Selected", "Please choose at least one combo or skip this step.");
      return;
    }

    // Move to the next step (step 3 or seat selection, etc.)
    // Example: seat selection might be step 3
    router.push(`/seat-selection/${movieId}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Top Bar with Trash Icon */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleClear}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Step Indicator: highlight step 2 of 4 */}
      <View style={styles.stepIndicatorContainer}>
        <View style={styles.circle}>
          <Text style={styles.circleText}>1</Text>
        </View>
        <View style={[styles.circle, styles.activeCircle]}>
          <Text style={styles.circleText}>2</Text>
        </View>
        <View style={styles.circle}>
          <Text style={styles.circleText}>3</Text>
        </View>
        <View style={styles.circle}>
          <Text style={styles.circleText}>4</Text>
        </View>
      </View>

      {/* Heading */}
      <Text style={styles.heading}>Buffet Products</Text>

      {/* List of Combos */}
      {combos.map((item) => (
        <View key={item.id} style={styles.comboCard}>
          {/* Image */}
          <Image source={{ uri: item.image }} style={styles.comboImage} />

          {/* Combo Info */}
          <View style={styles.comboInfo}>
            <Text style={styles.comboName}>{item.name}</Text>
            <Text style={styles.comboDetails}>{item.details}</Text>
            <Text style={styles.comboPrice}>Price: ${item.price}</Text>
          </View>

          {/* Quantity Controls */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => handleDecrement(item.id)} style={styles.qtyButton}>
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => handleIncrement(item.id)} style={styles.qtyButton}>
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Total & Add to Cart */}
      <View style={styles.bottomRow}>
        <Text style={styles.totalPrice}>${totalPrice}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ----- Styles -----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#201A28", // dark background
  },
  contentContainer: {
    padding: 16,
  },
  topBar: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#A98BC6",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  activeCircle: {
    backgroundColor: "#A98BC6",
  },
  circleText: {
    color: "#fff",
    fontWeight: "600",
  },
  heading: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  comboCard: {
    backgroundColor: "#2B2231",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 16,
  },
  comboImage: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 6,
  },
  comboInfo: {
    flex: 1,
  },
  comboName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  comboDetails: {
    color: "#ccc",
    fontSize: 13,
    marginVertical: 4,
  },
  comboPrice: {
    color: "#00c853",
    fontSize: 14,
    fontWeight: "600",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    backgroundColor: "#6D44B8",
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  quantityText: {
    color: "#fff",
    marginHorizontal: 8,
    fontSize: 16,
    width: 20,
    textAlign: "center",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
  },
  totalPrice: {
    color: "#00c853",
    fontSize: 20,
    fontWeight: "700",
  },
  addButton: {
    backgroundColor: "#6D44B8",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
