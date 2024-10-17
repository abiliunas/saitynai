import { AppBar, Switch, List, ListItem, Box } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Toolbar from "@mui/material/Toolbar";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";

const midLinks = [
  { title: "Pagrindinis", path: "" },
  { title: "Einamasis likutis", path: "/serviceManagement" },
  { title: "Pinigų krepšelis", path: "/order" },
];

const userLinks = [{ title: "Demo aplinka", path: "/demo" }];

const rightLinks = [
  { title: "Prisijungti", path: "/login" },
  { title: "Registruotis", path: "/register" },
];

const navStyles = {
  color: "inherit",
  alignItems: "center",
  "&:hover": {
    color: "grey.500",
  },
  "&.active": {
    color: "text.primary",
  },
};

export default function Header({ darkmode, handleThemeChange }) {
  const { user, logout } = useAuth();

  let isAdmin = false;
  let isMemberOrAdmin = false;
  let isUser = false;

  if (user) {
    isAdmin = user?.userRoles.includes("Admin");

    isUser = user?.userRoles.includes("User");

    isMemberOrAdmin =
      user.userRoles.includes("Admin") || user.userRoles.includes("Member");
  }
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center">
          {darkmode ? <DarkModeIcon /> : <WbSunnyIcon />}
          <Switch checked={darkmode} onChange={handleThemeChange} />
          <List sx={{ display: "flex" }}>
            {(isAdmin || isMemberOrAdmin) &&
              midLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyles}
                >
                  {title}
                </ListItem>
              ))}
          </List>
          <List sx={{ display: "flex" }}>
            {isUser &&
              userLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyles}
                >
                  {title}
                </ListItem>
              ))}
          </List>
        </Box>

        <Box>
          <List sx={{ display: "flex" }}>
            {!user &&
              rightLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyles}
                >
                  {title}
                </ListItem>
              ))}
            {user && (
              <ListItem onClick={() => logout()} sx={navStyles}>
                Atsijungti
              </ListItem>
            )}
          </List>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
