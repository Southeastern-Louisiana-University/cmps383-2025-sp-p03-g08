import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import QRCode from "react-native-qrcode-svg";

// For screen sizing if needed
const screenWidth = Dimensions.get("window").width;

export default function MyTicketScreen() {
  const router = useRouter();
  const { ticketId } = useSearchParams(); // e.g., /my-tickets/ABC123 => ticketId = "ABC123"

  // Example ticket data. In a real app, fetch from your backend or pass it from Payment Success.
  const [ticketData] = useState({
    movieTitle: "Kung Fu Panda 4",
    ticketCount: 2,
    ticketType: "Adult", // could be 2 Adult, 1 Child, etc.
    session: "20.30 pm - 22.00 pm",
    seatNumbers: ["C3", "C4"],
    buffet: "None ( $0 )",
    theater: "Cinema Village",
    totalAmount: 40,
  });

  const handleBackHome = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Heading */}
      <Text style={styles.headerText}>My Ticket</Text>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        {/* If you have the library installed, generate a real QR code: */}
        <QRCode
          value={`Ticket ID: ${ticketId} | Seats: ${ticketData.seatNumbers.join(", ")}`}
          size={180}
          backgroundColor="#fff"
          color="#000"
        />
      </View>

      <Text style={styles.infoText}>
        You can start enjoying the movie by scanning your ticket to the theater and canteen staff.
      </Text>

      {/* Ticket Details Box */}
      <View style={styles.ticketDetailsContainer}>
        <View style={styles.detailsColumn}>
          <Text style={styles.detailItem}>
            Movie: {ticketData.movieTitle}
          </Text>
          <Text style={styles.detailItem}>
            Ticket Count: {ticketData.ticketCount} {ticketData.ticketType} {" "}
            <Text style={{ color: "#4caf50" }}>${ticketData.totalAmount}</Text>
          </Text>
          <Text style={styles.detailItem}>
            Session: {ticketData.session}
          </Text>
          <Text style={styles.detailItem}>
            Seat Number: {ticketData.seatNumbers.join(", ")}
          </Text>
          <Text style={styles.detailItem}>
            Buffet Products: {ticketData.buffet}
          </Text>
          <Text style={styles.detailItem}>
            Movie Theater: {ticketData.theater}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.amountColumn}>
          <Text style={styles.amountTitle}>Total Amount</Text>
          <Text style={styles.amountValue}>${ticketData.totalAmount}</Text>
        </View>
      </View>

      {/* Back to Home Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackHome}>
        <Text style={styles.backButtonText}>Back to Home</Text>
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
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginTop: 20,
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: "#2B2231",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  infoText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  ticketDetailsContainer: {
    backgroundColor: "#2B2231",
    borderRadius: 16,
    flexDirection: "row",
    padding: 16,
    width: "100%",
    marginBottom: 20,
  },
  detailsColumn: {
    flex: 3,
    paddingRight: 8,
  },
  separator: {
    width: 1,
    backgroundColor: "#444",
    marginHorizontal: 8,
  },
  amountColumn: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  detailItem: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 8,
  },
  amountTitle: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 4,
  },
  amountValue: {
    color: "#00c853",
    fontSize: 24,
    fontWeight: "700",
  },
  backButton: {
    backgroundColor: "#6D44B8",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
