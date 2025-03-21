import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { bookingId } = useSearchParams(); // e.g. /confirmation/ABC123 => bookingId = "ABC123"

  // Handler for "View Ticket" button
  const handleViewTicket = () => {
    // Navigate to a "My Tickets" screen or a ticket detail screen
    // e.g., /my-tickets/ABC123
    router.push(`/my-tickets/${bookingId}`);
  };

  // Handler for "Back to Home" button
  const handleBackToHome = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      {/* Optional step indicator with all steps completed */}
      <View style={styles.stepIndicatorContainer}>
        <View style={[styles.circle, styles.completedCircle]}>
          <Ionicons name="checkmark" size={18} color="#fff" />
        </View>
        <View style={[styles.circle, styles.completedCircle]}>
          <Ionicons name="checkmark" size={18} color="#fff" />
        </View>
        <View style={[styles.circle, styles.completedCircle]}>
          <Ionicons name="checkmark" size={18} color="#fff" />
        </View>
        <View style={[styles.circle, styles.completedCircle]}>
          <Ionicons name="checkmark" size={18} color="#fff" />
        </View>
      </View>

      {/* Big checkmark icon */}
      <View style={styles.checkmarkContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#fff" />
      </View>

      {/* Title & Message */}
      <Text style={styles.title}>Payment Successful</Text>
      <Text style={styles.message}>
        We have sent a copy of your ticket to your e-mail address. 
        You can check your ticket in the “My Tickets” section on the homepage.
      </Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.viewTicketButton} onPress={handleViewTicket}>
        <Text style={styles.viewTicketButtonText}>View Ticket</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backHomeButton} onPress={handleBackToHome}>
        <Text style={styles.backHomeButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

// ----- Styles -----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#201A28",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#A98BC6",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  completedCircle: {
    backgroundColor: "#A98BC6",
  },
  checkmarkContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  viewTicketButton: {
    backgroundColor: "#6D44B8",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
  },
  viewTicketButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backHomeButton: {
    backgroundColor: "#332940",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  backHomeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
