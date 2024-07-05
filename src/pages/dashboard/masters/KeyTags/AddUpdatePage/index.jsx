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
import Bookings from '../../Booking';
import SuspenseLoader from 'src/components/layouts/SuspenseLoader';

const AddUpdatePage = ({ addNew }) => {
    const { checkPermission } = useCheckPermission();
    let details = useLocation().state
    const theme = useTheme()
    const { toast } = useToast()
    const navigate = useNavigate()
    const {id} = useParams()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
    const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
    const targetId = details?.id
    const [loading, setLoading] = useState(true)
    const [branches, setBranches] = useState([])
    const [realDetail, setRealDetail] = useState()

    const onCreate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
        if (!checkPermission('KEY_TAG:CREATE')) return true;
        try {
            await adminService.addKeyTag(formData)
            toast('Key Tag create successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.KEY_TAG.ROOT.ABSOLUTE, { replace: true })
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            // toast(error.response.data.message, 'error')
            setSubmitting(false);
            console.log(err);
        }
    }

    const getBranches = async () => {
        try {
            const response = await adminService.getParkingLocations({ offset: 0, limit: 10000 })
            setBranches(response.data.data)
        } catch (err) {
            toast('Error on get parking locations', 'error')
            console.log(err);
        }

    }

    useEffect(() => {
        getBranches()
    }, [])

    const getDetails = async () => {
        try {
            setLoading(true)
            const response = await adminService.getKeyTag(id)
            setRealDetail(response.data.data)
            setLoading(false)
        }catch(err) {
            toast(err.response.data.message)
            console.log(err)
            setLoading(false)
        }
        
    }

    useEffect(() => {
        if (!addNew) {
            getDetails()
        }else {
            setLoading(false)
        }
    }, [])

    const onUpdate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
        if (!checkPermission('KEY_TAG:UPDATE')) return true;
        try {
            await adminService.updateKeyTag(id, formData)
            toast('Key Tag update successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.KEY_TAG.ROOT.ABSOLUTE, { replace: true })
        } catch (error) {
            toast(error.response.data.message, 'error')
            setSubmitting(false);
            console.log(error);
        }
    }

    return (
        <>
            <Grid container padding={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {addNew ? 'Add new Key Tag' : 'Update Key Tag'}
                    </Typography>
                </Grid>
            </Grid>
            {loading ? <SuspenseLoader /> :<Grid container p={2} spacing={2}>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <Typography variant='subtitle2' marginBottom='20px'>
                        {addNew ? 'Fill out form below to add your Key Tag' : 'Fill out form below to update your Key Tag'}
                    </Typography>
                    <Card style={{ padding: '25px' }}>
                        <Formik
                            initialValues={{
                                code: realDetail?.code || ''
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    code: Yup.number()
                                        .required('code field is required'),
                                    
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
                                    <Grid container spacing={3} marginBottom={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.code && errors.code
                                                )}
                                                fullWidth
                                                helperText={touched?.code && errors.code}
                                                label={'Code'}
                                                name="code"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.code}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
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
                <Grid xs={12} sm={12} md={2} lg={2} xl={2} item >
                    {realDetail?.medias?.length && <Typography variant='subtitle2' marginBottom='20px'>
                        Identifier QR code
                    </Typography>}
                    {realDetail?.medias?.length && <Card style={{ padding: '25px' }}>
                        {realDetail?.medias?.map((media, index) => {
                            return <img alt={realDetail?.code} src={media.url} key={'media-' + index} width={"100%"} />
                        })}
                    </Card>}
                </Grid>

                {!addNew && <Grid xs={12} pt={10} item>
                    <Grid xs={12}>
                        <Typography variant="h3" component="h3" gutterBottom>
                            Bookings
                        </Typography>
                    </Grid>
                    <Bookings fromOthers={true} filterKey={'keyTagId'} filterId={id} />
                </Grid>}
            </Grid>}
        </>
    )
}

export default AddUpdatePage