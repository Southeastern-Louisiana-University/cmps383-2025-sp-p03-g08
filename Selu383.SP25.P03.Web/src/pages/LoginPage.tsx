import { useEffect, useState } from "react";
import classes from "../styles/Login.module.css";
import { Container, Title, TextInput, Button, Stack } from "@mantine/core";
import { useNavigate } from "react-router";
import { routes } from "../routes/routeIndex";

interface UserDto {
  userName: string;
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
      // Redirect after 2 seconds (adjust timing as needed)
      redirectTimer = window.setTimeout(() => {
        navigate(routes.home);
      }, 2000);
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
          // Check if it exists before calling
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
        Welcome back!
      </Title>

      <form onSubmit={handleLogin}>
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
          {formError ? <p style={{ color: "red" }}>{formError}</p> : null}
          <Button
            type="submit"
            value={loading ? "Loading..." : "Login"}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
