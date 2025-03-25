import "./styles/App.css";
import { BrowserRouter } from "react-router";
import { RoutesConfig } from "./routes/routeConfig";
import { MantineProvider } from "@mantine/core";
import Navbar from "./Components/Navbar";


function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Navbar />
        <RoutesConfig />
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
