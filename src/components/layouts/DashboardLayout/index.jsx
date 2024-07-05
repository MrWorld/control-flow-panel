import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { authService } from "src/api/services/auth";
// import { adminService } from 'src/api/services/admin';
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import {
  useUser,
  useSetUser,
  useSetPermission,
  useSetMenu,
  //  useSetExchangeRate
} from "src/contexts/GlobalContext";
import GeneralLayoutWrapper from "../GeneralLayout/GeneralLayoutWrapper";

const DashboardLayout = () => {
  const location = useLocation();
  const user = useUser();
  const setUser = useSetUser();
  const setMenu = useSetMenu();
  // const setExchangeRate = useSetExchangeRate();
  const setPermission = useSetPermission();

  // ***** get user profile on every refresh.
  const getMe = async () => {
    try {
      let res = await authService.getProfile();
      console.log(res);
      setUser(res.data.data);
    } catch (error) {
      // ******* if user be deleted or any things happened not normal, api will respond me with 403 error
      // ******* handle logout user here on 403 error
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) getMe();
  }, []);

  if (!user)
    return (
      <Navigate
        to={ROUTE_CONSTANTS.AUTH.LOGIN.ABSOLUTE}
        state={{ previousPath: location.pathname }}
        replace
      />
    );
  return (
    <GeneralLayoutWrapper>
      <Outlet />
    </GeneralLayoutWrapper>
  );
};
export default DashboardLayout;
