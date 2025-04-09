import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;
const TICKET_PRICE = 12; // $12 per ticket

type Movie = { id: string; title: string; poster: any };
type Theater = { id: string; name: string; location: string };

const movies: Movie[] = [
  { id: "1", title: "Epic Adventure", poster: require("@/assets/images/poster1.jpg") },
  { id: "2", title: "Romantic Comedy", poster: require("@/assets/images/poster2.jpg") },
  { id: "3", title: "Sci‑Fi Thriller", poster: require("@/assets/images/poster3.jpg") },
  { id: "4", title: "Animated Fun", poster: require("@/assets/images/poster4.jpg") },
  { id: "5", title: "Historical Drama", poster: require("@/assets/images/poster5.jpg") },
];

const theaters: Theater[] = [
  { id: "t1", name: "AMC Downtown", location: "123 Main St." },
  { id: "t2", name: "Regal Cinema", location: "456 Broadway" },
  { id: "t3", name: "Cineplex 9", location: "789 Elm Ave." },
];

export default function MoviesScreen() {
  const [stage, setStage] = useState<"list"|"theater"|"seats"|"confirm">("list");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const showtimes = ["1:00 PM", "4:00 PM", "7:00 PM"];
  const ROWS = 5, COLS = 8;

  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSeat = (seat: string) => {
    setSelectedSeats(prev =>
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  const resetAll = () => {
    setStage("list");
    setSelectedMovie(null);
    setSelectedTheater(null);
    setSelectedTime(null);
    setSelectedSeats([]);
  };

  const handleConfirmSale = () => {
    Alert.alert(
      "Sale Confirmed",
      `Movie: ${selectedMovie?.title}\n` +
      `Theater: ${selectedTheater?.name}\n` +
      `Time: ${selectedTime}\n` +
      `Seats: ${selectedSeats.join(", ")}\n` +
      `Total: $${(selectedSeats.length * TICKET_PRICE).toFixed(2)}`
    );
    resetAll();
  };

  // 4️⃣ Confirmation screen
  if (stage === "confirm") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        <TouchableOpacity onPress={() => setStage("seats")}>
          <Text style={styles.backText}>← Back to seat selection</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Confirm Purchase</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Movie:</Text>
          <Text style={styles.summaryValue}>{selectedMovie?.title}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Theater:</Text>
          <Text style={styles.summaryValue}>{selectedTheater?.name}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Time:</Text>
          <Text style={styles.summaryValue}>{selectedTime}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Seats:</Text>
          <Text style={styles.summaryValue}>{selectedSeats.join(", ")}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Cost:</Text>
          <Text style={styles.summaryValue}>
            ${ (selectedSeats.length * TICKET_PRICE).toFixed(2) }
          </Text>
        </View>
        <View style={styles.confirmButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={resetAll}  // ← now resets all and goes back to list
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmSale}
          >
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // 3️⃣ Seat‐selection & showtime
  if (stage === "seats" && selectedMovie && selectedTheater) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        <TouchableOpacity onPress={() => setStage("theater")}>
          <Text style={styles.backText}>← Back to theater selection</Text>
        </TouchableOpacity>
        <Text style={styles.header}>{selectedMovie.title}</Text>
        <Text style={styles.subHeader}>{selectedTheater.name}</Text>

        <Text style={styles.subHeader}>Pick a Showtime</Text>
        <View style={styles.timesContainer}>
          {showtimes.map(t => (
            <TouchableOpacity
              key={t}
              style={[
                styles.timeButton,
                selectedTime === t && styles.timeButtonSelected,
              ]}
              onPress={() => setSelectedTime(t)}
            >
              <Text
                style={[
                  styles.timeText,
                  selectedTime === t && styles.timeTextSelected,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.subHeader}>Select Seats</Text>

        {/* Screen Indicator */}
        <View style={styles.screenBar}>
          <Text style={styles.screenText}>SCREEN</Text>
        </View>

        {/* Seat Map */}
        <View style={styles.seatMap}>
          {Array.from({ length: ROWS }).map((_, row) => (
            <View key={row} style={styles.seatRow}>
              {Array.from({ length: COLS }).map((_, col) => {
                const seatId = `${row + 1}-${col + 1}`;
                const isSel = selectedSeats.includes(seatId);
                return (
                  <TouchableOpacity
                    key={seatId}
                    style={[styles.seat, isSel && styles.seatSelected]}
                    onPress={() => toggleSeat(seatId)}
                  >
                    <Text style={[styles.seatText, isSel && styles.seatTextSelected]}>
                      {row + 1}{String.fromCharCode(65 + col)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => setStage("confirm")}
        >
          <Text style={styles.nextText}>Proceed to Confirmation</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // 2️⃣ Theater‐selection
  if (stage === "theater" && selectedMovie) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        <TouchableOpacity onPress={() => setStage("list")}>
          <Text style={styles.backText}>← Back to movies</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Select Theater</Text>
        {theaters.map(th => (
          <TouchableOpacity
            key={th.id}
            style={styles.theaterButton}
            onPress={() => {
              setSelectedTheater(th);
              setStage("seats");
            }}
          >
            <Text style={styles.theaterName}>{th.name}</Text>
            <Text style={styles.theaterLocation}>{th.location}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  // 1️⃣ Main movies view
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      {["Highlights","New Releases","Coming Soon"].map((section, idx) => (
        <View key={section} style={styles.section}>
          <Text style={styles.sectionTitle}>{section}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
          >
            {filtered
              .slice(idx*2, idx*2 + 3) // pick 3 per section
              .map(m => (
                <TouchableOpacity key={m.id} onPress={() => {
                  setSelectedMovie(m);
                  setStage("theater");
                }}>
                  <Image source={m.poster} style={styles.posterImage} />
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  // Search
  searchInput: {
    margin: 16,
    backgroundColor: "#222",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#fff",
    height: 40,
  },

  // Carousels
  section: { marginTop: 16 },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  carousel: { paddingLeft: 16 },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#333",
  },

  // Back link & headers
  backText: { color: "#fdba74", marginBottom: 12, marginLeft: 16 },
  header: {
    color: "#fdba74",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginLeft: 16,
  },
  subHeader: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 16,
    marginTop: 12,
  },

  // Theater selection
  theaterButton: {
    backgroundColor: "#121212",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  theaterName: { color: "#fff", fontSize: 18, fontWeight: "600" },
  theaterLocation: { color: "#aaa", marginTop: 4 },

  // Showtime & seats
  timesContainer: { flexDirection: "row", flexWrap: "wrap", margin: 16 },
  timeButton: {
    borderWidth: 1,
    borderColor: "#fdba74",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    marginBottom: 12,
  },
  timeButtonSelected: { backgroundColor: "#fdba74" },
  timeText: { color: "#fdba74" },
  timeTextSelected: { color: "#000", fontWeight: "600" },

  screenBar: {
    height: 24,
    backgroundColor: "#444",
    marginHorizontal: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  screenText: { color: "#fff", fontWeight: "600", letterSpacing: 2 },

  seatMap: {
    marginHorizontal: 16,
    backgroundColor: "#222",
    padding: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  seatRow: { flexDirection: "row", marginBottom: 8, justifyContent: "center" },
  seat: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: "#fdba74",
    borderRadius: 4,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  seatSelected: { backgroundColor: "#fdba74" },
  seatText: { color: "#fdba74", fontSize: 12 },
  seatTextSelected: { color: "#000", fontWeight: "600" },

  nextButton: {
    backgroundColor: "#fdba74",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 30,
  },
  nextText: { color: "#000", fontSize: 16, fontWeight: "600" },

  // Confirmation
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  summaryLabel: { color: "#aaa", fontSize: 16 },
  summaryValue: { color: "#fff", fontSize: 16, fontWeight: "600" },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#fdba74",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelText: { color: "#fdba74", fontSize: 16, fontWeight: "600" },
  confirmButton: {
    backgroundColor: "#fdba74",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  confirmText: { color: "#000", fontSize: 16, fontWeight: "600" },
});