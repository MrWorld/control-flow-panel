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
    Switch,
    FormHelperText,
    Autocomplete,
    ListSubheader,
    InputAdornment,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useToast from 'src/hooks/useToast'


import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { useCheckPermission } from 'src/hooks/useCheckPermission';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { SearchOutlined } from '@mui/icons-material';

const containsText = (value, searchText) => {
    console.log(value)
    return value.code.toLowerCase().indexOf(searchText?.toLowerCase()) > -1;
} 

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
    const [isPhoneValid, setIsPhoneValid] = useState(false)
    const [phoneValidationEroor, setPhoneValidationError] = useState(null)
    const [searchText, setSearchText] = useState("");
    const [hasPrePaidOption, setHasPrePaidOption] = useState(true)
    const [isOnLoad, setIsOnLoad] = useState(false)
    const [companies, setCompanies] = useState([])
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [cardNumber, setCardNumber] = useState(null)
    // const [selectedOption, setSelectedOption] = useState(availableKeyTags[0]);
    const displayedOptions = useMemo(
        () => availableKeyTags.filter((option) => containsText(option, searchText)),
        [searchText]
      );
    const formRef = useRef(null);
    const searchRef = useRef(null);





    const handlePrePaidDataModel = (paymentMethodId) => {
        let paymentMethodData = {
            prePaidNote: prePaidNote,
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
            case 'Validation':
                delete paymentMethodData.unpaidPassword
                delete paymentMethodData.subscriptionNumber
                paymentMethodData.validationNumber = validationNumber
                break;
            case 'Subscription':
                paymentMethodData.subscriptionNumber = subscriptionNumber
                delete paymentMethodData.unpaidPassword
                delete paymentMethodData.validationNumber
                break;
        }

        return paymentMethodData
    }


    const onCreate = async (formData, resetForm, setErrors, setStatus, setSubmitting, WhereToGo = null) => {
        phoneValidationAndSet(phone)
        if (!matchIsValidTel(phone)) {
            toast('phone number is not valid', 'error')
        } else {

            const clonedFormData = structuredClone(formData)
            clonedFormData['phone'] = phone
            clonedFormData['customerTypeId'] = +formData['customerTypeId']
            clonedFormData['prePaid'] = checkedPrePaid
            const paymentMethodId = +structuredClone(formData['paymentMethodId'])
            if(checkedPrePaid) {
                const setPaymentMethodDataModel = handlePrePaidDataModel(paymentMethodId)
                clonedFormData['paymentMethodId'] = paymentMethodId
                if(setPaymentMethodDataModel.cardNumber) clonedFormData['cardNumber'] = setPaymentMethodDataModel.cardNumber
                if(setPaymentMethodDataModel.prePaidNote) clonedFormData['prePaidNote'] = setPaymentMethodDataModel.prePaidNote
                if(setPaymentMethodDataModel.companyId) clonedFormData['companyId'] = setPaymentMethodDataModel.companyId
                if(setPaymentMethodDataModel.subscriptionNumber) clonedFormData['subscriptionNumber'] = setPaymentMethodDataModel.subscriptionNumber
                if(setPaymentMethodDataModel.unpaidPassword) clonedFormData['unpaidPassword'] = setPaymentMethodDataModel.unpaidPassword
                if(setPaymentMethodDataModel.validationNumber) clonedFormData['validationNumber'] = setPaymentMethodDataModel.validationNumber
            }else {
                delete clonedFormData['paymentMethodId']
            }
            if (!checkPermission('BOOKING:CREATE')) return true;
            try {
                setIsOnLoad(true)
                const booking = await adminService.addBooking(clonedFormData)
                toast('Book create successful!', 'success')
                setSubmitting(false);
                resetForm();
                setPhone('')
                setStatus({ success: true });
                if (checkedPrePaid) {
                    setSubmitting(false);
                    setIsOnLoad(false)
                    setSelectedCompany(null)
                    setCardNumber(null)
                    getAvailableKeyTags()

                }else {
                    setIsOnLoad(false)
                    getAvailableKeyTags()

                }

                if(WhereToGo == 'UpdateVehicleDetails') {
                    console.log('this was created booking',booking)
                    navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.BOOKING.UPDATE_VEHICLE.ROOT.ABSOLUTE, { state: {...booking.data.data, isStandAlone: true} })
                    setSubmitting(false);
                    setIsOnLoad(false)
                }

                if(WhereToGo == 'Print') {
                    console.log('this was created booking',booking)
                    navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.BOOKING.PRINT_BY_DATA(booking.data.data.id).ABSOLUTE, { state: {...booking.data.data} })
                    setSubmitting(false);
                    setIsOnLoad(false)
                }

            } catch (err) {
                toast(err?.response?.data?.message || 'Network Error!', 'error')
                // toast('err in Creating Book!', 'err')
                setSubmitting(false);
                setIsOnLoad(false)
                console.log(err);
            }
        }



    }

    const onUpdate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
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


    const handleSelectCustomerType = (handleChange, value) => {
        handleChange(value)
        console.log('value is ', value.target.value)
        let temp = structuredClone(customerTypes)
        temp = temp.find(x => x.id == +(value.target.value))
        if(!temp.canPrePaid) {
            setHasPrePaidOption(false)
            setCheckedPrePaid(false)
        }else {
            setHasPrePaidOption(true)
        }
    }

    const getPaymentMethods = async () => {
        if(!checkPermission('PAYMENT_METHOD:READ')) return
        try {
            const response = await adminService.getPaymentMethods({ offset: 0, limit: 1000 })
            setPaymentMethods(response.data.data)
        } catch (err) {
            toast('Error on fetch payment methods!', 'error')
            console.log(err);
        }
    }

    const handleClickOnSubm = async() => {
        console.log(formRef)
        const validate = await formRef.current.validateForm()
        console.log(validate)
        setIsOnLoad(true)
        // await formRef.current.setTouched()
        if(!formRef.current.isValid) {
            console.log(formRef.current.errors)
            toast(`field ${Object.keys(formRef.current.errors)[0]} is required!`, 'warning')
            setIsOnLoad(false)
        }else {
            const WhereToGo = 'UpdateVehicleDetails'
            await onCreate(formRef.current.values, formRef.current.resetForm, formRef.current.setErrors, formRef.current.setStatus, formRef.current.setSubmitting, WhereToGo)
            setIsOnLoad(false)
        }
    }

    const handleClickOnSubmPrint = async() => {
        console.log(formRef)
        const validate = await formRef.current.validateForm()
        console.log(validate)
        setIsOnLoad(true)
        // await formRef.current.setTouched()
        if(!formRef.current.isValid) {
            toast(`field ${Object.keys(formRef.current.errors)[0]} is required!`, 'warning')
            setIsOnLoad(false)
        }else {
            const WhereToGo = 'Print'
            await onCreate(formRef.current.values, formRef.current.resetForm, formRef.current.setErrors, formRef.current.setStatus, formRef.current.setSubmitting, WhereToGo)
            setIsOnLoad(false)
        }
    }

    const getCompanies = async () => {
        try {
          const response = await adminService.getCompanies({ offset: 0, limit: 1000 })
          setCompanies(response.data.data)
        } catch (err) {
          toast('Error on fetch company list', 'error')
          console.log(err);
        }
      }

    useEffect(() => {
        getPaymentMethods()
        getAvailableKeyTags()
        getCustomerTypes()
        getCompanies()
    }, [])

    const phoneValidationAndSet = (x) => {

        let validations = {
            isValid: true,
            text: ''
        }

        setPhone(x)

        const validation = matchIsValidTel(x)
        if (validation) {
            validations.isValid = true
            validations.text = null
        } else {
            validations.isValid = false
            validations.text = 'invalid phone number'
        }

        console.log(validations)

        setIsPhoneValid(validations.isValid)
        setPhoneValidationError(validations.text)
    }
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
                            innerRef={formRef}
                            initialValues={{
                                name: details?.name || '',
                                customerTypeId: customerTypes[0]?.id || 1,
                                keyTagId: details?.keyTagId || null,
                                paymentMethodId: details?.paymentMethodId || 2,
                                phone: details?.phone || '+965',
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    name: Yup.string()
                                        .max(255)
                                        .optional(),
                                    customerTypeId: Yup.number()
                                        .min(1, 'The customer type is required')
                                        .required('The customer type is required'),
                                    keyTagId: Yup.number()
                                        .min(1)
                                        .required('The key tag is required'),
                                    paymentMethodId: Yup.number()
                                        .min(1)
                                        .optional(),
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
                                        <Grid item xs={12} md={12}>
                                            <FormControl>
                                                <FormLabel id="customerTypeId" required={true} error={Boolean(
                                                    touched?.customerTypeId && errors.customerTypeId
                                                )}
                                                    helperText={touched?.customerTypeId && errors.customerTypeId}>Customer Type</FormLabel>
                                                <RadioGroup
                                                    required
                                                    row
                                                    aria-labelledby="customerTypeId"
                                                    name="customerTypeId"
                                                    onChange={(x) => { handleSelectCustomerType(handleChange, x)}}
                                                    value={values.customerTypeId}
                                                >
                                                    {
                                                        customerTypes?.map((types) => {
                                                            return <FormControlLabel value={types.id} control={<Radio />} label={types.name} key={types.id} />
                                                        })
                                                    }
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6} >
                                            <FormControl fullWidth required>
                                                {details?.keyTagId ?
                                                    <TextField
                                                        fullWidth
                                                        disabled={true}
                                                        label={'Key Tag'}
                                                        value={values?.keyTagId}
                                                        variant="outlined" />
                                                    :
                                                    <>
                                                        <FormControl fullWidth required>
                                                            <InputLabel id="search-select-label">Key Tag</InputLabel>
                                                            <Select
                                                            // Disables auto focus on MenuItems and allows TextField to be in focus
                                                                error={Boolean(
                                                                    touched?.keyTagId && errors.keyTagId
                                                                )}
                                                                required
                                                                helperText={touched?.keyTagId && errors.keyTagId}
                                                                MenuProps={{ autoFocus: true }}
                                                                labelId="search-select-label"
                                                                id="keyTagId"
                                                                value={values?.keyTagId}
                                                                label="KeyTag"
                                                                name="keyTagId"
                                                                fullWidth
                                                                onChange={handleChange}
                                                                onClose={handleBlur}
                                                            >
                                                            <ListSubheader sx={{p: 0}}>
                                                                <TextField
                                                                size="small"
                                                                inputRef={searchRef}
                                                                autoFocus
                                                                placeholder="Type to search..."
                                                                fullWidth
                                                                InputProps={{
                                                                    type: 'number',
                                                                    inputMode: 'numeric',
                                                                    pattern: '[0-9]*',
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <SearchOutlined />
                                                                        </InputAdornment>
                                                                    )
                                                                }}
                                                                onChange={(e) => setSearchText(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key != "Escape") {
                                                                        e.stopPropagation();
                                                                    }
                                                                }}
                                                                />
                                                            </ListSubheader>
                                                            {searchText.length ? displayedOptions.map((option, i) => (
                                                                <MenuItem key={i} value={option.id}>
                                                                {option.code}
                                                                </MenuItem>
                                                            )) : availableKeyTags.map((option, i) => (
                                                                <MenuItem key={i} value={option.id}>
                                                                {option.code}
                                                                </MenuItem>
                                                            ))}
                                                            </Select>
                                                        </FormControl>
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
                                            <FormControl fullWidth>


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
                                                    variant='outlined'
                                                    onlyCountries={['KW']}
                                                />
                                            </FormControl>

                                        </Grid>

                                    </Grid>
                                    <Divider style={{ marginBottom: 20 }} />
                                    {hasPrePaidOption ? <Grid item xs={12}>
                                        {paymentMethods?.length ?
                                        
                                        <FormControl>
                                            <FormLabel id="pre paid">Pre Paid</FormLabel>
                                            <Switch label={'pre paid'} checked={checkedPrePaid} onChange={(x) => setCheckedPrePaid(x.target.checked)} color="primary" />

                                        </FormControl>
                                        : <></>}
                                        

                                    </Grid>: <></>}

                                    {checkedPrePaid && <Grid xs={12} style={{ marginBottom: 30 }}>
                                        <Grid xs={12} >
                                            <FormControl>
                                                <FormLabel id="paymentMethod">Payment Method</FormLabel>
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
                                            structuredClone(paymentMethods).find(x => x.id == +(values.paymentMethodId))?.name == 'Voucher' ? <>
                                            <Grid item xs={12} md={6} style={{marginBottom: 10}}>
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
                                            <Grid item xs={12} md={6} style={{ marginBottom: 10 }}>
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
                                            structuredClone(paymentMethods).find(x => x.id == +(values.paymentMethodId))?.name == 'Validation' ? <>
                                            
                                            <Grid item xs={12} md={6} style={{ marginBottom: 10 }}>
                                                <TextField
                                                fullWidth
                                                label={'Validation Number'} 
                                                name="validationNumber"
                                                onBlur={handleBlur}
                                                required
                                                onChange={(x) => setValidationNumber(x.target.value)}
                                                value={validationNumber}
                                                variant="outlined"
                                                />
                                            </Grid>
                                            </>: <></>
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
                                            loading={isOnLoad}
                                            disabled={Boolean(errors.submit) || isSubmitting || isOnLoad}
                                            variant="contained"
                                            style={{ width: is_small_screen && '100%', marginRight: 10 }}
                                        >
                                            Submit & Create New
                                        </Button>
                                        <Button
                                            onClick={handleClickOnSubm}
                                            type='button'
                                            startIcon={
                                                isSubmitting ? <CircularProgress size="1rem" /> : null
                                            }
                                            loading={isOnLoad}
                                            disabled={Boolean(errors.submit) || isSubmitting || isOnLoad}
                                            variant="outlined"
                                            style={{ width: is_small_screen && '100%', marginRight: 10 }}
                                        >
                                            Enter Vehicle Details
                                        </Button>
                                        <Button
                                            onClick={handleClickOnSubmPrint}
                                            startIcon={
                                                isSubmitting ? <CircularProgress size="1rem" /> : null
                                            }
                                            loading={isOnLoad}
                                            disabled={Boolean(errors.submit) || isSubmitting || isOnLoad}
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