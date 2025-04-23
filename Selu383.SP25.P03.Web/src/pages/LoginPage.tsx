import { useEffect, useState } from "react";
import classes from "../styles/Login.module.css";
import {
  Container,
  Title,
  TextInput,
  Stack,
  Alert,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

interface UserDto {
  userName: string;
  id: number;
  roles: string[];
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const redirectTo = location.state?.redirectTo ?? '/';

  useEffect(() => {
    let redirectTimer: number;

    if (loginSuccess) {
      redirectTimer = window.setTimeout(() => {
        navigate(redirectTo, { state: { fromLogin: true } }); 
      }, 3000);
    }
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [loginSuccess, navigate]);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
  
    setFormError("");
  
    // ✅ Validate username
    if (!username.trim()) {
      setFormError("Username is required.");
      return;
    }
  
    // ✅ If registering, validate email, password, confirm password
    if (isRegistering) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  
      if (!email.trim()) {
        setFormError("Email is required.");
        return;
      }
  
      if (!emailRegex.test(email)) {
        setFormError("Please enter a valid email address.");
        return;
      }
  
      if (password.length < 8) {
        setFormError("Password must be at least 8 characters long.");
        return;
      }
  
      if (password !== confirmPassword) {
        setFormError("Passwords do not match.");
        return;
      }
  
      // ✅ Send registration request
      setLoading(true);
      fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, phone }),
        credentials: "include",
      })
      
        .then((res) => {
          if (!res.ok) throw new Error("Registration failed");
          return res.text().then((t) => (t ? JSON.parse(t) : {}));
        })
        .then((data: UserDto) => {
          login(data);
          setLoginSuccess(true);
        })
        .catch(() => setFormError("Registration failed. Try again."))
        .finally(() => setLoading(false));
    } else {
      // ✅ Basic password check for login
      if (password.length < 8) {
        setFormError("Password must be at least 8 characters long.");
        return;
      }
  
      // ✅ Send login request
      setLoading(true);
      fetch("/api/authentication/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Login failed");
          return response.text().then((text) => (text ? JSON.parse(text) : {}));
        })
        .then((data: UserDto) => {
          login(data);
          setLoginSuccess(true);
        })
        .catch(() => setFormError("Wrong username or password"))
        .finally(() => setLoading(false));
    }
  }
  

  return (
    <Container size="xl" style={{ marginTop: '175px' }}>
      <Title ta="center" className={classes.title}>
        {isRegistering ? "Create an Account" : "Sign in"}
      </Title>



      {loginSuccess ? (
        <Alert
          color="green"
          title="Success!"
          style={{
            maxWidth: "500px",
            margin: "20px auto",
            padding: "15px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "18px", marginTop: "10px" }}>
            Welcome, <strong>{username}</strong>!
          </p>
          <p style={{ fontSize: "14px", marginTop: "5px" }}>
            Redirecting you to the homepage...
          </p>
        </Alert>
      ) : (
        <form onSubmit={handleLogin} name="login" autoComplete="on">
          <Stack ta="center" maw={500} mx="auto">
            <TextInput
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {isRegistering && (
              <>
                <TextInput
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextInput
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </>
            )}

            <TextInput
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {isRegistering && (
              <TextInput
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className='btn-orange'
              style={{marginTop:'10px'}}
            >
              {loading ? (isRegistering ? "Creating account..." : "Signing in...") : (isRegistering ? "Register" : "Sign in")}
            </button>

            {formError && <p style={{ color: "red" }}>{formError}</p>}
          </Stack>
        </form>
      )}
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
  {isRegistering ? (
    <>
      Already have an account?{" "}
      <span
        style={{ color: "#1c7ed6", cursor: "pointer", textDecoration: "underline" }}
        onClick={() => setIsRegistering(false)}
      >
        Sign in
      </span>
    </>
  ) : (
    <>
      Don't have an account?{" "}
      <span
        style={{ color: "#1c7ed6", cursor: "pointer", textDecoration: "underline" }}
        onClick={() => setIsRegistering(true)}
      >
        Create one
      </span>
    </>
  )}
</p>
    </Container>
  );
}
