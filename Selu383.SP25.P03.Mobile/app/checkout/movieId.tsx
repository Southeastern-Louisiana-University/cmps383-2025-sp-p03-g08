import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PaymentScreen() {
  const router = useRouter();
  const { movieId } = useSearchParams(); // e.g., /checkout/123 => movieId="123"

  // Step 4 of 4: Payment
  // For demonstration, we’ll use a static total of $40.
  const [totalAmount] = useState(40);

  // Track which payment method is selected
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Payment methods (customize as needed)
  const paymentMethods = [
    {
      id: "applepay",
      label: "Apple Pay",
      style: { backgroundColor: "#000" },
      textColor: "#fff",
      icon: <Ionicons name="logo-apple" size={24} color="#fff" />,
    },
    {
      id: "mastercard",
      label: "Pay with Master Card",
      style: { backgroundColor: "#b71c1c" },
      textColor: "#fff",
      icon: <Ionicons name="card-outline" size={24} color="#fff" />,
    },
    {
      id: "paypal",
      label: "Pay with PayPal",
      style: { backgroundColor: "#f6d45c" },
      textColor: "#333",
      icon: <Ionicons name="logo-paypal" size={24} color="#333" />,
    },
    {
      id: "googlepay",
      label: "Pay with Google Pay",
      style: { backgroundColor: "#fff" },
      textColor: "#000",
      icon: <Ionicons name="logo-google" size={24} color="#000" />,
    },
  ];

  // Final payment logic
  const handlePayNow = () => {
    if (!selectedMethod) {
      Alert.alert("No Payment Method", "Please select a payment option first.");
      return;
    }

    // --- Replace this mock logic with your real payment check ---
    // For demonstration, let's randomly succeed/fail:
    const success = Math.random() > 0.5;

    if (success) {
      // If payment is successful:
      router.push(`/payment-success/${movieId}`);
    } else {
      // If payment fails:
      router.push(`/payment-failed/${movieId}`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Step Indicator: highlight step 4 of 4 */}
      <View style={styles.stepIndicatorContainer}>
        <View style={styles.circle}>
          <Text style={styles.circleText}>1</Text>
        </View>
        <View style={styles.circle}>
          <Text style={styles.circleText}>2</Text>
        </View>
        <View style={styles.circle}>
          <Text style={styles.circleText}>3</Text>
        </View>
        <View style={[styles.circle, styles.activeCircle]}>
          <Text style={styles.circleText}>4</Text>
        </View>
      </View>

      {/* Heading */}
      <Text style={styles.heading}>Select Payment Options</Text>

      {/* Payment Methods */}
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodButton,
            method.style,
            selectedMethod === method.id && styles.selectedMethod,
          ]}
          onPress={() => setSelectedMethod(method.id)}
        >
          <View style={styles.methodContent}>
            {/* Icon on the left */}
            <View style={styles.iconContainer}>{method.icon}</View>
            {/* Label in the middle */}
            <Text style={[styles.methodLabel, { color: method.textColor }]}>
              {method.label}
            </Text>
          </View>
          {/* Checkmark if selected */}
          {selectedMethod === method.id && (
            <Ionicons name="checkmark-circle" size={24} color={method.textColor} />
          )}
        </TouchableOpacity>
      ))}

      {/* Total & Pay Now */}
      <View style={styles.bottomArea}>
        <Text style={styles.totalText}>Total Amount</Text>
        <Text style={styles.amount}>${totalAmount}</Text>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ----- STYLES -----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#201A28",
  },
  contentContainer: {
    padding: 16,
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
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  methodButton: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedMethod: {
    borderWidth: 2,
    borderColor: "#fff",
  },
  methodContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    marginRight: 8,
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  bottomArea: {
    alignItems: "center",
    marginVertical: 24,
  },
  totalText: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 8,
  },
  amount: {
    color: "#00c853",
    fontSize: 28,
    fontWeight: "700",
  },
  payButton: {
    backgroundColor: "#6D44B8",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
