import { useState } from "react";
import { ThemeProvider, createTheme, Container } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./layout/header";
import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#D27000" : "#d9400f", // Darker orange in dark mode
        dark: "#a3400f", // Darker color for hover and active states
      },
      background: {
        default: darkMode ? "#121212" : "#e8caca",
      },
    },
  });

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header darkmode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;
