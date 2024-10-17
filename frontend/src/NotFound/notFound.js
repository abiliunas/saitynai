import { Container, Paper, Typography, Divider, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Container
      component={Paper}
      style={{
        height: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "10px",
      }}
    >
      <Typography gutterBottom variant={"h3"} style={{ alignSelf: "center" }}>
        Turinys kurio ieškote buvo nerastas!
      </Typography>
      <Divider />
      <Button component={Link} to="/" fullWidth>
        Grįžti į pagrindinį puslapį
      </Button>
    </Container>
  );
}
