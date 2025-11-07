"use client";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { Box, Button, Container, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export default function SamplePriceBook() {
  const fileUrl = "/pdf/sample_pricebook.csv"; // File inside public/pdf/

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "sample_pricebook.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download Price Book
          </Button>
  );
}
