import React, { useState } from "react";
import { useRouter, useSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function BuyTicketScreen() {
  // Get the movieId from the dynamic route (/buy/123 => movieId = "123")
  const { movieId } = useSearchParams();
  const router = useRouter();

  // Example data for the chosen movie
  // In a real app, you'd fetch these details from an API or pass them from the previous screen
  const [movieData] = useState({
    title: "Kung Fu Panda 4",
    studio: "DreamWorks Animation",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/76/Kung_Fu_Panda_4_poster.jpg/220px-Kung_Fu_Panda_4_poster.jpg",
  });

  // Track whether the mandatory fields have been selected
  const [theaterSelected, setTheaterSelected] = useState(false);
  const [sessionSelected, setSessionSelected] = useState(false);
  // Buffet might be optional, so we won’t treat it as required

  // Handlers for pressing each option
  const handleChooseTheater = () => {
    // In a real app, show a modal or navigate to a theater selection screen
    setTheaterSelected(true);
  };

  const handleSelectSession = () => {
    // In a real app, show a date/time picker or a list of sessions
    setSessionSelected(true);
  };

  const handleNext = () => {
    // Check mandatory fields
    if (!theaterSelected || !sessionSelected) {
      Alert.alert(
        "Missing Required Fields",
        "Please select a movie theater and session to continue."
      );
      return;
    }
    // If everything is selected, proceed to the next step (seat selection, checkout, etc.)
    // For example:
    router.push(`/seat-selection/${movieId}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Step Indicator */}
      <View style={styles.stepIndicatorContainer}>
        {/* We have 4 steps: highlight step 1 */}
        <View style={[styles.circle, styles.activeCircle]}>
          <Text style={styles.circleText}>1</Text>
        </View>
        <View style={styles.circle}>
          <Text style={styles.circleText}>2</Text>
        </View>
        <View style={styles.circle}>
          <Text style={styles.circleText}>3</Text>
        </View>
        <View style={styles.circle}>
          <Text style={styles.circleText}>4</Text>
        </View>
      </View>

      {/* Movie Card */}
      <View style={styles.movieCard}>
        <Image source={{ uri: movieData.poster }} style={styles.posterImage} />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle}>{movieData.title}</Text>
          <Text style={styles.movieStudio}>{movieData.studio}</Text>
        </View>
      </View>

      {/* Instruction Text */}
      <Text style={styles.instructionText}>
        You need to select the mandatory fields (*) to proceed to the checkout page.
      </Text>

      {/* Theater Selection */}
      <TouchableOpacity style={styles.optionButton} onPress={handleChooseTheater}>
        <Text style={styles.optionText}>NY City - Cinema Village *</Text>
      </TouchableOpacity>

      {/* Session Selection */}
      <TouchableOpacity style={styles.optionButton} onPress={handleSelectSession}>
        <Text style={styles.optionText}>June 12, 2024 - 20.30 pm *</Text>
      </TouchableOpacity>

      {/* Buffet Products (optional) */}
      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.optionText}>Buffet Products</Text>
      </TouchableOpacity>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#201A28", // Example dark background
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
  movieCard: {
    backgroundColor: "#2B2231",
    borderRadius: 12,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 20,
  },
  posterImage: {
    width: 100,
    height: 130,
  },
  movieInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  movieTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  movieStudio: {
    color: "#ccc",
    fontSize: 14,
  },
  instructionText: {
    color: "#bbb",
    marginBottom: 20,
    lineHeight: 20,
  },
  optionButton: {
    backgroundColor: "#332940",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#6D44B8",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
