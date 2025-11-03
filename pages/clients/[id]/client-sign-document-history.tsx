import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography  
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getSignDocumentHistory } from "@/api/functions/client.api";
import dayjs from "dayjs";

interface signDocumentHistory {
  version:any;
  documentId: string;
  open: boolean;
  onClose: () => void;
}

interface HistoryItem {
  action: string;
  performedBy: string;
  timestamp: number[];
  notes: string | null;
}

export default function ClientSignDocumentHistory({
  version,
  documentId,
  open,
  onClose
}: signDocumentHistory) {

  const { data, isLoading, isError } = useQuery<HistoryItem[]>({
    queryKey: ["sign_document_history", documentId, version], 
    queryFn: () => getSignDocumentHistory({ id: documentId.toString() }),
    enabled: !!documentId,
  });

  // helper to convert timestamp array into readable format
  const formatTimestamp = (timestamp: number[]) => {
    if (!timestamp || timestamp.length < 6) return "N/A";
    const [year, month, day, hour, minute, second] = timestamp;
    return dayjs(new Date(year, month - 1, day, hour, minute, second)).format(
      "DD/MM/YYYY hh:mm A"
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Document History</DialogTitle>
      <Divider />
      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">Failed to load history.</Typography>
        ) : !data || data.length === 0 ? (
          <Typography>No history available for this document.</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 1, maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell><b>Action</b></TableCell>
                  <TableCell><b>Performed By</b></TableCell>
                  <TableCell><b>Timestamp</b></TableCell>
                  <TableCell><b>Notes</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.action}</TableCell>
                    <TableCell>{row.performedBy}</TableCell>
                    <TableCell>{formatTimestamp(row.timestamp)}</TableCell>
                    <TableCell>{row.notes ?? "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
