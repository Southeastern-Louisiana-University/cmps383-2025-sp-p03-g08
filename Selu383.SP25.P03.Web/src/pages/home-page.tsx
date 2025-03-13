// home-page.tsx
import { useNavigate } from "react-router"; // Using react-router for v7

const HomePage = () => {
  const navigate = useNavigate();

  console.log("HomePage component is rendering"); // Debug log

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        backgroundColor: "#e6f7ff", // Light blue background to clearly distinguish from root
        padding: "20px",
      }}
    >
      <h1 style={{ color: "#333", marginBottom: "20px" }}>Home Page</h1>

      <p
        style={{
          fontSize: "18px",
          marginBottom: "20px",
          maxWidth: "600px",
          textAlign: "center",
        }}
      >
        This is a simple home page component with no external UI libraries. If
        you can see this text, your routing is working correctly!
      </p>

      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Go to Main App
      </button>
    </div>
  );
};

export default HomePage;
