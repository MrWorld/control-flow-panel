import { useState } from 'react'
import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Tab,
  styled,
  Tabs
} from '@mui/material';
import { useEffect } from 'react';
import { adminService } from 'src/api/services/admin';
import { useCheckPermission } from 'src/hooks/useCheckPermission'
import { parcelTabs } from '../constants'

const PageHeader = ({ pageTitle, pageSubtitle, shopManagement, activeTab, changeActiveTab, showParcels }) => {
  const { checkPermission } = useCheckPermission()
  const [allShops, setAllShops] = useState([])
  const [shopTabs, setShopTabs] = useState([])

  const getData = async () => {
    if (!checkPermission('GET_VENDOR_LIST')) return true;
    try {
      let res = await adminService.getVendorList({ page: 0, take: 1000 })
      setAllShops(res.data.data.items)
    } catch (error) {
      console.log(error);
    }
  }

  const handleTabsChange = (_event, val) => {

    let selectedTab = shopTabs.find(tab => tab.value === val).value

    changeActiveTab(selectedTab)
  }

  const handleSetShopTabs = () => {
    let tempTabs = [...parcelTabs]

    // if(!checkPermission(null)) tempTabs = tempTabs.filter(tab => tab !== 'Terms')
    // if(!checkPermission(null)) tempTabs = tempTabs.filter(tab => tab !== 'parcelTabs')
    setShopTabs(tempTabs)
  }

  useEffect(() => {
    handleSetShopTabs()
  }, [])

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {pageTitle}
          </Typography>
          <Typography variant="subtitle2">
            {pageSubtitle}
          </Typography>
        </Grid>
        {checkPermission('GET_VENDOR_LIST') && //NEED_PERMISSION_KEY add new address type
          <>
            <Grid item>
              <Box dir={'rtl'} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Box dir={'rtl'}
                  display="flex"
                  alignItems="center"
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  justifyContent={{ xs: 'center', sm: 'space-between' }}
                  pb={3}
                >
                  {allShops.length > 0 && showParcels &&
                    <FormControl fullWidth style={{ width: '200px', marginRight: '10px' }}>
                      <InputLabel id="select-shop-label">Select shop</InputLabel>
                      <Select
                        labelId="select-shop-label"
                        id="select-shop"
                        value={shopManagement.selectedShopId || ''}
                        label="Select shop"
                        name='shop'
                        onChange={e => shopManagement.setSelectedShopId(e.target.value)}
                      >
                        {
                          [{ id: 0, name: 'ALL' }, ...allShops].map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                        }
                      </Select>
                    </FormControl>
                  }
                  {checkPermission('GET_PARCEL_LIST') && <TabsWrapper
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    textColor="secondary"
                    value={activeTab || 'Details'}
                    variant="scrollable"
                  >
                    {shopTabs.map((tab) => (
                      <Tab key={tab.value} value={tab.value} label={tab.label} />
                    ))}
                  </TabsWrapper>}
                </Box>
              </Box>
            </Grid>
          </>
        }
      </Grid>
    </>
  );
}

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