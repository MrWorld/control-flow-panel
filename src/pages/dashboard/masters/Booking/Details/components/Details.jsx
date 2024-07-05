import { useEffect, useMemo, useRef, useState } from 'react';
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  ButtonGroup,
  Button,
  FormControl,
  DialogActions,
  MenuItem,
  InputAdornment,
  TextField,
  ListSubheader,
  Select,
  InputLabel,
  CardHeader
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
import BookingAccordionDetails from './AccordionInfo';
import UpdateVehicleDetails from '../../AddUpdatePage/updateVehicleDetails';
import HistoryDetails from './HistoryDetails';
import UpdateLocationDetails from '../../AddUpdatePage/updateLocationDetails';
import { SearchOutlined } from '@mui/icons-material';
import SuspenseLoader from 'src/components/layouts/SuspenseLoader';


SwiperCore.use([Navigation, Thumbs]);

const containsText = (value, searchText) => {
  console.log(value)
  return value.name.toLowerCase().indexOf(searchText?.toLowerCase()) > -1;
}

const BookingDetails = ({ data }) => {
  const { checkPermission } = useCheckPermission()
  const navigate = useNavigate()
  const { toast } = useToast()
  const theme = useTheme()
  const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isDisabled, setisDisabled] = useState(data.isDisabled)
  const [toggleLoading, setToggleLoading] = useState(false)
  const [details, setDetails] = useState(null)
  const [isUpdateVehicleDetailsOpen, setIsUpdateVehicleDetailsOpen] = useState(false)
  const [isUpdateLocationDetailsOpen, setIsUpdateLocationDetailsOpen] = useState(false)
  const [updateParkerModel, setUpdateParkerModel] = useState(false)
  const [availableDriverSearchText, setAvailableDriverSearchText] = useState('')
  const [availableDrivers, setAvailableDrivers] = useState([])
  const [selectedDriverId, setSelectedDriverId] = useState(null)
  const [isOnLoad, setIsOnLoad] = useState(false)
  const searchRefDriver = useRef()
  const [resendLoad, setResendLoad] = useState(false)
  //*** handle enable or disable vehicle 
  const availableDriverDisplayedOptions = useMemo(
    () => availableDrivers?.filter((option) => containsText(option, availableDriverSearchText)),
    [availableDriverSearchText]
  );
  const getDetails = async () => {
    try {
      const response = await adminService.getBookingDetails(data.id)
      setDetails(response.data.data)
    } catch (err) {
      console.log(err)
      toast('error on fetch booking detais', 'error')
    }
  }

  const handleCloseUpdate = async () => {
    await getDetails()
    setIsUpdateVehicleDetailsOpen(false)
    setIsUpdateLocationDetailsOpen(false)
  }

  const handleCloseUpdateAndOpenLocation = async () => {
    await getDetails()
    setIsUpdateVehicleDetailsOpen(false)
    setIsUpdateLocationDetailsOpen(true)
  }

  useEffect(() => {
    getDetails()
    getAvailableDrivers()
  }, [])

  const getAvailableDrivers = async () => {
    try {
      const payload = {
        limit: 1000,
        offset: 0
      }
      const response = await adminService.getAvailableDrivers(payload)
      setAvailableDrivers(response.data.data)
    } catch (err) {
      toast('error on fetch available drivers!' + err.response.data.message, 'error')
    }
  }

  const handleResendTicket = async() => {
    try {
      setResendLoad(true)
      const response = await adminService.resendTicket(data.id)
      toast(response.data.message, 'success')
      setResendLoad(false)
    }catch(err) {
      toast(err.response.data.message, 'error')
      setResendLoad(false)
    }
  }

  const handleUpdateParker = async() => {
    try {
      setIsOnLoad(true)
      const payload = {
        driverId: selectedDriverId,
      }
      const response = await adminService.updateParker(data.id , payload)
      await getDetails()
      toast(response.data.message, 'success')
      setSelectedDriverId(null)
      setAvailableDriverSearchText('')
      setIsOnLoad(false)
      setUpdateParkerModel(false)
    }catch(err) {
      toast(err.response.data.message, 'error')
      setIsOnLoad(false)
    }
  }

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Box dir={'rtl'} p={1} paddingLeft={4} paddingRight={3} paddingTop={3} display='flex' >
            <Grid container spacing={1}>
              <Grid item width={is_small_screen ? '100%' : 'auto'}>
                <Button fullWidth variant='outlined' disabled={!checkPermission('BOOKING:UPDATE')} onClick={() => checkPermission('BOOKING:UPDATE') && setIsUpdateVehicleDetailsOpen(true)}>
                  Update Vehicle Details
                </Button>
              </Grid>
              <Grid item width={is_small_screen ? '100%' : 'auto'}>
                <Button fullWidth variant='outlined' disabled={!checkPermission('BOOKING:UPDATE')} onClick={() => checkPermission('BOOKING:UPDATE') && setIsUpdateLocationDetailsOpen(true)}>
                  Update Parking Location
                </Button>
              </Grid>
              <Grid item width={is_small_screen ? '100%' : 'auto'}>
                <Button fullWidth variant='outlined' disabled={!checkPermission('BOOKING:UPDATE')} onClick={() => setUpdateParkerModel(true)}>
                  Update Parker
                </Button>
              </Grid>
              <Grid item width={is_small_screen ? '100%' : 'auto'}>
                <Button fullWidth variant='outlined' disabled={resendLoad} onClick={() => handleResendTicket()}>
                  {resendLoad ? <CircularProgress size={24} /> :'Resend Ticket'}
                </Button>
              </Grid>
              <Grid item width={is_small_screen ? '100%' : 'auto'}>
                <Button fullWidth variant='outlined' onClick={() => navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.BOOKING.PRINT_BY_DATA(details?.id).ABSOLUTE, {replace: true} )}>
                  Print Ticket
                </Button>
              </Grid>
            </Grid>

            </Box>
          
            <Grid container spacing={2} >
              <Grid item xs={12} md={6}>
                <Card >
                <Box dir={'rtl'} p={2} flex={1}>
                  <Typography fontSize={24} fontWeight={400}>Booking Details</Typography>
                </Box>
                <Divider />
                  
                  <Box dir={'rtl'} p={ is_small_screen ? 1 :4} flex={1}>
                    <Box dir={'rtl'}
                      pt={1}
                      pb={1}
                    >
                      {details?.id && <BookingAccordionDetails data={details} />}
                    </Box>
                  </Box>
                </Card>
              </Grid>
              <Grid
                xs={12}
                md={6}
                item
                sx={{
                  position: 'relative'
                }}
              >
                <Card>
                <Box dir={'rtl'} p={2} flex={1}>
                  <Typography fontSize={24} fontWeight={400}>Activity</Typography>
                </Box>
                <Divider />
                <Box dir={'rtl'} p={4} pt={3}>
                  {details?.history?.length ? <HistoryDetails data={details?.history} />: <></> }
                </Box>
                </Card>
              </Grid>
            </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={isUpdateVehicleDetailsOpen}
        fullWidth={true}
        maxWidth="md"
        onClose={() => setIsUpdateVehicleDetailsOpen(false)}
      >
        <DialogTitle>Update Vehicle Details</DialogTitle>
        <DialogContent>
          {details?.id && <UpdateVehicleDetails data={details} setClose={() => handleCloseUpdateAndOpenLocation()} />}
        </DialogContent>
      </Dialog>
      <Dialog
        open={isUpdateLocationDetailsOpen}
        fullWidth={true}
        onClose={() => setIsUpdateLocationDetailsOpen(false)}
      >
        <DialogTitle>Update Location Details</DialogTitle>
        <DialogContent>
          {details?.id && <UpdateLocationDetails data={details} setClose={() => handleCloseUpdate()} />}
        </DialogContent>
      </Dialog>

      <Dialog open={updateParkerModel} onClose={() => setUpdateParkerModel(false)} >
        <DialogTitle>Update Parker</DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2} >
                    <Grid item xs={12}>
                    <FormControl fullWidth required>
                          <>
                              <FormControl fullWidth required>
                                  <InputLabel id="selectedDriverId">Driver</InputLabel>
                                  <Select
                                      required
                                      MenuProps={{ autoFocus: true }}
                                      labelId="search-select-label"
                                      id="selectedDriverId"
                                      value={selectedDriverId}
                                      label="Driver"
                                      name="selectedDriverId"
                                      fullWidth
                                      onChange={(x) => {setSelectedDriverId(x.target.value)}}
                                  >
                                  <ListSubheader sx={{p: 0}}>
                                      <TextField
                                      size="small"
                                      inputRef={searchRefDriver}
                                      value={availableDriverSearchText}
                                      autoFocus
                                      placeholder="Type to search..."
                                      fullWidth
                                      InputProps={{
                                          startAdornment: (
                                              <InputAdornment position="start">
                                                  <SearchOutlined />
                                              </InputAdornment>
                                          )
                                      }}
                                      onChange={(e) => setAvailableDriverSearchText(e.target.value)}
                                      onKeyDown={(e) => {
                                          if (e.key != "Escape") {
                                              e.stopPropagation();
                                          }
                                      }}
                                      />
                                  </ListSubheader>
                                  {availableDriverSearchText.length ? availableDriverDisplayedOptions.map((option, i) => (
                                      <MenuItem key={i} value={option.id}>
                                      {option.name}
                                      </MenuItem>
                                  )) : availableDrivers.map((option, i) => (
                                      <MenuItem key={i} value={option.id}>
                                      {option.name}
                                      </MenuItem>
                                  ))}
                                  </Select>
                              </FormControl>
                          </>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{mt: 5}}>
                      <Divider style={{ marginBottom: 20 }}/>
                      {isOnLoad ? <SuspenseLoader /> : 
                      <Button onClick={() => handleUpdateParker()} variant='contained' sx={{mr: '12px'}} disabled={!selectedDriverId || isOnLoad}>
                        Submit
                      </Button>} 
                      <Button variant='outlined' onClick={() => setUpdateParkerModel(false)}>Cancel</Button>
                    </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default BookingDetails;

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
  ({ disabled, theme }) => `
      width: auto;
      height: 50px;
      padding: 0 10px;
      border-radius: 5px;
      border: 1px solid ${theme.colors.primary.main};
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



