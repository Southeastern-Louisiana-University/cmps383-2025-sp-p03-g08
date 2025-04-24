import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUsername] = useState("");
  const [signEmail, setSignEmail] = useState("");
  const [signPassword, setSignPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing info", "Please enter both email and password.");
      return;
    }
    router.replace("/explore");
  };

  const handleSignUp = () => {
    if (!username.trim() || !signEmail.trim() || !signPassword) {
      Alert.alert("Missing info", "Please fill out all fields.");
      return;
    }
    if (signPassword !== confirmPassword) {
      Alert.alert("Password mismatch", "Your passwords do not match.");
      return;
    }
    Alert.alert("Success", `Account created for ${username}!`);
    setUsername("");
    setSignEmail("");
    setSignPassword("");
    setConfirmPassword("");
    setMode("login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lions Den 🍿</Text>

      <View style={styles.card}>
        {mode === "login" ? (
          <>
            <Text style={styles.subHeader}>Welcome back</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
              <Text style={styles.primaryText}>Log In</Text>
            </TouchableOpacity>
            <Text style={styles.switchText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => setMode("signup")}>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.subHeader}>Create your account</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={signEmail}
              onChangeText={setSignEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              value={signPassword}
              onChangeText={setSignPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#aaa"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={handleSignUp}>
              <Text style={styles.primaryText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode("login")}>
              <Text style={styles.link}>← Back to Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fdba74",
    marginBottom: 40,
  },
  card: {
    width: "100%",
    backgroundColor: "#2c2c2c",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  subHeader: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#3a3a3a",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 16,
    color: "#fff",
    fontSize: 16,
    marginBottom: 14,
  },
  primaryBtn: {
    backgroundColor: "#fdba74",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  primaryText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchText: {
    color: "#ccc",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
  link: {
    color: "#fdba74",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
});
