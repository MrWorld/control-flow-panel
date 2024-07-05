import {
  CardHeader,
  Divider,
  CardContent,
  Avatar,
  Card,
  ListItemText,
  List,
  ListItem,
  styled
} from '@mui/material';
import TrendingDown from '@mui/icons-material/TrendingDown';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingFlat from '@mui/icons-material/TrendingFlat';

const AvatarWrapperError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color:  ${theme.colors.error.main};
`
);

const AvatarWrapperSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.lighter};
      color:  ${theme.colors.success.main};
`
);

const AvatarWrapperWarning = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.warning.lighter};
      color:  ${theme.colors.warning.main};
`
);

function Conversions() {

  const data = {
    percentage: 100,
    sales: 3003,
    customers: '11days 20:10:00',
    earnings: 'KD 150,864.00'
  };

  return (
    <Card>
      <CardHeader title={'All Time'} />
      <Divider />
      <CardContent>

        <List disablePadding dense>
          <ListItem>
            <ListItemText
              primary={'Bookings'}
              primaryTypographyProps={{
                variant: 'subtitle2',
                gutterBottom: true,
                noWrap: true
              }}
              secondary={data.sales}
              secondaryTypographyProps={{
                variant: 'h3',
                color: 'textPrimary',
                noWrap: true
              }}
            />
            <AvatarWrapperError>
              <TrendingDown />
            </AvatarWrapperError>
          </ListItem>
          <Divider
            sx={{
              my: 1
            }}
          />
          <ListItem>
            <ListItemText
              primary={'Mean Park Time'}
              primaryTypographyProps={{
                variant: 'subtitle2',
                gutterBottom: true,
                noWrap: true
              }}
              secondary={data.customers}
              secondaryTypographyProps={{
                variant: 'h3',
                color: 'textPrimary'
              }}
            />
            <AvatarWrapperWarning>
              <TrendingFlat />
            </AvatarWrapperWarning>
          </ListItem>
          <Divider
            sx={{
              my: 1
            }}
          />
          <ListItem>
            <ListItemText
              primary={'Earnings Report'}
              primaryTypographyProps={{
                variant: 'subtitle2',
                gutterBottom: true,
                noWrap: true
              }}
              secondary={data.earnings}
              secondaryTypographyProps={{
                variant: 'h3',
                color: 'textPrimary'
              }}
            />
            <AvatarWrapperSuccess>
              <TrendingUp />
            </AvatarWrapperSuccess>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}

export default Conversions;
