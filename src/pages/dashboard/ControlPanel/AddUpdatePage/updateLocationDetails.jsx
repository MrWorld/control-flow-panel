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


const UpdateLocationDetails = ({ addNew, formData, data, setClose }) => {
    const { checkPermission } = useCheckPermission();
    const details = useLocation().state
    const theme = useTheme()
    const { toast } = useToast()
    const navigate = useNavigate()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
    const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
    const targetId = details?.id
    const [availableKeyTags, setAvailableKeyTags] = useState([])
    const [readDetail, setRealDetail] = useState()
    const [parking, setCarManufactorerList] = useState([])
    const [parkingBlocks, setParkingBlocks] = useState([])
    const [parkingBranches, setParkingBranches] = useState([])

    const SubmitDetails = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
        formData['bookingId'] = +data?.id
        try {
            const response = await adminService.updateBookingLocation(formData)
            if (response) setClose()
        } catch (err) {
            console.log('error on updating location details', err)
            toast('error on updating booking location details', 'error')
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
        // if (details?.id) getDetail()
    }, [])

    const getBranches = async () => {
        try {
            const response = await adminService.getParkingLocations({ limit: 1000, offset: 0 })
            setParkingBranches(response.data.data)
        } catch (err) {
            console.log('error on fetch car manufacturer list', err)
            toast('error on fetch car manufacturer list', 'error')
        }
    }

    const getBlocks = async () => {
        try {
            const response = await adminService.getParkingBlock({ limit: 1000, offset: 0 })
            setParkingBlocks(response.data.data)
        } catch (err) {
            console.log('error on fetch car manufacturer list', err)
            toast('error on fetch car manufacturer list', 'error')
        }
    }


    useEffect(() => {
        getBlocks()
        getBranches()

    }, [])


    return (

        <>
            <Grid container p={0} direction={!isMediumScreen ? 'row' : 'column-reverse'} style={{width: '100%'}}>
                <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
                    <Typography variant='subtitle2' marginBottom='20px'>
                        {addNew ? 'Fill out form below to attach vehicle to booking' : 'Fill out form below to update booking vehicle details'}
                    </Typography>
                    <Card style={{ padding: '25px' }}>
                        {data?.BookingVehicle && <Formik
                            initialValues={{
                                parkingBlockId:  data?.BookingLocations[0]?.parkingBlockId || null,
                                branchId:  data?.keyTag?.branchId || null,
                                description: data?.BookingLocations[0]?.description || null,
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    parkingBlockId: Yup.number()
                                        .min(1)
                                        .required('The customer type is required'),
                                    branchId: Yup.number()
                                        .min(1)
                                        .required('The car manufacturer is required'),
                                    description: Yup.string()
                                        .max(255)
                                        .optional(),

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


                                                <InputLabel id="branchId">Branch</InputLabel>
                                                <Select
                                                    error={Boolean(
                                                        touched?.branchId && errors.branchId
                                                    )}
                                                    fullWidth
                                                    helperText={touched?.branchId && errors.branchId}
                                                    id="branchId"
                                                    labelId="branchId"
                                                    disabled={details?.branchId}
                                                    value={values?.branchId}
                                                    label={'Branch'}
                                                    name='branchId'
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                >
                                                    {
                                                        parkingBranches.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6} >
                                            <FormControl fullWidth>


                                                <InputLabel id="parkingBlockId">Parking Block</InputLabel>
                                                <Select
                                                    error={Boolean(
                                                        touched?.parkingBlockId && errors.parkingBlockId
                                                    )}
                                                    fullWidth
                                                    helperText={touched?.parkingBlockId && errors.parkingBlockId}
                                                    id="parkingBlockId"
                                                    labelId="parkingBlockId"
                                                    disabled={details?.parkingBlockId}
                                                    value={values?.parkingBlockId}
                                                    label={'Vehicle Model'}
                                                    name='parkingBlockId'
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                >
                                                    {
                                                        parkingBlocks.map(item => <MenuItem key={item.id} value={item.id}>{item?.floor?.name} - {item.initial}</MenuItem>)
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.description && errors.description
                                                )}
                                                fullWidth
                                                helperText={touched?.description && errors.description}
                                                label={'description'}
                                                name="description"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values?.description}
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

export default UpdateLocationDetails