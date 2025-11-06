import {
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  updateServiceAgreement
} from "@/api/functions/client.api";
import { queryClient } from "pages/_app";
import { LoadingButton } from "@mui/lab";
import { toast } from "sonner";
import dayjs from "dayjs";

interface SupportPlanDocumentUploadProps {
  clientId: string;
  selectedData: any;
  openEdit: boolean;
  onCloseEdit: () => void;
}

export default function ServiceAgreementUploadEdit({
  clientId,
  selectedData,
  openEdit,
  onCloseEdit
}: SupportPlanDocumentUploadProps) {
  const [fileName, setFileName] = useState("");
  const [isExpiryMandatory, setIsExpiryMandatory] = useState(false);
  const [expiryDate, setExpiryDate] = useState<dayjs.Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [convertedDate, setConvertedDate] = useState<Date | null>(null);
  const [documentName, setDocumentname] = useState("");
  const [documentId, setDocumentId] = useState("");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileName(event.target.files[0].name);
    }
  };

  // ---------------- To Add the Document Start Here ----------------

  const { mutate } = useMutation({
    mutationFn: updateServiceAgreement,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["additional_document_list"] });
      // console.log("Compliance Data saved successfully");
      toast.success(data.message);
      setLoading(false); // Stop loading on success
      onCloseEdit();
    },
    onError: (error) => {
      console.error("Error saving Compliance Data:", error);
      setLoading(false); // Stop loading on error
    }
  });

  const onSubmit = (params: {
    clientId: string;
    documentName: string;
    fileName: string;
    documentID: string;
    data: FormData;
    isExpiryMandatory: boolean;
    expiryDate: Date;
  }) => {
    mutate(params);
  };

  const handleSubmit = () => {
    if (documentName) {
      const formattedExpiryDate = expiryDate
        ? new Date(expiryDate.toDate())
            .toLocaleDateString("en-GB")
            .split("/")
            .join("-")
        : null;

      if (formattedExpiryDate) {
        const [day, month, year] = formattedExpiryDate.split("-").map(Number);
        const dateObject = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        setConvertedDate(dateObject);
        setLoading(true); // Start loading
        const formData = new FormData();
        formData.append("documentName", documentName);
        if (file) formData.append("file", file);
        formData.append(
          "isExpiryMandatory",
          isExpiryMandatory ? "true" : "false"
        );
        if (dateObject) {
          // Create a new date object representing the selected date at midnight UTC
          const utcDate = new Date(
            Date.UTC(
              dateObject.getFullYear(),
              dateObject.getMonth(),
              dateObject.getDate()
            )
          );

          // Get the ISO string
          const isoDateString = utcDate.toISOString();

          // Append to formData
          formData.append("expiryDate", isoDateString);
        }

        console.log(
          "Submitting data",
          {
            clientId: clientId,
            documentName: documentName,
            file,
            isExpiryMandatory,
            expiryDate: convertedDate
          },
          formData.get("file") // Check the file content
        );

        onSubmit({
          clientId: clientId,
          documentName: documentName,
          fileName: fileName,
          documentID: documentId,
          data: formData,
          isExpiryMandatory,
          expiryDate: convertedDate ?? new Date()
        });
      }
    } else {
      console.log("Missing data", {
        clientId: clientId,
        documentName,
        file,
        isExpiryMandatory,
        expiryDate
      });
    }
  };

  // ---------------- To Add the Document End Here ----------------

  useEffect(() => {
    if (selectedData) {
      setDocumentname(selectedData.documentName);
      setFileName(selectedData.fileName);
      setIsExpiryMandatory(selectedData.isExpiryMandatory);
      setExpiryDate(dayjs(selectedData.expiryDate));
      setDocumentId(selectedData.documentId);
    }

    console.log(
      "-------------------- Selected Data ---------------------",
      selectedData
    );
  }, [selectedData]);

  return (
    <Dialog open={openEdit} onClose={onCloseEdit} fullWidth maxWidth="sm">
      <DialogTitle>Additional Document Edit</DialogTitle>
      <Divider />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextField
                name="documentName"
                label="Enter Document Name"
                variant="outlined"
                fullWidth
                value={documentName} // Bind to state
                onChange={(e) => setDocumentname(e.target.value)} // Update state on change
                disabled
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isExpiryMandatory}
                    onChange={(e) => setIsExpiryMandatory(e.target.checked)}
                  />
                }
                label="Is Expiry Mandatory?"
              />
            </Grid>
            {isExpiryMandatory && (
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <DatePicker
                  name="expiryDate"
                  label="Select Expiry Date"
                  value={expiryDate}
                  onChange={(newValue) => setExpiryDate(newValue)} // newValue will be a dayjs object
                  slots={{ textField: TextField }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            )}
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {/* <Button variant="contained" component="label" fullWidth>
                Select File
                <input type="file" hidden onChange={handleFileChange} />
              </Button> */}

              <TextField
                type="file"
                fullWidth
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setFile(target.files ? target.files[0] : null);
                }}
                sx={{ marginBottom: 2 }}
              />
            </Grid>
          </Grid>
          {fileName && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginTop: 1 }}
            >
              Selected File: {fileName}
            </Typography>
          )}
        </DialogContent>
      </LocalizationProvider>
      <DialogActions>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="contained" color="error" onClick={onCloseEdit}>
            Close
          </Button>
          {/* <Button variant="contained" color="success">
            Upload
          </Button> */}
          <LoadingButton
            onClick={handleSubmit}
            loading={loading}
            variant="contained"
          >
            Submit
          </LoadingButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
