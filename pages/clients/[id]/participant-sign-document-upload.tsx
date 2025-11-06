import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography  
} from "@mui/material";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMutation } from "@tanstack/react-query";
import { addSignDocument } from "@/api/functions/client.api";
import { queryClient } from "pages/_app";
import { LoadingButton } from "@mui/lab";
import { toast } from "sonner";

interface SupportPlanDocumentUploadProps {
  clientId: string;
  open: boolean;
  onClose: () => void;
}

export default function ParticipantSignDocumentUpload({
  clientId,
  open,
  onClose
}: SupportPlanDocumentUploadProps) {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [loading, setLoading] = useState(false);

  // Mapping of document types and their corresponding document names
  const documentOptions: Record<string, string[]> = {
    "Core Document": [
      "Client Intake",
      "Easy Read Consent",
      "Individual Risk Assessment",
      "Support Plan Form Part One",
      "Support Plan Form Part Two",
      "Participant Consent",
      "Participant Review",
      "Diary Form",
      "House Risk Assessment Form"
    ],
    "Clinical Document": [
      "Medication Chart",
      "Medication Incidents",
      "Vital Logs",
      "Stool Chart",
      "Insulin Sign Off Form",
      "Blood Glucose Log Book",
      "Sleep Chart",
      "Ventilator Observation Chart",
      "Weight Chart",
      "Bowel Chart Form",
      "Wound Treatment Forms",
      "Seizure Record Forms",
      "Skin Assessment Forms",
      "Catheter Care Form",
      "Mental Status Exam",
      "Tracheostomy Observations Chart"
    ],
    "Behaviour Document": [
      "Behaviour Observation Chart",
      "Positive Behaviour Review"
    ]
  };

  const { mutate } = useMutation({
    mutationFn: addSignDocument,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["sign_document_list"]
      });
      toast.success(data.message);
      setLoading(false);
      onClose();
    },
    onError: (error) => {
      console.error("Error saving Sign Document Data:", error);
      setLoading(false);
    }
  });

  const onSubmit = (params: {
    clientId: string;
    documentType: string;
    documentName: string;
    data: FormData;
  }) => {
    mutate(params);
  };

  const handleSubmit = () => {
    if (documentName && documentType && file) {
      setLoading(true);

      const formData = new FormData();
      formData.append("documentName", documentName);
      formData.append("documentType", documentType);
      formData.append("file", file);

      console.log("Submitting data", {
        clientId,
        documentType,
        documentName,
        file
      });

      onSubmit({
        clientId,
        documentType,
        documentName,
        data: formData
      });
    } else {
      toast.error("Please select document type, name, and upload a file.");
      console.log("Missing data", { clientId, documentType, documentName, file });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload Document for Signature</DialogTitle>
      <Divider />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Document Type Dropdown */}
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="document-type-label">Select Document Type</InputLabel>
                <Select
                  labelId="document-type-label"
                  value={documentType}
                  label="Select Document Type"
                  onChange={(e) => {
                    setDocumentType(e.target.value);
                    setDocumentName(""); // Reset document name when type changes
                  }}
                >
                  <MenuItem value="Core Document">Core Document</MenuItem>
                  <MenuItem value="Clinical Document">Clinical Document</MenuItem>
                  <MenuItem value="Behaviour Document">Behaviour Document</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Document Name Dropdown */}
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <FormControl fullWidth disabled={!documentType}>
                <InputLabel id="document-name-label">Select Document Name</InputLabel>
                <Select
                  labelId="document-name-label"
                  value={documentName}
                  label="Select Document Name"
                  onChange={(e) => setDocumentName(e.target.value)}
                >
                  {(documentOptions[documentType] || []).map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* File Upload */}
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextField
                type="file"
                fullWidth
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setFile(target.files ? target.files[0] : null);
                  setFileName(target.files ? target.files[0].name : "");
                }}
                sx={{ marginBottom: 2 }}
              />
            </Grid>
          </Grid>

          {fileName && (
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
              Selected File: {fileName}
            </Typography>
          )}
        </DialogContent>
      </LocalizationProvider>

      <DialogActions>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, width: "100%" }}>
         
          <LoadingButton
            onClick={handleSubmit}
            loading={loading}
            variant="contained"
            color="primary"
          >
            Submit
          </LoadingButton>
          <Button variant="contained" color="error" onClick={onClose}>
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
