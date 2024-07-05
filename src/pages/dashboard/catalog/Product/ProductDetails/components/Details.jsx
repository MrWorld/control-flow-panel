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
import { imageURLCombiner } from 'src/utils/imageUrlCombiner'
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { useNavigate } from 'react-router-dom';
import { adminService } from 'src/api/services/admin';
import useToast from 'src/hooks/useToast'
import FeaturedText from 'src/components/FeaturedText'
import { staticImages } from 'src/assets/images';
import { useCheckPermission } from 'src/hooks/useCheckPermission'
import { errorMessage } from 'src/utils/errorTypeDetector'
import GeneralInfo from './GeneralInfo'

SwiperCore.use([Navigation, Thumbs]);

const Details = ({ data }) => {
  const targetId = data.id
  const { checkPermission } = useCheckPermission()
  const navigate = useNavigate()
  const { toast } = useToast()
  const theme = useTheme()
  const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isProductDisabled, setIsProductDisabled] = useState(data.isDisabled)
  const [toggleLoading, setToggleLoading] = useState(false)

  //*** handle enable or disable vehicle 
  const handleToggle = async () => {
    if (!checkPermission('TOGGLE_PRODUCT')) return

    try {
      setToggleLoading(true)
      const data = { isDisabled: !isProductDisabled }
      await adminService.productToggle(targetId, data)
      setIsProductDisabled(status => !status)
      toast(`Product ${isProductDisabled ? 'Enabled' : 'Disabled'}`, 'success')
      setToggleLoading(false)
    } catch (error) {
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
        <Card style={{ marginBottom: '40px' }}>
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
                <SwiperWrapper is_small_screen={is_small_screen ? 'true' : 'false'}>
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
                      {data.medias?.map((value) => {
                        return (
                          <SwiperSlide key={value.url}>
                            <img style={{ objectFit: 'contain' }} src={value.url} alt="car-images" />
                          </SwiperSlide>
                        );
                      })}
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
                          <img style={{ objectFit: 'contain' }} src={value.url} alt="car-images" />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </SwiperWrapper>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box dir={'rtl'} p={1} paddingLeft={4} paddingRight={3} paddingTop={3} display='flex' justifyContent='space-between'>
                <CustomEditButton
                  disabled={!checkPermission('UPDATE_PRODUCT')}
                  onClick={() => checkPermission('UPDATE_PRODUCT') && navigate(ROUTE_CONSTANTS.DASHBOARD.CATALOG.PRODUCT.UPDATE.ROOT.ABSOLUTE, { state: { productId: targetId } })}
                >
                  <EditIcon style={{ color: '#fff' }} fontSize='large' />
                </CustomEditButton>
                <Box dir={'rtl'} display='flex' flexDirection='row' alignItems='center' >
                  {toggleLoading && <CircularProgress size='1rem' style={{ marginRight: '8px' }} />}
                  <Typography variant='h4' marginRight={2}>Disable</Typography>
                  <Switch
                    checked={isProductDisabled}
                    disabled={!checkPermission('TOGGLE_PRODUCT')}
                    onChange={handleToggle}
                    size='medium'
                  />
                </Box>
              </Box>
              <Divider
                sx={{
                  mt: 3
                }}
              />
              <Box dir={'rtl'} p={2} flex={1}>
                <Box dir={'rtl'}
                  pt={1}
                  pb={1}
                >
                  <GeneralInfo
                    name={data.name}
                    nameAr={data.nameAr}
                    description={data.description}
                    descriptionAr={data.descriptionAr}
                  />
                  <Divider
                    sx={{
                      mt: 3
                    }}
                  />
                  <Grid
                    display="flex"
                    flexDirection='column'
                  >
                    <Typography variant={'overline'} fontSize={'17px'}>Product details</Typography>
                    <Grid
                      item
                      display="flex"
                      flexDirection='row'
                      flexWrap='wrap'
                    >
                      <FeaturedText title='Price' text={data.price} suffix='KD' />
                      {data.hasDiscount &&
                        <FeaturedText title='discount' text={data.discount} suffix={data.discountType === "PERCENTAGE" ? "%" : 'KD'} />
                      }
                      <FeaturedText title='height' text={data.height} suffix='Cm' />
                      <FeaturedText title='width' text={data.width} suffix='Cm' />
                    </Grid>
                  </Grid>
                  <Divider
                    sx={{
                      mb: 3,
                      mt: 2
                    }}
                  />
                  <Grid container>
                    <Typography variant={'overline'} fontSize={'17px'}>Type and category</Typography>
                    <Grid container mt={3} display='flex' flexDirection='row' >
                      <Grid item display='flex' flexDirection='row' >
                        <Box dir={'rtl'} display="flex" alignItems="center" >
                          <StyledImage
                            src={imageURLCombiner(data.category.medias?.url) || staticImages.sampleCar}
                            alt={data.category.name}
                          />
                        </Box>
                        <Box dir={'rtl'} display="flex" flexDirection='column' justifyContent='space-around' ml={2}>
                          <Typography variant='h5'>{data.category.name}</Typography>
                          <Typography variant='h6'>{data.category.name}</Typography>
                        </Box>
                      </Grid>
                      <Grid item display='flex' flexDirection='row' marginLeft='auto'>
                        <Box dir={'rtl'} display="flex" flexDirection='column' justifyContent='space-around' ml={2}>
                          <Typography variant='h5'>{data.type.name}</Typography>
                          <Typography variant='h6'>{data.type.name}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
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
    height: ${is_small_screen === 'true' ? '40px' : '150px'};
    .swiper-slide {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: ${is_small_screen === 'true' ? '200px' : '400px'};
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



