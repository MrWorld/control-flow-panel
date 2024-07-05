import React from "react";
import { Box, Typography } from "@mui/material";
import { sidebarCategoryObjects } from "./SidebarCategoryObjects";
import SidebarCategories from "./SidebarCategories";
import Scrollbars from "react-custom-scrollbars-2";
import { useUser } from "src/contexts/GlobalContext";

const SidebarMenu = () => {
  const user = useUser();
  const menuCategoryGenerator = () => {
    let tempMenuCategory = [];

    // if(user.role.name == 'DRIVER') {
    //   tempMenuCategory.push(sidebarCategoryObjects['DRIVER_DASHBOARD'])
    // }

    Object.keys(sidebarCategoryObjects).forEach((category) => {
      tempMenuCategory.push(sidebarCategoryObjects[category]);
    });

    return tempMenuCategory;
  };

  return (
    // <Scrollbars>
    <Box dir={'rtl'} style={{ margin: "0px 8px 100px 8px" }}>
      {user?.role?.name != "DRIVER" && user?.role?.name != "CASHIER" ? (
        menuCategoryGenerator().map((category, index) => (
          <SidebarCategories
            key={index}
            category={category}
            Icon={category.icon}
            isParent={category.isParent}
            route={category.route}
          />
        ))
      ) : (
        <></>
      )}
    </Box>
    // </Scrollbars>
  );
};

export default SidebarMenu;
