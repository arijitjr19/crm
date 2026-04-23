"use client";

import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import {
  XeroDisconnect,
  XeroStatus,
  connectToXero
} from "@/api/functions/xero.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCookie } from "@/lib/functions/storage.lib";
import LinkOffIcon from "@mui/icons-material/LinkOff";

export default function ConnectToXero() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // 🔹 Get Xero Status
  const { mutate: getStatus, isPending: isCheckingStatus } = useMutation({
    mutationFn: XeroStatus,
    onSuccess: (data) => {
      setIsConnected(data?.message); // true / false
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to fetch status");
      setIsConnected(false);
    }
  });

  // 🔹 Connect to Xero
  const { mutate: connect, isPending: isConnecting } = useMutation({
    mutationFn: connectToXero,
    onSuccess: (data) => {
      setIsConnected(true);
      toast.success("Redirecting to Xero...");

      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Connection failed");
    }
  });

  // 🔹 Disconnect from Xero
  const { mutate: disconnect, isPending: isDisconnecting } = useMutation({
    mutationFn: XeroDisconnect,
    onSuccess: () => {
      setIsConnected(false);
      toast.success("Disconnected from Xero");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Disconnect failed");
    }
  });

  // 🔹 Fetch status on mount
  useEffect(() => {
    const userCookie = getCookie("user");

    if (!userCookie) {
      console.log("No user cookie found");
      setIsConnected(false);
      return;
    }

    try {
      const user = JSON.parse(userCookie);
      getStatus({ companyName: user.company });
    } catch (err) {
      console.error("Invalid JSON in cookie", err);
      setIsConnected(false);
    }
  }, []);

  // 🔹 Handle Connect
  const handleConnect = () => {
    const userCookie = getCookie("user");

    if (!userCookie) {
      toast.error("User not found");
      return;
    }

    try {
      const user = JSON.parse(userCookie);
      connect({ companyName: user.company });
    } catch (err) {
      console.error("Invalid JSON in cookie", err);
      toast.error("Invalid user data");
    }
  };

  // 🔹 Handle Disconnect
  const handleDisconnect = () => {
    const userCookie = getCookie("user");

    if (!userCookie) {
      toast.error("User not found");
      return;
    }

    try {
      const user = JSON.parse(userCookie);
      disconnect({ companyName: user.company });
    } catch (err) {
      console.error("Invalid JSON in cookie", err);
      toast.error("Invalid user data");
    }
  };

  // 🔹 While checking status
  if (isCheckingStatus || isConnected === null) {
    return null; // or loader
  }

  return (
    <>
      {!isConnected ? (
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          startIcon={<LinkIcon />}
          sx={{
            width: "89%",
            margin: "5px 16px",
            borderRadius: "3px",
            backgroundColor: "#d8effe",
            color: "#1e2a33",
            fontWeight: 500,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#c5e4fb"
            }
          }}
        >
          {isConnecting ? "Connecting..." : "Connect To Xero"}
        </Button>
      ) : (
        <Button
          onClick={handleDisconnect}
          disabled={isDisconnecting}
          startIcon={<LinkOffIcon />}
          sx={{
            width: "89%",
            margin: "5px 16px",
            borderRadius: "3px",
            backgroundColor: "#d8effe",
            color: "#1e2a33",
            fontWeight: 500,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#c5e4fb"
            }
          }}
        >
          {isDisconnecting ? "Disconnecting..." : "Disconnect Xero"}
        </Button>
      )}
    </>
  );
}