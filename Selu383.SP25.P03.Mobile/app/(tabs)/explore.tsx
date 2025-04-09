import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function ExploreScreen() {
  const router = useRouter();

  const recentItems = [
    { id: "v1", name: "Your Last Pizza" },
    { id: "v2", name: "Your Last Burger" },
  ];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#121212", dark: "#121212" }}
      backgroundColor="#000"
    >
      {/* App Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Lions Den Movies</Text>
      </View>

      {/* Lion Image */}
      <View style={styles.lionContainer}>
        <Image
          source={require("@/assets/images/lion.jpeg")}
          style={styles.lionImage}
          resizeMode="contain"
        />
      </View>

      {/* Explore Title */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>
          Explore
        </ThemedText>
      </ThemedView>

      {/* Food / Movies Buttons */}
      <View style={styles.navButtonsContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/food")}
        >
          <Text style={styles.navButtonText}>Food</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/Movies")}
        >
          <Text style={styles.navButtonText}>Movies</Text>
        </TouchableOpacity>
      </View>

      {/* Deals of Today */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deals of Today</Text>
        <TouchableOpacity style={styles.banner}>
          <Text style={styles.bannerText}>🔥 20% off all sushi today! 🔥</Text>
        </TouchableOpacity>
      </View>

      {/* Order Again */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Again</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentItems.map((item) => (
            <View key={item.id} style={styles.cardSmall}>
              <View style={styles.cardImageSmall} />
              <Text style={styles.cardTitleSmall}>{item.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  logoText: {
    color: "#fdba74",
    fontSize: 28,
    fontWeight: "bold",
  },
  lionContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  lionImage: {
    width: 120,
    height: 120,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  titleText: {
    color: "#fdba74",
    fontSize: 24,
    fontWeight: "bold",
  },

  navButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  navButton: {
    backgroundColor: "#fdba74",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  navButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 16,
    marginBottom: 8,
  },

  banner: {
    backgroundColor: "#fdba74",
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  bannerText: {
    color: "#000",
    fontWeight: "bold",
  },

  cardSmall: {
    width: 100,
    marginLeft: 16,
  },
  cardImageSmall: {
    height: 60,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  cardTitleSmall: {
    color: "#fff",
    marginTop: 4,
    fontSize: 14,
  },
});