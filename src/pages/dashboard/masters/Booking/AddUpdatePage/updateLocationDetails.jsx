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
    Box,
    ListSubheader,
    InputAdornment,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useToast from 'src/hooks/useToast'


import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { useCheckPermission } from 'src/hooks/useCheckPermission';
import { MuiTelInput } from 'mui-tel-input';
import { SearchOutlined } from '@mui/icons-material';

const containsTextBlock = (value, searchText) => {
    console.log(value)
    return `${value?.floor?.name} - ${value.initial}`.toLowerCase().indexOf(searchText?.toLowerCase()) > -1;
} 
const UpdateLocationDetails = ({ addNew, formData, data, setClose }) => {
    const { checkPermission } = useCheckPermission();
    const details = useLocation().state
    const theme = useTheme()
    const { toast } = useToast()
    const navigate = useNavigate()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
    const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
    const targetId = details?.id

    const [readDetail, setRealDetail] = useState()
    const [parking, setCarManufactorerList] = useState([])
    const [parkingBlocks, setParkingBlocks] = useState([])
    const [parkingBranches, setParkingBranches] = useState([])
    const [isStandAlone, setIsStandAlone] = useState(useLocation().isStandAlone)
    const [searchTextBlock,setSearchTextBlock] = useState('')
    const searchRefBlock = useRef()
    const displayedOptionsBlock = useMemo(
        () => parkingBlocks.filter((option) => containsTextBlock(option, searchTextBlock)),
        [searchTextBlock]
      );

    const SubmitDetails = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
        formData['bookingId'] = +readDetail?.id
        try {
            const response = await adminService.updateBookingLocation(formData)
            toast(response.data.message)
            if (response && !isStandAlone) setClose()
            if(isStandAlone) navigate(ROUTE_CONSTANTS.DASHBOARD.CONTROL_PANEL.ROOT.ABSOLUTE, {replace: true})
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            console.log('error on updating location details', err)
            // toast('error on updating booking location details', 'error')
        }
    }


    //**** handle map error 

    const getDetail = async (payload = data) => {
        try {
            const response = await adminService.getBookingDetails(payload?.id)
            setRealDetail(response.data.data)
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            // toast('Error on fetch details!', 'error')
            console.log(err);
        }
    }

    useEffect(() => {
        console.log('detailssssss', details)
        if(details?.isStandAlone) {
            getDetail(details) 
            setIsStandAlone(true)
        }
        else getDetail()
    }, [])

    const getBranches = async () => {
        try {
            const response = await adminService.getParkingLocations({ limit: 1000, offset: 0 })
            setParkingBranches(response.data.data)
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            console.log('error on fetch car manufacturer list', err)
            // toast('error on fetch car manufacturer list', 'error')
        }
    }

    const getBlocks = async () => {
        try {
            const response = await adminService.getParkingBlock({ limit: 1000, offset: 0 })
            setParkingBlocks(response.data.data)
        } catch (err) {
            console.log('error on fetch car manufacturer list', err)
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            // toast('error on fetch car manufacturer list', 'error')
        }
    }


    useEffect(() => {
        getBlocks()
        getBranches()

    }, [])


    return (

        <>
        <Box dir={'rtl'} sx={{p: isStandAlone ? 4: 0}}>
            <Grid container p={0} direction={!isMediumScreen ? 'row' : 'column-reverse'} style={{ width: '100%' }}>
                <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
                    <Typography variant='subtitle2' marginBottom='20px'>
                        {addNew ? 'Fill out form below to attach location to booking' : 'Fill out form below to update booking location details'}
                    </Typography>

                        {readDetail?.BookingVehicle && <Formik
                            initialValues={{
                                parkingBlockId: readDetail?.BookingLocations[0]?.parkingBlockId || null,
                                branchId: readDetail?.keyTag?.branchId || null,
                                description: readDetail?.BookingLocations[0]?.description || '',
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    parkingBlockId: Yup.number()
                                        .min(1)
                                        .required('The customer type is required'),
                                    branchId: Yup.number()
                                        .min(1)
                                        .required('The car manufacturer is required'),
                                    description: Yup.string()
                                        .max(255)
                                        .optional(),

                                })
                            }
                            onSubmit={async (
                                _values,
                                { resetForm, setErrors, setStatus, setSubmitting }
                            ) => addNew
                                    ? SubmitDetails(_values, resetForm, setErrors, setStatus, setSubmitting)
                                    : SubmitDetails(_values, resetForm, setErrors, setStatus, setSubmitting)
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
                                        <Grid item xs={12} md={6} >
                                            <FormControl fullWidth>
                                                <InputLabel id="branchId">Branch</InputLabel>
                                                <Select
                                                    error={Boolean(
                                                        touched?.branchId && errors.branchId
                                                    )}
                                                    fullWidth
                                                    helperText={touched?.branchId && errors.branchId}
                                                    id="branchId"
                                                    labelId="branchId"
                                                    disabled={true}
                                                    value={values?.branchId}
                                                    label={'Branch'}
                                                    name='branchId'
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                >
                                                    {
                                                        parkingBranches.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6} >
                                            <FormControl fullWidth>
                                                <InputLabel id="parkingBlockId">Parking Block</InputLabel>
                                                <Select
                                                    error={Boolean(
                                                        touched?.parkingBlockId && errors.parkingBlockId
                                                    )}
                                                    fullWidth
                                                    helperText={touched?.parkingBlockId && errors.parkingBlockId}
                                                    id="parkingBlockId"
                                                    labelId="parkingBlockId"
                                                    disabled={details?.parkingBlockId}
                                                    value={values?.parkingBlockId}
                                                    label={'Parking Block'}
                                                    name='parkingBlockId'
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                >
                                                    <ListSubheader sx={{p: 0}}>
                                                                <TextField
                                                                size="small"
                                                                inputRef={searchRefBlock}
                                                                autoFocus
                                                                placeholder="Type to search..."
                                                                fullWidth
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <SearchOutlined />
                                                                        </InputAdornment>
                                                                    )
                                                                }}
                                                                onChange={(e) => setSearchTextBlock(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key != "Escape") {
                                                                        e.stopPropagation();
                                                                    }
                                                                }}
                                                                />
                                                            </ListSubheader>
                                                            {searchTextBlock.length ? displayedOptionsBlock.map((item, i) => (
                                                                <MenuItem key={item.id} value={item.id}>{item?.floor?.name} - {item.initial}</MenuItem>
                                                            )) : parkingBlocks.map((item, i) => (
                                                                <MenuItem key={item.id} value={item.id}>{item?.floor?.name} - {item.initial}</MenuItem>
                                                            ))}

                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.description && errors.description
                                                )}
                                                fullWidth
                                                helperText={touched?.description && errors.description}
                                                label={'description'}
                                                name="description"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values?.description}
                                                variant="outlined"
                                                InputProps={{
                                                    sx: {
                                                        color: 'red',
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Divider style={{ marginBottom: 20 }} />

                                    <Grid container style={{ margin: '20px 0px' }} alignItems="center">
                                        <Button
                                            type="submit"
                                            startIcon={
                                                isSubmitting ? <CircularProgress size="1rem" /> : null
                                            }
                                            disabled={Boolean(errors.submit) || isSubmitting}
                                            variant="contained"
                                            style={{ width: is_small_screen && '100%'}}
                                        >
                                            Save {isStandAlone ? '& Go To Control Panel' : ''}
                                        </Button>
                                        {isStandAlone ? <Button
                                            variant='outlined'
                                            onClick={() => navigate(ROUTE_CONSTANTS.DASHBOARD.CONTROL_PANEL.ROOT.ABSOLUTE, {replace: true})}
                                            >
                                            Back To Panel
                                        </Button> : <Button variant='outlined'  style={{ width: is_small_screen && '100%', marginLeft: 10 }} onClick={() => setClose()}>
                                            Cancel
                                        </Button>}
                                    </Grid>
                                </form>
                            )}
                        </Formik>}

                </Grid>
            </Grid >
        </Box>
            
        </>
    )
}

export default UpdateLocationDetails