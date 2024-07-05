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
  Select,
  MenuItem,
  FormControl,
  ButtonGroup,
  Button,
  FormLabel,
  RadioGroup,
  TextField,
  FormControlLabel,
  Radio,
  ToggleButton,
  FormHelperText,
  InputLabel,
  ListSubheader,
  InputAdornment
} from '@mui/material';
//***** icon of material UI */ import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone';
import SwiperCore, { Navigation, Thumbs } from 'swiper/core';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../../../../api/services/admin';
import useToast from '../../../../../hooks/useToast'
import { useCheckPermission } from '../../../../../hooks/useCheckPermission'
import BookingAccordionDetails from './AccordionInfo';
import UpdateVehicleDetails from '../../AddUpdatePage/updateVehicleDetails';
import HistoryDetails from './HistoryDetails';
import UpdateLocationDetails from '../../AddUpdatePage/updateLocationDetails';
import { BookingStatuses, BookingStatusesReverse } from '../constants';
import { LoadingButton } from '@mui/lab';
import SuspenseLoader from 'src/components/layouts/SuspenseLoader';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MuiTelInput } from 'mui-tel-input';
import { set } from 'nprogress';
import { SearchOutlined } from '@mui/icons-material';


SwiperCore.use([Navigation, Thumbs]);
const containsText = (value, searchText) => {
  console.log(value)
  return value.name.toLowerCase().indexOf(searchText?.toLowerCase()) > -1;
} 

const BookingDetails = ({ data, onUpdateHandle, closeMe }) => {
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
  const [status, setStatus] = useState(data?.status || null)
  const [mode, setMode] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [serviceList, setServiceList] = useState([])
  const [modeOnLoad, setModeOnLoad] = useState(null)
  const [availableDrivers, setAvailableDrivers] = useState([])
  const [selectedDriverId, setSelectedDriverId] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [unPaidPassword, setUnPaidPassword] = useState(null)
  const [subscriptionNumber, setSubscriptionNumber] = useState(null)
  const [validationNumber, setValidationNumber] = useState(null)
  const [sendSms, setSendSms] = useState(false)
  const [companies, setCompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [cardNumber, setCardNumber] = useState(null)
  const [availableDriverSearchText, setAvailableDriverSearchText] = useState('')
  const [serviceSearchText, setServiceSearchText] = useState('')
  //*** handle enable or disable vehicle 
  const availableDriverDisplayedOptions = useMemo(
    () => availableDrivers?.filter((option) => containsText(option, availableDriverSearchText)),
    [availableDriverSearchText]
  );

  const serviceDisplayedOptions = useMemo(
    () => serviceList?.filter((option) => containsText(option, serviceSearchText)),
    [serviceSearchText]
  );

  const searchRefDriver = useRef()
  const searchRefService = useRef()

  const getDetails = async () => {
    try {
      const response = await adminService.getBookingDetails(data?.Bookings[0]?.id)
      let temp = (response.data?.data)
      if(!temp.paymentStatus) {
        temp?.validStateToGo?.push('payment')
      }
      setDetails(temp)
    } catch (err) {
      console.log(err)
      toast('error on fetch booking detais!' + err.response.data.message, 'error')
    }
  }

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

  const handleCloseUpdate = async () => {
    await getDetails()
    setIsUpdateVehicleDetailsOpen(false)
  }

  const getPaymentMethods = async () => {
    try {
      const response = await adminService.getPaymentMethods({ offset: 0, limit: 1000 })
      setPaymentMethods(response.data.data)
    } catch (err) {
      toast('Error on fetch payment methods!' + err.response.data.message, 'error')
      console.log(err);
    }
  }
  const getServices = async () => {
    try {
      const response = await adminService.getServices({ offset: 0, limit: 1000 })
      setServiceList(response.data.data)
    } catch (err) {
      toast('Error on fetch services!' + err.response.data.message, 'error')
      console.log(err);
    }
  }

  const getCompanies = async () => {
    try {
      const response = await adminService.getCompanies({ offset: 0, limit: 1000 })
      setCompanies(response.data.data)
    } catch (err) {
      toast('Error on fetch company list!' + err.response.data.message, 'error')
      console.log(err);
    }
  }

  useEffect(() => {
    getDetails()
    getAvailableDrivers()
    getPaymentMethods()
    getServices()
    getCompanies()
  }, [])

  const handleChangeStatus = async (e, action) => {
    const putData = {
      status: BookingStatusesReverse[e],
      sendSms: sendSms
    }
    try {
      setModeOnLoad(action)
      console.log('here we are', details.id)
      const response = await adminService.updateBooking(data?.Bookings[0]?.id, putData)
      console.log(response)
      toast(action + ' done successfully!', 'success')
      setModeOnLoad(null)
      await getDetails()
      onUpdateHandle(details)
      setIsLoading(true)
      closeMe()
    } catch (err) {
      toast('error on updating status: ' + err.response.data.message, 'error')
      setModeOnLoad(null)
      setIsLoading(false)
    }
  }



  const requestCar = async () => {
    setIsLoading(true)
    await handleChangeStatus('REQUESTED', 'Request Car')
    setMode('')
  }
  const serviceDone = async () => {
    setIsLoading(true)
    await handleChangeStatus('SERVICE_DONE', 'Service Done')
    setMode('')
  }
  const reparkCar = async () => {
    setIsLoading(true)
    await handleChangeStatus('RE_PARKED', 'Re park')
    setMode('')
  }
  const carIsReady = async () => {
    setIsLoading(true)
    try {
      const putData = {
        sendSms: sendSms
      }
      const response = await adminService.carIsReady(details.id, putData)
      toast(response.data.message)
      await getDetails()
      onUpdateHandle(details)
      setModeOnLoad(null)
      setMode('')
      setIsLoading(false)
      closeMe()
    }catch(err) {
      toast(err.response.data.message, 'error')
      setMode('')
      setModeOnLoad(null)
      setIsLoading(false)
    }
  }
  const parkCar = async () => {
    setIsLoading(true)
    await handleChangeStatus('PARKED', 'park')
    setMode('')
  }

  const assignDriver = async () => {
    try {
      console.log(details)
      setModeOnLoad('Driver Assign')
      setIsLoading(true)
      const body = {
        bookingId: details.id,
        driverId: selectedDriverId
      }

      const response = await adminService.assignDriverToBooking(body)
      console.log(response)
      toast(response.data.message)
      await getDetails()
      onUpdateHandle(details)
      setModeOnLoad(null)
      setMode('')
      closeMe()
    } catch (err) {
      console.log(err)
      toast(err.response.data.message, 'error')
      setModeOnLoad(null)
      setIsLoading(false)
      setMode('')
    }
  }

  const handleNoPaymentCheckOut = async () => {
    try {
      setModeOnLoad('Checkout nopayment')
      setIsLoading(true)
      const response = await adminService.checkout(details.id, {})
      console.log('response checkout',response)
      toast(response.data.message, 'success')
      await getDetails()
      onUpdateHandle(details)
      setMode('')
      setModeOnLoad(null)
      closeMe()
    } catch (err) {
      toast(err.response.data.messsage, 'error')
      setIsLoading(false)
      setModeOnLoad(null)
      setMode('')
    }
  }

  const handlePrePaidDataModel = (booking, paymentMethodId) => {
    let paymentMethodData = {
        bookingId: booking?.id,
        prePaidNote: '',
        unpaidPassword: null,
        cardNumber: null,
        companyId: null,
        subscriptionNumber: null,
        validationNumber: null
    }

    const paymentMethod = paymentMethods.find((x) => x.id == +(paymentMethodId))

    switch (paymentMethod.name) {
        case 'Cash':
            delete paymentMethodData.unpaidPassword
            delete paymentMethodData.subscriptionNumber
            delete paymentMethodData.validationNumber
            break;
        case 'Knet':
            delete paymentMethodData.unpaidPassword
            delete paymentMethodData.subscriptionNumber
            delete paymentMethodData.validationNumber
            break;
        case 'Unpaid':
            paymentMethodData.unpaidPassword = unPaidPassword
            delete paymentMethodData.subscriptionNumber
            delete paymentMethodData.validationNumber
            break;
        case 'Voucher':
            paymentMethodData.companyId = selectedCompany
            paymentMethodData.cardNumber = cardNumber
            delete paymentMethodData.unpaidPassword
            delete paymentMethodData.subscriptionNumber
            delete paymentMethodData.validationNumber
            break;
        case 'Subscription':
            paymentMethodData.subscriptionNumber = subscriptionNumber
            delete paymentMethodData.unpaidPassword
            delete paymentMethodData.validationNumber
            break;
        case 'Validation':
            paymentMethodData.validationNumber = validationNumber
            delete paymentMethodData.unpaidPassword
            delete paymentMethodData.subscriptionNumber
            break;
    }

    return paymentMethodData
}

  const handlePaymentStandalone = async(formData, resetForm, setErrors, setStatus, setSubmitting) => {
    try{
      setIsLoading(true)
      setModeOnLoad('handle payment')
      const setPaymentMethodDataModel = handlePrePaidDataModel(details, +formData['paymentMethodId'])
      const data = {
        prePaid: true,
        paymentMethodId: +formData['paymentMethodId'],
        ...(setPaymentMethodDataModel.cardNumber ? {cardNumber: setPaymentMethodDataModel.cardNumber}: {}),
        ...(setPaymentMethodDataModel.prePaidNote ? {prePaidNote: setPaymentMethodDataModel.prePaidNote}: {}),
        ...(setPaymentMethodDataModel.subscriptionNumber ? {subscriptionNumber: setPaymentMethodDataModel.subscriptionNumber}: {}),
        ...(setPaymentMethodDataModel.companyId ? {companyId: setPaymentMethodDataModel.companyId}: {}),
        ...(setPaymentMethodDataModel.unpaidPassword ? {unpaidPassword: setPaymentMethodDataModel.unpaidPassword}: {}),
        ...(setPaymentMethodDataModel.validationNumber ? {validationNumber: setPaymentMethodDataModel.validationNumber}: {}),
      }
      const response = await adminService.updateBooking(details.id, data)
      toast(response.data.message || 'Booking Payment updated!', 'success')
      await getDetails()
      onUpdateHandle(details)
      setIsLoading(false)
      setModeOnLoad(null)
      setMode('')
      closeMe()
    }catch(err) {
      toast(err.response.data.message, 'error')
      setIsLoading(false)
      setModeOnLoad(null)
      console.log(err)
    }
  }

  const checkout = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
    setIsLoading(true)
    setModeOnLoad('checkout')
    // if (!checkPermission('BOOKING:UPDATE')) return true;
    if(!formData['paymentMethodId']) {
      toast('please select payment method first', 'warning')
    }
    try {
      data = {
        ...(formData['paymentMethodId'] && { paymentMethodId: +formData['paymentMethodId'] }),
        ...(subscriptionNumber && { subscriptionNumber: subscriptionNumber }),
        ...(unPaidPassword && { unpaidPassword: unPaidPassword }),
        ...(validationNumber && { validationNumber: validationNumber }),
        ...(selectedCompany && { companyId: selectedCompany, cardNumber: cardNumber})
      }
      const response = await adminService.checkout(details.id, data)
      toast(response.data.message, 'success')
      closeMe()
      onUpdateHandle(details)
      setIsLoading(false)
      setModeOnLoad(null)
      setMode('')
    } catch (error) {
      toast(error.response.data.message, 'error')
      setIsLoading(false)
      setModeOnLoad(null)
      setMode('')
      console.log(error);
    }
  }

  const bookService = async () => {
    
    try {
      setModeOnLoad('Service Request')
      const data = {
        id: selectedService,
        bookingId: details?.id
      }
      const response = await adminService.serviceBook(data)
      toast(response.data.message, 'success')
     
      await getDetails()
      setMode('')
      onUpdateHandle(details)
      setIsLoading(true)
      setModeOnLoad(null)
      setSelectedService(null)
    }catch(err) {
      toast(err.response.data.message, 'error')
      setModeOnLoad(null)
      setMode('')
      console.log(err);
    }
  }

  return (
    <>
      {modeOnLoad && <SuspenseLoader ></SuspenseLoader>}
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={0}
      >
        <Grid item xs={12}>
          {/* <Card style={{ marginBottom: '40px' }}> */}
          <Grid container spacing={2} pt={'40px'}>
            <Grid item xs={12} md={6}>
              <Box dir={'rtl'} p={0} flex={1} >
                <Box dir={'rtl'}
                  pt={'20px'}
                  pb={1}
                >
                  <ButtonGroup variant={details?.validStateToGo?.length > 1 ? 'outlined' : 'contained'} fullWidth>
                    {details?.validStateToGo?.map((validState) => {
                      if(validState == 4){return <Button key={validState + 'state-index'} onClick={() => setMode('Request Car')} variant={mode == 'Request Car' ? 'contained' : 'outlined'} disabled={modeOnLoad == 'Request Car'}>{modeOnLoad == 'Request Car' ? <CircularProgress /> : 'Request Car'}</Button>}
                      if(validState == 3){return <Button key={validState + 'state-index'} onClick={() => setMode('Driver Assign')}  variant={mode == 'Driver Assign' ? 'contained' : 'outlined'}>Driver Assign</Button>}
                      if(validState == 2){return <Button key={validState + 'state-index'} onClick={() => setMode('Car is Ready')}  variant={mode == 'Car is Ready' ? 'contained' : 'outlined'} disabled={modeOnLoad == 'Car is Ready'}>{modeOnLoad == 'Car is Ready' ? <CircularProgress /> : 'Car is Ready'}</Button>}
                      if(validState == 8){return <Button key={validState + 'state-index'} onClick={() => setMode('Checkout')}  variant={mode == 'Checkout' ? 'contained' : 'outlined'}>Checkout</Button>}
                      if(validState == 5){return <Button key={validState + 'state-index'} onClick={() => setMode('Re park')}  variant={mode == 'Re park' ? 'contained' : 'outlined'}>Repark</Button>}
                      if(validState == 6){return <Button key={validState + 'state-index'} onClick={() => setMode('Service Request')}  variant={mode == 'Service Request' ? 'contained' : 'outlined'}>Request Service</Button>}
                      if(validState == 7){return <Button key={validState + 'state-index'} onClick={() => setMode('Service Done')}  variant={mode == 'Service Done' ? 'contained' : 'outlined'}>Service Done</Button>}
                      if(validState == 'payment'){return <Button key={'paymentstate-index'} onClick={() => setMode('Payment')}  variant={mode == 'Payment' ? 'contained' : 'outlined'}>Payment</Button>}
                    }).filter(Boolean)}
                  </ButtonGroup>
                  <Grid container justifyContent={'space-between'} >
                  {
                    mode == 'Driver Assign' && <Grid item xs={12} pt={3} minHeight={'400px'} sx={{display:'flex', flexDirection: 'column',justifyContent: 'space-between'}}>
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
                      <Button fullWidth variant='contained' style={{ position: 'absolute', bottom: '20px', width: 'auto' }} disabled={!selectedDriverId || modeOnLoad != null} loading={modeOnLoad != null} onClick={() => assignDriver()}>{modeOnLoad ? <CircularProgress /> :'submit'}</Button>
                    </Grid>
                  }
                  {
                    mode == 'Service Request' && <Grid item xs={12} pt={3} minHeight={'400px'} sx={{display:'flex', flexDirection: 'column',justifyContent: 'space-between'}}>
                      <FormControl fullWidth required>
                          <>
                              <FormControl fullWidth required>
                                  <InputLabel id="selectedServiceId">Service</InputLabel>
                                  <Select
                                      required
                                      MenuProps={{ autoFocus: true }}
                                      labelId="selectedServiceId"
                                      id="selectedServiceId"
                                      value={selectedService}
                                      label="Service"
                                      name="selectedServiceId"
                                      fullWidth
                                      onChange={(x) => {setSelectedService(x.target.value)}}
                                  >
                                  <ListSubheader sx={{p: 0}}>
                                      <TextField
                                      size="small"
                                      inputRef={searchRefDriver}
                                      value={serviceSearchText}
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
                                      onChange={(e) => setServiceSearchText(e.target.value)}
                                      onKeyDown={(e) => {
                                          if (e.key != "Escape") {
                                              e.stopPropagation();
                                          }
                                      }}
                                      />
                                  </ListSubheader >
                                  {serviceSearchText.length ? serviceDisplayedOptions.map((option, i) => (
                                      <MenuItem key={i} value={option.id}>
                                      {option.name}
                                      </MenuItem>
                                  )) : serviceList.map((option, i) => (
                                      <MenuItem key={i} value={option.id}>
                                      {option.name}
                                      </MenuItem>
                                  ))}
                                  </Select>
                              </FormControl>
                          </>
                      </FormControl>
                      <Button fullWidth variant='contained' style={{ position: 'absolute', bottom: '20px', width: 'auto' }} disabled={!selectedService || modeOnLoad != null} onClick={() => bookService()}>{modeOnLoad ? <CircularProgress /> :'submit'}</Button>
                    </Grid>
                  }
                  {
                    mode == 'Car is Ready' && <Grid item xs={12} pt={3} minHeight={'400px'} sx={{display:'flex', flexDirection: 'column',justifyContent: 'space-between'}}>
                      <FormControlLabel style={{marginLeft: 1}} control={<Switch
                        checked={sendSms}
                        value={sendSms}
                        onChange={(x) => setSendSms(x.target.checked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                        
                      />} label="Send sms to Customer" />
                      <Button fullWidth variant='contained' disabled={modeOnLoad != null} style={{ position: 'absolute', bottom: '20px', width: 'auto' }}  onClick={() => carIsReady()}>{modeOnLoad ? <CircularProgress /> :'submit'}</Button>
                    </Grid>
                  }
                  {
                    mode == 'Request Car' && <Grid item xs={12} pt={3} minHeight={'400px'} sx={{display:'flex', flexDirection: 'column',justifyContent: 'space-between'}}>
                      {/* <FormControlLabel control={<Switch
                        checked={sendSms}
                        value={sendSms}
                        onChange={(x) => setSendSms(x.target.checked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />} label="Send sms to Customer" /> */}
                      <Button fullWidth variant='contained' style={{ position: 'absolute', bottom: '20px', width: 'auto'  }} disabled={modeOnLoad != null} onClick={() => requestCar()}>{modeOnLoad ? <CircularProgress /> :'submit'}</Button>
                    </Grid>
                  }
                  {
                    mode == 'Service Done' && <Grid item xs={12} pt={3} minHeight={'400px'} sx={{display:'flex', flexDirection: 'column',justifyContent: 'space-between'}}>
                      {/* <FormControlLabel style={{marginLeft: 1}} control={<Switch
                        checked={sendSms}
                        value={sendSms}
                        onChange={(x) => setSendSms(x.target.checked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                        
                      />} label="Send sms to Customer" /> */}
                      <Button fullWidth variant='contained' disabled={modeOnLoad != null} style={{ position: 'absolute', bottom: '20px', width: 'auto' }} onClick={() => serviceDone()}>{modeOnLoad ? <CircularProgress /> :'submit'}</Button>
                    </Grid>
                  }
                  {
                    mode == 'Re park' && <Grid item xs={12} pt={3} minHeight={'400px'} sx={{display:'flex', flexDirection: 'column',justifyContent: 'space-between'}}>
                      <FormControlLabel style={{marginLeft: 1}} control={<Switch
                        checked={sendSms}
                        value={sendSms}
                        onChange={(x) => setSendSms(x.target.checked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                        
                      />} label="Send sms to Customer" />
                      <Button fullWidth variant='contained' disabled={modeOnLoad == 'Re park'} style={{ position: 'absolute', bottom: '20px', width: 'auto' }} onClick={() => reparkCar()}>{modeOnLoad ? <CircularProgress /> :'submit'}</Button>
                    </Grid>
                  }
                  {
                    mode == 'park' && <Grid item xs={12} pt={3} minHeight={'400px'} sx={{display:'flex', flexDirection: 'column',justifyContent: 'space-between'}}>
                      <Button fullWidth variant='contained'  style={{ position: 'absolute', bottom: '20px', width: 'auto' }} disabled={modeOnLoad != null} onClick={() => parkCar()}>{modeOnLoad ? <CircularProgress /> :'submit'}</Button>
                    </Grid>
                  }

                  {
                    mode == 'Checkout' && !details?.paymentStatus &&
                    <Grid item xs={12} pt={3} minHeight={'400px'} sx={{display:'flex', flexDirection: 'column',justifyContent: 'space-between'}}>
                      <Formik
                      initialValues={{
                        paymentMethodId: details?.paymentMethodId || 2,
                      }}
                      validationSchema={
                        Yup.object().shape({
                          paymentMethodId: Yup.number()
                            .min(1)
                            .optional(),

                        })
                      }
                      onSubmit={async (
                        _values,
                        { resetForm, setErrors, setStatus, setSubmitting }
                      ) => checkout(_values, resetForm, setErrors, setStatus, setSubmitting)
                      }
                    >
                      {({
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values
                      }) => (
                        <form onSubmit={handleSubmit}>
                          <Grid container mt={2}>
                            <Grid xs={12} mb={5} >
                              <FormControl>
                                <FormLabel id="paymentMethod" required>Payment Method</FormLabel>
                                <RadioGroup
                                  row
                                  aria-labelledby="paymentMethodId"
                                  name="paymentMethodId"
                                  onChange={(x) => { handleChange(x) }}
                                  value={values.paymentMethodId}
                                >
                                  {
                                    paymentMethods?.map((methods) => {
                                      return <FormControlLabel value={+(methods?.id)} control={<Radio />} label={methods?.name} key={methods?.id} />
                                    })
                                  }
                                </RadioGroup>
                                {errors.paymentMethodId ? <FormHelperText sx={{color: 'red'}}>please select payment method</FormHelperText>: <></>}
                              </FormControl>
                            </Grid>

                            {
                              structuredClone(paymentMethods).find(x => x.id == +(values.paymentMethodId))?.name == 'Unpaid' && <Grid item xs={12} md={12} style={{ marginBottom: 10 }}>
                                <TextField
                                  fullWidth
                                  label={'Unpaid Password'}
                                  name="unPaidPassword"
                                  onBlur={handleBlur}
                                  required
                                  onChange={(x) => setUnPaidPassword(x.target.value)}
                                  value={unPaidPassword}
                                  variant="outlined"
                                />
                              </Grid>
                            }
                            {
                              structuredClone(paymentMethods).find(x => x.id == +(values.paymentMethodId))?.name == 'Validation' && <Grid item xs={12} md={12} style={{ marginBottom: 10 }}>
                                <TextField
                                  fullWidth
                                  label={'Validation number'}
                                  name="validationNumber"
                                  onBlur={handleBlur}
                                  required
                                  onChange={(x) => setValidationNumber(x.target.value)}
                                  value={validationNumber}
                                  variant="outlined"
                                />
                              </Grid>
                            }

                            {
                              structuredClone(paymentMethods).find(x => x.id == +(values.paymentMethodId))?.name == 'Voucher' ? <>
                              <Grid item xs={12} md={12} style={{marginBottom: 10}}>
                                <FormControl fullWidth>
                                  <FormLabel id="companyId">Company</FormLabel>
                                  <Select
                                    labelId="companyId"
                                    id="companyId"
                                    fullWidth
                                    value={selectedCompany}
                                    label="company"
                                    name='companyId'
                                    onChange={(x) => setSelectedCompany(x.target.value)}
                                  >
                                    {
                                      companies?.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                                    }
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} md={12} style={{ marginBottom: 10 }}>
                                <TextField
                                  fullWidth
                                  label={'Card Number'} 
                                  name="cardNumber"
                                  onBlur={handleBlur}
                                  required
                                  onChange={(x) => setCardNumber(x.target.value)}
                                  value={cardNumber}
                                  variant="outlined"
                                />
                              </Grid>
                              </>: <></>
                            }

                            {
                              structuredClone(paymentMethods).find(x => x.id == +(values.paymentMethodId))?.name == 'Subscription' && <Grid item xs={12} md={12} style={{ marginBottom: 10 }}>
                                <MuiTelInput
                                  onChange={(x) => setSubscriptionNumber(x)}
                                  value={subscriptionNumber}
                                  fullWidth
                                  defaultCountry='KW'
                                />
                              </Grid>
                            }
                              
                          </Grid>
                          <Button style={{position: 'absolute', bottom: '20px', width: 'auto'}} type="submit" disabled={modeOnLoad != null} variant='contained'>
                            {modeOnLoad ? <CircularProgress/> : 'Confirm'} 
                          </Button>
                        </form>)}
                    </Formik></Grid>
                  }

                  {
                    mode == 'Payment' && !details?.paymentStatus &&
                    <Grid item xs={12} pt={3} minHeight={'400px'} sx={{display:'flex', flexDirection: 'column',justifyContent: 'space-between'}}>
                      <Formik
                      initialValues={{
                        paymentMethodId: details?.paymentMethodId || 2,
                      }}
                      validationSchema={
                        Yup.object().shape({
                          paymentMethodId: Yup.number()
                            .min(1)
                            .optional(),

                        })
                      }
                      onSubmit={async (
                        _values,
                        { resetForm, setErrors, setStatus, setSubmitting }
                      ) => handlePaymentStandalone(_values, resetForm, setErrors, setStatus, setSubmitting)
                      }
                    >
                      {({
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values
                      }) => (
                        <form onSubmit={handleSubmit}>
                          <Grid container mt={2}>
                            <Grid xs={12} mb={5} >
                              <FormControl>
                                <FormLabel id="paymentMethod" required>Payment Method</FormLabel>
                                <RadioGroup
                                  row
                                  aria-labelledby="paymentMethodId"
                                  name="paymentMethodId"
                                  onChange={(x) => { handleChange(x) }}
                                  value={values.paymentMethodId}
                                >
                                  {
                                    paymentMethods?.map((methods) => {
                                      return <FormControlLabel value={+(methods?.id)} control={<Radio />} label={methods?.name} key={methods?.id} />
                                    })
                                  }
                                </RadioGroup>
                              </FormControl>
                            </Grid>

                            {
                              structuredClone(paymentMethods).find(x => x.id == +(values.paymentMethodId))?.name == 'Unpaid' && <Grid item xs={12} md={12} style={{ marginBottom: 10 }}>
                                <TextField
                                  fullWidth
                                  label={'Unpaid Password'}
                                  name="unPaidPassword"
                                  onBlur={handleBlur}
                                  onChange={(x) => setUnPaidPassword(x.target.value)}
                                  value={unPaidPassword}
                                  variant="outlined"
                                />
                              </Grid>
                            }
                            {
                              structuredClone(paymentMethods).find(x => x.id == +(values.paymentMethodId))?.name == 'Validation' && <Grid item xs={12} md={12} style={{ marginBottom: 10 }}>
                                <TextField
                                  fullWidth
                                  label={'Validation number'}
                                  name="validationNumber"
                                  onBlur={handleBlur}
                                  required
                                  onChange={(x) => setValidationNumber(x.target.value)}
                                  value={validationNumber}
                                  variant="outlined"
                                />
                              </Grid>
                            }

                            {
                              structuredClone(paymentMethods).find(x => x.id == +(values.paymentMethodId))?.name == 'Voucher' ? <>
                              <Grid item xs={12} md={12} style={{marginBottom: 10}}>
                                <FormControl fullWidth>
                                  <FormLabel id="companyId">Company</FormLabel>
                                  <Select
                                    labelId="companyId"
                                    id="companyId"
                                    fullWidth
                                    value={selectedCompany}
                                    label="company"
                                    name='companyId'
                                    onChange={(x) => setSelectedCompany(x.target.value)}
                                  >
                                    {
                                      companies?.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                                    }
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} md={12} style={{ marginBottom: 10 }}>
                                <TextField
                                  fullWidth
                                  label={'Card Number'} 
                                  name="cardNumber"
                                  onBlur={handleBlur}
                                  required
                                  onChange={(x) => setCardNumber(x.target.value)}
                                  value={cardNumber}
                                  variant="outlined"
                                />
                              </Grid>
                              </>: <></>
                            }

                            {
                              structuredClone(paymentMethods).find(x => x.id == +(values.paymentMethodId))?.name == 'Subscription' && <Grid item xs={12} md={12} style={{ marginBottom: 10 }}>
                                <MuiTelInput
                                  onChange={(x) => setSubscriptionNumber(x)}  
                                  value={subscriptionNumber}
                                  fullWidth
                                  defaultCountry='KW'
                                />
                              </Grid>
                            }
                            
                              
                          </Grid>
                          <Button style={{position: 'absolute', bottom: '20px', width: 'auto'}} type="submit" disabled={modeOnLoad != null} variant='contained'>
                            {modeOnLoad ? <CircularProgress /> : 'Confirm'}
                          </Button>
                        </form>)}
                    </Formik></Grid>
                  }

                  {mode == 'Checkout' && details?.paymentStatus ? <Grid item xs={12} pt={3} minHeight={'400px'} sx={{display:'flex', flexDirection: 'column',justifyContent: 'space-between'}}>
                    <Button style={{position: 'absolute', bottom: '20px', width: 'auto'}} disabled={modeOnLoad != null} variant='contained'

                      onClick={() => handleNoPaymentCheckOut()}>
                      {modeOnLoad ? <CircularProgress /> :'Checkout'}
                    </Button>
                  </Grid>: <></>}
                  </Grid>
                 

                </Box>
              </Box>
            </Grid>
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
              </Box>
              <Box dir={'rtl'} p={0}>
                {details?.id && <BookingAccordionDetails data={details} />}
              </Box>
            </Grid>
          </Grid>
          {/* </Card> */}
        </Grid>
      </Grid>
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



