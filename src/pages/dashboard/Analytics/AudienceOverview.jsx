import { useRef, useState } from 'react';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';

import {
  Button,
  Card,
  Box,
  CardContent,
  CardHeader,
  Menu,
  MenuItem,
  CardActions,
  Grid,
  Typography,
  Divider,
  styled,
} from '@mui/material';


const CardActionsWrapper = styled(CardActions)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
      padding: 0;
      display: block;
`
);

function AudienceOverview() {

  const periods = [
    {
      value: 'today',
      text: 'Today'
    },
    {
      value: 'yesterday',
      text: 'Yesterday'
    },
    {
      value: 'last_month',
      text: 'Last month'
    },
    {
      value: 'last_year',
      text: 'Last year'
    }
  ];
  const audiences = [
    {
      value: 'users',
      text: 'Users'
    },
    {
      value: 'new_users',
      text: 'New users'
    },
    {
      value: 'orders',
      text: 'Orders'
    }
  ];

  const actionRef1 = useRef(null);
  const actionRef2 = useRef(null);
  const [openPeriod, setOpenMenuPeriod] = useState(false);
  const [openAudience, setOpenMenuAudience] = useState(false);
  const [period, setPeriod] = useState(periods[3].text);
  const [audience, setAudience] = useState(audiences[1].text);

  const data = {
    users: 1,
    newUsers: 12.847,
    pageViews: 67.492,
    avgSessionDuration: '00:05:21',
    bounceRate: '65.37%',
    sessions: 25.694,
    orders: 100,
  };
  const mapper = [
    {
      title: 'New Users',
      value: 1,
      subtitle: 'chart'
    },
    {
      title: 'New Subscriptions',
      value: 1,
      subtitle: 'chart'
    },
    {
      title: 'Total Check-in',
      value: 1,
      subtitle: 'chart'
    },
    {
      title: 'Total Check-out',
      value: 1,
      subtitle: 'chart'
    },
    {
      title: 'Total Key tags',
      value: 1,
      subtitle: 'chart'
    },
    {
      title: 'Service Provided',
      value: 1,
      subtitle: 'chart'
    },
    {
      title: 'Sms Sended',
      value: 1,
      subtitle: 'chart'
    },
    {
      title: 'Reparks',
      value: 1,
      subtitle: 'chart'
    },
  ]

  return (
    <Card>
      <CardHeader
        action={
          <>
            <Button
              size="small"
              variant="outlined"
              ref={actionRef1}
              onClick={() => setOpenMenuPeriod(true)}
              endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
            >
              {period}
            </Button>
            <Menu
              disableScrollLock
              anchorEl={actionRef1.current}
              onClose={() => setOpenMenuPeriod(false)}
              open={openPeriod}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              {periods.map((_period) => (
                <MenuItem
                  key={_period.value}
                  onClick={() => {
                    setPeriod(_period.text);
                    setOpenMenuPeriod(false);
                  }}
                >
                  {_period.text}
                </MenuItem>
              ))}
            </Menu>
          </>
        }
        title={'Overview'}
      />
      <Divider />
      <CardActionsWrapper>
        <Box dir={'rtl'}>
          <Grid container alignItems="center">
            {
              mapper.map((items, index) => {
                return <Grid
                  xs={12}
                  sm={6}
                  md={4}
                  item
                  sx={{
                    position: 'relative'
                  }}
                  key={index}
                >
                  <Box dir={'rtl'}
                    component="span"
                    sx={{
                      display: { xs: 'none', sm: 'inline-block' }
                    }}
                  >
                    <Divider orientation="vertical" flexItem absolute />
                  </Box>
                  <Box dir={'rtl'}
                    sx={{
                      p: 3
                    }}
                  >
                    <Box dir={'rtl'}>
                      <Typography variant="subtitle2" gutterBottom>
                        {items.title || 'Users'}
                      </Typography>
                      <Typography variant="h3">{items.value}</Typography>
                    </Box>

                    <div>{items.subtitle}</div>
                  </Box>
                  <Divider />
                </Grid>
              })
            }
          </Grid>

        </Box>
      </CardActionsWrapper>
    </Card>
  );
}

export default AudienceOverview;
