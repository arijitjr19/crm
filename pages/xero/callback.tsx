"use client";

import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { Box, Button, Container, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();

  return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          minHeight="70vh"
        >
          <CheckCircleIcon
            sx={{ fontSize: 80, color: "success.main", mb: 2 }}
          />

          <Typography variant="h4" gutterBottom>
            Thank You!
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3}>
            Your submission has been successfully completed. We appreciate your
            time and effort.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/home")}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Container>
  );
}