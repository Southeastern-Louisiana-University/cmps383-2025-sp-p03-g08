import { useEffect, useState } from "react";
import classes from "../styles/Login.module.css";
import {
  Container,
  Title,
  TextInput,
  Button,
  Stack,
  Alert,
} from "@mantine/core";
import { useNavigate } from "react-router";
import { routes } from "../routes/routeIndex";

interface UserDto {
  userName: string;
  id: number;
  roles: string[];
}

interface LoginFormProps {
  onLoginSuccess?: (user: UserDto) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let redirectTimer: number;

    if (loginSuccess) {
      // on log in success, redirect after 3 secs
      redirectTimer = window.setTimeout(() => {
        navigate(routes.home);
      }, 3000);
    }
    // Clean up timer if component unmounts
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [loginSuccess, navigate]);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) {
      return;
    }

    setFormError("");
    setLoading(true);

    fetch("/api/authentication/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.text().then((text) => (text ? JSON.parse(text) : {}));
      })

      .then((data: UserDto) => {
        console.log("Logged in as", data);
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }
        setLoginSuccess(true);
      })

      .catch((error) => {
        console.error("Login error:", error);
        setFormError("Wrong username or password");
      })

      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Container size="xl">
      <Title ta="center" className={classes.title}>
        Sign in
      </Title>

      {loginSuccess ? ( // if login success, tell user and redirect to homepage
        <Alert
          color="green"
          title="Login Successful!"
          style={{
            maxWidth: "500px",
            margin: "20px auto",
            padding: "15px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "18px", marginTop: "10px" }}>
            Welcome back, <strong>{username}</strong>!
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
              styles={{
                label: {
                  width: "100px", // Adjust label width as needed
                  ta: "left",
                },
                input: {
                  width: "10%",
                  height: "25px",
                },
              }}
            />
            <TextInput
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              styles={{
                input: {
                  width: "10%",
                  height: "25px",
                },
              }}
            />

            <Button
              type="submit"
              value={loading ? "Loading..." : "Login"}
              disabled={loading}
              styles={{
                root: {
                  marginTop: "20px",
                  width: "5%",
                  height: "25px",
                },
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            {formError ? <p style={{ color: "red" }}>{formError}</p> : null}
          </Stack>
        </form>
      )}
    </Container>
  );
}
