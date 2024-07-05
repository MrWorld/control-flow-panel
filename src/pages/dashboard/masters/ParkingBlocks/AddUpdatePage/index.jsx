import React, { useEffect, useState } from 'react'
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

const AddUpdatePage = ({ addNew }) => {
    const { checkPermission } = useCheckPermission();
    const details = useLocation().state
    const theme = useTheme()
    const { toast } = useToast()
    const navigate = useNavigate()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
    const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
    const targetId = details?.id
    const [parkingLocations, setParkingLocations] = useState([])
    const [floors, setFloor] = useState([])

    const onCreate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
        if (!checkPermission('PARKING_BLOCK:CREATE')) return true;
        try {
            await adminService.addParkingBlock(formData)
            toast('Parking Block create successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.PARKING_BLOCK.ROOT.ABSOLUTE, { replace: true })
        } catch (error) {
            toast('Error in Creating Parking Block!', 'error')
            setSubmitting(false);
            console.log(error);
        }
    }

    const getParkingLocations = async () => {
        try {
            const response = await adminService.getParkingLocations({ offset: 0, limit: 10000 })
            setParkingLocations(response.data.data)
        } catch (err) {
            toast('Error on get parking locations', 'error')
            console.log(err);
        }

    }

    useEffect(() => {
        getParkingLocations()
    }, [])

    const getFloors = async () => {
        try {
            const response = await adminService.getFloors({ page: 1, take: 10000 })
            setFloor(response.data.data)
        } catch (err) {
            toast('Error on get floors', 'error')
            console.log(err);
        }

    }

    useEffect(() => {
        getFloors()
    }, [])

    const onUpdate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
        if (!checkPermission('PARKING_BLOCK:UPDATE')) return true;
        try {
            await adminService.updateParkingBlock(targetId, formData)
            toast('Parking Block update successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.PARKING_BLOCK.ROOT.ABSOLUTE, { replace: true })
        } catch (error) {
            toast('Error in updating Parking Block!', 'error')
            setSubmitting(false);
            console.log(error);
        }
    }

    return (
        <>
            <Grid container padding={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {addNew ? 'Add new Parking Block' : 'Update Parking Block'}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container p={2} direction={!isMediumScreen ? 'row' : 'column-reverse'}>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <Typography variant='subtitle2' marginBottom='20px'>
                        {addNew ? 'Fill out form below to add your Parking Block' : 'Fill out form below to update your Parking Block'}
                    </Typography>
                    <Card style={{ padding: '25px' }}>
                        <Formik
                            initialValues={{
                                description: details?.description || '',
                                initial: details?.initial || '',
                                floorId: details?.floor?.id || ''
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    initial: Yup.string()
                                        .max(255)
                                        .required('The initial field is required'),
                                    description: Yup.string()
                                        .optional(),
                                    floorId: Yup.number()
                                        .required('Floor field is required'),
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
                                            <FormControl fullWidth>
                                                <InputLabel id="floorId">Floor</InputLabel>
                                                <Select
                                                    fullWidth
                                                    id="floorId"
                                                    labelId="floorId"
                                                    value={values.floorId}
                                                    label={'Floor'}
                                                    name='floorId'
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                >
                                                    {
                                                        floors.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
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
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.initial && errors.initial
                                                )}
                                                fullWidth
                                                helperText={touched?.initial && errors.initial}
                                                label={'Initial'}
                                                name="initial"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.initial}
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
            </Grid>
        </>
    )
}

export default AddUpdatePage