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
    CardContent,
    CardHeader,
    Box,
    Input,
    Switch,
    Stack,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useToast from 'src/hooks/useToast'
import CustomButton from "src/components/CustomButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { useCheckPermission } from 'src/hooks/useCheckPermission';
import LocationPicker from '../components/LocationPicker'
import { defaultPosition } from '../constants'
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import AdminList from '../../Admins';
import styled from '@emotion/styled';
import TermsAndConditionEditor from './EditStaticPages';
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

const AddUpdatePage = ({ addNew, formData }) => {
    const { checkPermission } = useCheckPermission();
    const details = useLocation().state
    const theme = useTheme()
    const { toast } = useToast()
    const navigate = useNavigate()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
    const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
    const targetId = details?.id
    const [position, setPosition] = useState(details?.latitude && details?.longitude ? { lat: details?.latitude, lng: details?.longitude } : null)
    const [positionError, setPositionError] = useState(false)
    const [phone, setPhone] = useState(details?.phone || '+965')
    const [enterances, setEnterances] = useState([])
    const [readDetail, setRealDetail] = useState()
    const [branchPricingConfigs, setBranchPricingConfigs] = useState([])
    const [tab, setTab] = useState('details')
    const [editorId,setEditorId] = useState(null)
    const [loading,setLoading] = useState(true)
    const [settingLoading,setSettingLoading] = useState(false)
    const {id} = useParams()
    const positionValidator = () => {
        if (!position) return false
        if (position.lat > 90 || position.lat < -90) return false
        if (position.lng > 180 || position.lat < -180) return false

        return true
    }

    const onCreate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {

        if (!positionValidator()) {
            setPositionError(true)
            return
        }
        formData['latitude'] = JSON.stringify(position.lat)
        formData['longitude'] = JSON.stringify(position.lng)
        formData['phone'] = phone
        formData['entrances'] = enterances.filter(x => x)

        if (!checkPermission('PARKING_LOCATION:CREATE')) return true;
        try {
            await adminService.addParkingLocations(formData)
            toast('Branch create successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.PARKING_LOCATION.ROOT.ABSOLUTE, { replace: true })
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            toast('Error in Creating Branch!', 'error')
            setSubmitting(false);
            console.log(err);
        }
    }

    const onUpdate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
        if (!positionValidator()) {
            setPositionError(true)
            return
        }
        formData['latitude'] = JSON.stringify(position.lat)
        formData['longitude'] = JSON.stringify(position.lng)
        formData['phone'] = phone
        formData['entrances'] = enterances.filter(x => x)

        if (!checkPermission('PARKING_LOCATION:UPDATE')) return true;
        try {
            await adminService.updateParkingLocations(id, formData)
            toast('Branch update successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.PARKING_LOCATION.ROOT.ABSOLUTE, { replace: true })
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            // toast('Error in updating Branch!', 'error')
            setSubmitting(false);
            console.log(err);
        }
    }

    const handleChangePosition = e => setPosition(e.latlng)

    //**** handle map error 
    useEffect(() => {
        if (position) setPositionError(false)
    }, [position])

    const getDetail = async () => {
        try {
            setLoading(true)
            const response = await adminService.getParkingLocation(id)
            setRealDetail(response.data.data)
            if (response.data?.data?.branchEntrances?.length) {
                setEnterances(response.data?.data?.branchEntrances)
            }
            setPosition({
                lat: parseFloat(response?.data?.data?.latitude),
                lng: parseFloat(response?.data?.data?.longitude)
            })
            setPhone(response?.data?.data?.phone)
            setLoading(false)
        } catch (err) {
            toast('Error on fetch details!', 'error')
            console.log(err);
            setLoading(false)
        }

    }

    const getBranchConfigs = async() => {
        try {
            setSettingLoading(true)
            const response = await adminService.getBranchConfigs(id)
            const responseCustomerType = await adminService.getCustomerTypes()

            if(response.data.data && responseCustomerType.data.data) {
                let temp = []

                response?.data?.data?.map((config) => {
                    
                    if(config.key.includes('bpc#')){
                        let clone = structuredClone(config)
                        const customerTypeId = +clone.key.replace('bpc#', '')
                        console.log(customerTypeId)
                        responseCustomerType?.data?.data?.forEach((ctype) => {
                            const cloneCtype = structuredClone(ctype)
                            if(cloneCtype.id == customerTypeId) {
                                clone['inputType'] = 'price'
                                clone['row'] = 'pricing'
                                clone['type'] = cloneCtype
                                clone['type'].name = cloneCtype.name + ' cost (Per Vehicle)'
                            }
                        })
                        temp.push(clone)
                    }
                    if(config.key.includes('blc#')) {
                        console.log('is it blc ?', config)
                        let clone = structuredClone(config)
                        const customerTypeId = +clone.key.replace('blc#', '')
                        responseCustomerType?.data?.data?.forEach((ctype) => {
                            const cloneCtype = structuredClone(ctype)
                            if(cloneCtype.id == customerTypeId) {
                                clone['inputType'] = 'percentage'
                                clone['min'] = 0
                                clone['max'] = 100
                                clone['suffix'] = '%'
                                clone['row'] = 'landlord'
                                clone['type'] = cloneCtype
                                clone['type'].name = 'Landlord ' + cloneCtype.name + ' percentage'
                            }
                        })
                        temp.push(clone)
                    }
                    if(config.key.includes('brpc#')) {
                        let clone = structuredClone(config)
                        clone['type'] = {name: 'Repark Cost (Per Vehicle)'}
                        clone['inputType'] = 'price'
                        clone['row'] = 'pricing'
                        temp.push(clone)
                    }
                    if(config.key.includes('btc#')) {
                        setEditorId(config.id)
                        let clone = structuredClone(config)
                        clone['type'] = {name: 'Terms & Conditions'}
                        clone['inputType'] = 'reachEditor'
                        clone['row'] = 'terms'
                        temp.push(clone)
                    }
                    if(config.key.includes('blnc#')) {
                        let clone = structuredClone(config)
                        clone['type'] = {name: 'Landlord Name'}
                        clone['inputType'] = 'text'
                        clone['row'] = 'landlord'
                        temp.push(clone)
                    }
                    if(config.key.includes('brc#')) {
                        let clone = structuredClone(config)
                        clone['type'] = {name: 'Car Ready In'}
                        clone['inputType'] = 'text'
                        clone['suffix'] = 'min'
                        clone['row'] = 'pricing'
                        temp.push(clone)
                    }
                    if(config.key.includes('website#')) {
                        let clone = structuredClone(config)
                        clone['type'] = {name: 'Website'}
                        clone['inputType'] = 'text'
                        clone['row'] = 'input'
                        temp.push(clone)
                    }
                    if(config.key.includes('email#')) {
                        let clone = structuredClone(config)
                        clone['type'] = {name: 'Email'}
                        clone['inputType'] = 'text'
                        clone['row'] = 'input'
                        temp.push(clone)
                    }
                    if(config.key.includes('phone#')) {
                        // let clone = structuredClone(config)
                        // clone['type'] = {name: 'Phone'}
                        // clone['inputType'] = 'text'
                        // clone['row'] = 'input'
                        // temp.push(clone)
                    }
                    if(config.key.includes('wn#')) {
                        let clone = structuredClone(config)
                        clone['type'] = {name: 'Whatsapp Number'}
                        clone['inputType'] = 'text'
                        clone['row'] = 'input'
                        temp.push(clone)
                    }
                    if(config.key.includes('address#')) {
                        // let clone = structuredClone(config)
                        // clone['type'] = {name: 'Branch Address'}
                        // clone['inputType'] = 'text'
                        // clone['row'] = 'input'
                        // temp.push(clone)
                    }
                    if(config.key.includes('pi#')) {
                        let clone = structuredClone(config)
                        clone['type'] = {name: 'Print Invoice'}
                        clone['inputType'] = 'boolean'
                        clone['row'] = 'input'
                        temp.push(clone)
                    }
                    if(config.key.includes('instagram#') || config.key.includes('facebook#') || config.key.includes('linkedin#') || config.key.includes('twitter#')) {
                        let clone = structuredClone(config)
                        clone['type'] = {name: clone.key.replace('#' , '')}
                        clone['inputType'] = 'text'
                        clone['row'] = 'input'
                        temp.push(clone)
                    }
                })
                console.log(temp)
                setBranchPricingConfigs(temp)
                setSettingLoading(false)
            }
        }catch(err) {
            console.log(err)
            toast(err.response.data.message, 'error')
            setSettingLoading(false)
        }
    }

    useEffect(() => {
        if (!addNew) {
            getDetail()
            getBranchConfigs()
        }else {
            setLoading(false)
        }
    }, [])

    //**** render map if location exist or updated 

    const renderLocation = () => {
        if (addNew) return <LocationPicker
            position={position ? position : defaultPosition}
            handleChangePosition={handleChangePosition}
        />
        else {
            if (position) return <LocationPicker
                position={position}
                handleChangePosition={handleChangePosition}
            />
            else return null
        }
    }

    const handleAddEnterance = () => {
        const temp = []
        temp.push({
            id: null,
            name: '',
            description: ''
        })
        setEnterances((enterances) => [...enterances.filter(x => x), ...temp])
    }



    const deleteEntrance = async (entrance, index) => {
        console.log(index)
        if (entrance.id) {
            // await adminService.ParkingLocationRemoveEntrance(entrance.id)
            // getDetail(details?.id)
            let temp = structuredClone(enterances)
            temp = temp.filter(x => x)
            delete temp[index]
            setEnterances(temp)
        } else {
            let temp = structuredClone(enterances)
            temp = temp.filter(x => x)
            delete temp[index]
            setEnterances(temp)
        }
    }

    const handleEditEnteranceName = (values, index) => {
        let temp = structuredClone(enterances)
        temp[index].name = values.target.value
        temp = temp.filter(x => x)
        setEnterances(temp)
    }

    const handleEditEnteranceDescription = (values, index) => {
        let temp = structuredClone(enterances)
        temp[index].description = values.target.value
        temp = temp.filter(x => x)
        setEnterances(temp)
    }

    const handleSettingChange = (conf, value) => {
        let temp = structuredClone(branchPricingConfigs)
        temp.map((config) => {
            if(config.id == conf.id){
                config.value = value.target.value
            }
        })
        setBranchPricingConfigs(temp)
    }
    const handleSettingChangeEditor = async(value) => {
        setSettingLoading(true)
        console.log(value)
        let temp = structuredClone(branchPricingConfigs)
        temp.map((config) => {
            if(config.id == editorId){
                config.value = value
            }
        })
        setBranchPricingConfigs(temp)
        try {
            const payload = [{
                id: editorId,
                value: value
            }]
            const response = await adminService.updateBranchConfig(payload)
            getBranchConfigs()
            toast(response.data.message, 'success')
            setSettingLoading(false)
        }catch(err) {
            toast(err.response.data.message, 'error')
            setSettingLoading(false)
        }
    }

    const handleSaveSettings = async() => {
        setSettingLoading(true)
        try {
            let payload = []
            branchPricingConfigs.map((conf) => {
                if(conf.key != 'btc#') {
                    const data = {
                        value: conf.value,
                        id: conf.id
                    }
                    payload.push(data)
                }
            })
            const response = await adminService.updateBranchConfig(payload)
            toast(response.data.message)
            getBranchConfigs()
            setSettingLoading(false)
        }catch(err) {
            toast(err.response.data.message, 'error')
            setSettingLoading(false)
        }
    }

    return (
        <>
            <Grid container padding={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {addNew ? 'Add new Branch' : 'Update Branch'}
                    </Typography>
                    <Typography variant='subtitle2' marginBottom='20px'>
                        {addNew ? 'Fill out form below to add your Branch' : 'Fill out form below to update your Branch'}
                    </Typography>
                </Grid>
                {!addNew ? <Grid item>
                    <Button variant={tab == 'details' ? 'contained': 'link'} sx={{ml: 1}} onClick={() => setTab('details')}>
                        Details
                    </Button>
                    <Button variant={tab == 'configs' ? 'contained': 'link'} sx={{ml: 1}} onClick={() => setTab('configs')}>
                        Configurations
                    </Button>
                    <Button variant={tab == 'btc' ? 'contained': 'link'} sx={{ml: 1}} onClick={() => setTab('btc')}>
                        Terms & Conditions
                    </Button>
                </Grid>: <></>}
            </Grid>
            <Grid container p={1}  md={12} direction={!isMediumScreen ? 'row' : 'column'}>
            {loading ? <SuspenseLoader /> :tab == 'details' ? <Grid p={1} xs={12} sm={12} md={12} lg={12} xl={12} item>
                    
                    <Card style={{ padding: '25px' }}>
                        <Formik
                            initialValues={{
                                name: readDetail?.name || '',
                                contactPerson: readDetail?.contactPerson || '',
                                location: readDetail?.location || '',
                                internalNote: readDetail?.internalNote || '',
                                phone: readDetail?.phone || ''
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    name: Yup.string()
                                        .max(255)
                                        .required('The name field is required'),
                                    contactPerson: Yup.string()
                                        .max(255)
                                        .required('The contactPerson field is required'),
                                    location: Yup.string()
                                        .required('location field is required'),
                                    internalNote: Yup.string()
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
                                                    touched?.contactPerson && errors.contactPerson
                                                )}
                                                fullWidth
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
                                                    touched?.location && errors.location
                                                )}
                                                fullWidth
                                                helperText={touched?.location && errors.location}
                                                label={'Location'}
                                                name="location"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.location}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={24} md={24}>
                                            <Grid item xs={12} md={12} display='flex' flexDirection='column' >
                                                {renderLocation()}
                                                {positionError && <div>Please choose a correct location</div>}
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <TextField
                                                error={Boolean(
                                                    touched?.internalNote && errors.internalNote
                                                )}
                                                fullWidth
                                                helperText={touched?.internalNote && errors.internalNote}
                                                label={'Internal Note'}
                                                name="internalNote"
                                                multiline
                                                rows={4}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.internalNote}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item sx={12} mt={10}>

                                        <Button color="secondary" onClick={() => handleAddEnterance()} variant='outlined' style={{ marginTop: 2 }}>
                                            {'+ Enterance'}
                                        </Button>
                                        <Grid container spacing={3} marginBottom={2} marginTop={1} >


                                            {
                                                enterances.map((enternace, index) => {
                                                    console.log(index, enternace)
                                                    return <>
                                                        <Grid item xs={5} md={5} key={index + 'name'}>
                                                            <TextField
                                                                fullWidth
                                                                label={'Name'}
                                                                name="name"
                                                                onBlur={handleBlur}
                                                                onChange={(x) => handleEditEnteranceName(x, index)}
                                                                value={enternace?.name}
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={5} md={5} key={index + 'desc'}>
                                                            <TextField
                                                                fullWidth
                                                                label={'Description'}
                                                                name="description"
                                                                onBlur={handleBlur}
                                                                onChange={(x) => handleEditEnteranceDescription(x, index)}
                                                                value={enternace?.description}
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={2} md={2} key={index + 'delete'}>
                                                            <DeleteIcon

                                                                style={{ cursor: "pointer", height: '100%', color: 'darkred' }}
                                                                onClick={() => deleteEntrance(enternace, index)}
                                                            />
                                                        </Grid>
                                                    </>

                                                })
                                            }

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
                </Grid>: <></>}
                {!addNew && tab == 'configs' ? <Grid p={1} xs={12} sm={12} md={12} lg={12} xl={12} item>
                    
                    <Card style={{ padding: '25px' }}>
                        <Typography fontWeight={800}>Settings</Typography>
                        <Grid container p={1} pb={3} spacing={2} >

                        {
                            branchPricingConfigs.map((conf) => {
                                if(conf.category == 'SETTINGS' && conf.key != 'btc#' && conf.row == 'pricing') {
                                    return <>
                                            {conf.inputType == 'price' ? <Grid xs={12} sm={12} md={4} lg={2} item key={conf.id} ><TextField
                                                type='number'
                                                label={conf?.type?.name}
                                                value={conf.value}
                                                fullWidth
                                                onChange={(x) => handleSettingChange(conf, x)}
                                            /></Grid>: <></>}
                                            {conf.inputType == 'percentage' ? <Grid xs={12} sm={12} md={4} lg={2} item key={conf.id} ><TextField
                                                type='number'
                                                fullWidth
                                                label={conf?.type?.name}
                                                value={conf.value}
                                                onChange={(x) => handleSettingChange(conf, x)}
                                            /></Grid>: <></>}
                                            {conf.inputType == 'text' ? <Grid xs={12} sm={12} md={4} lg={2} item key={conf.id} ><TextField
                                                type='text'
                                                fullWidth
                                                // prefix={conf.suffix ? <div>{conf.suffix}</div> : <></>}
                                                label={conf?.type?.name}
                                                value={conf.value}
                                                onChange={(x) => handleSettingChange(conf, x)}
                                            /></Grid>: <></>}</>
                                }
                            })
                        }      
                        </Grid>

                        <Grid container p={1} pb={3} spacing={2} >

                        {
                            branchPricingConfigs.map((conf) => {
                                if(conf.category == 'SETTINGS' && conf.key != 'btc#' && conf.row == 'landlord') {
                                    return <>
                                            {conf.inputType == 'price' ? <Grid xs={12} sm={12} md={4} lg={2} item key={conf.id} ><TextField
                                                type='number'
                                                label={conf?.type?.name}
                                                value={conf.value}
                                                fullWidth
                                                onChange={(x) => handleSettingChange(conf, x)}
                                            /></Grid>: <></>}
                                            {conf.inputType == 'percentage' ? <Grid xs={12} sm={12} md={4} lg={2} item key={conf.id} ><TextField
                                                type='number'
                                                fullWidth
                                                label={conf?.type?.name}
                                                value={conf.value}
                                                onChange={(x) => handleSettingChange(conf, x)}
                                            /></Grid>: <></>}
                                            {conf.inputType == 'text' ? <Grid xs={12} sm={12} md={4} lg={2} item key={conf.id} ><TextField
                                                type='text'
                                                fullWidth
                                                // prefix={conf.suffix ? <div>{conf.suffix}</div> : <></>}
                                                label={conf?.type?.name}
                                                value={conf.value}
                                                onChange={(x) => handleSettingChange(conf, x)}
                                            /></Grid>: <></>}</>
                                }
                            })
                        }      
                        </Grid>

                        <Typography fontWeight={800}>General</Typography>
                        <Grid container p={1} pb={3} spacing={2} >

                        {
                            branchPricingConfigs.map((conf) => {
                                if(conf.category == 'GENERAL') {
                                    return <>
                                            {conf.inputType == 'price' ? <Grid item xs={12} sm={12} md={4} lg={2} key={conf.id} ><TextField
                                                type='number'
                                                label={conf?.type?.name}
                                                value={conf.value}
                                                fullWidth
                                                onChange={(x) => handleSettingChange(conf, x)}
                                            /></Grid>: <></>}
                                            {conf.inputType == 'percentage' ? <Grid item xs={12} sm={12} md={4} lg={2} key={conf.id} ><TextField
                                                type='number'
                                                inputProps={{
                                                    min: conf.min,
                                                    max: conf.max
                                                }}
                                                renderSuffix={() => <div>%</div>}
                                                label={conf?.type?.name}
                                                value={conf.value}
                                                fullWidth
                                                onChange={(x) => handleSettingChange(conf, x)}
                                            /></Grid>: <></>}
                                            {conf.inputType == 'text' ? <Grid item xs={12} sm={12} md={4} lg={2} key={conf.id} ><TextField
                                                type='text'
                                                renderSuffix={() => {
                                                    conf.suffix ? <div>{conf.suffix}</div> : <></>
                                                }}
                                                label={conf?.type?.name}
                                                value={conf.value}
                                                fullWidth
                                                onChange={(x) => handleSettingChange(conf, x)}
                                            /></Grid>: <></>}
                                            {conf.inputType == 'boolean' ? <Grid item xs={12} sm={12} md={4} lg={2} key={conf.id} >
                                                <FormControl fullWidth>
                                                <Typography >{conf?.type?.name}</Typography>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography color={'gray'}>Automatic</Typography>
                                                <AntSwitch value={conf.value == 'true' ? true : false} inputProps={{ 'aria-label': 'ant design' }} onChange={(x) => handleSettingChange(conf, x.target.checked)}/>
                                                <Typography color={'gray'}>Always ask</Typography>
                                              </Stack>
                                              </FormControl>
                                              </Grid>
                                            : <></>}
                                    </>
                                }
                            })
                        }      
                        </Grid>

                        <Typography fontWeight={800}>Social Media</Typography>
                        <Grid container p={1} pb={3} spacing={2} >
                        {
                            branchPricingConfigs.map((conf) => {
                                if(conf.category == 'SOCIAL_MEDIA') {
                                    return <>
                                            {conf.inputType == 'price' ? <Grid item xs={12} sm={12} md={4} lg={2} key={conf.id} ><TextField
                                                type='number'
                                                label={conf?.type?.name}
                                                fullWidth
                                                value={conf.value}
                                                onChange={(x) => handleSettingChange(conf, x)}
                                            /></Grid>: <></>}
                                            {conf.inputType == 'percentage' ? <Grid item xs={12} sm={12} md={4} lg={2} key={conf.id} ><TextField
                                                type='number'
                                                label={conf?.type?.name}
                                                fullWidth
                                                value={conf.value}
                                                onChange={(x) => handleSettingChange(conf, x)}
                                            /></Grid>: <></>}
                                            {conf.inputType == 'text' ? <Grid item xs={12} sm={12} md={4} lg={2} key={conf.id} ><TextField
                                                type='text'
                                                renderSuffix={() => {
                                                    conf.suffix ? <div>{conf.suffix}</div> : <></>
                                                }}
                                                label={conf?.type?.name}
                                                fullWidth
                                                value={conf.value}
                                                onChange={(x) => handleSettingChange(conf, x)}
                                            /></Grid>: <></>}
                                        </>
                                }
                            })
                        }      
                        </Grid>

                        {/* <Typography fontWeight={800}>Assets</Typography>
                        <Grid container p={1} pb={3} spacing={2} >

                        {
                            branchPricingConfigs.map((conf) => {
                                if(conf.category == 'ASSETS') {
                                    return <Grid item xs={12} sm={12} md={4} lg={2} key={conf.id} >
                                    <Box dir={'rtl'} pt={4} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <FormControl>
                                            {conf.inputType == 'price' ? <TextField
                                                type='number'
                                                label={conf?.type?.name}
                                                value={conf.value}
                                                onChange={(x) => handleSettingChange(conf, x)}
                                            />: <></>}
                                            {conf.inputType == 'percentage' ? <TextField
                                                type='number'
                                                inputProps={{
                                                    min: conf.min,
                                                    max: conf.max
                                                }}
                                                renderSuffix={() => <div>%</div>}
                                                label={conf?.type?.name}
                                                value={conf.value}
                                                onChange={(x) => handleSettingChange(conf, x)}
                                            />: <></>}
                                            {conf.inputType == 'text' ? <TextField
                                                type='text'
                                                renderSuffix={() => {
                                                    conf.suffix ? <div>{conf.suffix}</div> : <></>
                                                }}
                                                label={conf?.type?.name}
                                                value={conf.value}
                                                onChange={(x) => handleSettingChange(conf, x)}
                                            />: <></>}
                                        </FormControl>
                                        
                                    </Box>
                                </Grid>
                                }
                            })
                        }      
                        </Grid> */}
                        <Button
                            variant='contained'
                            fullWidth
                            onClick={() => handleSaveSettings()}
                            >
                            Save
                        </Button>
                    </Card>
                </Grid>: <></>}
                {!addNew && tab == 'btc' ? <Grid p={1} xs={12} sm={12} md={12} lg={12} xl={12} item>
                        {
                            branchPricingConfigs.map((conf) => {
                                if(conf.category == 'SETTINGS' & conf.key == 'btc#') {
                                    return <Grid item xs={12} key={conf.id}>
                                       <TermsAndConditionEditor data={conf.value} onChange={handleSettingChangeEditor}/>
                                    </Grid>
                                }
                            })
                        }
                </Grid> : <>
                </>}
                {settingLoading ? <SuspenseLoader /> :<></>}
            </Grid >
            
        </>
    )
}

export default AddUpdatePage

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
      boxSizing: 'border-box',
    },
  }));
  