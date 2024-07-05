import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { adminService } from 'src/api/services/admin';
import {
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
    Card,
    TextField,
    Divider,
    CircularProgress,
    FormControl,


    Button,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    InputLabel,
    Select,
    MenuItem,
    Box,
    ListSubheader,
    InputAdornment,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useToast from 'src/hooks/useToast'


import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { useCheckPermission } from 'src/hooks/useCheckPermission';
import { MuiTelInput } from 'mui-tel-input';
import ImagePicker from 'src/components/ImagePicker';
import { SearchOutlined } from '@mui/icons-material';

const containsText = (value, searchText) => {
    console.log(value)
    return `${value.name}`.toLowerCase().indexOf(searchText?.toLowerCase()) > -1;
} 
const UpdateVehicleDetails = ({ addNew, formData, data, setClose }) => {
    const { checkPermission } = useCheckPermission();
    const details = useLocation().state
    const theme = useTheme()
    const { toast } = useToast()
    const navigate = useNavigate()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
    const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
    const targetId = details?.id
    const [readDetail, setRealDetail] = useState()
    const [carManufactorerList, setCarManufactorerList] = useState([])
    const [carModelList, setCarModelList] = useState([])
    const [carColorList, setCarColorList] = useState(['White', 'Black', 'Gray', 'Silver', 'Blue', 'Red', 'Green', 'Gold/Beige', 'Brown', 'Orange'])
    const [vehicleManufacturerId, setVehicleManufacturerId] = useState(data?.BookingVehicle?.length ? data?.BookingVehicle[0]?.vehicleManufacturer?.id : null)
    const [vehicleId, setVehicleId] = useState(data?.BookingVehicle?.length ? data?.BookingVehicle[0]?.vehicle?.id : null)
    const [isStandAlone, setIsStandAlone] = useState(useLocation().isStandAlone)
    const [allImages, setAllImages] = useState([])
    const [imageIds, setImageIds] = useState([])
    const searchRefManufacturer = useRef()
    const [searchTextManufacturer,setSearchTextManufacturer] = useState('')
    const displayedOptionsManufacturer = useMemo(
        () => carManufactorerList.filter((option) => containsText(option, searchTextManufacturer)),
        [searchTextManufacturer]
      );
    const searchRefCar = useRef()
    const [searchTextCar,setSearchTextCar] = useState('')
    const displayedOptionsCar = useMemo(
        () => carManufactorerList.filter((option) => containsText(option, searchTextCar)),
        [searchTextCar]
      );
    
    const SubmitDetails = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
        if(!vehicleManufacturerId) return toast('Vehicle ManufacturerI is required', 'warning')
        if(!vehicleId) return toast('Vehicle is required', 'warning')
        formData['bookingId'] = readDetail?.id
        formData['vehicleId'] = vehicleId
        formData['vehicleManufacturerId'] = vehicleManufacturerId
        formData['carPlate'] = `${formData.carPlate}`
        try {
            const response = await adminService.updateBookingVehicle(formData)
            toast(response.data.message)
            if (response && !isStandAlone) setClose()

            if(isStandAlone) navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.BOOKING.UPDATE_LOCATION.ROOT.ABSOLUTE, {state: {...readDetail, isStandAlone: true}, })
        } catch (err) {
            console.log('error on updating vehicle details', err)
            // toast('error on updating booking vehicle details', 'error')
            toast(err?.response?.data?.message || 'Network Error!', 'error')
        }
    }


    //**** handle map error 

    const getDetail = async (payload = data) => {
        try {
            const response = await adminService.getBookingDetails(payload?.id)
            setRealDetail(response.data.data)
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            // toast('Error on fetch details!', 'error')
            console.log(err);
        }
    }
    useEffect(() => {
        console.log('data here',details)
        if(details?.isStandAlone) {
            getDetail(details)
            setIsStandAlone(true)
        }else{
            getDetail()
        }
    }, [])

    const getVehicleManufacturer = async () => {
        try {
            const response = await adminService.getCarManufacturers({ take: 1000, page: 0 })
            setCarManufactorerList(response.data.data)
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            console.log('error on fetch car manufacturer list', err)
            // toast('error on fetch car manufacturer list', 'error')
        }
    }

    const getVehicles = async () => {
        try {
            const response = await adminService.getCarModel({ take: 1000, page: 0, filter: 'vehicleManufacturerId' + ':' + 'equals' + ':' + vehicleManufacturerId})
            setCarModelList(response.data.data)
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            console.log('error on fetch car manufacturer list', err)
            // toast('error on fetch car manufacturer list', 'error')
        }
    }


    useEffect(() => {
        getVehicleManufacturer()
    }, [])
    useEffect(() => {
        if(vehicleManufacturerId) {
            getVehicles()
        }
    }, [vehicleManufacturerId])

    const getStaticDetailsFromArray = (data, name) => {
        console.log('data is here', data);
        let tmp = structuredClone(data)
        const value = tmp[0][`${name}`]
        return value
    }

    const handleChangeVehicleManufacturer = (value) => {
        setVehicleId(null)
        setVehicleManufacturerId(value)
    }

    const handleDeleteImage = (image) => {
        console.log(image)
    }

    return (

        <>
            <Box dir={'rtl'} sx={{
                p: isStandAlone ? 4 : 0
            }}>
            <Grid container p={0} direction={!isMediumScreen ? 'row' : 'column-reverse'} spacing={2}>
                <Grid xs={12} sm={12} md={8} xl={8} item>
                    <Typography variant='subtitle2' marginBottom='20px'>
                        {addNew ? 'Fill out form below to attach vehicle to booking' : 'Fill out form below to update booking vehicle details'}
                    </Typography>

                        {readDetail?.BookingVehicle && <Formik
                            initialValues={{
                                carPlate: readDetail?.BookingVehicle?.length ? getStaticDetailsFromArray(readDetail?.BookingVehicle, 'carPlate') : '',
                                color: readDetail?.BookingVehicle?.length ? getStaticDetailsFromArray(readDetail?.BookingVehicle, 'color') : '',
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    color: Yup.string()
                                        .max(255)
                                        .required('The color field is required'),
                                    carPlate: Yup.string()
                                        .max(255)
                                        .required('The Car Plate field is required'),
                                    
                                })
                            }
                            onSubmit={async (
                                _values,
                                { resetForm, setErrors, setStatus, setSubmitting }
                            ) => addNew
                                    ? SubmitDetails(_values, resetForm, setErrors, setStatus, setSubmitting)
                                    : SubmitDetails(_values, resetForm, setErrors, setStatus, setSubmitting)
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
                                    <Grid container spacing={3} marginBottom={2}>
                                        <Grid item xs={12} md={6} >
                                            <FormControl fullWidth required>
                                                <InputLabel id="vehicleManufacturerId">Vehicle Manufacturer</InputLabel>
                                                <Select
                                                    fullWidth
                                                    id="vehicleManufacturerId"
                                                    labelId="vehicleManufacturerId"
                                                    disabled={details?.vehicleManufacturerId}
                                                    value={vehicleManufacturerId}
                                                    required
                                                    label={'Vehicle Manufacturer'}
                                                    name='vehicleManufacturerId'
                                                    onChange={(x) => handleChangeVehicleManufacturer(x.target.value)}
                                                    variant="outlined"
                                                >
                                                    <ListSubheader sx={{p: 0}}>
                                                                <TextField
                                                                size="small"
                                                                inputRef={searchRefManufacturer}
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
                                                                onChange={(e) => setSearchTextManufacturer(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key != "Escape") {
                                                                        e.stopPropagation();
                                                                    }
                                                                }}
                                                                />
                                                            </ListSubheader>
                                                            {searchTextManufacturer.length ? displayedOptionsManufacturer.map((item, i) => (
                                                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                            )) : carManufactorerList.map((item, i) => (
                                                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                            ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6} >
                                            {vehicleManufacturerId && <FormControl fullWidth required>


                                                <InputLabel id="vehicleId">Vehicle Model</InputLabel>
                                                <Select
                                                    fullWidth
                                                    id="vehicleId"
                                                    labelId="vehicleId"
                                                    disabled={details?.vehicleId}
                                                    value={vehicleId}
                                                    required
                                                    label={'Vehicle Model'}
                                                    name='vehicleId'
                                                    onChange={(x) => setVehicleId(x.target.value)}
                                                    variant="outlined"
                                                >
                                                    <ListSubheader sx={{p: 0}}>
                                                                <TextField
                                                                size="small"
                                                                inputRef={searchRefCar}
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
                                                                onChange={(e) => setSearchTextCar(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key != "Escape") {
                                                                        e.stopPropagation();
                                                                    }
                                                                }}
                                                                />
                                                            </ListSubheader>
                                                            {searchTextCar.length ? displayedOptionsCar.map((item, i) => (
                                                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                            )) : carModelList.map((item, i) => (
                                                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                            ))}
                                                </Select>
                                            </FormControl>}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="vehicleId">Vehicle color</InputLabel>
                                                <Select 
                                                    error={Boolean(
                                                        touched?.color && errors.color
                                                    )}
                                                    fullWidth
                                                    helperText={touched?.color && errors.color}
                                                    id="color"
                                                    labelId="color"
                                                    value={values?.color}
                                                    required
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    label={'Vehicle color'}
                                                    name='color'
                                                    variant="outlined"
                                                >
                                                    {carColorList.map((clr) => {
                                                        return <MenuItem key={clr} value={clr}>{clr}</MenuItem>
                                                    }) }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.carPlate && errors.carPlate
                                                )}
                                                type="text"
                                                inputProps={{ inputMode: 'text' }}
                                                fullWidth
                                                helperText={touched?.carPlate && errors.carPlate}
                                                label={'Car Plate'}
                                                name="carPlate"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values?.carPlate}
                                                variant="outlined"
                                            />
                                        </Grid>
                                       
                                    </Grid>
                                    <Divider style={{ marginBottom: 20 }} />

                                    <Grid container style={{ margin: '20px 0px' }} alignItems="center">
                                        <Button
                                            type="submit"
                                            startIcon={
                                                isSubmitting ? <CircularProgress size="1rem" /> : null
                                            }
                                            disabled={Boolean(errors.submit) || isSubmitting}
                                            variant="contained"
                                            style={{ width: is_small_screen && '100%' }}
                                        >
                                            Save {isStandAlone ? '& Enter Parking detail' : ''}
                                        </Button>
                                        {isStandAlone ? <Button
                                            variant='outlined'
                                            onClick={() => navigate(ROUTE_CONSTANTS.DASHBOARD.CONTROL_PANEL.ROOT.ABSOLUTE, {replace: true})}
                                            >
                                            Back To Panel
                                        </Button> : <Button variant='outlined' style={{ width: is_small_screen && '100%', marginLeft: 10 }} onClick={() => setClose()}>Cancel</Button>}
                                    </Grid>
                                </form>
                            )}
                        </Formik>}
                </Grid>
                {readDetail?.id ? <Grid item sm={12} md={4} >
                                            <ImagePicker
                                                imageStates={{
                                                    setDisconnectImageIds: handleDeleteImage,
                                                    imageIds: readDetail.medias || [],
                                                    setImageIds: setImageIds,
                                                    setAllImages
                                                }}
                                                addNew={addNew}
                                                deleteOld={false}
                                                aspectRatio={0}
                                                entity="booking"
                                                imageIds={readDetail.medias}
                                                entityId={readDetail?.id}
                                                title='Upload Vehicle Image (autosave)'
                                                wrapperStyle={{ marginTop: '30px', marginLeft: '30px' }}
                                            />
                                        </Grid> : <></>}
            </Grid >
            </Box>
            
        </>
    )
}

export default UpdateVehicleDetails