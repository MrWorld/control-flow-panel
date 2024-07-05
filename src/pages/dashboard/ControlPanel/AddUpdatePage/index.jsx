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
    Switch,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useToast from 'src/hooks/useToast'


import { useCheckPermission } from 'src/hooks/useCheckPermission';
import { MuiTelInput } from 'mui-tel-input';


const AddUpdatePage = ({ addNew, formData }) => {
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
    const [checkedPrePaid, setCheckedPrePaid] = useState(false)
    const [selectedCustomerType, setSelectedCustomerType] = useState()
    const [paymentMethods, setPaymentMethods] = useState()
    const [prePaidNote, setPrePaidNote] = useState('')
    const [unPaidPassword, setUnPaidPassword] = useState('')
    const [subscriptionNumber, setSubscriptionNumber] = useState('')
    const [validationNumber, setValidationNumber] = useState('')


    const handlePrePaidDataModel = (booking, paymentMethodId) => {
        let paymentMethodData = {
            bookingId: booking.data.data.id,
            prePaidNote: prePaidNote,
            unpaidPassword: null,
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


    const onCreate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {



        formData['phone'] = phone
        formData['customerTypeId'] = +formData['customerTypeId']
        const paymentMethodId = +structuredClone(formData['paymentMethodId'])

        if (!checkPermission('BOOKING:CREATE')) return true;
        try {
            const booking = await adminService.addBooking(formData)
            toast('Book create successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            if (checkedPrePaid) {
                const data = {
                    bookingId: booking.data.data.id,
                    prePaid: checkedPrePaid,
                    prePaidNote: prePaidNote
                }
                await adminService.setPrePaid(data)

                const updatePaymentMethodData = {
                    bookingId: booking.data.data.id,
                    paymentMethodId: paymentMethodId
                }

                await adminService.updatePaymentMethod(updatePaymentMethodData)

                const setPaymentMethodDataModel = handlePrePaidDataModel(booking, paymentMethodId)

                console.log('paymentMethodData is here', setPaymentMethodDataModel)

                await adminService.setPaymentMethod(setPaymentMethodDataModel)

            }

            // navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.BOOKING.ROOT.ABSOLUTE, { replace: true })
        } catch (error) {
            toast('Error in Creating Book!', 'error')
            setSubmitting(false);
            console.log(error);
        }
    }

    const onUpdate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {

        // formData['phone'] = phone

        // if (!checkPermission('BOOKING:UPDATE')) return true;
        // try {
        //     await adminService.updateParkingLocations(targetId, formData)
        //     toast('Branch update successful!', 'success')
        //     setSubmitting(false);
        //     resetForm();
        //     setStatus({ success: true });
        //     navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.BOOKING.ROOT.ABSOLUTE, { replace: true })
        // } catch (error) {
        //     toast('Error in updating Branch!', 'error')
        //     setSubmitting(false);
        //     console.log(error);
        // }
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

    const getAvailableKeyTags = async () => {
        try {
            const response = await adminService.getAvailableKeyTags({ offset: 0, limit: 1000 })
            setAvailableKeyTags(response.data.data)
        } catch (err) {
            toast('Error on fetch available key tags!', 'error')
            console.log(err);
        }
    }


    const handleSelectCustomerType = (value) => {
        console.log('value is ', value)
        // setSelectedCustomerType
    }

    const getPaymentMethods = async () => {
        try {
            const response = await adminService.getPaymentMethods({ offset: 0, limit: 1000 })
            setPaymentMethods(response.data.data)
        } catch (err) {
            toast('Error on fetch payment methods!', 'error')
            console.log(err);
        }
    }

    useEffect(() => {
        getPaymentMethods()
        getAvailableKeyTags()
        getCustomerTypes()
    }, [])
    //**** render map if location exist or updated 


    return (
        <>
            <Grid container padding={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {addNew ? 'Add new Booking' : 'Update Booking'}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container p={2} direction={!isMediumScreen ? 'row' : 'column-reverse'}>
                <Grid xs={12} sm={12} md={12} lg={12} xl={8} item>
                    <Typography variant='subtitle2' marginBottom='20px'>
                        {addNew ? 'Fill out form below to add your Booking' : 'Fill out form below to update your Booking'}
                    </Typography>
                    <Card style={{ padding: '25px' }}>
                        <Formik
                            initialValues={{
                                name: details?.name || '',
                                customerTypeId: details?.customerTypeId || null,
                                keyTagId: details?.keyTagId || null,
                                // paymentMethodId: details?.paymentMethodId || null,
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    name: Yup.string()
                                        .max(255)
                                        .required('The name field is required'),
                                    customerTypeId: Yup.number()
                                        .min(1)
                                        .required('The customer type is required'),
                                    keyTagId: Yup.number()
                                        .min(1)
                                        .required('The key tag is required'),
                                    paymentMethodId: Yup.number()
                                        .min(1)
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
                                        <Grid item xs={12} md={12}>
                                            <FormControl>
                                                <FormLabel id="customerTypeId">Customer Type</FormLabel>
                                                {
                                                    (
                                                        errors.customerTypeId
                                                    ) && <div>error</div>
                                                }
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="customerTypeId"
                                                    name="customerTypeId"
                                                    onChange={handleChange}
                                                    value={values.customerTypeId}
                                                >
                                                    {
                                                        customerTypes?.map((types) => {
                                                            return <FormControlLabel value={+(types.id)} control={<Radio />} label={types.name} key={types.id} />
                                                        })
                                                    }
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6} >
                                            <FormControl fullWidth>


                                                {details?.keyTagId ?
                                                    <TextField

                                                        fullWidth
                                                        disabled={true}
                                                        label={'Key Tag'}
                                                        name="keyTagId"
                                                        value={details?.keyTag?.code}
                                                        variant="outlined" />
                                                    :
                                                    <>
                                                        <InputLabel id="keyTagId">Key Tag</InputLabel>
                                                        <Select
                                                            error={Boolean(
                                                                touched?.keyTagId && errors.keyTagId
                                                            )}
                                                            fullWidth
                                                            helperText={touched?.keyTagId && errors.keyTagId}
                                                            id="keyTagId"
                                                            labelId="keyTagId"
                                                            disabled={details?.keyTagId}
                                                            value={values?.keyTagId}
                                                            label={'Key Tag'}
                                                            name='keyTagId'
                                                            onChange={handleChange}
                                                            variant="outlined"
                                                        >
                                                            {
                                                                availableKeyTags.map(item => <MenuItem key={item.id} value={item.id}>{item.code}</MenuItem>)
                                                            }
                                                        </Select>
                                                    </>
                                                }
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.name && errors.name
                                                )}
                                                fullWidth
                                                helperText={touched?.name && errors.name}
                                                label={'Name'}
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.name}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <MuiTelInput
                                                onChange={(x) => setPhone(x)}
                                                value={phone}
                                                fullWidth
                                                defaultCountry='KW'
                                            />
                                        </Grid>

                                    </Grid>
                                    <Divider style={{ marginBottom: 20 }} />
                                    <Grid item xs={12}>
                                        <FormControl>
                                            <FormLabel id="pre paid">Pre Paid</FormLabel>
                                            <Switch label={'pre paid'} checked={checkedPrePaid} onChange={(x) => setCheckedPrePaid(x.target.checked)} color="primary" />

                                        </FormControl>

                                    </Grid>

                                    {checkedPrePaid && <Grid xs={12} style={{ marginBottom: 30 }}>
                                        <Grid xs={12} >
                                            <FormControl>
                                                <FormLabel id="paymentMethod">Payment Method</FormLabel>
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="paymentMethodId"
                                                    name="paymentMethodId"
                                                    onChange={(x) => { handleChange(x) && handleSelectCustomerType(x) }}
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
                                            structuredClone(paymentMethods).find(x => x.id == +(values.paymentMethodId))?.name == 'Unpaid' && <Grid item xs={12} md={6} style={{ marginBottom: 10 }}>
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
                                            structuredClone(paymentMethods).find(x => x.id == +(values.paymentMethodId))?.name == 'Subscription' && <Grid item xs={12} md={6} style={{ marginBottom: 10 }}>
                                                <TextField
                                                    fullWidth
                                                    label={'Subscription Number'}
                                                    name="subscriptionNumber"
                                                    onBlur={handleBlur}
                                                    onChange={(x) => setSubscriptionNumber(x.target.value)}
                                                    value={subscriptionNumber}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        }
                                        {
                                            structuredClone(paymentMethods).find(x => x.id == +(values.paymentMethodId))?.name == 'Validation' && <Grid item xs={12} md={6} style={{ marginBottom: 10 }}>
                                                <TextField
                                                    fullWidth
                                                    label={'Validation Number'}
                                                    name="validationNumber"
                                                    onBlur={handleBlur}
                                                    onChange={(x) => setValidationNumber(x.target.value)}
                                                    value={validationNumber}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        }

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label={'Note'}
                                                name="prePaidNote"
                                                onBlur={handleBlur}
                                                onChange={(x) => setPrePaidNote(x.target.value)}
                                                value={prePaidNote}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>}


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
                                            Submit & Create New
                                        </Button>
                                        <Button
                                            // type="submit"
                                            startIcon={
                                                isSubmitting ? <CircularProgress size="1rem" /> : null
                                            }
                                            disabled={true}
                                            variant="outlined"
                                            style={{ width: is_small_screen && '100%', marginRight: 10 }}
                                        >
                                            Enter Vehicle Details
                                        </Button>
                                        <Button
                                            // type="submit"
                                            startIcon={
                                                isSubmitting ? <CircularProgress size="1rem" /> : null
                                            }
                                            disabled={true}
                                            variant="outlined"
                                            style={{ width: is_small_screen && '100%', marginRight: 10 }}
                                        >
                                            Print Ticket
                                        </Button>
                                    </Grid>
                                </form>
                            )}
                        </Formik>
                    </Card>
                </Grid>
            </Grid >
        </>
    )
}

export default AddUpdatePage