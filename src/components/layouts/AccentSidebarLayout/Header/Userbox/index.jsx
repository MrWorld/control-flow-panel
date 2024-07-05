import { useRef, useState } from "react";
import {
  useUser,
  usePurgeUser,
  useSidebarClose,
} from "src/contexts/GlobalContext";
import { NavLink, useNavigate, Navigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
  styled,
} from "@mui/material";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import AccountBoxTwoToneIcon from "@mui/icons-material/AccountBoxTwoTone";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";
import { authService } from "src/api/services/auth";
import useToast from "src/hooks/useToast";
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";

const HeaderUserBox = () => {
  const navigate = useNavigate();
  const handleCloseSideBar = useSidebarClose();
  const { toast } = useToast();
  const user = useUser();
  const purgeUser = usePurgeUser();
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await authService.logout();
      await purgeUser();
      localStorage.removeItem("branchId");
      handleClose();
      handleCloseSideBar();
      toast("Sign out success!", "success");
      setLoading(false);
      navigate(<Navigate to={ROUTE_CONSTANTS.AUTH.LOGIN.ABSOLUTE} />);
    } catch (err) {
      setLoading(false);
      toast("Sign out has problem, Please try again", "error");
    }
  };

  return (
    <>
      <UserBoxButton color="primary" ref={ref} onClick={handleOpen}>
        <Avatar
          variant="rounded"
          alt={user.firstName}
          src={user.medias && user.medias.url}
        />
        <Box dir={'rtl'}
          component="span"
          sx={{
            display: { xs: "none", md: "inline-block" },
          }}
        >
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.firstName} {user.lastName}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user?.userType}
            </UserBoxDescription>
          </UserBoxText>
        </Box>
        <Box dir={'rtl'}
          component="span"
          sx={{
            display: { xs: "none", sm: "inline-block" },
          }}
        >
          <ExpandMoreTwoToneIcon
            sx={{
              ml: 1,
            }}
          />
        </Box>
      </UserBoxButton>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuUserBox
          sx={{
            minWidth: 210,
          }}
          display="flex"
        >
          <Avatar
            variant="rounded"
            alt={user.firstName}
            src={user.medias && user.medias?.url}
          />
          <UserBoxText>
            <UserBoxLabel variant="body1">
              {user.firstName} {user.lastName}
            </UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user?.userType}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider />
        <Box dir={'rtl'} m={1}>
          <Button color="primary" fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon
              sx={{
                mr: 1,
              }}
            />
            {"خروج"}
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default HeaderUserBox;

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding: ${theme.spacing(0, 1)};
        height: ${theme.spacing(7)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${theme.palette.secondary.light}
`
);
