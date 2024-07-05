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
    styled,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useToast from 'src/hooks/useToast'
import CustomButton from "src/components/CustomButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { useCheckPermission } from 'src/hooks/useCheckPermission';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import SuspenseLoader from 'src/components/layouts/SuspenseLoader';
import ImagePicker from 'src/components/ImagePicker';
import { UploadFileOutlined } from '@mui/icons-material';
import FilePicker from 'src/components/FilePicker';


Yup.addMethod(Yup.string, 'phoneValidation', function ({errorMessage, value}) {
    return this.test('phoneValidation', errorMessage, function() {
        const {path, createError} = this
        console.log('error', value, path)
        if(!String(value).startsWith('+965')) {
            return createError({path, message: 'phone number is limited to Kuwait(+965) numbers!'})
        }
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
    const [phone, setPhone] = useState('')
    const [readDetail, setRealDetail] = useState()
    const [loading, setLoading] = useState(true)
    const [tempId, setTempId] = useState()
    const [, setDisconnectLogoImageIds] = useState([])
    const [, setDisconnectBannerImageIds] = useState([])
    const [imageIds,setImageIds] = useState([])

    const onCreate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {

        formData['phone'] = phone
        formData['tempTargetId'] = tempId

        if (!checkPermission('COMPANY:CREATE')) return true;
        try {
            await adminService.addCompany(formData)
            toast('Company create successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.COMPANY.ROOT.ABSOLUTE, { replace: true })
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            setSubmitting(false);
            console.log(err);
        }
    }

    const onUpdate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
        formData['phone'] = phone

        if (!checkPermission('COMPANY:UPDATE')) return true;
        try {
            await adminService.updateCompany(id, formData)
            toast('Company update successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.COMPANY.ROOT.ABSOLUTE, { replace: true })
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            setSubmitting(false);
            console.log(err);
        }
    }

    const getRndInteger = (min, max) => {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    const getDetail = async () => {
        try {
            setLoading(true)
            const response = await adminService.getCompany(id)
            setRealDetail(response.data.data)
            setPhone(response?.data?.data?.phone)
            setLoading(false)
        } catch (err) {
            toast('Error on fetch details!', 'error')
            console.log(err);
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!addNew) {
            getDetail()
        }
        else {
            let random = getRndInteger(1000000,10000000)
            random = random * -1
            console.log(random)
            setTempId(random)
            setLoading(false)
        }
    }, [])

    //**** render map if location exist or updated 

    return (
        <>
            <Grid container padding={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {addNew ? 'Add new Company' : 'Update Company'}
                    </Typography>
                </Grid>
            </Grid>
            {loading ? <SuspenseLoader /> :<Grid container p={2} direction={!isMediumScreen ? 'row' : 'column-reverse'}>
                <Grid xs={12} sm={12} md={12} lg={8} xl={8} item>
                    <Typography variant='subtitle2' marginBottom='20px'>
                        {addNew ? 'Fill out form below to add Company' : 'Fill out form below to update Company'}
                    </Typography>
                    <Card style={{ padding: '25px' }}>
                        <Formik
                            initialValues={{
                                name: readDetail?.name || '',
                                contactPerson: readDetail?.contactPerson || '',
                                description: readDetail?.description || '',
                                phone: readDetail?.phone || '+965',
                                email: readDetail?.email || '',
                                cardNumber: readDetail?.cardNumber || '',
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    name: Yup.string()
                                        .max(255)
                                        .required('The name field is required'),
                                    email: Yup.string()
                                        .email()
                                        .required('The email field is required'),
                                    contactPerson: Yup.string()
                                        .max(255)
                                        .required('The contactPerson field is required'),
                                    description: Yup.string()
                                        .optional(),
                                    cardNumber: Yup.string().required('The Card Number field is requried'),
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
                                                    touched?.email && errors.email
                                                )}
                                                fullWidth
                                                required
                                                helperText={touched?.email && errors.email}
                                                label={'email'}
                                                name="email"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.email}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.contactPerson && errors.contactPerson
                                                )}
                                                fullWidth
                                                required
                                                helperText={touched?.contactPerson && errors.contactPerson}
                                                label={'Contact Person'}
                                                name="contactPerson"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.contactPerson}
                                                type="contactPerson"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.cardNumber && errors.cardNumber
                                                )}
                                                fullWidth
                                                required
                                                helperText={touched?.cardNumber && errors.cardNumber}
                                                label={'Card Number'}
                                                name="cardNumber"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.cardNumber}
                                                type="cardNumber"
                                                variant="outlined"
                                            />
                                        </Grid>
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
                <Grid xs={12} sm={12} md={12} lg={4} xl={4} item p={1} pt={5}>
                    {/* <Card style={{ padding: '25px'}}>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            fullWidth
                            startIcon={<UploadFileOutlined />}
                            >
                            Upload file
                            <VisuallyHiddenInput type="file" onChange={(x) => console.log(x)}/>
                        </Button>
                    </Card> */}

                    <FilePicker imageStates={{
                            setDisconnectImageIds: setDisconnectLogoImageIds,
                            imageIds: details?.medias || [],
                            setImageIds: setImageIds,
                        }}
                        addNew={addNew}
                        entity="companies"
                        entityId={addNew ? tempId : details?.id}
                        singlePicker={true}
                        canDelete={false}
                        title='Attachment'
                        wrapperStyle={{ marginTop: '30px' }}/>
                    
                    {/* <ImagePicker
                        imageStates={{
                            setDisconnectImageIds: setDisconnectLogoImageIds,
                            imageIds: details?.medias || [],
                            setImageIds: setImageIds,
                        }}
                        aspectRatio={1}
                        addNew={addNew}
                        entity="companies"
                        entityId={addNew ? tempId : details?.id}
                        singlePicker={true}
                        canDelete={false}
                        title='Upload Image (Replace)'
                        wrapperStyle={{ marginTop: '30px' }}
                    /> */}
                </Grid>
            </Grid >}
        </>
    )
}



const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

export default AddUpdatePage