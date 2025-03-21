import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { movieId } = useSearchParams();

  // Handler when user taps "View Ticket"
  const handleViewTicket = () => {
    // Navigate to a "My Tickets" screen, or a specific ticket detail route
    // For example:
    // router.push(`/my-tickets/${movieId}`);
    // Or simply:
    router.replace("/(tabs)/home");
  };

  // Handler for "Back to Home"
  const handleBackHome = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Step Indicator: all 4 steps complete */}
      <View style={styles.stepIndicatorContainer}>
        <View style={[styles.circle, styles.activeCircle]}>
          <Text style={styles.circleText}>1</Text>
        </View>
        <View style={[styles.circle, styles.activeCircle]}>
          <Text style={styles.circleText}>2</Text>
        </View>
        <View style={[styles.circle, styles.activeCircle]}>
          <Text style={styles.circleText}>3</Text>
        </View>
        <View style={[styles.circle, styles.activeCircle]}>
          <Text style={styles.circleText}>4</Text>
        </View>
      </View>

      {/* Checkmark Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#4caf50" />
      </View>

      <Text style={styles.title}>Payment Successful</Text>
      <Text style={styles.subtitle}>
        We have sent a copy of your ticket to your e-mail address. You can check
        your ticket in the My Tickets section on the homepage.
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={handleViewTicket}>
        <Text style={styles.primaryButtonText}>View Ticket</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleBackHome}>
        <Text style={styles.secondaryButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#201A28",
  },
  contentContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
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
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    color: "#bbb",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: "#6D44B8",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 30,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#6D44B8",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 30,
  },
  secondaryButtonText: {
    color: "#6D44B8",
    fontSize: 16,
    fontWeight: "600",
  },
});
