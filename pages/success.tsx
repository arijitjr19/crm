"use client";

import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const { id } = useParams();
  const router = useRouter();

  return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <Paper
            elevation={4}
            sx={{
              padding: 4,
              textAlign: "center",
              borderRadius: 3
            }}
          >
            <CheckCircleIcon
              sx={{ fontSize: 60, color: "success.main", mb: 2 }}
            />

            <Typography variant="h5" fontWeight={600} gutterBottom>
              Success!
            </Typography>

            <Typography variant="body1" color="text.secondary" mb={2}>
              Your payment was completed successfully.
            </Typography>

            {/* <Typography variant="body2" mb={3}>
              Reference ID: <strong>{id}</strong>
            </Typography> */}

            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/home")}
            >
              Back to Home
            </Button>
          </Paper>
        </Box>
      </Container>
  );
}