import {
    Grid,
    Typography,
    TextField,
    useMediaQuery,
    useTheme,
    Button,
    CircularProgress,
    Divider,
    Card,
    InputAdornment
} from '@mui/material';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import useToast from 'src/hooks/useToast'
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { phoneRegExp } from '../../../../../../constants'
import { errorMessage } from 'src/utils/errorTypeDetector'


const AddUpdateForm = ({ targetAPI, addNew, details }) => {
    const { toast } = useToast()
    const navigate = useNavigate()
    const theme = useTheme()
    const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))

    const handleApiCall = async (data, resetForm, setStatus) => {
        if(data.email2 === '') delete data['email2']
        if(data.phoneNumber2 === '') delete data['phoneNumber2']
        
        try {
            await targetAPI(data)
            resetForm()
            setStatus({ success: true });
            toast(`Shop ${addNew ? 'created' : 'update'} successfully!`, 'success')
            if (addNew) navigate(-1)
            else navigate(ROUTE_CONSTANTS.DASHBOARD.LOGISTICS.SHOP.GET_BY_DATA(details.id).ABSOLUTE)
        } catch (error) {
            if(errorMessage(error)) toast(errorMessage(error), 'error')
            else toast(error, 'error')
        }
    }

    return (
        <>
            <Typography variant='subtitle2' marginBottom='20px'>
                {addNew ? 'Fill out form below to add your new shop' : 'Fill out form below to update your shop'}
            </Typography>
            <Card style={{ padding: '25px' }}>
                <Formik
                    initialValues={{
                        name: details?.name || '',
                        nameAr: details?.nameAr || '',
                        commission: details?.commission || '',
                        asap: details?.asap || '',
                        email1: details?.email1 || '',
                        email2: details?.email2 || '',
                        phoneNumber1: details?.phoneNumber1 || '',
                        phoneNumber2: details?.phoneNumber2 || '',
                    }}
                    validationSchema={
                        Yup.object().shape({
                            name: Yup.string()
                                .max(255)
                                .required('The name field is required'),
                            nameAr: Yup.string()
                                .max(255)
                                .required('The Arabic name field is required'),
                            commission: Yup.number()
                                .typeError('The commission field is required')
                                .integer()
                                .positive()
                                .min(0)
                                .max(100)
                                .required('The commission field is required'),
                            asap: Yup.number()
                                .typeError('The minimum delivery time field is required')
                                .integer()
                                .positive()
                                .min(1)
                                .required('The minimum delivery time field is required'),
                            email1: Yup.string()
                                .email('The email provided should be a valid email address')
                                .max(255)
                                .required('The email field is required'),
                            email2: Yup.string()
                                .email('The email provided should be a valid email address')
                                .max(255),
                            phoneNumber1: Yup
                                .string()
                                .matches(phoneRegExp, 'Paimary phone is not valid')
                                .required('The email field is required'),
                            phoneNumber2: Yup
                                .string()
                                .matches(phoneRegExp, 'Secondary phone is not valid')
                        })
                    }
                    onSubmit={async (
                        _values,
                        { resetForm, setStatus }
                    ) => handleApiCall(_values, resetForm, setStatus)}
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
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        error={Boolean(
                                            touched?.nameAr && errors.nameAr
                                        )}
                                        fullWidth
                                        helperText={touched?.nameAr && errors.nameAr}
                                        label={'Name Arabic'}
                                        name="nameAr"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.nameAr}
                                        variant="outlined"
                                        style={{direction: 'rtl'}}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        error={Boolean(
                                            touched?.commission && errors.commission
                                        )}
                                        fullWidth
                                        helperText={touched?.commission && errors.commission}
                                        label={'Commission'}
                                        name="commission"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.commission}
                                        variant="outlined"
                                        type='number'
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        error={Boolean(
                                            touched?.asap && errors.asap
                                        )}
                                        fullWidth
                                        helperText={touched?.asap && errors.asap}
                                        label={'As Soon As Possible'}
                                        name="asap"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.asap}
                                        variant="outlined"
                                        type='number'
                                        InputProps={{ inputProps: { min: 0 }, endAdornment: <InputAdornment position="end">Minutes</InputAdornment> }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        error={Boolean(touched?.email1 && errors.email1)}
                                        fullWidth
                                        helperText={touched?.email1 && errors.email1}
                                        label='Primary email address'
                                        name="email1"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="email"
                                        value={values.email1}
                                        variant="outlined"
                                    />
                                </Grid>
                                {!addNew && 
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            error={Boolean(touched?.email2 && errors.email2)}
                                            fullWidth
                                            helperText={touched?.email2 && errors.email2}
                                            label='Secondary email address'
                                            name="email2"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            type="email"
                                            value={values.email2}
                                            variant="outlined"
                                        />
                                    </Grid>
                                }
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        error={Boolean(
                                            touched?.phoneNumber1 && errors.phoneNumber1
                                        )}
                                        fullWidth
                                        helperText={touched?.phoneNumber1 && errors.phoneNumber1}
                                        label={'Primary Phone number'}
                                        name="phoneNumber1"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.phoneNumber1}
                                        variant="outlined"
                                    />
                                </Grid>
                                {!addNew && 
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            error={Boolean(
                                                touched?.phoneNumber2 && errors.phoneNumber2
                                            )}
                                            fullWidth
                                            helperText={touched?.phoneNumber2 && errors.phoneNumber2}
                                            label={'Secondary Phone number'}
                                            name="phoneNumber2"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.phoneNumber2}
                                            variant="outlined"
                                        />
                                    </Grid>
                                }
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
        </>
    )

}
export default AddUpdateForm
