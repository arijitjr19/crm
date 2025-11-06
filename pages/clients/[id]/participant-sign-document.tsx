import {
  // getAdditionalDocument,
  // getConsentClient,
  getConsentSigned,
  // getServiceAgreementList,
  getSignDocumentList,
  // sendForConsent
} from "@/api/functions/client.api";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import DownloadIcon from "@mui/icons-material/Download";
import ServiceAgreementUploadEdit from "./participant-service-agreement-upload-edit";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ParticipantSignDocumentUpload from "./participant-sign-document-upload";
import ParticipantSignDocumentHistory from "./participant-sign-document-history";
import ParticipantSignDocumentView from "./participant-sign-document-view";
import ParticipantSignDocumentEmployeeSelection from "./participant-sign-document-select-employee";

// Define the type of a document
interface Document {
  sentForConsent: any;
  versionNumber: string;
  isActive: any;
  id(id: any): void;
  consents: string;
  overallStatus: string;
  documentType: string;
  documentId: string;
  documentName: string | null;
  fileName: string | null;
  expiryDate: string | null;
  downloadURL: string;
}

export default function ParticipantSignDocument() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery<Document[]>({
    queryKey: ["sign_document_list"],
    queryFn: () => getSignDocumentList({ id: id.toString() }) // pass the id as an object
  });
  
  const [isModalEmployeeSelection, setIsModalEmployeeSelection] = useState(false);
  const [isModalView, setIsModalView] = useState(false);
  const [isModalHistory, setIsModalHistory] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenEdit, setModalOpenEdit] = useState(false);
  const [selectedData, setSelectedData] = useState<Document | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<any>(null);
  const [selectedDocumentVersion, setSelectedDocumentVersion] = useState<any>(null);
  const [selectedDocumentURL, setSelectedDocumentURL] = useState<any>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [signedDocumentDownload, setSignedDocumentDownload] = useState<string>("");

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleCloseModalHistory = () => setIsModalHistory(false);
  const handleCloseModalView = () => setIsModalView(false);
  const handleCloseModalEmployeeSelection = () => setIsModalEmployeeSelection(false);
  const handleOpenModalEdit = (data: Document) => {
    setSelectedData(data);
    setModalOpenEdit(true);
  };
  const handleCloseModalEdit = () => setModalOpenEdit(false);

  const formatExpiryDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd-MM-yyyy");
  };

  const handleHistoryClick = (documentId:any) => {
    console.log("History icon clicked!",documentId);
    setSelectedDocumentId(documentId);
    setIsModalHistory(true);
  };

  const handleViewDocument = (documentURL:any) => {
    setSelectedDocumentURL(documentURL);
    setIsModalView(true);
  };

 

  // ------ To send for Consent ------
  // const { mutate: sendForConsentMutate } = useMutation({
  //   mutationFn: ({ documentId, employeeId }: { documentId: string; employeeId: string }) =>
  //     sendForConsent(documentId, employeeId),
  
  //   onSuccess: (data) => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["consent_documents_list"], // 🔁 Update query key to match your list
  //     });
  //     toast.success(data.message || "Consent request sent successfully");
  //   },
  
  //   onError: (error) => {
  //     console.error("Error sending consent request:", error);
  //     toast.error("Failed to send consent request");
  //   },
  // });
  
  
  const handleSendForConsent = (doc: any) => {
    setSelectedDocumentId(doc.id);
    setSelectedDocumentVersion(doc.versionNumber)
    setIsModalEmployeeSelection(true)
    // console.log("Document Id:------",doc.id)
    // console.log("Employee Id:------",id)
    // if (doc.id==="" || id==="") {
    //   toast.error("Missing document or employee information");
    //   return;
    // }
  
    // sendForConsentMutate({
    //   documentId: doc.id,
    //   employeeId: id.toString(),
    // });
  };
  

  // const { data:signedConsent, isLoading:isLoadingSignedConsent, isError:isErrorSignedConsent } = useQuery<Document[]>({
  //   queryKey: ["sign_consent"],
  //   queryFn: () => getConsentSigned({ id: "3" }) // pass the id as an object
  // });

  // useEffect(()=>{
  //   console.log("Signed Consent",signedConsent)
  // },[signedConsent])

  // const {
  //   data: signedConsent,
  //   isLoading:isLoadingSignedConsent,
  //   isError:isErrorSignedConsent,
  //   refetch
  // } = useQuery<Document[]>({
  //   queryKey: ["sign_consent", selectedId],
  //   queryFn: () => getConsentSigned({ id: selectedId }),
  //   enabled: false // <-- don't run automatically
  // });

  const {
    data: signedConsent,
    isLoading:isLoadingSignedConsent,
    isError:isErrorSignedConsent,
    refetch
  } = useQuery<Document[]>({
    queryKey: ["sign_participant"],
    queryFn: () => getConsentSigned({ id: selectedId.toString() }),
    enabled: false // <-- don't run automatically
  });

  // 🔘 This function runs when the button is clicked
  // const handleFetchConsent = (id: any) => {
  //   console.log("Selected Document ID:************",id)
  //   setSelectedId(id);
  //   refetch(); // <-- manually trigger API call
  // };

  // const handleFetchConsent = (id: any) => {
  //   console.log("Selected Document ID:", id);
  //   setSelectedId(id);
  
  //   // Construct the download URL dynamically
  //   const downloadUrl = `http://192.168.99.227:8080/api/documents/consent/signed/${id}`;
  
  //   // Trigger browser download
  //   const link = document.createElement("a");
  //   link.href = downloadUrl;
  //   link.download = `consent_${id}.pdf`; // optional filename
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleFetchConsent = (id: any) => {
    console.log("Selected Document ID:", id);
    setSelectedId(id);
  
    // Construct the URL dynamically
    const fileUrl = `http://192.168.99.227:8080/api/documents/consent/signed/${id}`;
  
    // Open in a new tab
    window.open(fileUrl, "_blank");
  };
  
  
  

  

  return (
    <Grid
      item
      xs={12}
      sx={{
        backgroundColor: "#FFFFFF",
        padding: 2,
        marginTop: 0,
        marginLeft: 1,
        borderRadius: 2,
        boxShadow: (theme) => theme.shadows[3]
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ paddingBottom: "15px" }}
      >
        <Typography variant="h5">Sign Document</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add
        </Button>
      </Stack>
      <Divider />
      {isLoading ? (
        <Grid item xs={12} display="flex" justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : isError ? (
        <Grid item xs={12}>
          <Typography color="error">Failed to load documents.</Typography>
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>
                  <strong>Document Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Document Type</strong>
                </TableCell>
                <TableCell>
                  <strong>Version</strong>
                </TableCell>
                {/* <TableCell>
                  <strong>File Name</strong>
                </TableCell> */}
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Download</strong>
                </TableCell>
                <TableCell>
                  <strong>Consent</strong>
                </TableCell>
                <TableCell>
                  <strong>History</strong>
                </TableCell>
                <TableCell>
                  <strong>View</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((doc) => (
                  <TableRow key={doc.documentId}>
                    <TableCell>{doc.documentName || "N/A"}</TableCell>
                    <TableCell>{doc.documentType || "N/A"}</TableCell>
                    <TableCell>{doc.versionNumber || "N/A"}</TableCell>
                    <TableCell>{doc.overallStatus || "N/A"}</TableCell>

                    <TableCell align="center">
                      <Tooltip title="Download Signed Document">
                        <IconButton onClick={() => handleFetchConsent(doc.id)}>
                          <DownloadIcon sx={{ color: "#009688" }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    {!doc.sentForConsent && doc.isActive && (<TableCell align="center">
                      <Tooltip title="Send for Consent">
                        <IconButton onClick={() => handleSendForConsent(doc)}>
                          <SendIcon sx={{ color: "#009688" }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>)}

                    {doc.sentForConsent && (<TableCell align="center">
                      <Tooltip title="Already Sent">
                        <IconButton >
                          <SendIcon   sx={{ color: "#e8e6e6" }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>)}


                    {!doc.isActive && !doc.sentForConsent && (<TableCell align="center">
                      <Tooltip title="Old Document">
                        <IconButton >
                          <SendIcon   sx={{ color: "#e8e6e6" }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>)}
                 
                    

                    <TableCell align="center">
                      <Tooltip title="View History">
                        <IconButton color="primary" onClick={()=>handleHistoryClick(doc.id)}>
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Document">
                        <IconButton color="primary" onClick={()=>handleViewDocument(doc.downloadURL)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                 
                    {/* <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Typography
                        sx={{ color: doc.expiryDate ? "red" : "#000000" }}
                      >
                        {formatExpiryDate(doc.expiryDate)}
                      </Typography>
                    </TableCell> */}

                    {/* <TableCell>
                      <Box
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        <Tooltip title="Download" arrow>
                          <IconButton sx={{ fontSize: 24, color: "green" }}>
                            <a
                              href={doc.downloadURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: "none" }}
                            >
                              <DownloadIcon />
                            </a>
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No documents available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}


      {selectedDocumentId && (
        <ParticipantSignDocumentEmployeeSelection
          documentId={selectedDocumentId.toString()}
          open={isModalEmployeeSelection}
          onClose={handleCloseModalEmployeeSelection}
        />
      )}

{selectedDocumentURL && (
        <ParticipantSignDocumentView
          documentURL={selectedDocumentURL}
          open={isModalView}
          onClose={handleCloseModalView}
        />
      )}
      
      {selectedDocumentId && (
        <ParticipantSignDocumentHistory
          version={selectedDocumentVersion}
          documentId={selectedDocumentId.toString()}
          open={isModalHistory}
          onClose={handleCloseModalHistory}
        />
      )}
      {id && (
        <ParticipantSignDocumentUpload
          clientId={id.toString()}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
      {selectedData && (
        <ServiceAgreementUploadEdit
          clientId={id.toString()}
          selectedData={selectedData}
          openEdit={isModalOpenEdit}
          onCloseEdit={handleCloseModalEdit}
        />
      )}
    </Grid>
  );
}
