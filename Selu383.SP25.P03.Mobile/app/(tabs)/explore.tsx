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
      headerBackgroundColor={{ dark: "#D84242", light: "#D84242" }}

      headerImage={
        <View style={{ height: 200, backgroundColor: "#1a1a1a" }} />
      }
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Lions Den Movies</Text>
      </View>

      <View style={styles.lionContainer}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.lionImage}
          resizeMode="contain"
        />
      </View>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>
          Explore
        </ThemedText>
      </ThemedView>

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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deals of Today</Text>
        <TouchableOpacity style={styles.banner}>
          <Text style={styles.bannerText}>🔥 20% off all sushi today! 🔥</Text>
        </TouchableOpacity>
      </View>

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
    borderRadius: 60,
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
    justifyContent: "space-evenly",
    marginHorizontal: 16,
    marginBottom: 24,
  },
  navButton: {
    backgroundColor: "#fdba74",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 2,
    width: "42%",
    alignItems: "center",
  },
  navButtonText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "600",
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#e0e0e0",
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 16,
    marginBottom: 8,
  },

  banner: {
    backgroundColor: "#fdba74",
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  bannerText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },

  cardSmall: {
    width: 120,
    marginLeft: 16,
    backgroundColor: "#2c2c2c",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImageSmall: {
    height: 60,
    backgroundColor: "#444",
    borderRadius: 8,
  },
  cardTitleSmall: {
    color: "#fff",
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
});