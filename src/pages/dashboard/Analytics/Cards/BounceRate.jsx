import {
  Link,
  CardContent,
  Avatar,
  Box,
  Typography,
  ListItemAvatar,
  Card,
  ListItemText,
  ListItem,
  styled
} from '@mui/material';

import SportsBasketballTwoToneIcon from '@mui/icons-material/SportsBasketballTwoTone';

const AvatarPrimary = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.primary.main};
      color: ${theme.palette.getContrastText(theme.colors.primary.main)};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.primary};
`
);

const CardContentWrapper = styled(CardContent)(
  ({ theme }) => `
     padding: ${theme.spacing(2.5, 3, 3)};
`
);

function ActiveReferrals({value}) {

  return (
    <Card>
      <CardContentWrapper>
        <Typography variant="overline" color="text.primary">
          {'Your Customers'}
        </Typography>

        <ListItem
          disableGutters
          sx={{
            my: 1
          }}
          component="div"
        >
          <ListItemAvatar>
            <AvatarPrimary variant="rounded">
              <SportsBasketballTwoToneIcon fontSize="large" />
            </AvatarPrimary>
          </ListItemAvatar>

          <ListItemText
            primary={value}
            primaryTypographyProps={{
              variant: 'h1',
              sx: {
                ml: 2
              },
              noWrap: true
            }}
          />
        </ListItem>
        {/* <ListItem
          disableGutters
          sx={{
            mt: 0.5,
            mb: 1.5
          }}
          component="div"
        >
          <ListItemText
            primary={
              <>
                <Link fontWeight="bold" href="#">
                  {'customers'}
                </Link>
                <Box dir={'rtl'}
                  component="span"
                  sx={{
                    pl: 0.5
                  }}
                >
                  {'with atleast one order'}
                </Box>
              </>
            }
            primaryTypographyProps={{ variant: 'body2', noWrap: true }}
          />
        </ListItem> */}
      </CardContentWrapper>
    </Card>
  );
}

export default ActiveReferrals;
