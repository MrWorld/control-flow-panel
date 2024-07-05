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
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useToast from 'src/hooks/useToast'
import CustomButton from "src/components/CustomButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { useCheckPermission } from 'src/hooks/useCheckPermission';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import Bookings from '../../Booking';
import SuspenseLoader from 'src/components/layouts/SuspenseLoader';


Yup.addMethod(Yup.string, 'phoneValidation', function ({errorMessage, value}) {
    return this.test('phoneValidation', errorMessage, function() {
        const {path, createError} = this
        console.log('error', value, path)
        console.log('validation', matchIsValidTel(value))
        if(!value || !matchIsValidTel(value)) {
            return createError({path, message: errorMessage})
        }

        return true
    })
})

const AddUpdatePage = ({ addNew, formData }) => {
    const { checkPermission } = useCheckPermission();
    const details = useLocation().state
    const theme = useTheme()
    const {id} = useParams()
    const { toast } = useToast()
    const navigate = useNavigate()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
    const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
    const targetId = details?.id
    const [readDetail, setRealDetail] = useState()
    const [loading, setLoading] = useState(true)

    const onCreate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {



        if (!checkPermission('SERVICE:CREATE')) return true;
        try {
            await adminService.addService(formData)
            toast('Service create successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.SERVICE.ROOT.ABSOLUTE, { replace: true })
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            toast('Error in Creating service!', 'error')
            setSubmitting(false);
            console.log(err);
        }
    }

    const onUpdate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {


        if (!checkPermission('SERVICE:UPDATE')) return true;
        try {
            await adminService.updateService(id, formData)
            toast('Service update successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.SERVICE.ROOT.ABSOLUTE, { replace: true })
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            // toast('Error in updating Company!', 'error')
            setSubmitting(false);
            console.log(err);
        }
    }



    const getDetail = async () => {
        try {
            setLoading(true)
            const response = await adminService.getService(id)
            setRealDetail(response.data.data)
            setLoading(false)
        } catch (err) {
            toast('Error on fetch details!', 'error')
            console.log(err);
            setLoading(false)

        }
    }

    useEffect(() => {
        if (!addNew) getDetail()
        else {setLoading(false)}
    }, [])

    //**** render map if location exist or updated 

    return (
        <>
            <Grid container padding={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {addNew ? 'Add new Service' : 'Update Service'}
                    </Typography>
                </Grid>
            </Grid>
            {loading ? <SuspenseLoader /> :<Grid container p={2} >
                <Grid xs={12} sm={12} md={12} lg={12} xl={8} item>
                    <Typography variant='subtitle2' marginBottom='20px'>
                        {addNew ? 'Fill out form below to add your Service' : 'Fill out form below to update your Service'}
                    </Typography>
                    <Card style={{ padding: '25px' }}>
                        <Formik
                            initialValues={{
                                name: readDetail?.name || '',
                                genCost: readDetail?.genCost || 0,
                                vipCost: readDetail?.vipCost || 0,
                                description: readDetail?.description || '',
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    name: Yup.string()
                                        .max(255)
                                        .required('The name field is required'),
                                    genCost: Yup.number().required('The General Cost field is required'),
                                    vipCost: Yup.number().required('The VIP Cost field is required'),
                                    description: Yup.string()
                                        .optional(),
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
                                                    touched?.name && errors.name
                                                )}
                                                fullWidth
                                                helperText={touched?.name && errors.name}
                                                label={'Name'}
                                                name="name"
                                                required
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.name}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.genCost && errors.genCost
                                                )}
                                                fullWidth
                                                required
                                                type='number'
                                                helperText={touched?.genCost && errors.genCost}
                                                label={'General Cost'}
                                                name="genCost"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.genCost}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.vipCost && errors.vipCost
                                                )}
                                                fullWidth
                                                required
                                                type='number'
                                                helperText={touched?.vipCost && errors.vipCost}
                                                label={'VIP Cost'}
                                                name="vipCost"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.vipCost}
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
                                                label={'Internal Note'}
                                                name="description"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.description}
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
                {!addNew ? <Grid item xs={12}>
                    <Bookings fromOthers={true} filterKey={'services'} filterId={id}/>
                </Grid>: <></>}
            </Grid >}
        </>
    )
}

export default AddUpdatePage