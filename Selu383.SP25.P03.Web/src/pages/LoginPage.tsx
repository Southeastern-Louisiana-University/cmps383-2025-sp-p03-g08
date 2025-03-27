import { useState } from "react";

import classes from "../styles/Login.module.css";
import {
  Container,
  Title,
  Anchor,
  Paper,
  TextInput,
  PasswordInput,
  Group,
  Checkbox,
  Button,
  Text,
  Box,
  Stack,
} from "@mantine/core";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    fetch("/api/authentication/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: username, password }),
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error("Login failed");
        return r.json();
      })
      .then((data) => {
        console.log("Logged in as", data);
      })
      .catch((err) => console.error(err));
  }

  return (
    <Container size="xl">
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>

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

        <Button onClick={handleLogin}>Sign in</Button>
      </Stack>
    </Container>
  );
}

/* <div>  
      <h1>Sign In</h1>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div> 
      );
      }
      */
