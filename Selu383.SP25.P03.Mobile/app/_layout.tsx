import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Load fonts (example: SpaceMono)
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; // While fonts are loading, render nothing or a placeholder
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Your welcome/splash page (index.tsx) */}
        <Stack.Screen name="index" />

        {/* Login & Register screens */}
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />

        {/* Main tab layout */}
        <Stack.Screen name="(tabs)" />

        {/* Not-found or fallback screen (optional) */}
        <Stack.Screen name="+not-found" options={{ headerShown: true, title: "Not Found" }} />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
