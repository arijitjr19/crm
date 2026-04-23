import Logo from "@/components/logo/logo";
import { useResponsive } from "@/hooks/utils/use-responsive";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { NAV } from "@/config/constants";
import { UserData } from "@/interface/common.interface";
import { roleParser } from "@/lib/functions/_helpers.lib";
import { getCookie } from "@/lib/functions/storage.lib";
import Scrollbar from "@/ui/scrollbar";
import navConfig from "../config-navigation";
import SidebarItem from "./SidebarItem";
import useUser from "@/hooks/react-query/useUser";
import NewLogo from "@/components/logo/new-logo";
import { Paper } from "@mui/material";
import NewLogoSidebar from "@/components/logo/new-logo-sidebar";
import { useRouter } from "next/router"; // pages router
import ConnectToXero from "pages/xero/connect-to-xero";

interface SidebarProps {
  openNav: boolean;
  onCloseNav: () => void;
}

export default function Sidebar({ openNav, onCloseNav }: SidebarProps) {
  const pathname = usePathname();
  const ref = useRef(null);
  const upLg = useResponsive("up", "lg");
  const user = useUser();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const router = useRouter();

  const renderAccount = (
    <Box
    onClick={() => router.push("/user/profile")}
      sx={{
        my: 3,
        mx: 2,   
        py: 2,
        px: 2.5,
        display: "flex",
        borderRadius: 1.5,
        alignItems: "center",
        bgcolor:'#1D2A33',
        cursor: "pointer",
        // bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12)
      }}
    >
      {/* <Avatar src={user?.data?.data?.photoDownloadURL} alt="photoURL">
        {user?.data?.data?.name?.charAt(0)}
      </Avatar> */}

          <Avatar
            src={user?.data?.data?.photoDownloadURL}
            alt="photoURL"
            sx={{
              bgcolor: "#F7FAFC",
              color: "#1D2A33",
              fontWeight: 600
            }}
          >
            {user?.data?.data?.name?.charAt(0)}
          </Avatar>

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2" sx={{ color: "#ffffff" }}>
          {user?.data?.data?.name}
        </Typography>

        {/* <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {roleParser(user?.data?.data?.role?.[0].name || "")}
        </Typography> */}
        <Typography variant="body2" sx={{ color: "#F7FAFC" }}>
          {roleParser(user?.data?.data?.role?.[0].name || "")}
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2, color: "#ffffff" }}>
      {navConfig.map((item) => (
        <SidebarItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "&.simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
         
        }
      }}
      ref={ref}
    >
      <NewLogoSidebar sx={{ mt: 3, ml: 4 }} />


      {renderAccount}

      {renderMenu}
      
      <ConnectToXero></ConnectToXero>

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH }
      }}
    >
      {upLg ? (
        // <Box
        //   sx={{
        //     color: "#ffffff",
        //     height: 1,
        //     position: "fixed",
        //     width: NAV.WIDTH,
        //     // borderRight: (theme) => `dashed 1px ${theme.palette.divider}`
        //     borderRight: (theme) => `dashed 1px #5A7A8C`
        //   }}
        // >

        <Paper
  elevation={5}
  sx={{
    color: "#ffffff",
    height: "100%",
    position: "fixed",
    width: NAV.WIDTH,
    backgroundColor: "#F7FAFC", // paper background
    borderRadius: 0,            // flat sidebar look
  }}
>
          {renderContent}
         
        </Paper>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
              color: "#ffffff"
            }
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
