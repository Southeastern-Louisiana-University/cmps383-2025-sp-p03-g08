import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

// Example seat shape
// 'available' = can be selected
// 'occupied'  = already taken
// 'selected'  = user selected
const initialSeats = [
  [
    { id: "A1", status: "available" },
    { id: "A2", status: "occupied" },
    { id: "A3", status: "available" },
    { id: "A4", status: "available" },
    { id: "A5", status: "available" },
    { id: "A6", status: "available" },
    { id: "A7", status: "occupied" },
    { id: "A8", status: "available" },
  ],
  [
    { id: "B1", status: "available" },
    { id: "B2", status: "available" },
    { id: "B3", status: "available" },
    { id: "B4", status: "occupied" },
    { id: "B5", status: "occupied" },
    { id: "B6", status: "available" },
    { id: "B7", status: "available" },
    { id: "B8", status: "available" },
  ],
  [
    { id: "C1", status: "occupied" },
    { id: "C2", status: "available" },
    { id: "C3", status: "available" },
    { id: "C4", status: "available" },
    { id: "C5", status: "occupied" },
    { id: "C6", status: "available" },
    { id: "C7", status: "available" },
    { id: "C8", status: "available" },
  ],
  [
    { id: "D1", status: "available" },
    { id: "D2", status: "available" },
    { id: "D3", status: "occupied" },
    { id: "D4", status: "available" },
    { id: "D5", status: "available" },
    { id: "D6", status: "available" },
    { id: "D7", status: "occupied" },
    { id: "D8", status: "available" },
  ],
  [
    { id: "E1", status: "available" },
    { id: "E2", status: "occupied" },
    { id: "E3", status: "available" },
    { id: "E4", status: "available" },
    { id: "E5", status: "occupied" },
    { id: "E6", status: "available" },
    { id: "E7", status: "occupied" },
    { id: "E8", status: "available" },
  ],
  [
    { id: "F1", status: "available" },
    { id: "F2", status: "available" },
    { id: "F3", status: "available" },
    { id: "F4", status: "occupied" },
    { id: "F5", status: "available" },
    { id: "F6", status: "available" },
    { id: "F7", status: "available" },
    { id: "F8", status: "available" },
  ],
];

const screenWidth = Dimensions.get("window").width;

export default function SeatSelectionScreen() {
  const router = useRouter();
  const { movieId } = useSearchParams(); // e.g., /seat-selection/123 => movieId="123"

  // Track seat map in state so we can toggle selection
  const [seats, setSeats] = useState(initialSeats);

  // For example, track adult/child seats or just total seats
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);

  // Toggle seat status when tapped
  const handleSeatPress = (rowIndex: number, seatIndex: number) => {
    setSeats((prev) => {
      // Copy current seat map
      const updated = [...prev].map((row) => [...row]);

      const seat = updated[rowIndex][seatIndex];
      if (seat.status === "available") {
        seat.status = "selected";
      } else if (seat.status === "selected") {
        seat.status = "available";
      }
      // 'occupied' seats cannot be changed
      return updated;
    });
  };

  // Compute how many seats are selected
  const selectedSeats = seats.flat().filter((s) => s.status === "selected");
  // Example seat pricing (adult = $20, child = $10). 
  // Adjust as needed or tie it to user input.
  const seatPrice = 20;
  const totalAmount = selectedSeats.length * seatPrice;

  // Payment
  const handlePayment = () => {
    // Typically you'd verify seat selection, then navigate to a checkout page
    // e.g. /checkout/[movieId]
    router.push(`/checkout/${movieId}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Step Indicator: highlight step 3 */}
      <View style={styles.stepIndicatorContainer}>
        <View style={styles.circle}>
          <Text style={styles.circleText}>1</Text>
        </View>
        <View style={styles.circle}>
          <Text style={styles.circleText}>2</Text>
        </View>
        <View style={[styles.circle, styles.activeCircle]}>
          <Text style={styles.circleText}>3</Text>
        </View>
        <View style={styles.circle}>
          <Text style={styles.circleText}>4</Text>
        </View>
      </View>

      {/* "Screen" label */}
      <View style={styles.screenLabelContainer}>
        <Text style={styles.screenLabel}>Screen</Text>
      </View>

      {/* Seat Grid */}
      <View style={styles.seatGrid}>
        {seats.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.seatRow}>
            {row.map((seat, seatIndex) => {
              let seatStyle = [styles.seat];
              if (seat.status === "occupied") {
                seatStyle.push(styles.occupiedSeat);
              } else if (seat.status === "selected") {
                seatStyle.push(styles.selectedSeat);
              }

              return (
                <TouchableOpacity
                  key={seat.id}
                  style={seatStyle}
                  onPress={() => handleSeatPress(rowIndex, seatIndex)}
                  disabled={seat.status === "occupied"}
                />
              );
            })}
          </View>
        ))}
      </View>

      {/* Ticket Details */}
      <View style={styles.ticketDetails}>
        <View style={styles.ticketRow}>
          <Text style={styles.ticketLabel}>ADULT</Text>
          <View style={styles.ticketCounter}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setAdultCount(Math.max(0, adultCount - 1))}
            >
              <Ionicons name="remove-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.ticketValue}>{adultCount}</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setAdultCount(adultCount + 1)}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.ticketRow}>
          <Text style={styles.ticketLabel}>CHILD</Text>
          <View style={styles.ticketCounter}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setChildCount(Math.max(0, childCount - 1))}
            >
              <Ionicons name="remove-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.ticketValue}>{childCount}</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setChildCount(childCount + 1)}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* You can show seat summary, session, etc. */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Amount:</Text>
          <Text style={styles.summaryValue}>${totalAmount}</Text>
        </View>
      </View>

      {/* Payment Options Button */}
      <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
        <Text style={styles.paymentButtonText}>Payment Options</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---- STYLES ----
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
  screenLabelContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  screenLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  seatGrid: {
    alignSelf: "center",
    marginBottom: 20,
  },
  seatRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  seat: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#666", // available
    marginHorizontal: 4,
  },
  occupiedSeat: {
    backgroundColor: "#333",
  },
  selectedSeat: {
    backgroundColor: "#ff9900",
  },
  ticketDetails: {
    backgroundColor: "#2B2231",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  ticketRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  ticketLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  ticketCounter: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterButton: {
    marginHorizontal: 6,
  },
  ticketValue: {
    color: "#fff",
    fontSize: 16,
    minWidth: 20,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  summaryLabel: {
    color: "#fff",
    fontSize: 16,
  },
  summaryValue: {
    color: "#00c853",
    fontSize: 18,
    fontWeight: "700",
  },
  paymentButton: {
    backgroundColor: "#6D44B8",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
