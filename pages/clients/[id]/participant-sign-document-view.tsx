import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography  
} from "@mui/material";
import {useEffect,useState } from "react";

interface SignDocumentHistory {
  documentURL: string;
  open: boolean;
  onClose: () => void;
}

export default function ParticipantSignDocumentView({
  documentURL,
  open,
  onClose
}: SignDocumentHistory) {
  const [fileType, setFileType] = useState<"image" | "pdf" | "unknown" | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!documentURL || !open) return;
    setLoading(true);
    setFileType(null);
    setPreviewURL(null);

    fetch(documentURL)
      .then(async (res) => {
        const blob = await res.blob();
        const mime = blob.type;

        const url = URL.createObjectURL(blob);
        setPreviewURL(url);

        if (mime.includes("pdf")) setFileType("pdf");
        else if (mime.includes("image")) setFileType("image");
        else setFileType("unknown");
      })
      .catch(() => setFileType("unknown"))
      .finally(() => setLoading(false));
  }, [documentURL, open]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = documentURL;
    link.download = documentURL.split("/").pop() || "document";
    link.target = "_blank";
    link.click();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Document Viewer</DialogTitle>
      <Divider />
      <DialogContent>
        {loading ? (
          <Typography>Loading document...</Typography>
        ) : !previewURL ? (
          <Typography>No preview available.</Typography>
        ) : fileType === "image" ? (
          <Box sx={{ textAlign: "center" }}>
            <img
              src={previewURL}
              alt="Document"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: 8,
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
              }}
            />
          </Box>
        ) : fileType === "pdf" ? (
          <Box
            sx={{
              width: "100%",
              height: "70vh",
              border: "1px solid #ccc",
              borderRadius: 2,
              overflow: "hidden"
            }}
          >
            <iframe
              src={previewURL}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="PDF Viewer"
            ></iframe>
          </Box>
        ) : (
          <Typography>Unable to preview this file type.</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Button variant="contained" color="primary" onClick={handleDownload}>
            Download
          </Button>
          <Button variant="contained" color="error" onClick={onClose}>
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
