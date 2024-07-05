import React from "react";
import { Box, styled, Typography, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebarClose, useUser } from "src/contexts/GlobalContext";
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import { DashboardOutlined } from "@mui/icons-material";

const SidebarRoutes = ({ route }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const handleCloseSideBar = useSidebarClose();
  const user = useUser();

  const handleClick = (link) => {
    navigate(link);
    handleCloseSideBar();
  };

  const activeTabFinder = () => {
    const linkArray = route.link.split("/");
    const myLocation = location.pathname
      .split("/")
      .slice(0, linkArray.length)
      .join("/");
    return route.link === myLocation;
  };

  return (
    <>
      <StyledSidebarRoutes
        theme={theme}
        isactive={activeTabFinder() ? "true" : "false"}
        onClick={() => handleClick(route.link)}
        isMain={route.isMain}
      >
        <Box dir={"rtl"} display="flex" flexDirection="row" alignItems="center">
          <route.icon />
          <Typography className="route-name" ml={1}>
            {route.name}
          </Typography>
        </Box>
      </StyledSidebarRoutes>
    </>
  );
};

export default SidebarRoutes;

const StyledSidebarRoutes = styled(Box)`
  display: flex;
  align-items: center;
  padding: 10px;
  padding-left: ${(props) => (props.isMain ? "10px" : "30px")};
  height: 44px;
  cursor: ${(props) => (props.isactive === "true" ? "cursor" : "pointer")};
  border-radius: 5px;
  opacity: ${(props) => (props.isactive === "true" ? "1" : "0.5")};
  background: ${(props) =>
    props.isactive === "true" && "rgba(255, 255, 255, 0.1)"};
  transition: background 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  color: ${(props) => (props.isactive === "true" ? "white" : "lightgray")};
  margin-bottom: 4px;
  :hover {
    opacity: ${(props) => (props.isactive !== "true" ? "0.7" : "1")};
    background: ${(props) =>
      props.isactive !== "true"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(255, 255, 255, 0.1)"};
    color: white;
  }
  .route-name {
    font-size: 12px;
    font-weight: 600;
  }
`;
