"use client";

import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { Box, Button, Container, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { callbackApi } from "@/api/functions/xero.api";
import { toast } from "sonner";
import { useEffect } from "react";

export default function ThankYouPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Get query params properly
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const { mutate, isPending } = useMutation({
    mutationFn: callbackApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Connected successfully");

      // Optional: Auto redirect after success
      // setTimeout(() => {
      //   router.push("/home");
      // }, 1500);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    }
  });

  // ✅ Trigger API when params are available
  useEffect(() => {
    if (code && state) {
      mutate({ code, state });
    }
  }, [code, state, mutate]);

  // ✅ Debug log
  useEffect(() => {
    console.log("-----:URL Data:-----", { code, state });
  }, [code, state]);

  return (
    <DashboardLayout>
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
            {isPending
              ? "Connecting to Xero, please wait..."
              : "Your submission has been successfully completed. We appreciate your time and effort."}
          </Typography>

          {!isPending && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/home")}
            >
              Go to Dashboard
            </Button>
          )}
        </Box>
      </Container>
    </DashboardLayout>
  );
}