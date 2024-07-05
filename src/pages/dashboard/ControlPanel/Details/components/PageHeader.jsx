import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Grid,
  Typography,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
  styled
} from '@mui/material';
import { ROUTE_CONSTANTS } from '../../../../../constants/AppRoutes'
import { useCheckPermission } from '../../../../../hooks/useCheckPermission';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';

const PageHeader = ({ data, setActiveTab, activeTab }) => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission()
  const [DetailTabs, setDetailTabs] = useState(['Details', 'Invoice', 'Payments'])

  const handleBack = () => {
    navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.BOOKING.ROOT.ABSOLUTE)
  }

  const handleTabsChange = (_event, tabsValue) => {
    setActiveTab({
      tab: tabsValue
    })
  }

  const handleSetDetailTabs = () => {
    let tempArr = [...DetailTabs]
    if (checkPermission('GET_VEHICLE_ATTRIBUTE_LIST')) tempArr = ['Attribute', ...tempArr]

    setDetailTabs(tempArr)
  }

  useEffect(() => {
    handleSetDetailTabs()
  }, [])

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Box dir={'rtl'} display="flex" alignItems="center" justifyContent="space-between">
          <Tooltip arrow placement="top" title={'Go back'}>
            <IconButton
              onClick={handleBack}
              color="primary"
              sx={{
                p: 2,
                mr: 2
              }}
            >
              <ArrowBackTwoToneIcon />
            </IconButton>
          </Tooltip>
          <Box dir={'rtl'}>
            <Typography variant="h3" component="h3" gutterBottom>
              {data.name}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item display='flex' flexDirection='row'>
        <Box dir={'rtl'}
          display="flex"
          alignItems="center"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent={{ xs: 'center', sm: 'space-between' }}
          pb={3}
        >
          <TabsWrapper
            onChange={handleTabsChange}
            scrollButtons="auto"
            textColor="secondary"
            value={activeTab}
            variant="scrollable"
          >
            {DetailTabs.map((tab) => (
              <Tab key={tab} value={tab} label={tab} />
            ))}
          </TabsWrapper>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PageHeader;

const TabsWrapper = styled(Tabs)(
  ({ theme }) => `
    @media (max-width: ${theme.breakpoints.values.md}px) {
      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }

      .MuiTabs-indicator {
          box-shadow: none;
      }
    }
    `
);
