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
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs'
import SuspenseLoader from 'src/components/layouts/SuspenseLoader';


Yup.addMethod(Yup.string, 'phoneValidation', function ({errorMessage, value}) {
    return this.test('phoneValidation', errorMessage, function() {
        const {path, createError} = this
        console.log('error', value, path)
        if(!String(value).startsWith('+965')) {
            return createError({path, message: 'phone number is limited to Kuwait(+965) numbers!'})
        }
        console.log('validation', matchIsValidTel(value))
        if(!value || !matchIsValidTel(value)) {
            console.log('am i here ?')
            return createError({path, message: errorMessage})
        }

        return true
    })
})

const AddUpdatePage = ({ addNew }) => {
    const { checkPermission } = useCheckPermission();
    const details = useLocation().state
    const [realDetails, setRealDetail] = useState()
    const theme = useTheme()
    const { toast } = useToast()
    const navigate = useNavigate()
    const {id} = useParams()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
    const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
    const targetId = details?.id
    const [paymentMethods, setPaymentMethods] = useState([])
    const [loading, setLoading] = useState(true)
    const [phone, setPhone] = useState(details?.phone || '+965')
    const [toDate, setToDate] = useState(details?.toDate || dayjs().add(30, 'days'))
    const [fromDate, setFromDate] = useState(details?.fromDate || dayjs())

    const onCreate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
        if (!checkPermission('SUBSCRIPTION:CREATE')) return true;

        formData['toDate'] = dayjs(toDate)
        formData['fromDate'] = dayjs(fromDate)
        formData['phone'] = phone
		formData['paymentMethodId'] = 1;


        try {
            await adminService.addSubscriptions(formData)
            toast('Subscription create successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.SUBSCRIPTION.ROOT.ABSOLUTE, { replace: true })
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            setSubmitting(false);
            console.log(err);
        }
    }

    const getPaymentMethods = async () => {
        try {
            const response = await adminService.getPaymentMethods({ offset: 0, limit: 10000 })
            setPaymentMethods(response.data.data)
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            // toast('Error on get Payment Methods', 'error')
            console.log(err);
        }

    }

    const getDetails = async() => {
        try {
            setLoading(true)
            const response = await adminService.getSubscription(id)
            setRealDetail(response.data.data)
            setPhone(response.data.data.phone)
            setToDate(response.data.data.toDate)
            setFromDate(response.data.data.fromDate)
            setLoading(false)
        }catch(err) {
            toast(err.response.data.message, 'error')
            setLoading(false)
        }
    }

    useEffect(() => {
        if(!addNew) {getDetails()}
        else {setLoading(false)}
        
        getPaymentMethods()
    }, [])

    const paymentTypes = [
        { value: 'CASH', name: 'Cash' },
        { value: 'PAYMENTMETHOD', name: 'KNet' },
    ]


    const onUpdate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
        if (!checkPermission('SUBSCRIPTION:UPDATE')) return true;

        formData['toDate'] = dayjs(toDate)
        formData['fromDate'] = dayjs(fromDate)
        formData['phone'] = phone
        formData['paymentMethodId'] = 1;
        try {
            await adminService.updateSubscriptions(id, formData)
            toast('Subscription update successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.SUBSCRIPTION.ROOT.ABSOLUTE, { replace: true })
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            // toast('Error in updating Subscription!', 'error')
            setSubmitting(false);
            console.log(err);
        }
    }

    return (
        <>
            <Grid container padding={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {addNew ? 'Add new Subscription' : 'Update Subscription'}
                    </Typography>
                </Grid>
            </Grid>
            {loading ? <SuspenseLoader /> :<Grid container p={2} direction={!isMediumScreen ? 'row' : 'column-reverse'}>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <Typography variant='subtitle2' marginBottom='20px'>
                        {addNew ? 'Fill out form below to add your Subscription' : 'Fill out form below to update your Subscription'}
                    </Typography>
                    <Card style={{ padding: '25px' }}>
                        <Formik
                            initialValues={{
                                name: realDetails?.name || '',
                                value: realDetails?.value || '',
                                paymentMethodId: realDetails?.paymentMethodId || '',
                                paymentType: realDetails?.paymentType || '',
                                comment: realDetails?.comment || '',
                                phone: realDetails?.phone || '+965',
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    value: Yup.number()
                                        .min(1)
                                        .required('The value field is required'),
                                    comment: Yup.string()
                                        .optional(),
                                    name: Yup.string()
                                        .required(),
                                    paymentType: Yup.string()
                                        .required(),
                                    // paymentMethodId: Yup.number()
                                    //     .required('Payment Method field is required'),
                                    phone: Yup.string().phoneValidation({errorMessage: "The Phone Number Field should be a valid phone", value: phone}),
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
                                                label={'name'}
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.name}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth
                                                
                                                error={Boolean(
                                                    touched?.paymentType && errors.paymentType
                                                )}>
                                                <InputLabel id="paymentType">Payment Type</InputLabel>
                                                <Select
                                                    fullWidth
                                                    id="paymentType"
                                                    labelId="paymentType"
                                                    value={values.paymentType}
                                                    label={'Payment Method'}
                                                    name='paymentType'
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    onBlur={handleBlur}
                                                >
                                                    {
                                                        paymentTypes.map(item => <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>)
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {/* <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="paymentMethodId">Payment Method</InputLabel>
                                                <Select
                                                    fullWidth
                                                    id="paymentMethodId"
                                                    labelId="paymentMethodId"
                                                    value={values.paymentMethodId}
                                                    label={'Payment Method'}
                                                    name='paymentMethodId'
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                >
                                                    {
                                                        paymentMethods.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid> */}
                                        <Grid item xs={12} md={6}>
                                            <MuiTelInput
                                                onChange={setPhone}
                                                error={Boolean(
                                                    touched?.phone && errors.phone
                                                )}
                                                fullWidth
                                                required
                                                name='phone'
                                                label={'phone'}
                                                onBlur={handleBlur}
                                                helperText={touched?.phone && errors.phone}
                                                value={phone}
                                                defaultCountry='KW'
                                                onlyCountries={['KW']}
                                                variant='outlined'
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
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.value && errors.value
                                                )}
                                                fullWidth
                                                helperText={touched?.value && errors.value}
                                                label={'Value'}
                                                name="value"
                                                type='number'
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.value}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.comment && errors.comment
                                                )}
                                                fullWidth
                                                helperText={touched?.comment && errors.comment}
                                                label={'comment'}
                                                name="comment"
                                                type='string'
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.comment}
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
            </Grid>}
        </>
    )
}

export default AddUpdatePage