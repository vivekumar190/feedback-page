import { AppBar, Box, Container, Link, Toolbar } from "@mui/material";
import Logo from "./Logo";

const Header = () => {
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: "1px solid #eee",
        bgcolor: "white",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            minHeight: "64px",
          }}
        >
          <Link href="/" underline="none" sx={{ display: "flex" }}>
            <Logo />
          </Link>

          <Box sx={{ display: "flex", gap: 3 }}></Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
