import { useState, useLayoutEffect } from 'react';
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
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes';
import { productTabs } from '../constants';
import { useCheckPermission } from 'src/hooks/useCheckPermission';


const PageHeader = ({ data, setActiveTab, activeTab }) => {
  const { checkPermission } = useCheckPermission()
  const navigate = useNavigate();
  const [pageTabs, setPageTabs] = useState([])

  const handleBack = () => {
    navigate(ROUTE_CONSTANTS.DASHBOARD.CATALOG.PRODUCT.ROOT.ABSOLUTE)
  }

  const handleTabsChange = (_event, tabsValue) => {
    setActiveTab({
      tab: tabsValue
    })
  }
  const handleSetProductTabs = () => {
    let tempTabs = []
    productTabs.forEach(item => {
      if (checkPermission(item.permission)) tempTabs.push(item)
    })

    setPageTabs(tempTabs)
  }

  useLayoutEffect(() => {
    handleSetProductTabs()
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
              {data?.name}
            </Typography>
            <Typography variant="h4" component="h3" gutterBottom>
              {data?.nameAr}
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
            {pageTabs.length > 0 && pageTabs.map((tab, index) => (
              <Tab key={index} value={tab.value} label={tab.label} />
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
