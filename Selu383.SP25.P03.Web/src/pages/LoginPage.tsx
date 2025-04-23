import { useEffect, useState } from "react";
import classes from "../styles/Login.module.css";
import {
  Container,
  Title,
  TextInput,
  Button,
  Stack,
  Alert,
  Box,
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
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const redirectTo = location.state?.redirectTo ?? "/";

  useEffect(() => {
    let redirectTimer: number;

    if (loginSuccess) {
      redirectTimer = window.setTimeout(() => {
        navigate(redirectTo, { state: { fromLogin: true } });
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
        login(data);
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
    <Box className="page-content">
      <Container size="sm" pt={40}>
        <Title ta="center" className={classes.title} order={1} mb={30}>
          Sign in
        </Title>

        {loginSuccess ? (
          <Alert
            color="green"
            title="Login Successful!"
            variant="filled"
            radius="md"
            w="100%"
            maw={400}
            mx="auto"
            py="md"
          >
            <p style={{ fontSize: "18px", marginTop: "10px" }}>
              Welcome back, <strong>{username}</strong>!
            </p>
          </Alert>
        ) : (
          <form onSubmit={handleLogin} name="login" autoComplete="on">
            <Stack ta="center" maw={400} mx="auto" gap="lg">
              <TextInput
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                size="md"
                radius="md"
                w="100%"
                required
                styles={{
                  label: {
                    textAlign: "left",
                    display: "block",
                    marginBottom: "8px",
                  },
                }}
              />

              <TextInput
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="md"
                radius="md"
                w="100%"
                required
                styles={{
                  label: {
                    textAlign: "left",
                    display: "block",
                    marginBottom: "8px",
                  },
                }}
              />

              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                size="md"
                radius="md"
                fullWidth
                style={{
                  backgroundColor: "#fdba74",
                  color: "#100e0e",
                }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              {formError && (
                <Alert color="red" title="Error" variant="light" radius="md">
                  {formError}
                </Alert>
              )}
            </Stack>
          </form>
        )}
      </Container>
    </Box>
  );
}
