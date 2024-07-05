import { useRef, useState } from 'react';
import {
  Box,
  Button,
  useTheme,
  CardActionArea,
  Typography,
  MenuList,
  Grid,
  Divider,
  Card,
  MenuItem,
  ListItemText,
  alpha,
  Link,
  Popover,
  Stack,
  styled
} from '@mui/material';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import Text from 'src/components/Text';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone';
import DashboardCustomizeTwoToneIcon from '@mui/icons-material/DashboardCustomizeTwoTone';
import ContactSupportTwoToneIcon from '@mui/icons-material/ContactSupportTwoTone';
import { useNavigate } from 'react-router-dom';
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes';
import { MessageOutlined } from '@mui/icons-material';

const LabelWrapper = styled(Box)(
  ({ theme }) => `
  font-size: ${theme.typography.pxToRem(10)};
  font-weight: bold;
  text-transform: uppercase;
  border-radius: ${theme.general.borderRadiusSm};
  padding: ${theme.spacing(0.5, 1, 0.4)};
`
);

const CardActionAreaWrapper = styled(CardActionArea)(
  ({ theme }) => `
      .MuiTouchRipple-root {
        opacity: .2;
      }

      .MuiCardActionArea-focusHighlight {
        background: ${theme.colors.primary.main};
      }

      &:hover {
        .MuiCardActionArea-focusHighlight {
          opacity: .05;
        }
      }
`
);

const MenuListWrapperSecondary = styled(MenuList)(
  ({ theme }) => `
  padding: ${theme.spacing(3)};

  & .MuiMenuItem-root {
      border-radius: 50px;
      padding: ${theme.spacing(1, 1, 1, 2.5)};
      min-width: 200px;
      margin-bottom: 2px;
      position: relative;
      color: ${theme.colors.alpha.black[70]};

      &.Mui-selected,
      &:hover,
      &.MuiButtonBase-root:active {
          background: ${theme.colors.alpha.black[10]};
          color: ${theme.colors.alpha.black[100]};
      }

      &:last-child {
          margin-bottom: 0;
      }
    }
`
);

const MenuListWrapperSuccess = styled(MenuList)(
  ({ theme }) => `
  padding: ${theme.spacing(3)};

  & .MuiMenuItem-root {
      border-radius: 50px;
      padding: ${theme.spacing(1, 1, 1, 2.5)};
      min-width: 200px;
      margin-bottom: 2px;
      position: relative;
      color: ${theme.colors.success.main};

      &.Mui-selected,
      &:hover,
      &.MuiButtonBase-root:active {
          background: ${theme.colors.success.lighter};
          color: ${theme.colors.success.dark};
      }

      &:last-child {
          margin-bottom: 0;
      }
    }
`
);

const MenuListWrapperError = styled(MenuList)(
  ({ theme }) => `
  padding: ${theme.spacing(3)};

  & .MuiMenuItem-root {
      border-radius: 50px;
      padding: ${theme.spacing(1, 1, 1, 2.5)};
      min-width: 200px;
      margin-bottom: 2px;
      position: relative;
      color: ${theme.colors.error.main};

      &.Mui-selected,
      &:hover,
      &.MuiButtonBase-root:active {
          background: ${theme.colors.error.lighter};
          color: ${theme.colors.error.dark};
      }

      &:last-child {
          margin-bottom: 0;
      }
    }
`
);

const DotLegend = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    width: ${theme.spacing(1.4)};
    height: ${theme.spacing(1.45)};
    display: inline-block;
    border: ${theme.colors.alpha.white[100]} solid 2px;
`
);

function HeaderMenu() {
  const theme = useTheme();
  const navigate = useNavigate()

  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const ref2 = useRef(null);
  const [isOpen2, setOpen2] = useState(false);

  const handleOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleNavigate = (path, replace) => {
    navigate(path, { replace: replace })
    setOpen2(false)
  }

  return (
    <>
      <Box dir={'rtl'}
        sx={{
          display: { xs: 'none', md: 'inline-flex' }
        }}
      >
        <Button
          ref={ref2}
          onClick={handleOpen2}
          endIcon={<KeyboardArrowDownTwoToneIcon />}
          color="secondary"
          size="small"
          sx={{
            px: 2,
            backgroundColor: `${theme.colors.secondary.lighter}`,
            color: `${theme.colors.secondary.dark}`,

            '.MuiSvgIcon-root': {
              color: `${theme.colors.secondary.dark}`,
              transition: `${theme.transitions.create(['color'])}`
            },

            '&:hover': {
              backgroundColor: `${theme.colors.secondary.main}`,
              color: `${theme.palette.getContrastText(
                theme.colors.secondary.main
              )}`,

              '.MuiSvgIcon-root': {
                color: `${theme.palette.getContrastText(
                  theme.colors.secondary.main
                )}`
              }
            }
          }}
        >
          Quick Access
        </Button>
      </Box>
      <Popover
        disableScrollLock
        anchorEl={ref2.current}
        onClose={handleClose2}
        open={isOpen2}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        sx={{
          '.MuiPopover-paper': {
            background: theme.colors.gradients.blue3
          }
        }}
      >
        <Box dir={'rtl'}
          sx={{
            maxWidth: 400
          }}
          p={3}
        >
          <Grid container mt={1} spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardActionAreaWrapper
                  sx={{
                    p: 2
                  }}
                onClick={() => handleNavigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.BOOKING.ADD_NEW.ROOT.ABSOLUTE, true)}
                >
                  <Text color="warning">
                    <AccountTreeTwoToneIcon
                      sx={{
                        mb: 1
                      }}
                    />
                  </Text>
                  <Typography variant="h4">Take Vehicle In</Typography>
                </CardActionAreaWrapper>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardActionAreaWrapper
                  sx={{
                    p: 2
                  }}
                  onClick={() => handleNavigate(ROUTE_CONSTANTS.DASHBOARD.SMS.ABSOLUTE, true)}
                >
                  <Text color="success">
                    <MessageOutlined
                      sx={{
                        mb: 1
                      }}
                    />
                  </Text>
                  <Typography variant="h4">Send SMS</Typography>
                </CardActionAreaWrapper>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardActionAreaWrapper
                  sx={{
                    p: 2
                  }}
                  onClick={() =>  handleNavigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.CAR_MODEL.ADD_NEW.ROOT.ABSOLUTE, true)}
                >
                  <Text color="primary">
                    <DashboardCustomizeTwoToneIcon
                      sx={{
                        mb: 1
                      }}
                    />
                  </Text>
                  <Typography variant="h4">+ Car Model</Typography>
                </CardActionAreaWrapper>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardActionAreaWrapper
                  sx={{
                    p: 2
                  }}
                  onClick={() => handleNavigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.SUBSCRIPTION.ADD_NEW.ROOT.ABSOLUTE, true)}
                >
                  <Text color="error">
                    <PeopleOutlineTwoToneIcon
                      sx={{
                        mb: 1
                      }}
                    />
                  </Text>
                  <Typography variant="h4">+ Subscription</Typography>
                </CardActionAreaWrapper>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderMenu;
