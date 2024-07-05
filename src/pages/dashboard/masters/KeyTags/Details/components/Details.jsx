import { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Divider,
  IconButton,
  Card,
  styled,
  Switch,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
//***** icon of material UI */ import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import SwiperCore, { Navigation, Thumbs } from 'swiper/core';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import ChevronLeftTwoToneIcon from '@mui/icons-material/ChevronLeftTwoTone';
import { Swiper, SwiperSlide } from 'swiper/react';
import { imageURLCombiner } from '../../../../../../utils/imageUrlCombiner'
import { ROUTE_CONSTANTS } from '../../../../../../constants/AppRoutes'
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../../../../../api/services/admin';
import useToast from '../../../../../../hooks/useToast' 
import FeaturedText from '../../../../../../components/FeaturedText'
import VehicleGeneralInfo from './GeneralInfo'
import { staticImages } from '../../../../../../assets/images';
import { useCheckPermission } from '../../../../../../hooks/useCheckPermission'
import { errorMessage } from '../../../../../../utils/errorTypeDetector'


SwiperCore.use([Navigation, Thumbs]);

const Details = ({ data }) => {
  const { checkPermission } = useCheckPermission()
  const navigate = useNavigate()
  const { toast } = useToast()
  const theme = useTheme()
  const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isDisabled, setisDisabled] = useState(data.isDisabled)
  const [toggleLoading, setToggleLoading] = useState(false)

  //*** handle enable or disable vehicle 
  const handleVehicleToggle = async () => {
    if(!checkPermission('TOGGLE_VEHICLE')) return 
    
    try{
      setToggleLoading(true)
      const data = {disabled: !isDisabled}
      const entityId = data.id
      await adminService.toggleKeyTag(entityId, data)
      setisDisabled(status => !status)
      toast(`Vehicle ${isDisabled ? 'Enabled': 'Disabled'}`, 'success')
      setToggleLoading(false)
    }catch(error) {
      toast(errorMessage(error), 'error')
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
      <Grid item xs={12}>
        <Card style={{marginBottom: '40px'}}>
          <Grid container spacing={0}>
            <Grid
              xs={12}
              md={6}
              item
              sx={{
                position: 'relative'
              }}
            >
              <Box dir={'rtl'}
                component="span"
                sx={{
                  display: { xs: 'none', md: 'inline-block' }
                }}
              >
                <Divider
                  absolute
                  sx={{
                    height: '100%',
                    left: 'auto',
                    right: 0
                  }}
                  orientation="vertical"
                  flexItem
                />
              </Box>
              <Box dir={'rtl'} p={6}>
                {/* {data.medias.length > 0 &&
                  <SwiperWrapper is_small_screen={is_small_screen ? true : undefined}>
                    <Box dir={'rtl'}
                      sx={{
                        position: 'relative'
                      }}
                    >
                      <Swiper
                        thumbs={{ swiper: thumbsSwiper }}
                        spaceBetween={15}
                        slidesPerView={1}
                        autoHeight
                        loop
                        navigation={{
                          nextEl: '.MuiSwipe-right',
                          prevEl: '.MuiSwipe-left'
                        }}
                      >
                      </Swiper>
                      <SwipeIndicator className="MuiSwipe-root MuiSwipe-left">
                        <ChevronLeftTwoToneIcon />
                      </SwipeIndicator>
                      <SwipeIndicator className="MuiSwipe-root MuiSwipe-right">
                        <ChevronRightTwoToneIcon />
                      </SwipeIndicator>
                    </Box>
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      watchSlidesProgress
                      slidesPerView={4}
                      spaceBetween={15}
                    >
                      {data.medias.map((value) => {
                        return (
                          <SwiperSlide key={value.url}>
                            <img style={{objectFit: 'contain'}} src={imageURLCombiner(value.url)} alt="car-images" />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </SwiperWrapper>
                } */}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box dir={'rtl'} p={1} paddingLeft={4} paddingRight={3} paddingTop={3} display='flex' justifyContent='space-between'>
                <CustomEditButton disabled={!checkPermission('KEY_TAG:UPDATE')} onClick={() => checkPermission('KEY_TAG:UPDATE') && navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.KEY_TAG.UPDATE.ROOT.ABSOLUTE, {state: data})}>
                    <EditIcon style={{color: '#fff'}} fontSize='large'/>
                </CustomEditButton>
                <Box dir={'rtl'} display='flex' flexDirection='row' alignItems='center' >
                  {toggleLoading && <CircularProgress size='1rem' style={{marginRight: '8px'}}/>}
                  <Typography variant='h4' marginRight={2}>Disable</Typography>
                  <Switch checked={isDisabled} disabled={!checkPermission('KEY_TAG:UPDATE')} onChange={handleVehicleToggle} size='medium'/>
                </Box>
              </Box>
              <Divider
                sx={{
                  mt: 3
                }}
              />
              <Box dir={'rtl'} p={4} flex={1}>
                <VehicleGeneralInfo 
                  name={data.name} 
                  description={data.description} 
                />
                <Divider
                  sx={{
                    mt: 3
                  }}
                />
                <Box dir={'rtl'}
                  pt={1}
                  pb={1}
                >
                  <Grid container>
                    <Typography variant={'overline'} fontSize={'17px'}>Brand and Class</Typography>
                    <Grid container mt={3} display='flex' flexDirection='row' justifyContent={'space-between'}>
                      <Grid item display='flex'  flexDirection='row'  mt={1}>
                        <Box dir={'rtl'} display="flex" alignItems="center" >
                          <StyledImage
                            // src={imageURLCombiner(data.brand.medias?.url) || staticImages.placeholder }
                          />
                        </Box>
                      </Grid>
                      <Grid item display='flex' flexDirection='row' mr={15} mt={1}>
                        <Box dir={'rtl'} display="flex" alignItems="center" >
                          <StyledImage
                            // src={imageURLCombiner(data.class.medias?.url) || staticImages.placeholder }
                            // alt={data.class.name}
                          />
                        </Box>
                        <Box dir={'rtl'} display="flex" flexDirection='column' justifyContent='space-around' ml={2}>
                          <Typography variant='h5'>{data.name}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
                <Divider
                  sx={{
                    mb: 3
                  }}
                />
                <Grid
                  display="flex"
                  flexDirection='column'
                >
                  <Typography  variant={'overline'} fontSize={'17px'}>Information</Typography>
                  <Grid 
                    item
                    display="flex"
                    flexDirection='row'
                    flexWrap= 'wrap'
                  >
                    <FeaturedText title='gearbox' text={data.code}/>
                    <FeaturedText title='model' text={data?.identifier}/>
                    {/* <FeaturedText title='cylinder' text={data?.cylinder}/> */}
                    {/* <FeaturedText title='doors' text={data.doors}/> */}
                    {/* <FeaturedText title='fuel' text={data.fuel} suffix='liters'/> */}
                    {/* <FeaturedText title='year' text={data.year}/> */}
                    {/* <FeaturedText title='seats' text={data.seats}/> */}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
}
export default Details;

const SwipeIndicator = styled(IconButton)(
  ({ theme }) => `
    @media (max-width: ${theme.breakpoints.values.sm}px) {
        display: none;
    }
    transition: ${theme.transitions.create(['background', 'color'])};
    color: ${theme.colors.primary.main};
    background: ${theme.colors.alpha.white[100]};
    position: absolute;
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
    top: 50%;
    margin-top: ${theme.spacing(-1.5)};
    border-radius: 100px;
    z-index: 5;

    &:hover {
      background: ${theme.colors.alpha.white[100]};
      color: ${theme.colors.alpha.black[100]};
    }

    &.MuiSwipe-left {
      left: ${theme.spacing(0.5)};
    }
    
    &.MuiSwipe-right {
      right: ${theme.spacing(0.5)};
    }
`
);

const SwiperWrapper = styled(Box)(
  ({ theme, is_small_screen }) => `
  .swiper-wrapper {
    height: ${is_small_screen ? '40px' : '150px'};
    .swiper-slide {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: ${is_small_screen ? '200px' : '400px'};
        object-fit: cover
      }
    }
  }

  .swiper-container-thumbs {
    .swiper-wrapper {
      display: flex;
      align-items: center;
    }

    .swiper-slide {
      width: 140px;
      display: flex;
      padding: 3px;

      img {
        width: 100%;
        height: auto;
        border-radius: ${theme.general.borderRadius};
        opacity: .7;
        transition: ${theme.transitions.create(['box-shadow', 'opacity'])};
      }

      &:hover {
        cursor: pointer;

        img {
          opacity: 1;
        }
      }

      &.swiper-slide-thumb-active {
        img {
          opacity: 1;
          box-shadow: 0 0 0 3px ${theme.colors.primary.main};
        }
      }
    }
  }
`
);

const StyledImage = styled('img')(
  () => `
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 9px;
`
);

const CustomEditButton = styled(Box)(
  ({ disabled }) => `
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #f33;
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



