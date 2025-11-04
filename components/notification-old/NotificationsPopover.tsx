import Scrollbar from "@/ui/scrollbar/scrollbar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Popover from "@mui/material/Popover";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import NotificationItem, { Notification } from "./NotificationItem";
import {
  getAdminNotifications,
  getClientNotifications,
  getEmployeeNotifications,
} from "@/api/functions/client.api";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "@/lib/functions/storage.lib";
import { getRole } from "@/lib/functions/_helpers.lib";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const [recordCount, setRecordCount] = useState(0);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false
      }))
    );
  };

  const userDataString = getCookie("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  // console.log(
  //   "------------ Get Cookies Data --------------",
  //   userData[0]?.name
  // );
  const role = getRole();

  // useEffect(() => {
  //   console.log(
  //     "------------------- USER ROLE TYPE --------------------",
  //     role
  //   );
  // }, [role]);

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["get_notification", userData?.id],
  //   queryFn: () =>
  //     userData?.id
  //       ? // ? getAdminNotifications(userData?.id)
  //         // getEmployeeNotifications(userData?.id)
  //         getClientNotifications(userData?.id)
  //       : Promise.reject("Client ID is undefined"),
  //   enabled: !!userData?.id
  // });

  const { data, isLoading, error } = useQuery({
    queryKey: ["get_notification", userData?.id],
    queryFn: () => {
      if (!userData?.id) {
        return Promise.reject("Client ID is undefined");
      }

      if (role === "ROLE_ADMIN") {
        return getAdminNotifications(userData.id);
      } else if (userData.role === "ROLE_CARER") {
        return getEmployeeNotifications(userData.id);
      } else {
        return getClientNotifications(userData.id);
      }
    },
    enabled: !!userData?.id
  });

  // useEffect(() => {
  //   console.log("------------ Get Admin Notification --------------", data);
  // }, [data]);

  useEffect(() => {
    // console.log("------------ Get Admin Notification --------------", data);

    if (Array.isArray(data)) {
      setRecordCount(data.length);
    } else if (data && typeof data === "object") {
      setRecordCount(Object.keys(data).length);
    } else {
      setRecordCount(0);
    }
  }, [data]);

  return (
    <>
      <IconButton color={open ? "primary" : "default"} onClick={handleOpen}>
        <Badge badgeContent={recordCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360
          }
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              You have {recordCount} unread messages
            </Typography>
          </Box>

          <Tooltip title=" Mark all as read">
            <IconButton color="primary" onClick={handleMarkAllAsRead}>
              <TaskAltIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Scrollbar sx={{ height: { xs: 0, sm: "auto" } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: "overline" }}
              >
                New
              </ListSubheader>
            }
          >
            {Array.isArray(data) &&
              data.length > 0 &&
              data.map((notification: Notification) => (
                
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  userid={userData?.id}
                />
              ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: "dashed" }} />

        {/* <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box> */}
      </Popover>
    </>
  );
}
