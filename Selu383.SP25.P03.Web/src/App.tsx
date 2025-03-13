import "./App.css";
import { BrowserRouter } from "react-router";
import { RoutesConfig } from "./routes/routeConfig";
import { MantineProvider } from "@mantine/core";

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <RoutesConfig />
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
