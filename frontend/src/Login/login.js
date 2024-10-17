import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login, getCurrentUser } = useAuth();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userId = window.localStorage.getItem("currentUserId");

      if (userId) {
        const currentUser = await getCurrentUser();

        if (currentUser) {
          navigate("/");
        }
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogin = async () => {
    const user = await login({ username, password });

    if (user) {
      navigate("/");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h5" gutterBottom>
          Prisijungimas
        </Typography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Vartotojo vardas"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Slaptažodis"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
              >
                Prisijungti
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
