import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>Lions Den Movies</Text>
        {/* Possibly add a user icon or profile button */}
      </View>

      {/* Highlights Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Highlights</Text>
        {/* Replace with your carousel component or horizontal scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Image
            source={{ uri: "https://example.com/featured-movie.jpg" }}
            style={styles.highlightImage}
          />
          <Image
            source={{ uri: "https://example.com/featured-movie2.jpg" }}
            style={styles.highlightImage}
          />
          {/* ...Add more images or a custom carousel */}
        </ScrollView>
      </View>

      {/* New Movies in Theaters */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New Movies in Theaters</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {/* Grid or horizontal list of new movies */}
      </View>

      {/* Coming Soon */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {/* Grid or horizontal list of upcoming movies */}
      </View>

      {/* ...Add more sections as per your Figma design */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b", // or your desired background
  },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  seeAll: {
    color: "#1db954",
    fontSize: 14,
    alignSelf: "center",
  },
  highlightImage: {
    width: 200,
    height: 120,
    borderRadius: 8,
    marginHorizontal: 8,
    resizeMode: "cover",
  },
});
