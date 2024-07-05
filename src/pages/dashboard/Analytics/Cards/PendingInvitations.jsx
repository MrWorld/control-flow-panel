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

import BusinessTwoToneIcon from '@mui/icons-material/BusinessTwoTone';

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.main};
      color: ${theme.palette.getContrastText(theme.colors.error.main)};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.error};
`
);

const CardContentWrapper = styled(CardContent)(
  ({ theme }) => `
     padding: ${theme.spacing(2.5, 3, 3)};
`
);

function PendingInvitations({value}) {

  return (
    <Card>
      <CardContentWrapper>
        <Typography variant="overline" color="text.primary">
          {'Completed Orders'}
        </Typography>

        <ListItem
          disableGutters
          sx={{
            my: 1
          }}
          component="div"
        >
          <ListItemAvatar>
            <AvatarError variant="rounded">
              <BusinessTwoToneIcon fontSize="large" />
            </AvatarError>
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
                  {'see and enjoy'}
                </Link>
                <Box dir={'rtl'}
                  component="span"
                  sx={{
                    pl: 0.5
                  }}
                >
                  {'horray'}
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

export default PendingInvitations;
