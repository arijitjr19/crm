import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSignDocumentPendingClient } from "@/api/functions/client.api";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import RateReviewIcon from "@mui/icons-material/RateReview";
import RefreshIcon from "@mui/icons-material/Refresh";
import SignaturePadComponent from "./client-digital-signature";
import ClientSignDocumentHistory from "./[id]/client-sign-document-history";


interface SignDocumentPendingProps {
  clientId: string;
  open: boolean;
  onClose: () => void;
}

interface Document {
  versionNumber: string;
  documentType: string;
  id: any;
  documentId: number;
  clientId: number;
  employeeId: number;
  clientStatus: string | null;
  employeeStatus: string | null;
  clientRejectionNotes: string | null;
  employeeRejectionNotes: string | null;
  clientReviewedAt: string | null;
  employeeReviewedAt: string | null;
  clientSignature: string | null;
  employeeSignature: string | null;
  overallStatus: string | null;
  documentName: string | null;
}

export default function ClientSignDocumentPending({
  clientId,
  open,
  onClose,
}: SignDocumentPendingProps) {

  const {
    data,
    isLoading,
    isError,
    refetch, // <- this function lets you manually trigger a refresh
    isFetching,
  } = useQuery<Document[]>({
    queryKey: ["sign_document_pending_client_refresh"],
    queryFn: () => getSignDocumentPendingClient({ id: clientId.toString() }),
  });

  // const { data, isLoading, isError } = useQuery<Document[]>({
  //   queryKey: ["sign_document_pending_client_refresh"],     
  //   queryFn: () => getSignDocumentPendingClient({ id: clientId.toString() }),
  // });

  // useEffect(() => {
  //     if (data && data.length > 0) {
  //       console.log("Pending Document^^^^^^^^^^^^^^^^^^^^", data[0].documentId);
  //     }
  //   }, [data]);


  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const [action, setAction] = useState<string>("");
  const [rejectionNote, setRejectionNote] = useState<string>("");

  const [isModalHistory, setIsModalHistory] = useState(false);
  const handleCloseModalHistory = () => setIsModalHistory(false);

  const [selectedDocumentId, setSelectedDocumentId] = useState<any>("");
  const [selectedDocumentVersion, setSelectedDocumentVersion] = useState<any>(null);
  const [selectedConsentId, setSelectedConsentId] = useState<any>("");


  const handleReject = (doc: Document) => {
    console.log("Rejected:", doc);
  };

  const handleCloseApproveDialog = () => {
    setApproveDialogOpen(false);
    setSelectedDoc(null);
  };


  const handleHistory = (doc: any) => {
    // Your logic here, e.g., open modal or navigate to history page
    // console.log("View history of:", doc.documentId);
    setSelectedDocumentId(doc.documentId)
    setSelectedDocumentVersion(doc.versionNumber)
    setIsModalHistory(true);
  };



  const handleReview = (doc: Document) => {
    setSelectedDoc(doc);
    setApproveDialogOpen(true);
    setSelectedConsentId(doc.id)
  };

  // function formatTimestamp(value?: any) {
  //   if (!value) return "-";

  //   // Extract year, month, and day from the string
  //   const year = value.slice(0, 4);
  //   const month = value.slice(4, 6);
  //   const day = value.slice(6, 8);

  //   return `${day}/${month}/${year}`;
  // }

  // function formatTimestamp(value?: any) {
  //   if (!value) return "-";

  //   // Ensure it’s a string
  //   const str = String(value).trim();

  //   // Some systems send timestamps with extra precision; take only first 8 digits for date
  //   if (str.length < 8) return "-";

  //   const year = str.slice(0, 4);
  //   const month = str.slice(4, 6);
  //   const day = str.slice(6, 8);

  //   return `${day}/${month}/${year}`;
  // }




  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Pending Documents</DialogTitle>
      <Divider />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DialogContent>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : isError ? (
            <Typography color="error">Failed to load data</Typography>
          ) : data && data.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell><b>Document ID</b></TableCell>
                      <TableCell><b>Client ID</b></TableCell>
                      <TableCell><b>Employee ID</b></TableCell> */}
                    <TableCell><b>Client Status</b></TableCell>
                    <TableCell><b>Employee Status</b></TableCell>
                    <TableCell><b>Client Rejection Notes</b></TableCell>
                    <TableCell><b>Employee Rejection Notes</b></TableCell>
                    <TableCell><b>Client Reviewed At</b></TableCell>
                    <TableCell><b>Employee Reviewed At</b></TableCell>
                    <TableCell><b>Client Signature</b></TableCell>
                    <TableCell><b>Employee Signature</b></TableCell>
                    <TableCell><b>Overall Status</b></TableCell>
                    <TableCell><b>Document Name</b></TableCell>
                    <TableCell><b>Document Type</b></TableCell>
                    <TableCell><b>Document Version</b></TableCell>
                    <TableCell align="center"><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((doc) => (
                    <TableRow key={doc.documentId}>
                      {/* <TableCell>{doc.documentId}</TableCell>
                        <TableCell>{doc.clientId}</TableCell>
                        <TableCell>{doc.employeeId}</TableCell> */}
                      <TableCell>{doc.clientStatus || "-"}</TableCell>
                      <TableCell>{doc.employeeStatus || "-"}</TableCell>
                      <TableCell>{doc.clientRejectionNotes || "-"}</TableCell>
                      <TableCell>{doc.employeeRejectionNotes || "-"}</TableCell>
                      {/* <TableCell>{doc.clientReviewedAt || "-"}</TableCell> */}
                      <TableCell>
                        {doc.clientReviewedAt
                          ? (() => {
                            const str = String(doc.clientReviewedAt);
                            const clean = str.replace(/\D/g, ""); // remove any non-digits, just in case
                            if (clean.length < 8) return "-";
                            const year = clean.slice(0, 4);
                            const month = clean.slice(4, 6);
                            const day = clean.slice(6, 8);
                            return `${day}/${month}/${year}`;
                          })()
                          : "-"}
                      </TableCell>
                      {/* <TableCell>{doc.employeeReviewedAt || "-"}</TableCell> */}
                      <TableCell>
                        {doc.employeeReviewedAt
                          ? (() => {
                            const str = String(doc.employeeReviewedAt);
                            const clean = str.replace(/\D/g, ""); // remove any non-digits, just in case
                            if (clean.length < 8) return "-";
                            const year = clean.slice(0, 4);
                            const month = clean.slice(4, 6);
                            const day = clean.slice(6, 8);
                            return `${day}/${month}/${year}`;
                          })()
                          : "-"}
                      </TableCell>



                      {/* <TableCell>{formatTimestamp(doc.employeeReviewedAt)}</TableCell> */}
                      {/* <TableCell>{doc.clientSignature || "-"}</TableCell> */}
                      <TableCell>
                        {doc.clientSignature ? (
                          <img
                            src={doc.clientSignature}
                            alt="Employee Signature"
                            style={{ width: "150px", height: "auto", border: "1px solid #fff", borderRadius: "4px" }}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      {/* <TableCell>{doc.employeeSignature || "-"}</TableCell> */}
                      <TableCell>
                        {doc.employeeSignature ? (
                          <img
                            src={doc.employeeSignature}
                            alt="Employee Signature"
                            style={{ width: "150px", height: "auto", border: "1px solid #fff", borderRadius: "4px" }}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{doc.overallStatus || "-"}</TableCell>
                      <TableCell>{doc.documentName || "-"}</TableCell>
                      <TableCell>{doc.documentType || "-"}</TableCell>
                      <TableCell>{doc.versionNumber || "-"}</TableCell>

                      {doc.clientStatus === "PENDING" && (
                        <TableCell align="center">
                          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                            <Tooltip title="History">
                              <IconButton
                                color="primary"
                                onClick={() => handleHistory(doc)}
                              >
                                <HistoryIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Review">
                              <IconButton
                                color="primary"
                                onClick={() => handleReview(doc)}
                              >
                                <RateReviewIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      )}

                      {doc.clientStatus !== "PENDING" && (
                        <TableCell align="center">
                          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                            <Tooltip title="History">
                              <IconButton
                                color="primary"
                                onClick={() => handleHistory(doc)}
                              >
                                <HistoryIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Review Done">
                              <IconButton
                                sx={{ color: "#e8e6e6" }}
                              >
                                <RateReviewIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      )}

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No pending documents found.</Typography>
          )}
        </DialogContent>
      </LocalizationProvider>
      <DialogActions>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
        >
          {/* ✅ Refresh Button */}
          <Tooltip title="Refresh">
            <IconButton
              onClick={() => refetch()}
              disabled={isFetching}
              sx={{
                color: "grey.600",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <RefreshIcon
                sx={{
                  transition: "transform 0.3s ease",
                  ...(isFetching && { transform: "rotate(360deg)" }),
                }}
              />
            </IconButton>
          </Tooltip>

          {/* ❌ Close Button */}
          <Button variant="contained" color="error" onClick={onClose}>
            Close
          </Button>
        </Box>
      </DialogActions>

      {/* <DialogActions>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, width: "100%" }}>
            <Button variant="contained" color="error" onClick={onClose}>
              Close
            </Button>
          </Box>
        </DialogActions> */}

      {/* Review Modal */}
      <Dialog open={approveDialogOpen} onClose={handleCloseApproveDialog} maxWidth="sm" >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Review Decision</Typography>
          <IconButton
            onClick={handleCloseApproveDialog}
            color="error"
            size="small"
            sx={{
              "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>
            <SignaturePadComponent consentId={selectedConsentId} onClose={handleCloseApproveDialog}></SignaturePadComponent>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* ------- History Modal ------ */}
      {selectedDocumentId && (<ClientSignDocumentHistory
        version={selectedDocumentVersion}
        documentId={selectedDocumentId.toString()}
        open={isModalHistory}
        onClose={handleCloseModalHistory}
      />)}

    </Dialog>
  );
}
