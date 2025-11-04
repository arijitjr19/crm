import {
  getShiftByDocumentIdFromNotification,
  getShiftByIdFromNotification,
  updateMarkRead
} from "@/api/functions/client.api";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ShiftDetails from "./shift_details";
import DocumentDetails from "./document_details";

export interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: Date;
  createdAtEpochNew: string;
  updatedAt: Date;
  readAt: string;
  isRead: boolean;
  isDeleted: boolean;
  referenceId: string;
  type: string;
  avatar: string | null;
}

function renderContent(notification: Notification) {
  // function renderContent({ notification, userid }: { notification: Notification, userid: string }) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography
        component="span"
        variant="body2"
        sx={{ color: "text.secondary" }}
      >
        &nbsp; {notification.message}
      </Typography>
    </Typography>
  );

  // if (notification.type === "order_placed") {
  //   return {
  //     avatar: (
  //       <img
  //         alt={notification.title}
  //         src="/assets/icons/ic_notification_package.svg"
  //       />
  //     ),
  //     title
  //   };
  // }
  // if (notification.type === "order_shipped") {
  //   return {
  //     avatar: (
  //       <img
  //         alt={notification.title}
  //         src="/assets/icons/ic_notification_shipping.svg"
  //       />
  //     ),
  //     title
  //   };
  // }
  // if (notification.type === "mail") {
  //   return {
  //     avatar: (
  //       <img
  //         alt={notification.title}
  //         src="/assets/icons/ic_notification_mail.svg"
  //       />
  //     ),
  //     title
  //   };
  // }
  if (notification.type === "message") {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/assets/icons/ic_notification_chat.svg"
        />
      ),
      title
    };
  }
  return {
    avatar: notification.avatar ? (
      <img alt={notification.title} src={notification.avatar} />
    ) : null,
    title
  };
}

interface NotificationItemProps {
  notification: Notification;
  userid: string;   
}

function NotificationItem({ notification, userid }: NotificationItemProps) {
  const { avatar, title } = renderContent(notification);
  const [number, setNumber] = useState<string | null>(null);
  const [openModal, setModal] = useState(false);
  const [doctype, setDoctype] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const queryClient = useQueryClient();
  
  const handleCloseModal = () => {
    setModal(false);
    queryClient.invalidateQueries({ queryKey: ["get_notification"] });
  };

  // const handleNotificationClick = (notification: any) => {
  //   console.log("Selected Notification:", notification.title.split(" ")[0]);
  //   setDoctype(notification.title.split(" ")[0]);
  //   setModal(true);
  //   setNumber(notification.referenceId);
  //   console.log(
  //     "--------------------------:Selected Notification ID:",
  //     notification.id
  //   );
  //   console.log("--------------------------:Selected User ID:", userid);
  // };

  // mutation for marking notification as read
  const { mutate: markAsRead, isPending } = useMutation({
    mutationFn: (notificationId: string) =>
      updateMarkRead({ notificationId, userId: userid }),
    onSuccess: () => {
      // console.log("Notification updated successfully ✅");
      // queryClient.invalidateQueries({ queryKey: ["get_notification"] });
    },
    onError: (error) => {
      console.error("Failed to update notification ❌", error);
    }
  });

  const handleNotificationClick = (notification: any) => {
    // console.log("Selected Notification:", notification.title.split(" ")[0]);
    setDoctype(notification.title.split(" ")[0]);
    setModal(true);
    setNumber(notification.referenceId);

    // trigger the update
    markAsRead(notification.id);
  };

  // const handleNotificationClick = (notification: any) => {
  //   console.log("Selected Notification:", notification.title.split(" ")[0]);
  //   setDoctype(notification.title.split(" ")[0]);
  //   setModal(true);
  //   setNumber(notification.referenceId); // triggers useQuery via enabled flag
  // };

  // Fetch shift data by ID when number is set
  // const {
  //   data: shiftData,
  //   isLoading: loading,
  //   isError
  // } = useQuery({
  //   queryKey: ["Shift_Data_By_Id", number],
  //   queryFn: () => getShiftByIdFromNotification(String(number)),
  //   enabled: !!number // only run if number is not null/undefined/empty
  // });

  // useEffect(() => {
  //   if (shiftData) {
  //     console.log("------------ :Shift Data: ------------", shiftData);
  //   }
  // }, [shiftData]);

  const isShift = doctype === "Shift";
  const isDocument = doctype === "Document";

  // Query when doctype is 'Shift'
  const {
    data: shiftDataShift,
    isLoading: loadingShift,
    isError: isErrorShift
  } = useQuery({
    queryKey: ["Shift_Data_By_Id", number, "shift"],
    queryFn: () => getShiftByIdFromNotification(String(number)),
    enabled: isShift && !!number // Executes only if doctype === 'Shift'
  });

  // Query when doctype is 'Document'
  const {
    data: shiftDataDocument,
    isLoading: loadingDocument,
    isError: isErrorDocument
  } = useQuery({
    queryKey: ["Shift_Data_By_Id", number, "document"],
    queryFn: () => getShiftByDocumentIdFromNotification(String(number)),
    enabled: isDocument && !!number // Executes only if doctype === 'Document'
  });

  // Result selection: Only one will have data at a time
  const shiftData = isShift ? shiftDataShift : shiftDataDocument;
  const loading = isShift ? loadingShift : loadingDocument;
  const isError = isShift ? isErrorShift : isErrorDocument;

  useEffect(() => {
    if (shiftData) {
      console.log("------------ :Data: ------------", shiftData);
    }
  }, [shiftData]);

  return (
    <>
      <ListItemButton
        sx={{
          py: 1.5,
          px: 2.5,
          mt: "1px",
          ...(notification.isRead && {
            bgcolor: "action.selected"
          })
        }}
        onClick={() => handleNotificationClick(notification)}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: "background.neutral" }}>{avatar}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: "flex",
                alignItems: "center",
                color: "text.disabled"
              }}
            >
              {/* <Iconify
              icon="eva:clock-outline"
              sx={{ mr: 0.5, width: 16, height: 16 }}
            /> */}
              {new Date(notification.createdAtEpochNew).toLocaleDateString(
                "en-GB"
              )}
            </Typography>
          }
        />
        <Typography>{userid}</Typography>
      </ListItemButton>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {doctype === "Shift" ? (
            <Typography>Shift Details</Typography>
          ) : doctype === "Document" ? (
            <Typography>Document Details</Typography>
          ) : null}
        </DialogTitle>
        <Divider />
        <DialogContent>
          {/* <Typography>Here will be the content.</Typography> */}
          {/* <ShiftDetails shiftdata={shiftData}></ShiftDetails> */}
          {doctype === "Shift" ? (
            <ShiftDetails shiftdata={shiftData} />
          ) : doctype === "Document" ? (
            // <Typography>Document</Typography>
            <DocumentDetails></DocumentDetails>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseModal}
            >
              Close
            </Button>
            {/* <Button variant="contained" color="success">
              Update
            </Button> */}
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default NotificationItem;
