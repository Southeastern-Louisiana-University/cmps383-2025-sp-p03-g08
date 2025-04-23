import "./styles/App.css";
import { BrowserRouter } from "react-router";
import { RoutesConfig } from "./routes/routeConfig";
import { MantineProvider } from "@mantine/core";
import Navbar from "./Components/Navbar";
import { useEffect, useState } from "react";


function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Detect system preference or use stored value
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      document.body.className = saved;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      setTheme(systemTheme);
      document.body.className = systemTheme;
    }
  }, []);
    // Apply theme and store it
    useEffect(() => {
      document.body.className = theme;
      localStorage.setItem('theme', theme);
    }, [theme]);
  
    const toggleTheme = () => {
      setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };
  return (
    <MantineProvider>
      <BrowserRouter>
   <Navbar theme={theme} toggleTheme={toggleTheme} />
        <RoutesConfig />
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
