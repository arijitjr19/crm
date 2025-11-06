import { getAllActiveShifts } from "@/api/functions/client.api";
import CalendarComponent from "@/components/calendarComponent/calendarComponent";
import CalendarToolbar from "@/components/calendarComponent/calendarToolbar";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { Box, IconButton, MenuItem, Stack, Tooltip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import router from "next/router";
import { logout } from "@/reduxtoolkit/slices/userSlice";
import useUser from "@/hooks/react-query/useUser";
import LogoutIcon from "@mui/icons-material/Logout";
import { useResponsive } from "@/hooks/utils/use-responsive";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsPopover from "@/components/notification/NotificationsPopover";
import AccountPopover from "@/components/common/account-popover";
import { padding } from "@mui/system";
import DescriptionIcon from '@mui/icons-material/Description';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { getCookie, setCookieClient } from "@/lib/functions/storage.lib";
import ClientSignDocumentPending from "./clients/client-document-pending";

interface HeaderProps {
  onOpenNav: () => void;
}

export default function StaffRoster({ onOpenNav }: HeaderProps) {
  const [date, setDate] = useState(moment());
  const [open, setOpen] = useState<HTMLElement | null>(null);
  // const user = useUser();
  const userDataString = getCookie("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [isModalPending, setIsModalPending] = useState(false);
  const handleCloseModalPending = () => setIsModalPending(false);

  const { data, isLoading } = useQuery({
    queryKey: [
      "get_all_active_shifts_carer",
      date.startOf("month").format("X"),
      date.endOf("month").format("X")
    ],
    queryFn: () =>
      getAllActiveShifts({
        startDate: date.startOf("month").format("X"),
        endDate: date.endOf("month").format("X")
      })
  });

  useEffect(() => {
    console.log("----------- Carer List ------------", data);
  }, [data]);

  const dispatch = useAppDispatch();

  const handleClose = (e?: any, r?: any, path?: string) => {
    if (path) {
      router.push(path);
    }
    setOpen(null);
  };

  const lgUp = useResponsive("up", "lg");

  const renderLogout = (
    <>
      <Tooltip title="Logout">
        <IconButton
          color="primary"
          onClick={() => {
            dispatch(logout());
            setOpen(null);
            // router.push("/");
            // router.push("/auth/client-signin");
          }}
        >
          <PowerSettingsNewIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const renderContent = (
    <>
      {!lgUp && (
        <Tooltip title="Notification">
          <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        </Tooltip>
      )}

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={1}>
        <Tooltip title="Notifications">
          <Box>
            <NotificationsPopover />
          </Box>
        </Tooltip>
        {/* <AccountPopover /> */}
      </Stack>
    </>
  );


  const renderDocument = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>
      )}

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={1}>
        <Tooltip title="Documents">
          <IconButton
            color="primary"
            onClick={() => { setIsModalPending(true) }}
          >
            <DescriptionIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </>
  );

   setCookieClient("firstLoad", "false");
    const [isFirstLoadComplete, setIsFirstLoadComplete] = useState(false);
    console.log("-------------- First Load --------------");
    useEffect(() => {
      // window.location.href = "https://your-new-page-url.com";
      const isFirstLoad = getCookie("firstLoad");
  
      if (!isFirstLoad) {
        setCookieClient("firstLoad", "true");
        setIsFirstLoadComplete(true); // Update state to trigger a re-render
        console.log("-------------- Second Load --------------");
        window.location.reload();
      } else {
        setIsFirstLoadComplete(true);
      }
    }, []);
  
    // Prevent rendering the content before the first load is complete
    if (!isFirstLoadComplete) {
      return null;
    }
  

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%", // make sure the parent is full-width
          padding: "8px 16px" // optional spacing
        }}
      >
        {/* Left side: Logout + renderContent */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <MenuItem
            disableRipple
            disableTouchRipple
            onClick={() => {
              dispatch(logout());
              setOpen(null);
              router.push("/auth/client-signin");
            }}
            sx={{
              backgroundColor: "#00a9a9",
              color: "#ffffff",
              margin: "6px",
              padding: "6px 12px",
              borderRadius: "3px",
              display: "flex",
              alignItems: "center"
            }}
          >
            <LogoutIcon sx={{ marginRight: "8px" }} />
            Logout
          </MenuItem> */}
          {/* Adjacent content */}
          {renderLogout}
          {renderContent}
          {renderDocument}
        </Box>


        {/* Right side: Calendar */}
        <CalendarToolbar date={date} setDate={setDate} />
      </Box>
      <Box sx={{ padding: 2 }}>
        <CalendarComponent date={date} shifts={data} />
      </Box>

      {userData?.id !== "" && (
        <ClientSignDocumentPending clientId={userData?.id} open={isModalPending} onClose={handleCloseModalPending}></ClientSignDocumentPending>
      )}
    </>
  );
}
