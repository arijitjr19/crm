import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Typography
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

/**
 * DocumentDetails page
 * --------------------
 * Renders a single PDF in‑page (via <iframe>) **and** offers a fallback button to open it in a new tab.
 *
 * Why the fallback?
 * ‑ If your backend sets `X‑Frame‑Options: SAMEORIGIN | DENY`, most browsers will refuse to display the PDF inside an iframe.
 * ‑ Instead of a blank box the user now gets an actionable button.
 */
export default function DocumentDetails() {
  // 📝 Replace this with real data / API call when wiring up React Query.
  const documentData = {
    id: 56,
    downloadURL: "http://192.168.99.227:8080/api/document/3/Apple/Other/56", // <-- PDF URL
    lastUpdated: 1734430573429,
    expiryDate: 1732991400000,
    isExpiryMandatory: true
  } as const;

  const toDateString = (ms: number) =>
    new Date(ms).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

  // --------------------------------------------------
  //  Lightweight “did it load?” indicator.
  // --------------------------------------------------
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [didLoad, setDidLoad] = useState(false);

  // Give the iframe a couple of seconds; if it didn’t paint, we keep the fallback visible.
  useEffect(() => {
    const t = setTimeout(() => {
      // If `contentDocument` exists we assume it rendered something.
      if (iframeRef.current?.contentDocument?.body?.children?.length) {
        setDidLoad(true);
      }
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <Container sx={{ mt: 0 }}>
      {/* <Typography variant="h4" gutterBottom>
        Document Details
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Details for document <b>#{documentData.id}</b>.
      </Typography> */}

      {/* <Divider sx={{ mb: 2 }} /> */}

      {/* <Typography>ID: {documentData.id}</Typography> */}
      <Typography>
        Last Updated: {toDateString(documentData.lastUpdated)}
      </Typography>
      <Typography>
        Expiry Date: {toDateString(documentData.expiryDate)}{" "}
        {documentData.isExpiryMandatory && "(Mandatory)"}
      </Typography>

      {/* --------------------------------------------------
             PDF viewer area
           -------------------------------------------------- */}
      {/* <Box
        sx={{
          mt: 4,
          height: 600,
          overflow: "auto",
          border: "1px solid #ccc",
          position: "relative"
        }}
      >

        {!didLoad && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.6)",
              zIndex: 1
            }}
          >
            <CircularProgress size={32} thickness={4} />
          </Box>
        )}

        <iframe
          ref={iframeRef}
          src={documentData.downloadURL}
          title={`PDF Document ${documentData.id}`}
          width="100%"
          height="100%"
          style={{ border: "none" }}
          onLoad={() => setDidLoad(true)}
        />
      </Box> */}

      {/* --------------------------------------------------
             Fallback button (always visible)
           -------------------------------------------------- */}
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          href={documentData.downloadURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          View the document
        </Button>
      </Box>
    </Container>
  );
}
