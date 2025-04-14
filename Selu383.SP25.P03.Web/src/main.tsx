import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./hooks/useAuth";
import "./styles/index.css";
import App from "./App";
import { WorkflowProvider } from "./hooks/WorkflowContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <WorkflowProvider>
      <App />
      </WorkflowProvider>
    </AuthProvider>
  </StrictMode>
);
