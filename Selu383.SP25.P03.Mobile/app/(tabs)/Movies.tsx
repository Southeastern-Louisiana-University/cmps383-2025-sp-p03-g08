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

const PRICES = {
  Adult: 12,
  Child: 8,
  Senior: 10,
};

type TicketType = keyof typeof PRICES;
type Movie = { id: string; title: string; poster: any };
type Theater = { id: string; name: string; location: string };

const ROWS = 5, COLS = 8;

const movies: Movie[] = [
  { id: "1", title: "Indiana Jones: Riders of the Lost Ark", poster: require("@/assets/images/poster1.jpg") },
  { id: "2", title: "Friday", poster: require("@/assets/images/poster2.jpg") },
  { id: "3", title: "Captain America: The First Avenger", poster: require("@/assets/images/poster3.jpg") },
  { id: "4", title: "Elevation", poster: require("@/assets/images/poster4.jpg") },
  { id: "5", title: "Raiders of the Lost Ark", poster: require("@/assets/images/poster5.jpg") },
];

const theaters: Theater[] = [
  { id: "t1", name: "2nd Lion Theater", location: "570 2nd Ave, New York, NY 10016" },
  { id: "t2", name: "Broad Lion", location: "636 N Broad St, New Orleans, LA 70119" },
  { id: "t3", name: "Lion Studios LA", location: "4020 Marlton Ave, Los Angeles, CA 90008" },
];

const generateShowtimes = (): string[] => {
  const times = [];
  for (let hour = 8; hour <= 22; hour++) {
    const isPM = hour >= 12;
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const suffix = isPM ? "PM" : "AM";
    times.push(`${displayHour}:00 ${suffix}`);
  }
  return times;
};

const showtimes = generateShowtimes();

export default function MoviesScreen() {
  const [stage, setStage] = useState<"list" | "theater" | "seats" | "confirm">("list");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<{ [seat: string]: TicketType }>({});
  const [search, setSearch] = useState("");

  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSeat = (seat: string, type?: TicketType) => {
    setSelectedTickets(prev => {
      const copy = { ...prev };
      if (seat in copy) {
        delete copy[seat];
      } else if (type) {
        copy[seat] = type;
      }
      return copy;
    });
  };

  const resetAll = () => {
    setStage("list");
    setSelectedMovie(null);
    setSelectedTheater(null);
    setSelectedTime(null);
    setSelectedTickets({});
  };

  const handleConfirmSale = () => {
    Alert.alert(
      "Sale Confirmed",
      `Movie: ${selectedMovie?.title}\n` +
      `Theater: ${selectedTheater?.name}\n` +
      `Time: ${selectedTime}\n` +
      `Seats: ${Object.entries(selectedTickets).map(([seat, type]) => `${seat} (${type})`).join(", ")}\n` +
      `Total: $${Object.values(selectedTickets).reduce((sum, type) => sum + PRICES[type], 0).toFixed(2)}`
    );
    resetAll();
  };

  if (stage === "confirm") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        <TouchableOpacity onPress={() => setStage("seats")}>  
          <Text style={styles.backText}>← Back to seat selection</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Confirm Purchase</Text>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Movie:</Text><Text style={styles.summaryValue}>{selectedMovie?.title}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Theater:</Text><Text style={styles.summaryValue}>{selectedTheater?.name}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Time:</Text><Text style={styles.summaryValue}>{selectedTime}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Seats:</Text><Text style={styles.summaryValue}>{Object.entries(selectedTickets).map(([seat, type]) => `${seat} (${type})`).join(", ")}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Total Cost:</Text><Text style={styles.summaryValue}>${Object.values(selectedTickets).reduce((sum, type) => sum + PRICES[type], 0).toFixed(2)}</Text></View>
        <View style={styles.confirmButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={resetAll}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmSale}><Text style={styles.confirmText}>Confirm</Text></TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

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
              style={[styles.timeButton, selectedTime === t && styles.timeButtonSelected]}
              onPress={() => setSelectedTime(t)}
            >
              <Text style={[styles.timeText, selectedTime === t && styles.timeTextSelected]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.subHeader}>Select Seats</Text>
        <View style={styles.screenBar}><Text style={styles.screenText}>SCREEN</Text></View>
        <View style={styles.seatMap}>
          {Array.from({ length: ROWS }).map((_, row) => (
            <View key={row} style={styles.seatRow}>
              {Array.from({ length: COLS }).map((_, col) => {
                const seatId = `${row + 1}-${col + 1}`;
                const isSel = seatId in selectedTickets;
                return (
                  <TouchableOpacity
                    key={seatId}
                    style={[styles.seat, isSel && styles.seatSelected]}
                    onPress={() => {
                      if (isSel) {
                        toggleSeat(seatId);
                      } else {
                        Alert.alert(
                          "Select Ticket Type",
                          `Choose a ticket type for seat ${seatId}`,
                          Object.entries(PRICES).map(([type, price]) => ({
                            text: `${type} ($${price})`,
                            onPress: () => toggleSeat(seatId, type as TicketType),
                          }))
                        );
                      }
                    }}
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

        <TouchableOpacity style={styles.nextButton} onPress={() => setStage("confirm")}>
          <Text style={styles.nextText}>Proceed to Confirmation</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for movies"
        value={search}
        onChangeText={setSearch}
      />
      <Text style={styles.header}>Select a Movie</Text>
      {filtered.map(movie => (
        <TouchableOpacity
          key={movie.id}
          style={styles.movieCard}
          onPress={() => {
            setSelectedMovie(movie);
            setStage("theater");
          }}
        >
          <Image source={movie.poster} style={styles.moviePoster} />
          <Text style={styles.movieTitle}>{movie.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  timesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    color: "#fff",
  },
  header: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 18,
    color: "#fff",
    marginVertical: 10,
  },
  movieCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  moviePoster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 15,
  },
  theaterButton: {
    padding: 15,
    backgroundColor: "#333",
    borderRadius: 8,
    marginVertical: 10,
  },
  theaterName: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  theaterLocation: {
    color: "#aaa",
    fontSize: 14,
  },
  seatMap: {
    marginVertical: 20,
    flexDirection: "column",
  },
  seatRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  seat: {
    width: 40,
    height: 40,
    backgroundColor: "#444",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  seatSelected: {
    backgroundColor: "#22a3d9",
  },
  seatText: {
    color: "#fff",
  },
  seatTextSelected: {
    color: "#000",
  },
  screenBar: {
    alignItems: "center",
    marginVertical: 10,
  },
  screenText: {
    color: "#fff",
    fontSize: 16,
  },
  nextButton: {
    padding: 15,
    backgroundColor: "#22a3d9",
    borderRadius: 8,
    marginTop: 20,
  },
  nextText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
  },
  timeButton: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 8,
    margin: 5,
  },
  timeButtonSelected: {
    backgroundColor: "#22a3d9",
  },
  timeText: {
    color: "#fff",
  },
  timeTextSelected: {
    color: "#000",
  },
  summaryRow: {
    flexDirection: "row",
    marginVertical: 10,
  },
  summaryLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  summaryValue: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
});