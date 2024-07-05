import {
  alpha,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  Popover,
  useTheme,
  Tooltip,
  Typography,
  styled,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import { Link as RouterLink } from 'react-router-dom';
import { formatDistance } from 'date-fns';
// import { useUser } from 'src/contexts/GlobalContext';
import { adminService } from 'src/api/services/admin';
import { useNotificationSocket } from 'src/hooks/useNotificationSocket';
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const HeaderNotifications = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const theme = useTheme();
  // const user = useUser()
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (id) => {
    navigate(ROUTE_CONSTANTS.DASHBOARD.LOGISTICS.SHOP.GET_BY_DATA(id))
    setOpen(false);
  }

  




  useEffect(() => {
    // getMyNotification()
  }, [])


  return (
    <>
      
    </>
  );
}

export default HeaderNotifications;

const NotificationsBadge = styled(Badge)(
  ({ theme }) => `
    
    .MuiBadge-badge {
        background-color: ${theme.palette.error.main};
        color: ${theme.palette.error.contrastText};
        min-width: 18px; 
        height: 18px;
        padding: 0;

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 0 1px ${alpha(theme.palette.error.main, 0.3)};
            content: "";
        }
    }
`
);

const IconButtonPrimary = styled(IconButton)(
  ({ theme }) => `
    margin-left: ${theme.spacing(1)};
    background: ${theme.colors.alpha.trueWhite[10]};
    color: ${theme.colors.alpha.trueWhite[70]};
    padding: 0;
    width: 42px;
    height: 42px;
    border-radius: 100%;
    transition: ${theme.transitions.create(['background', 'color'])};

    &.active,
    &:active,
    &:hover {
      background: ${alpha(theme.colors.alpha.trueWhite[30], 0.2)};
      color: ${theme.colors.alpha.trueWhite[100]};
    }
`
);
