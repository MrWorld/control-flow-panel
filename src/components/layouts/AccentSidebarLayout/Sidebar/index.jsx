import Scrollbar from "../../Scrollbar";
import { Box, Drawer, Typography, styled, useTheme } from "@mui/material";

import Logo from "../../../LogoSign";
import SidebarMenu from "./SidebarMenu";
import SidebarTopSection from "./SidebarTopSection";
import { useSidebarShow, useSidebarClose } from "src/contexts/GlobalContext";
import dayjs from "dayjs";

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: ${theme.sidebar.width};
        min-width: ${theme.sidebar.width};
        color: ${theme.sidebar.textColor};
        background: ${theme.sidebar.background};
        box-shadow: ${theme.sidebar.boxShadow};
        position: relative;
        z-index: 7;
        height: 100%;
`
);

const TopSection = styled(Box)(
  ({ theme }) => `
        margin: ${theme.spacing(2, 3)};
`
);

function Sidebar() {
  const sidebarShow = useSidebarShow();
  const handleCloseSidebar = useSidebarClose();
  const theme = useTheme();

  return (
    <>
      <SidebarWrapper
        sx={{
          display: {
            xs: "none",
            sm: "inline-block",
            md: "inline-block",
            lg: "inline-block",
          },
          position: "fixed",
          left: 0,
          top: 0,
        }}
      >
        <Scrollbar>
          <TopSection>
            <Box
              dir={"rtl"}
              sx={{
                width: 52,
                mt: 2,
                mb: 3,
              }}
            >
              <Logo />
            </Box>
            {/* <SidebarTopSection /> */}
          </TopSection>
          <SidebarMenu />
        </Scrollbar>
        <Box
          dir={"rtl"}
          display={{ xs: "block" }}
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            zIndex: 0,
            background: theme.sidebar.background,
            height: 50,
            padding: 14,
            width: theme.sidebar.width,
          }}
          alignItems="center"
          textAlign={{ xs: "center" }}
        >
          <Box dir={"rtl"}>
            <Typography variant="subtitle0">
              &copy; {dayjs().format("YYYY")} - Control Flow
            </Typography>
          </Box>
        </Box>
      </SidebarWrapper>
      <Drawer
        sx={{
          boxShadow: `${theme.sidebar.boxShadow}`,
          // background: 'rgb(17, 24, 39)'
        }}
        anchor={theme.direction === "rtl" ? "right" : "left"}
        open={sidebarShow}
        onClose={handleCloseSidebar}
        variant="temporary"
        elevation={9}
      >
        <SidebarWrapper>
          <Scrollbar>
            <TopSection>
              <Box
                dir={"rtl"}
                sx={{
                  width: 52,
                  ml: 1,
                  mt: 1,
                  mb: 3,
                }}
              >
                <Logo />
              </Box>
              <SidebarTopSection />
            </TopSection>
            <SidebarMenu />
            <Box
              dir={"rtl"}
              display={{ xs: "block" }}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                zIndex: 0,
                background: theme.sidebar.background,
                height: 50,
                padding: 14,
                width: theme.sidebar.width,
              }}
              alignItems="center"
              textAlign={{ xs: "center" }}
            >
              <Box dir={"rtl"}>
                <Typography variant="subtitle0">
                  &copy; {dayjs().format("YYYY")} - Control FLow
                </Typography>
              </Box>
            </Box>
          </Scrollbar>
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default Sidebar;
