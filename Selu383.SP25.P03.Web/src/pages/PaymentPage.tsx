import React, { useState } from "react";
import { PaymentModal } from "../Components/PaymentModal";
import { TextInput, Button } from "@mantine/core";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function PaymentPage() {
  const [mode, setMode] = useState<"select" | "guest" | "authenticated">(
    "select"
  );
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const isAuthenticated = !!user;

  React.useEffect(() => {
    if (isAuthenticated || location.state?.fromLogin) {
      setMode("authenticated");
    }
    if (user) {
      setGuestInfo({
        name: user.userName || "",
        email: "",
        phone: "",
      });
    }
  }, [isAuthenticated, location.state]);

  const handleGuestContinue = () => {
    if (!guestInfo.name || (!guestInfo.email && !guestInfo.phone)) {
      alert("Please enter your name and at least email or phone.");
      return;
    }
    setMode("authenticated");
  };

  const handleLoginRedirect = () => {
    navigate("/login", {
      state: {
        redirectTo: location.pathname,
        redirectedFromPayment: true,
      },
    });
  };

  return (
    <div
      style={{ paddingTop: "120px", display: "flex", justifyContent: "center" }}
    >
      <div style={{ padding: "2rem", width: "80%" }}>
        <h1 style={{ textAlign: "center" }}>Checkout</h1>

        {mode === "select" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <Button color="teal" onClick={() => setMode("guest")}>
              Checkout as Guest
            </Button>
            <Button variant="outline" onClick={handleLoginRedirect}>
              Log In
            </Button>
          </div>
        )}

        {mode === "guest" && (
          <div
            style={{
              marginTop: "2rem",
              maxWidth: "400px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <TextInput
              label="Name"
              placeholder="Full Name"
              value={guestInfo.name}
              onChange={(e) =>
                setGuestInfo({ ...guestInfo, name: e.currentTarget.value })
              }
              required
            />
            <TextInput
              label="Email"
              placeholder="Email"
              value={guestInfo.email}
              onChange={(e) =>
                setGuestInfo({ ...guestInfo, email: e.currentTarget.value })
              }
              style={{ marginTop: "1rem" }}
            />
            <TextInput
              label="Phone"
              placeholder="Phone"
              value={guestInfo.phone}
              onChange={(e) =>
                setGuestInfo({ ...guestInfo, phone: e.currentTarget.value })
              }
              style={{ marginTop: "1rem" }}
            />

            <Button
              style={{ marginTop: "1.5rem" }}
              onClick={handleGuestContinue}
            >
              Continue to Payment
            </Button>
          </div>
        )}

        {mode === "authenticated" && (
          <>
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <h2>Enter Payment Details</h2>
            </div>
            <PaymentModal guestInfo={guestInfo} /> {/* 👈 Pass it here */}
          </>
        )}
      </div>
    </div>
  );
}
