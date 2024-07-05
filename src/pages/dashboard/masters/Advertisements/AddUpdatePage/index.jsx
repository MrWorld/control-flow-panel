import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { adminService } from 'src/api/services/admin';
import {
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
    Card,
    TextField,
    Divider,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useToast from 'src/hooks/useToast'
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { useCheckPermission } from 'src/hooks/useCheckPermission';
import { MuiTelInput } from 'mui-tel-input';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs'
import ImagePicker from 'src/components/ImagePicker';
import SuspenseLoader from 'src/components/layouts/SuspenseLoader';

const AddUpdatePage = ({ addNew }) => {
    const { checkPermission } = useCheckPermission();
    const [details, setDetails] = useState()
    const locationDetails = useLocation().state
    const theme = useTheme()
    const { toast } = useToast()
    const navigate = useNavigate()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
    const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
    const targetId = locationDetails?.id
    const [parkingLocations, setParkingLocations] = useState([])
    const [toDate, setToDate] = useState(locationDetails?.toDate || dayjs().add(30, 'days'))
    const [fromDate, setFromDate] = useState(locationDetails?.fromDate || dayjs())
    const [, setDisconnectLogoImageIds] = useState([])
    const [, setDisconnectBannerImageIds] = useState([])
    const [imageIds,setImageIds] = useState([])
    const logo = null
    const [logoIds, setLogoIds] = useState([])
    const [bannerIds, setBannerIds] = useState([])
    const [tempId, setTempId] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { id } = useParams()
    const advTypes = [
        { value: 'IMAGE', name: 'Image' },
        { value: 'VIDEO', name: 'Video' },
    ]



    const onCreate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {

        formData['toDate'] = dayjs(toDate)
        formData['fromDate'] = dayjs(fromDate)
        formData['duration'] = 1;
        formData['type'] = 'IMAGE';
        formData['tempTargetId'] = tempId


        try {
            await adminService.addAdvertisements(formData)
            toast('Subscription create successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.ADVERTISEMENT.ROOT.ABSOLUTE, { replace: true })
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            // toast('err in Creating Subscription!', 'err')
            setSubmitting(false);
            console.log(err);
        }
    }

    const getParkingLocation = async () => {
        try {
            const response = await adminService.getParkingLocations({ offset: 0, limit: 10000 })
            setParkingLocations(response.data.data)
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            // toast('Error on get Peyment Methods', 'error')
            console.log(err);
        }

    }

    useEffect(() => {
        getParkingLocation()
    }, [])


    const onUpdate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
        if (!checkPermission('BANNER:UPDATE')) return true;

        formData['toDate'] = dayjs(toDate)
        formData['fromDate'] = dayjs(fromDate)
        formData['duration'] = 1;
        formData['type'] = 'IMAGE';

        try {
            await adminService.updateAdvertisements(id, formData)
            toast('Advertisement update successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.ADVERTISEMENT.ROOT.ABSOLUTE, { replace: true })
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            // toast('Error in updating Advertisement!', 'error')
            setSubmitting(false);
            console.log(err);
        }
    }

    const getRndInteger = (min, max) => {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    const getDetails = async() => {
        try {
            const response = await adminService.getAdvertisement(id)
            setDetails(response.data.data)
            setIsLoading(false)
        }catch(err) {
            toast(err.response.data.message, 'error')
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if(addNew) {
            let random = getRndInteger(1000000,10000000)
            random = random * -1
            console.log(random)
            setTempId(random)
            setIsLoading(false)
        }
        else {
            setIsLoading(true)
            getDetails()
        }
    }, [])

    return (
        <>  
            {isLoading ? <SuspenseLoader ></SuspenseLoader> : <>
            <Grid container padding={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {addNew ? 'Add new Advertisement' : 'Update Advertisement'}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container p={2} direction={!isMediumScreen ? 'row' : 'column-reverse'}>
                <Grid xs={12} sm={12} md={12} lg={8} xl={8} item p={1}>
                    <Typography variant='subtitle2' marginBottom='20px'>
                        {addNew ? 'Fill out form below to add your Advertisement' : 'Fill out form below to update your Advertisement'}
                    </Typography>
                    <Card style={{ padding: '25px' }}>
                        <Formik
                            initialValues={{
                                duration: details?.duration || '',
                                description: details?.description || '',
                                title: details?.title || '',
                                type: details?.type || '',
                                link: details?.link || '',
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    title: Yup.string()
                                        .required('The title field is required'),
                                    description: Yup.string()
                                        .optional(),
                                    // duration: Yup.number()
                                    //     .min(1)
                                    //     .required('The duration field is required'),
                                    // type: Yup.mixed()
                                    //     .oneOf(['IMAGE', 'VIDEO']),
                                    link: Yup.string()
                                        .required("Website should be a valid URL")
                                })
                            }
                            onSubmit={async (
                                _values,
                                { resetForm, setErrors, setStatus, setSubmitting }
                            ) => addNew
                                    ? onCreate(_values, resetForm, setErrors, setStatus, setSubmitting)
                                    : onUpdate(_values, resetForm, setErrors, setStatus, setSubmitting)
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
                                    <Grid container spacing={3} marginBottom={2} >
                                        {/* <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="type">Advertisement Type</InputLabel>
                                                <Select
                                                    fullWidth
                                                    id="type"
                                                    labelId="type"
                                                    value={values.type}
                                                    label={'Advertisement Type'}
                                                    name='type'
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                >
                                                    {
                                                        advTypes.map(item => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid> */}
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.title && errors.title
                                                )}
                                                fullWidth
                                                helperText={touched?.title && errors.title}
                                                label={'Title'}
                                                name="title"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.title}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <DatePicker
                                                    label={'From Date'}
                                                    name="fromDate"
                                                    fullWidth
                                                    onBlur={handleBlur}
                                                    onChange={(x) => setFromDate(x)}
                                                    value={dayjs(fromDate)}
                                                    variant="outlined"
                                                />
                                            </FormControl>

                                        </Grid>
                                        {/* <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.duration && errors.duration
                                                )}
                                                fullWidth
                                                helperText={touched?.duration && errors.duration}
                                                label={'Duration (s)'}
                                                name="duration"
                                                type='number'
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.duration}
                                                variant="outlined"
                                            />
                                        </Grid> */}
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <DatePicker
                                                    label={'To Date'}
                                                    name="toDate"
                                                    fullWidth
                                                    onBlur={handleBlur}
                                                    onChange={(x) => setToDate(x)}
                                                    value={dayjs(toDate)}
                                                    variant="outlined"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.link && errors.link
                                                )}
                                                fullWidth
                                                helperText={touched?.link && errors.link}
                                                label={'Link'}
                                                name="link"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.link}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.description && errors.description
                                                )}
                                                fullWidth
                                                helperText={touched?.description && errors.description}
                                                label={'Description'}
                                                name="description"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.description}
                                                variant="outlined"
                                            />
                                        </Grid>

                                    </Grid>
                                    {/* {
                                        !addNew && details?.medias?.length && details?.medias[0]?.url ? <Grid item xs={12}>
                                            <img src={details?.medias[0]?.url} width={'100%'}/>
                                        </Grid> : <></>
                                    } */}
                                    <Divider />
                                    <Grid container style={{ margin: '20px 0px' }} direction={!is_small_screen ? 'row' : 'column-reverse'} alignItems="center">
                                        <Button color="secondary" onClick={() => navigate(-1)}>
                                            {'Cancel'}
                                        </Button>
                                        <Button
                                            type="submit"
                                            startIcon={
                                                isSubmitting ? <CircularProgress size="1rem" /> : null
                                            }
                                            disabled={Boolean(errors.submit) || isSubmitting}
                                            variant="contained"
                                            style={{ width: is_small_screen && '100%' }}
                                        >
                                            Save
                                        </Button>
                                    </Grid>
                                </form>
                            )}
                        </Formik>
                    </Card>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={4} xl={4} item p={1}>
                    <ImagePicker
                        imageStates={{
                            setDisconnectImageIds: setDisconnectLogoImageIds,
                            imageIds: details?.medias || [],
                            setImageIds: setImageIds,
                        }}
                        aspectRatio={0.56}
                        addNew={addNew}
                        entity="advertisement"
                        entityId={addNew ? tempId : locationDetails?.id}
                        singlePicker={true}
                        canDelete={false}
                        title='Upload Image (Replace)'
                        wrapperStyle={{ marginTop: '30px' }}
                    />
                </Grid>
            </Grid>
            </>}
            
        </>
    )
}

export default AddUpdatePage