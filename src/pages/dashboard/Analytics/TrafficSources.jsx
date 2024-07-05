import { useRef, useState } from 'react';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';

import {
  Button,
  Card,
  Box,
  CardContent,
  CardHeader,
  Divider,
  Menu,
  MenuItem,
  CardActions,
  Grid,
  Typography,
  styled,
  Tabs,
  Tab
} from '@mui/material';

const CardActionsWrapper = styled(CardActions)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
      padding: 0;
      display: block;
`
);

const TabsContainerWrapper = styled(CardContent)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
`
);

const EmptyResultsWrapper = styled('img')(
  ({ theme }) => `
      max-width: 100%;
      width: auto;
      height: ${theme.spacing(17)};
      margin-top: ${theme.spacing(2)};
`
);

function TrafficSources() {

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

  const data = {
    users: 2.593,
    pagesSession: 2.66,
    newSessions: '82.05%',
    avgSessionDuration: '00:03:56',
    bounceRate: '49.75%',
    sessions: 9.381
  };

  const actionRef1 = useRef(null);
  const [openPeriod, setOpenMenuPeriod] = useState(false);
  const [period, setPeriod] = useState('Select period');

  const [currentTab, setCurrentTab] = useState('referral');

  const tabs = [
    { value: 'direct', label: 'Direct' },
    { value: 'referral', label: 'Referral' },
    { value: 'organic', label: 'Organic' },
    { value: 'social', label: 'Social' }
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

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
        title={'Traffic Sources'}
      />
      <Divider />
      <TabsContainerWrapper>
        <Tabs
          onChange={handleTabsChange}
          value={currentTab}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </TabsContainerWrapper>
      <Divider
        sx={{
          display: { xs: 'none', sm: 'flex' }
        }}
      />
      <CardContent>
        {currentTab === 'direct' && (
          <Box dir={'rtl'}
            sx={{
              textAlign: 'center'
            }}
          >
            <EmptyResultsWrapper src="/static/images/placeholders/illustrations/1.svg" />
            <Typography
              align="center"
              variant="h4"
              fontWeight="normal"
              color="text.secondary"
              sx={{
                mt: 3
              }}
              gutterBottom
            >
              There are no charts generated for <b>Direct</b> traffic sources!
            </Typography>
            <Button
              variant="contained"
              sx={{
                my: 3
              }}
            >
              {'Generate Chart'}
            </Button>
          </Box>
        )}
        {currentTab === 'referral' && (
          <div>chart</div>
        )}
        {currentTab === 'organic' && (
          <Box dir={'rtl'}
            sx={{
              textAlign: 'center'
            }}
          >
            <EmptyResultsWrapper src="/static/images/placeholders/illustrations/1.svg" />

            <Typography
              align="center"
              variant="h4"
              fontWeight="normal"
              color="text.secondary"
              sx={{
                mt: 3
              }}
              gutterBottom
            >
              There are no charts generated for <b>Organic</b> traffic sources!
            </Typography>
            <Button
              variant="contained"
              sx={{
                my: 3
              }}
            >
              {'Generate Chart'}
            </Button>
          </Box>
        )}
        {currentTab === 'social' && (
          <Box dir={'rtl'}
            sx={{
              textAlign: 'center'
            }}
          >
            <EmptyResultsWrapper src="/static/images/placeholders/illustrations/1.svg" />

            <Typography
              align="center"
              variant="h4"
              fontWeight="normal"
              color="text.secondary"
              sx={{
                mt: 3
              }}
              gutterBottom
            >
              There are no charts generated for <b>Social</b> traffic sources!
            </Typography>
            <Button
              variant="contained"
              sx={{
                my: 3
              }}
            >
              {'Generate Chart'}
            </Button>
          </Box>
        )}
      </CardContent>
      <Divider />
      <CardActionsWrapper>
        <Box dir={'rtl'}>
          <Grid container alignItems="center">
            <Grid
              xs={12}
              sm={6}
              md={4}
              item
              sx={{
                position: 'relative'
              }}
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
                  <Typography align="center" variant="h3" gutterBottom>
                    {data.users}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    {'Users'}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              md={4}
              item
              sx={{
                position: 'relative'
              }}
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
                  <Typography align="center" variant="h3" gutterBottom>
                    {data.sessions}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    {'Sessions'}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              md={4}
              item
              sx={{
                position: 'relative'
              }}
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
                  <Typography align="center" variant="h3" gutterBottom>
                    {data.pagesSession}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    {'pages/session'}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              md={4}
              item
              sx={{
                position: 'relative'
              }}
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
                  <Typography align="center" variant="h3" gutterBottom>
                    {data.avgSessionDuration}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    {'Avg. Session Duration'}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              md={4}
              item
              sx={{
                position: 'relative'
              }}
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
                  <Typography align="center" variant="h3" gutterBottom>
                    {data.newSessions}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    {'% New Sessions'}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              md={4}
              item
              sx={{
                position: 'relative'
              }}
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
                  <Typography align="center" variant="h3" gutterBottom>
                    {data.bounceRate}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    {'Bounce Rate'}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
          </Grid>
        </Box>
      </CardActionsWrapper>
    </Card>
  );
}

export default TrafficSources;
