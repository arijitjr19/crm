"use client";

import {
    Box,
    Button,
    Container,
    Paper,
    Typography
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRouter } from "next/navigation";

export default function CancelPage() {
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
          <CancelIcon
            sx={{ fontSize: 60, color: "error.main", mb: 2 }}
          />

          <Typography variant="h5" fontWeight={600} gutterBottom>
            Payment Cancelled
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={2}>
            Your payment was not completed. If this was a mistake, you can try again.
          </Typography>

          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => router.push("/home")}
            >
              Back to Home
            </Button>

            {/* <Button
              variant="contained"
              color="error"
              onClick={() => router.push("/retry-payment")}
            >
              Try Again
            </Button> */}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}