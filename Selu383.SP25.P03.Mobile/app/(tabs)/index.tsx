// app/index.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/bg-movies-blur.jpg")} 
      style={styles.backgroundImage}
    >
      {/* Optional overlay to darken or tint the background */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Lions Den Movies</Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push("/register")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    // Depending on your image, you can adjust:
    resizeMode: "cover", 
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Slight dark overlay
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 50,
  },
  button: {
    backgroundColor: "#0A8A00", // Example green color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
    width: "60%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  orText: {
    color: "#fff",
    marginVertical: 15,
    fontSize: 16,
    fontWeight: "400",
  },
});
