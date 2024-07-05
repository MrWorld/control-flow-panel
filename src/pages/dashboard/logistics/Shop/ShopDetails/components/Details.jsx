import { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Divider,
  Card,
  styled,
  Tabs,
  Tab,
  Switch,
  CircularProgress,
} from '@mui/material';
//***** icon of material UI */ import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import SwiperCore, { Navigation, Thumbs } from 'swiper/core';
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { useNavigate } from 'react-router-dom';
import { adminService } from 'src/api/services/admin';
import useToast from 'src/hooks/useToast'
import FeaturedText from 'src/components/FeaturedText'
import { useCheckPermission } from 'src/hooks/useCheckPermission'

let tabs = [{ label: 'English', value: 'en' }, { label: 'Arabic', value: 'ar' }]
SwiperCore.use([Navigation, Thumbs]);

const Details = ({ data }) => {
  const { checkPermission } = useCheckPermission()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isVendorDisabled, setIsVendorDisabled] = useState(data?.isDisabled)
  const [toggleLoading, setToggleLoading] = useState(false)
  const [activeTab, setActiveTab] = useState({ label: 'English', value: 'en' })

  const handleChangeLanguage = (e, val) => {
    let selected = tabs.find(tab => tab.value === val)

    setActiveTab(selected)
  }

  //*** handle enable or disable Vendor 
  const handleVendorToggle = async () => {
    if (!checkPermission('TOGGLE_VENDOR')) return  //NEED_PERMISSION_KEY

    try {
      setToggleLoading(true)
      const toggleData = { isDisabled: !isVendorDisabled }
      const vendorId = data.id
      await adminService.toggleVendorStatus(vendorId, toggleData)
      setIsVendorDisabled(status => !status)
      toast(`Vendor ${isVendorDisabled ? 'Enabled' : 'Disabled'}`, 'success')
      setToggleLoading(false)
    } catch (error) {
      toast('Error happened in changing vendor status', 'error')
      setToggleLoading(false)
      console.error(error);
    }
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={3}
    >
      <Grid item xs={12} sm={12} md={8} lg={8} xl={9} >
        <StyledImageBox>
          <Box dir={'rtl'} className='banner-card'>
            <img alt='shop-banner' className='banner-image' src={data?.banner?.url} />
            <Box dir={'rtl'} className='logo-card'>
              <img alt='shop-logo' className='shop-logo' src={data.logo.url} />
            </Box>
          </Box>
        </StyledImageBox>
      </Grid>
      <Grid item xs={12} sm={12} md={8} lg={8} xl={9} mt={10}>
        <Card style={{ marginBottom: '40px' }}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={12}>
              <Box dir={'rtl'} p={1} paddingLeft={4} paddingRight={3} paddingTop={3} display='flex' justifyContent='space-between'>
                <CustomEditButton
                  disabled={!checkPermission('UPDATE_VENDOR')}  //NEED_PERMISSION_KEY
                  onClick={() => checkPermission('UPDATE_VENDOR') && navigate(ROUTE_CONSTANTS.DASHBOARD.LOGISTICS.SHOP.UPDATE.ROOT.ABSOLUTE, { state: data })} //NEED_PERMISSION_KEY
                >
                  <EditIcon style={{ color: '#fff' }} fontSize='large' />
                </CustomEditButton>
                <Box dir={'rtl'} display='flex' flexDirection='column' alignItems='flex-end' justifyContent='space-between' mt={0.5}>
                  <Box dir={'rtl'}
                    display="flex"
                    alignItems="center"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    justifyContent={{ xs: 'center', sm: 'space-between' }}
                    pb={3}
                  >
                    <TabsWrapper
                      onChange={handleChangeLanguage}
                      scrollButtons="auto"
                      textColor="secondary"
                      value={activeTab.value || 'Details'}
                      variant="scrollable"
                    >
                      {tabs.map((tab) => (
                        <Tab key={tab.value} value={tab.value} label={tab.label} />
                      ))}
                    </TabsWrapper>
                  </Box>
                  <Box dir={'rtl'} display='flex' flexDirection='row' alignItems='center' >
                    {toggleLoading && <CircularProgress size='1rem' style={{ marginRight: '8px' }} />}
                    <Typography variant='h4' marginRight={2}>Disable</Typography>
                    <Switch checked={isVendorDisabled}
                      disabled={!checkPermission('TOGGLE_VENDOR')} //NEED_PERMISSION_KEY
                      onChange={handleVendorToggle} size='medium'
                    />
                  </Box>
                </Box>
              </Box>
              <Divider
                sx={{
                  mt: 3
                }}
              />
              <Box dir={'rtl'} p={4} flex={1}>
                <Box dir={'rtl'} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Typography variant={'overline'} fontSize={'17px'}>General</Typography>
                </Box>
                <Box dir={'rtl'}>
                  <FeaturedText
                    title={activeTab.value === 'en' ? 'Name' : 'اسم'}
                    text={activeTab.value === 'en' ? data.name : data.nameAr}
                  />
                  <Grid
                    item
                    display="flex"
                    flexDirection='row'
                    flexWrap='wrap'
                  >
                    <FeaturedText title='commission' text={data.commission} suffix='%' />
                    <FeaturedText title='delivery time' text={data.asap} suffix='Minutes' />
                    <FeaturedText title='Primary Phone' text={data.phoneNumber1} />
                    <FeaturedText title='Secondary Phone' text={data.phoneNumber2 || '-'} />
                    <FeaturedText title='Primary Email' text={data.email1 || '-'} wrapperStyle={{ width: '200px' }} />
                    <FeaturedText title='Secondary email' text={data.email2 || '-'} wrapperStyle={{ width: '100%' }} />
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
}
export default Details;

const CustomEditButton = styled(Box)(
  ({ disabled }) => `
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #7e6fd0;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: ${!disabled && 'pointer'};
      opacity: ${disabled && '0.5'};
      :hover{
        opacity: ${disabled ? '0.5' : '0.8'};
      }
`
);
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

const StyledImageBox = styled(Box)`
    .banner-card{
      height: 200px;
      position: relative;
      .banner-image{
        width: 100%;
        border-radius: 8px;
        height: 100%;
        object-fit: cover;
      };
      .logo-card{
        width: 120px;
        height: 120px;
        position: absolute;
        bottom: -70px;
        left: 20px;
        .shop-logo{
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
        }
      }
    };
    
`



