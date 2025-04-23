import { useState } from "react";
import { BrowserRouter } from "react-router";
import { RoutesConfig } from "./routes/routeConfig";
import { MantineProvider, MantineColorScheme } from "@mantine/core";
import Navbar from "./Components/Navbar";
import { CartProvider } from "./hooks/cartContext";
import { AuthProvider } from "./hooks/useAuth";
import "@mantine/core/styles.css";

function App() {
  const [colorScheme, setColorScheme] = useState<MantineColorScheme>("dark");

  // Toggle function for dark mode (not implemented yet!)
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <MantineProvider defaultColorScheme={colorScheme}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <RoutesConfig />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
