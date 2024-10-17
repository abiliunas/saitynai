import React, { useState } from "react";
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

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { register } = useAuth();

  const handleRegister = async () => {
    const newErrors = {};

    if (!username || username.length < 6) {
      newErrors.username =
        "Vartotojo vardas turi būti ne trumpesnis nei 6 simboliai";
    }

    if (!password || password.length < 6) {
      newErrors.password =
        "Slaptažodis turi būti ne trumpesnis nei 6 simboliai";
    }

    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      const user = await register({ username, password });

      if (user) {
        navigate("/");
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h5" gutterBottom>
          Registracija
        </Typography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Vartotojo vardas"
                variant="outlined"
                required
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={Boolean(errors.username)}
                helperText={errors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Slaptažodis"
                type="password"
                variant="outlined"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(errors.password)}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleRegister}
              >
                Registruotis
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
