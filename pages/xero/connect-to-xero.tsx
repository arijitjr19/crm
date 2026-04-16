"use client";

import { useEffect } from "react";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { Container, Typography } from "@mui/material";
import { connectToXero } from "@/api/functions/xero.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ConnectToXero() {

  const company = "Ashish Co";

  const { mutate, isPending } = useMutation({
    mutationFn: connectToXero,
    onSuccess: (data) => {
      toast.success(data.message);
      // If backend sends redirect URL
      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    }
  });

  useEffect(() => {
    mutate({ companyName: company });
  }, []);

  return (
    <DashboardLayout>
      <Container>
        <Typography variant="h4" gutterBottom>
          Connecting to Xero...
        </Typography>

        <Typography variant="body1">
          {isPending
            ? "Please wait while we redirect you to Xero for authorization."
            : "Initializing connection, please don't press back button or refresh."}
        </Typography>
      </Container>
    </DashboardLayout>
  );
}