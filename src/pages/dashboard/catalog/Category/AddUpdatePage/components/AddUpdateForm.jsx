import {
    Grid,
    Typography,
    TextField,
    useMediaQuery,
    useTheme,
    Button,
    CircularProgress,
    Divider,
    Card
} from '@mui/material';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import useToast from 'src/hooks/useToast'
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { errorMessage } from 'src/utils/errorTypeDetector'

const AddUpdateForm = ({ targetAPI, addNew, details }) => {
    const { toast } = useToast()
    const navigate = useNavigate()
    const theme = useTheme()
    const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))

    const handleApiCall = async (data, resetForm, setErrors, setStatus, setSubmitting) => {
        try {
            await targetAPI(data)
            resetForm()
            setStatus({ success: true });
            setSubmitting(false);
            toast(`Category ${addNew ? 'created' : 'update'} successfully!`, 'success')
            navigate(ROUTE_CONSTANTS.DASHBOARD.CATALOG.CATEGORY.ROOT.ABSOLUTE, { replace: true })
        } catch (error) {
            if (errorMessage(error)) toast(errorMessage(error))
            else toast(error, 'error')
            setSubmitting(false);
        }
    }

    return (
        <>
            <Typography variant='subtitle2' marginBottom='20px'>
                {addNew ? 'Fill out form below to add your new category' : 'Fill out form below to update your category'}
            </Typography>
            <Card style={{ padding: '25px' }}>
                <Formik
                    initialValues={{
                        name: details?.name || '',
                        nameAr: details?.nameAr || '',
                    }}
                    validationSchema={
                        Yup.object().shape({
                            name: Yup.string()
                                .max(255)
                                .required('The name field is required'),
                            nameAr: Yup.string()
                                .max(255)
                                .required('The Arabic name field is required'),
                        })

                    }
                    onSubmit={async (
                        _values,
                        { resetForm, setErrors, setStatus, setSubmitting }
                    ) => handleApiCall(_values, resetForm, setErrors, setStatus, setSubmitting)}
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
                                        style={{ direction: 'rtl' }}
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
        </>
    )

}
export default AddUpdateForm