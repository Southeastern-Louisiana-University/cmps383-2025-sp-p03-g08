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

export default function PaymentFailedScreen() {
  const router = useRouter();
  const { movieId } = useSearchParams();

  // Handler for "Try Again"
  const handleTryAgain = () => {
    // Maybe go back to the payment screen
    // e.g. router.replace(`/checkout/${movieId}`);
    router.replace(`/checkout/${movieId}`);
  };

  // Handler for "Back to Home"
  const handleBackHome = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Step Indicator: all 4 steps attempted */}
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

      {/* X (close) Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="close-circle" size={80} color="#ff5252" />
      </View>

      <Text style={styles.title}>Payment Failed</Text>
      <Text style={styles.subtitle}>
        Your ticket purchase could not be processed because there was a problem
        with the payment process. Try to buy a ticket again by pressing the “Try
        Again” button.
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={handleTryAgain}>
        <Text style={styles.primaryButtonText}>Try Again</Text>
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
