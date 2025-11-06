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
  Typography  
} from "@mui/material";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "pages/_app";
import { toast } from "sonner";
import { getStaffList } from "@/api/functions/staff.api";
import { sendForConsent } from "@/api/functions/client.api";

interface signDocumentEmployeeSelection {
  documentId: string;
  open: boolean;
  onClose: () => void;
}

export default function ParticipantSignDocumentEmployeeSelection({
  documentId,
  open,
  onClose
}: signDocumentEmployeeSelection) {

  const { data = [], isLoading } = useQuery({
    queryKey: ["user_list"],
    queryFn: getStaffList
  });

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  // --- Mutation for sending consent ---
  const { mutate: sendForConsentMutate, isPending } = useMutation({
    mutationFn: ({ documentId, employeeId }: { documentId: string; employeeId: string }) =>
      sendForConsent(documentId, employeeId),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sign_document_history"] });
      queryClient.invalidateQueries({ queryKey: ["sign_document_list"] });      
      toast.success(data?.message || "Consent request sent successfully");
      onClose();
    },

    onError: (error) => {
      console.error("Error sending consent request:", error);
      toast.error("Failed to send consent request");
    },
  });

  // --- Handle submit ---
  const handleSendForConsent = () => {
    if (!documentId || !selectedEmployeeId) {
      toast.error("Please select an employee before sending consent");
      return;
    }

    sendForConsentMutate({
      documentId,
      employeeId: selectedEmployeeId,
    });
  };

  // --- Prepare dropdown list (skip first 2 employees) ---
  const employeeOptions = Array.isArray(data) ? data.slice(2) : [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Employee List</DialogTitle>
      <Divider />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {isLoading ? (
                <Typography>Loading employees...</Typography>
              ) : (
                <FormControl fullWidth>
                  <InputLabel id="employee-select-label">Select Employee</InputLabel>
                  <Select
                    labelId="employee-select-label"
                    value={selectedEmployeeId}
                    label="Select Employee"
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  >
                    {employeeOptions.map((emp) => (
                      <MenuItem key={emp.id} value={emp.id.toString()}>
                        {emp.salutation ? `${emp.salutation} ${emp.name}` : emp.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </LocalizationProvider>

      <DialogActions>
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end", // pushes buttons to the right
      width: "100%",
      gap: 2, // adds space between the two buttons
    }}
  >
   
    <Button
      variant="contained"
      color="primary"
      disabled={!selectedEmployeeId || isPending}
      onClick={handleSendForConsent}
    >
      {isPending ? "Sending..." : "Send for Consent"}
    </Button>
    <Button variant="contained" color="error" onClick={onClose}>
      Close
    </Button>
  </Box>
</DialogActions>

    </Dialog>
  );
}
