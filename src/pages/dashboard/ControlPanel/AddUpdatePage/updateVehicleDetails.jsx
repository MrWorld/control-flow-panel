import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { adminService } from '../../../../api/services/admin';
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
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useToast from 'src/hooks/useToast'


import { useCheckPermission } from 'src/hooks/useCheckPermission';


const UpdateVehicleDetails = ({ addNew, formData, data, setClose }) => {
    const { checkPermission } = useCheckPermission();
    const details = useLocation().state
    const theme = useTheme()
    const { toast } = useToast()
    const navigate = useNavigate()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
    const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
    const targetId = details?.id
    const [phone, setPhone] = useState(details?.phone || '')
    const [customerTypes, setCustomerTypes] = useState([])
    const [availableKeyTags, setAvailableKeyTags] = useState([])
    const [readDetail, setRealDetail] = useState()
    const [carManufactorerList, setCarManufactorerList] = useState([])
    const [carModelList, setCarModelList] = useState([])

    const SubmitDetails = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
        formData['bookingId'] = data?.id
        try {
            const response = await adminService.updateBookingVehicle(formData)
            if (response) setClose()
        } catch (err) {
            console.log('error on updating vehicle details', err)
            toast('error on updating booking vehicle details', 'error')
        }


    }


    //**** handle map error 

    const getDetail = async () => {
        try {
            const response = await adminService.getBookingDetails(details?.id)
            setRealDetail(response.data.data)
        } catch (err) {
            toast('Error on fetch details!', 'error')
            console.log(err);
        }
    }

    useEffect(() => {
        if (details?.id) getDetail()
    }, [])

    const getCustomerTypes = async () => {
        try {
            const response = await adminService.getCustomerTypes()
            setCustomerTypes(response.data.data)
        } catch (err) {
            toast('Error on fetch customer types!', 'error')
            console.log(err);
        }
    }

    const getVehicleManufacturer = async () => {
        try {
            const response = await adminService.getCarManufacturers({ take: 1000, page: 0 })
            setCarManufactorerList(response.data.data)
        } catch (err) {
            console.log('error on fetch car manufacturer list', err)
            toast('error on fetch car manufacturer list', 'error')
        }
    }

    const getVehicles = async () => {
        try {
            const response = await adminService.getCarModel({ take: 1000, page: 0 })
            setCarModelList(response.data.data)
        } catch (err) {
            console.log('error on fetch car manufacturer list', err)
            toast('error on fetch car manufacturer list', 'error')
        }
    }


    useEffect(() => {
        getVehicles()
        getVehicleManufacturer()

    }, [])

    const getStaticDetailsFromArray = (data, name) => {
        console.log('data is here',data);
        let tmp = structuredClone(data)
        const value = tmp[0][`${name}`]
        return value
    }


    return (

        <>
            <Grid container p={0} direction={!isMediumScreen ? 'row' : 'column-reverse'}>
                <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
                    <Typography variant='subtitle2' marginBottom='20px'>
                        {addNew ? 'Fill out form below to attach vehicle to booking' : 'Fill out form below to update booking vehicle details'}
                    </Typography>
                    <Card style={{ padding: '25px' }}>
                        {data?.BookingVehicle && <Formik
                            initialValues={{
                                carPlate: data?.BookingVehicle?.length ? getStaticDetailsFromArray(data?.BookingVehicle, 'carPlate') : '',
                                color: data?.BookingVehicle?.length ? getStaticDetailsFromArray(data?.BookingVehicle, 'color') : '',
                                vehicleId: data?.BookingVehicle?.length ? data?.BookingVehicle[0]?.vehicle?.id : null,
                                vehicleManufacturerId: data?.BookingVehicle?.length ? data?.BookingVehicle[0]?.vehicleManufacturer?.id : null,
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    color: Yup.string()
                                        .max(255)
                                        .required('The color field is required'),
                                    vehicleId: Yup.number()
                                        .min(1)
                                        .required('The customer type is required'),
                                    vehicleManufacturerId: Yup.number()
                                        .min(1)
                                        .required('The car manufacturer is required'),
                                    carPlate: Yup.string()
                                        .max(255)
                                        .required('The color field is required'),

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
                                            <FormControl fullWidth>


                                                <InputLabel id="vehicleManufacturerId">Vehicle Manufacturer</InputLabel>
                                                <Select
                                                    error={Boolean(
                                                        touched?.vehicleManufacturerId && errors.vehicleManufacturerId
                                                    )}
                                                    fullWidth
                                                    helperText={touched?.vehicleManufacturerId && errors.vehicleManufacturerId}
                                                    id="vehicleManufacturerId"
                                                    labelId="vehicleManufacturerId"
                                                    disabled={details?.vehicleManufacturerId}
                                                    value={values?.vehicleManufacturerId}
                                                    label={'Vehicle Manufacturer'}
                                                    name='vehicleManufacturerId'
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                >
                                                    {
                                                        carManufactorerList.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6} >
                                            {values.vehicleManufacturerId && <FormControl fullWidth>


                                                <InputLabel id="vehicleId">Vehicle Model</InputLabel>
                                                <Select
                                                    error={Boolean(
                                                        touched?.vehicleId && errors.vehicleId
                                                    )}
                                                    fullWidth
                                                    helperText={touched?.vehicleId && errors.vehicleId}
                                                    id="vehicleId"
                                                    labelId="vehicleId"
                                                    disabled={details?.vehicleId}
                                                    value={values?.vehicleId}
                                                    label={'Vehicle Model'}
                                                    name='vehicleId'
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                >
                                                    {
                                                        carModelList.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                                                    }
                                                </Select>
                                            </FormControl>}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.color && errors.color
                                                )}
                                                fullWidth
                                                helperText={touched?.color && errors.color}
                                                label={'color'}
                                                name="color"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values?.color}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.carPlate && errors.carPlate
                                                )}
                                                fullWidth
                                                helperText={touched?.carPlate && errors.carPlate}
                                                label={'carPlate'}
                                                name="carPlate"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values?.carPlate}
                                                variant="outlined"
                                            />
                                        </Grid>

                                    </Grid>
                                    <Divider style={{ marginBottom: 20 }} />

                                    <Divider />
                                    <Grid container style={{ margin: '20px 0px' }} direction={!is_small_screen ? 'row' : 'column-reverse'} alignItems="center">
                                        <Button
                                            type="submit"
                                            startIcon={
                                                isSubmitting ? <CircularProgress size="1rem" /> : null
                                            }
                                            disabled={Boolean(errors.submit) || isSubmitting}
                                            variant="contained"
                                            style={{ width: is_small_screen && '100%', marginRight: 10 }}
                                        >
                                            Save
                                        </Button>
                                    </Grid>
                                </form>
                            )}
                        </Formik>}
                    </Card>
                </Grid>
            </Grid >
        </>
    )
}

export default UpdateVehicleDetails