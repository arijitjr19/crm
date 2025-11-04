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
import router, { useRouter } from "next/router";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from "react-responsive-carousel";
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

      {/* Banner Section (Carousel) */}

      <Box
        sx={{
          width: "100%",
          height: "350px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
          overflow: "hidden",
          paddingLeft: 0,
          paddingRight: 0
        }}
      >
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          interval={5000}
          showArrows={false}
          showStatus={false}
        >
          {[
            "/assets/background/banner2.jpeg",
            "/assets/background/banner2.jpeg",
            "/assets/background/banner2.jpeg"
          ].map((src, index) => (
            <div key={index} style={{ width: "100%", height: "350px" }}>
              <img
                src={src}
                alt={`Banner ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>
          ))}
        </Carousel>
      </Box>

      {/* Login Options */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" align="center" fontWeight={600} sx={{ mb: 4 }}>
          Sign In
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            {
              title: "Employee Sign In",
              path: "/auth/employee/signin",
              bg: "linear-gradient(135deg, #1c92d2, #3a6073)"
            },
            {
              title: "Client Sign In",
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
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Sensible Health. All Rights
          Reserved.
        </Typography>
      </Box>
    </>
  );
}
