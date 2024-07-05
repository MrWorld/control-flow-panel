import {
  Box,
  alpha,
  IconButton,
  Tooltip,
  styled,
  Stack,
  Button,
  Select,
  FormControl,
  MenuItem,
  FormLabel,
} from "@mui/material";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import Logo from "../../../LogoSign";
import {
  useSidebarShow,
  useSidebarToggle,
  useUser,
} from "src/contexts/GlobalContext";
import ReorderIcon from "@mui/icons-material/Reorder";
import HeaderUserBox from "./Userbox";
import HeaderNotifications from "./Notifications";
import HeaderMenu from "./menus";
import { SpaceBar } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";

const HeaderWrapper = styled(Box)(
  ({ theme, isSideBarOpen }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        top: 0;
        background-color: ${alpha(theme.header.background, 0.95)};
        backdrop-filter: blur(8px);
        box-shadow: ${theme.header.boxShadow};
        position: fixed;
        justify-content: space-between;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.sm}px) {
            left: ${isSideBarOpen ? theme.sidebar.width : 0};
            width: auto;
            transition: left 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
        }
`
);

function Header({ toggleSideBar, isSideBarOpen }) {
  const handleToggleSidebar = useSidebarToggle();
  const sidebarShow = useSidebarShow();
  const user = useUser();
  const [branchId, setBranchId] = useState(null);
  const navigate = useNavigate();

  return (
    <HeaderWrapper
      display="flex"
      alignItems="center"
      isSideBarOpen={isSideBarOpen}
    >
      <Stack direction={"row"}>
        <Button
          onClick={toggleSideBar}
          sx={{
            display: {
              xs: "none",
              md: "flex",
              sm: "flex",
              lg: "flex",
            },
          }}
        >
          <ReorderIcon />
        </Button>
        <Box dir={'rtl'}
          component="span"
          sx={{
            display: { lg: "none", md: "none", sm: "none", xs: "inline-block" },
          }}
        >
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" onClick={handleToggleSidebar}>
              {!sidebarShow ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
      {/* <Box dir={'rtl'} display="flex" alignItems="center">
        <Box dir={'rtl'}
          component="span"
          sx={{
            mr: 1,
            display: { lg: 'none', xs: 'inline-block' }
          }}
        >
          <Logo />
        </Box>
      </Box> */}

      <Box dir={'rtl'} display="flex" alignItems="center">
        <HeaderNotifications />

        <HeaderUserBox />
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
