import React, { useState, useEffect, useRef } from 'react'
import {
    Card,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Typography,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    styled,
    Box,
    Switch,
    TextField,
    InputAdornment
} from '@mui/material';
import { adminService } from 'src/api/services/admin';
import { useCheckPermission } from 'src/hooks/useCheckPermission';
import useToast from 'src/hooks/useToast'
// import { errorMessage } from '../../../../../../utils/errorTypeDetector'
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Formik } from 'formik';
import CustomButton from 'src/components/CustomButton'

const ShopAreas = ({ data }) => {
    const { checkPermission } = useCheckPermission();
    const [show, setShow] = useState(false)
    const [allAreas, setAllAreas] = useState([])
    const [vendorAreas, setVendorAreas] = useState([])

    const getData = async () => {
        try {
            Promise.all([adminService.getVendorAreas(data.id), adminService.getAllAreas()])
                .then(responses => {
                    setVendorAreas(responses[0].data.data.items)
                    setAllAreas(responses[1].data.data.items)
                })
                .catch(error => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
    }

    const onRefreshList = () => getData()

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <Grid container justifyContent="flex-end" alignItems="center" mb={2}>
                <Grid item>
                    <Button
                        sx={{
                            mt: { xs: 2, sm: 0 }
                        }}
                        onClick={() => checkPermission('CREATE_VENDOR_AREA') && setShow(true)}
                        variant="contained"
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                    >
                        {'Add Area'}
                    </Button>
                </Grid>
            </Grid>
            <Grid container display='flex' justifyContent='center'>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    {vendorAreas.length > 0
                        ? allAreas.map(city => <SupportedCityCard key={city.id} city={city} vendorAreas={vendorAreas} />)
                        : <Box dir={'rtl'} display='flex' justifyContent='center'>
                            <Typography variant='h4'>No area selected yet! add one first</Typography>
                        </Box>
                    }
                </Grid>
            </Grid>
            {show && checkPermission('CREATE_VENDOR_AREA') && <AddAreaModal show={show} onHide={() => setShow(false)} onRefreshList={onRefreshList} allAreas={allAreas} vendorAreas={vendorAreas} vendorId={data.id} />}
        </>
    )
}

export default ShopAreas

const SupportedCityCard = ({ city, vendorAreas }) => {
    const [targetAreas, setTargetAreas] = useState([])

    const handleFindTargetAreas = () => {
        let tempTargetAreas = []

        vendorAreas.forEach(item => {
            if (item.area.cityId === city.id) tempTargetAreas = [...tempTargetAreas, item]
        })

        setTargetAreas(tempTargetAreas)
    }

    useEffect(() => {
        handleFindTargetAreas()
    }, [vendorAreas])

    return (
        <StyledCityCard>
            <Typography variant='h5'>{city.name}</Typography>
            <Box dir={'rtl'} className='cards-wrapper'>
                {targetAreas.length > 0
                    ? targetAreas.map(item =>
                        <AreaCard key={item.id} item={item} />
                    )
                    : <Typography variant=''>No area found!</Typography>
                }
            </Box>
        </StyledCityCard>
    )
}

const AreaCard = ({ item }) => {
    const { checkPermission } = useCheckPermission()
    const { toast } = useToast()
    const [isAreaDisabled, setIsAreaDisabled] = useState(item.isAvailable)
    const [loading, setLoading] = useState()
    const [price, setPrice] = useState(parseInt(item.deliveryPrice))

    const handleUpdate = async () => {
        if (!checkPermission('UPDATE_VENDOR_AREAS')) return //mahya
        const tempData = {
            isAvailable: isAreaDisabled,
            deliveryPrice: price
        }

        try {
            setLoading(true)
            await adminService.updateAreaAvailability(item.id, tempData)
            toast(`${item.area.name.toUpperCase()} update successful!`, 'success')
            setLoading(false)
        } catch (error) {
            toast(`Error happened in toggle class`, 'error')
            console.log(error);
            setLoading(false)
        }
    }

    return (
        <Card key={item.id} className='area-box'>
            <Box dir={'rtl'} display={'flex'} flexDirection='row' justifyContent='space-between'>
                <Typography style={{ fontWeight: '600', marginTop: '5px' }}>{item.area.name}</Typography>
                <Switch
                    checked={isAreaDisabled}
                    onChange={() => setIsAreaDisabled(toggle => !toggle)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    disabled={checkPermission && !checkPermission('UPDATE_VENDOR_AREAS')} //mahya
                />
            </Box>
            <Box dir={'rtl'} display={'flex'} flexDirection='row' justifyContent='space-between' alignItems='center' marginTop={1}>
                <TextField
                    InputProps={{ endAdornment: <InputAdornment position="end">KD</InputAdornment> }}
                    value={price}
                    variant="standard"
                    onChange={e => setPrice(e.target.value)}
                />
            </Box>
            <Box dir={'rtl'} display={'flex'} flexDirection='row' justifyContent='space-between' alignItems='center' >
                <CustomButton
                    text='save'
                    onClick={handleUpdate}
                    disabled={loading}
                    height={'30px'}
                    width={'100%'}
                    style={{ marginTop: '25px' }}
                    loading={loading}
                />
            </Box>
        </Card>
    )
}

const AddAreaModal = ({ show, onHide, onRefreshList, allAreas, vendorId, vendorAreas }) => {
    const { checkPermission } = useCheckPermission();
    const formRef = useRef();
    const [selectedCity, setSelectedCity] = useState(undefined)
    const [cityRelatedAreas, setCityRelatedArea] = useState([])

    const handleSetCityRelatedAreas = () => {
        let tempRelatedAreas = []
        if (selectedCity) {
            tempRelatedAreas = allAreas.find(city => city.id === selectedCity).areas
            vendorAreas.forEach(alreadySelectedArea => {
                tempRelatedAreas = tempRelatedAreas.filter(area => area.id !== alreadySelectedArea.areaId)
            })
        }
        setCityRelatedArea(tempRelatedAreas)
    }

    const onAddArea = async (_values) => {
        if (!checkPermission('CREATE_VENDOR_AREA')) return true
        let tempData = {
            areaId: _values.area
        }

        try {
            await adminService.addNewVendorArea(vendorId, tempData)
            onRefreshList()
            onHide()
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleSetCityRelatedAreas()
    }, [selectedCity])

    return (
        <Dialog
            fullWidth
            maxWidth="md"
            open={show}
            onClose={onHide}
        >
            <DialogTitle>
                <Typography variant='h4'>Add New Area</Typography>
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{
                        city: '',
                        area: ''
                    }}
                    innerRef={formRef}
                    // validationSchema={}
                    onSubmit={async (
                        _values,
                        { resetForm, setStatus, setSubmitting }
                    ) => onAddArea(_values, resetForm, setStatus, setSubmitting)}
                >
                    {({
                        errors,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <DialogContent
                                dividers
                                sx={{
                                    p: 3
                                }}
                            >
                                <Grid container spacing={3}>
                                    <Grid item xs={12} lg={6} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="city-input">City</InputLabel>
                                            <Select
                                                error={Boolean(
                                                    touched?.style && errors.style
                                                )}
                                                labelId="city-input-label"
                                                id="city-input"
                                                value={values.city}
                                                label={'City'}
                                                name={'city'}
                                                onChange={(event) => {
                                                    handleChange('city')(event) // this is for specifying that event should change which value.
                                                    setSelectedCity(event.target.value)
                                                }}
                                                options={allAreas}
                                            >
                                                {
                                                    allAreas.map(city => <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>)
                                                }
                                            </Select>
                                            {touched?.style && errors.style && <StyledHelperText>{errors.style}</StyledHelperText>}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} lg={6} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="area-input">Area</InputLabel>
                                            <Select
                                                error={Boolean(
                                                    touched?.style && errors.style
                                                )}
                                                labelId="area-input-label"
                                                id="area-input"
                                                value={values.area}
                                                label={'Area'}
                                                name={'area'}
                                                onChange={handleChange}
                                                options={cityRelatedAreas}
                                            >
                                                {
                                                    cityRelatedAreas.map(area => <MenuItem key={area.id} value={area.id}>{area.name}</MenuItem>)
                                                }
                                            </Select>
                                            {touched?.style && errors.style && <StyledHelperText>{errors.style}</StyledHelperText>}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions
                                sx={{
                                    p: 3
                                }}
                            >
                                <Button color="secondary" onClick={onHide}>
                                    {'Cancel'}
                                </Button>
                                <Button
                                    type="submit"
                                    startIcon={
                                        isSubmitting ? <CircularProgress size="1rem" /> : null
                                    }
                                    disabled={Boolean(errors.submit) || isSubmitting}
                                    variant="contained"
                                >
                                    Add New Area
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
const StyledHelperText = styled(FormHelperText)(
    () => `
        color: red
  `
);

const StyledCityCard = styled(Card)`
    min-height: 50px;
    margin: 20px 0px;
    padding: 5px 10px 10px 5px;
    display: flex;
    flex-direction: column;
    padding: 18px;
    .cards-wrapper{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .area-box{
            min-height: 90px;
            width: 200px;
            border-radius: 8px;
            margin-right: 8px;
            margin-top: 8px;
            padding: 6px;
            display: flex;
            flex-direction: column;
            justify-content: space-between
        }
    }
    
`