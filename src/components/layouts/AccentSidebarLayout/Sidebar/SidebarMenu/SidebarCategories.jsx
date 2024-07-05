import React, { useEffect, useState } from "react";
import { Box, styled, Typography, useTheme } from "@mui/material";
import { sidebarRoutesObjects } from "./SidebarRoutesObjects";
import { useCheckPermission } from "src/hooks/useCheckPermission";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SidebarRoutes from "./SidebarRoutes";
import { useUser } from "src/contexts/GlobalContext";

const SidebarCategories = ({
  category,
  Icon,
  isParent = true,
  route = null,
}) => {
  const { checkPermission } = useCheckPermission();
  const [isOpen, setIsOpen] = useState(false);
  const [routeHight, setRouteHight] = useState(0);
  const theme = useTheme();
  const user = useUser();

  const menuItemsGenerator = () => {
    let tempMenuItems = [];

    Object.keys(sidebarRoutesObjects)
      .filter(
        (route) => sidebarRoutesObjects[route].categorySlug === category.slug
      )
      .forEach((route) => {
        tempMenuItems.push(sidebarRoutesObjects[route]);
      });

    return tempMenuItems;
  };

  useEffect(() => {
    menuItemsGenerator().forEach((cat) => {
      // eslint-disable-next-line no-restricted-globals
      if (cat.categorySlug === location.pathname.split("/")[2]) {
        setIsOpen(true);
      }
    });
  }, [menuItemsGenerator()]);

  useEffect(() => {
    if (isOpen) setRouteHight(menuItemsGenerator().length * 35);
    else setRouteHight(0);
  }, [isOpen]);

  return isParent ? (
    <SidebarWrapper
      theme={theme}
      isopen={isOpen ? "true" : "false"}
      routehight={routeHight}
    >
      <Box
        dir={"rtl"}
        className="header"
        onClick={() => setIsOpen((prevState) => !prevState)}
      >
        <Box dir={"rtl"} display="flex" flexDirection="row" alignItems="center">
          <Icon className="icon" />
          <Typography className="category-name" ml={1}>
            {category.name}
          </Typography>
        </Box>
        {isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowLeftIcon />}
      </Box>
      <Box dir={"rtl"} className="body">
        {user?.role?.name != "DRIVER" && user?.role?.name != "CASHIER" ? (
          menuItemsGenerator().map((route, index) => (
            <SidebarRoutes key={index} route={route} Icon={route.icon} />
          ))
        ) : (
          <></>
        )}
      </Box>
    </SidebarWrapper>
  ) : route ? (
    <SidebarRoutes route={route} Icon={Icon} />
  ) : (
    <></>
  );
};

export default SidebarCategories;

const SidebarWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: space-between;
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    padding-left: 10px;
    cursor: pointer;
    opacity: ${(props) => (props.isopen === "true" ? "0.8" : "0.4")};
    color: ${(props) => (props.isopen === "true" ? "white" : "lightgray")};
    :hover {
      color: white;
    }
    .active {
      background: #f2f5f9;
      color: #7e6fd0;
    }
    .category-name {
      font-size: 13px;
      font-weight: 600;
    }
  }
  .body {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: ${(props) => (props.isopen === "true" ? `auto` : "0px")};
    transition: height 50000ms cubic-bezier(0, 0, 0.2, 1) 100ms;
  }
`;
