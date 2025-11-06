import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@mui/material";
import { useRouter } from "next/router";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  

  return (
    <>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "white" }}>
            Shift Care
          </Typography>
          <Button color="inherit" onClick={() => router.push("/auth/signup")}>
            Admin sign up
          </Button>
          <Button color="inherit" onClick={() => router.push("/about")}>
            About
          </Button>
          <Button color="inherit" onClick={() => router.push("/contact")}>
            Contact
          </Button>
          {/* Sign In Dropdown */}
          <Button color="inherit" onClick={handleMenuOpen}>
            Sign in
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                router.push("/auth/employee/signin");
                handleMenuClose();
              }}
            >
              Employee Sign in
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push("/auth/client/signin");
                handleMenuClose();
              }}
            >
              Client Sign in
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Banner Section (Carousel) */}

      <Box
        sx={{
          width: "100%",
          height: "100vh", // Full screen height
          display: "flex",
          flexDirection: "column", // Header -> Content -> Footer vertically
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Sensible Health
            </Typography>
            <Button color="inherit" onClick={() => router.push("/about")}>
              About
            </Button>
            <Button color="inherit" onClick={() => router.push("/contact")}>
              Contact
            </Button>
            {/* Sign In Dropdown */}
            <Button color="inherit" onClick={handleMenuOpen}>
              Sign In
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  router.push("/auth/employee/signin");
                  handleMenuClose();
                }}
              />
            </div>
          ))}
        </Carousel>
      </Box>

      {/* Login Options */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" align="center" fontWeight={600} sx={{ mb: 4 }}>
          Sign in
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            {
              title: "Employee Sign in",
              path: "/auth/employee/signin",
              bg: "linear-gradient(135deg, #1c92d2, #3a6073)"
            },
            {
              title: "Client Sign in",
              path: "/auth/client/signin",
              bg: "linear-gradient(135deg, #16222A, #3A6073, #46A2D9)"
            }
          ].map((login, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  borderRadius: 2,
                  boxShadow: 3,
                  background: login.bg,
                  color: "white"
              >
                Employee Sign In
              </MenuItem>
              <MenuItem
                onClick={() => {
                  router.push("/auth/client/signin");
                  handleMenuClose();
                }}
              >
                Client Sign In
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1, // Takes remaining space between header and footer
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
            backgroundImage: "url('/assets/background/banner2.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              align="center"
              fontWeight={600}
              sx={{ mb: 4, color: "white", textShadow: "0px 1px 4px rgba(0,0,0,0.5)" }}
            >
              Sign In
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {[
                {
                  title: "Employee Sign In",
                  path: "/auth/employee/signin",
                  bg: "linear-gradient(135deg, #1c92d2, #3a6073)",
                },
                {
                  title: "Client Sign In",
                  path: "/auth/client/signin",
                  bg: "linear-gradient(135deg, #16222A, #3A6073, #46A2D9)",
                },
              ].map((login, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Card
                    sx={{
                      textAlign: "center",
                      borderRadius: 2,
                      boxShadow: 3,
                      background: login.bg,
                      color: "white",
                    }}
                  >
                    <CardActionArea onClick={() => router.push(login.path)}>
                      <CardContent sx={{ padding: "75px" }}>
                        <Typography
                          variant="h5"
                          fontWeight={600}
                          sx={{ color: "#ffffff" }}
                        >
                          {login.title}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 3,
          textAlign: "center",
          mt: 6
        }}
      >
        <Typography variant="body2" color={"white"}>
          &copy; {new Date().getFullYear()} Shift care. All Rights
          Reserved.
        </Typography>
      </Box>
    </>
  );
}
