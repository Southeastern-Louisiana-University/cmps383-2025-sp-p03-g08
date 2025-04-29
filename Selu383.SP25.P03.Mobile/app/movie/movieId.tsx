import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function MovieDetailScreen() {
  // 1. Grab the movieId from the dynamic route: /movie/123 => movieId = "123"
  const { movieId } = useSearchParams();
  const router = useRouter();

  // 2. Example movie data (could be fetched from an API based on movieId)
  const [movieData, setMovieData] = useState({
    title: "Kung Fu Panda 4",
    studio: "DreamWorks Animation",
    rating: "4/5",
    imdbRating: "8.1",
    description:
      "After Po is tapped to become the Spiritual Leader of the Valley of Peace, he needs to find and train a new Dragon Warrior, while a wicked sorceress plans to re-summon all the master villains whom Po has vanquished to the spirit realm...",
    images: [
      "https://example.com/kfp1.jpg",
      "https://example.com/kfp2.jpg",
      "https://example.com/kfp3.jpg",
    ],
    poster:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/76/Kung_Fu_Panda_4_poster.jpg/220px-Kung_Fu_Panda_4_poster.jpg",
  });

  // 3. (Optional) Fetch real data when movieId changes
  // useEffect(() => {
  //   fetch(`https://api.example.com/movies/${movieId}`)
  //     .then(res => res.json())
  //     .then(data => setMovieData(data))
  //     .catch(error => console.log(error));
  // }, [movieId]);

  // 4. Handler for the Buy Ticket button
  const handleBuyTicket = () => {
    // Navigate to the Buy Ticket screen: /buy/[movieId]
    router.push(`/buy/${movieId}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Top Poster / Hero Section */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: movieData.poster }}
          style={styles.posterImage}
          resizeMode="cover"
        />
        {/* Overlay with movie title, studio, ratings */}
        <View style={styles.overlayInfo}>
          <Text style={styles.movieTitle}>{movieData.title}</Text>
          <Text style={styles.studioText}>{movieData.studio}</Text>
          <Text style={styles.ratingText}>
            {movieData.rating} ({movieData.imdbRating} on IMDb)
          </Text>
        </View>
      </View>

      {/* Movie Subject / Description */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Movie Subject</Text>
        <Text style={styles.descriptionText}>{movieData.description}</Text>
      </View>

      {/* Images From The Movie (horizontal scroll) */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Images From The Movie</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {movieData.images.map((imgUrl, index) => (
            <Image
              key={index}
              source={{ uri: imgUrl }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      </View>

      {/* Buy Ticket Button */}
      <TouchableOpacity style={styles.buyButton} onPress={handleBuyTicket}>
        <Text style={styles.buyButtonText}>Buy Ticket Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b", // Or your desired background color
  },
  heroContainer: {
    width: "100%",
    height: screenWidth * 0.8, // Adjust ratio as needed
    position: "relative",
  },
  posterImage: {
    width: "100%",
    height: "100%",
  },
  overlayInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  studioText: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#ccc",
  },
  section: {
    padding: 16,
  },
  sectionHeading: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
  },
  descriptionText: {
    color: "#bbb",
    lineHeight: 20,
  },
  previewImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  buyButton: {
    marginHorizontal: 16,
    marginVertical: 24,
    backgroundColor: "#5cb85c",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
