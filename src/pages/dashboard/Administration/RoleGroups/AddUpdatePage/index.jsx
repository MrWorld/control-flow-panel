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
    FormLabel,
    FormGroup,
    FormHelperText,
    Checkbox,
    FormControlLabel,
    Box,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useToast from 'src/hooks/useToast'
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { useCheckPermission } from 'src/hooks/useCheckPermission';
import { useUser } from 'src/contexts/GlobalContext';
import AdminList from 'src/pages/dashboard/masters/Admins';

const AddUpdatePage = ({ addNew }) => {
    const { checkPermission } = useCheckPermission();
    const details = useLocation().state
    const theme = useTheme()
    const { toast } = useToast()
    const navigate = useNavigate()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
    const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
    const targetId = details?.id
    const [organizations, setorganizations] = useState([])
    const [loading, setLoading] = useState(false)
    const [readDetail, setRealDetails] = useState({})
    const [organizationLoading, setOrganizationLoading] = useState(false)
    const [permissionMapper, setPermissionMapper] = useState([
        {
            title: 'Parking Locations',
            all: false,
            items: [
                {
                    key: 'PARKING_LOCATION:READ',
                    value: false,
                },
                {
                    key: 'PARKING_LOCATION:CREATE',
                    value: false,
                },
                {
                    key: 'PARKING_LOCATION:DETAILS',
                    value: false,
                },
                {
                    key: 'PARKING_LOCATION:UPDATE',
                    value: false,
                },
                {
                    key: 'PARKING_LOCATION:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Parking Floors',
            all: false,
            items: [
                {
                    key: 'PARKING_FLOOR:READ',
                    value: false,
                },
                {
                    key: 'PARKING_FLOOR:CREATE',
                    value: false,
                },
                {
                    key: 'PARKING_FLOOR:DETAILS',
                    value: false,
                },
                {
                    key: 'PARKING_FLOOR:UPDATE',
                    value: false,
                },
                {
                    key: 'PARKING_FLOOR:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Parking Blocks',
            all: false,
            items: [
                {
                    key: 'PARKING_BLOCK:READ',
                    value: false,
                },
                {
                    key: 'PARKING_BLOCK:CREATE',
                    value: false,
                },
                {
                    key: 'PARKING_BLOCK:DETAILS',
                    value: false,
                },
                {
                    key: 'PARKING_BLOCK:UPDATE',
                    value: false,
                },
                {
                    key: 'PARKING_BLOCK:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Organization',
            all: false,
            items: [
                {
                    key: 'ORGANIZATION:READ',
                    value: false,
                },
                {
                    key: 'ORGANIZATION:CREATE',
                    value: false,
                },
                {
                    key: 'ORGANIZATION:DETAILS',
                    value: false,
                },
                {
                    key: 'ORGANIZATION:UPDATE',
                    value: false,
                },
                {
                    key: 'ORGANIZATION:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Role Group',
            all: false,
            items: [
                {
                    key: 'ROLE_GROUP:READ',
                    value: false,
                },
                {
                    key: 'ROLE_GROUP:CREATE',
                    value: false,
                },
                {
                    key: 'ROLE_GROUP:DETAILS',
                    value: false,
                },
                {
                    key: 'ROLE_GROUP:UPDATE',
                    value: false,
                },
                {
                    key: 'ROLE_GROUP:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Permissions',
            all: false,
            items: [
                {
                    key: 'PERMISSION:READ',
                    value: false,
                },
                {
                    key: 'PERMISSION:CREATE',
                    value: false,
                },
                {
                    key: 'PERMISSION:DETAILS',
                    value: false,
                },
                {
                    key: 'PERMISSION:UPDATE',
                    value: false,
                },
                {
                    key: 'PERMISSION:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Admins',
            all: false,
            items: [
                {
                    key: 'ADMIN:READ',
                    value: false,
                },
                {
                    key: 'ADMIN:CREATE',
                    value: false,
                },
                {
                    key: 'ADMIN:DETAILS',
                    value: false,
                },
                {
                    key: 'ADMIN:UPDATE',
                    value: false,
                },
                {
                    key: 'ADMIN:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Customer',
            all: false,
            items: [
                {
                    key: 'CUSTOMER:READ',
                    value: false,
                },
                {
                    key: 'CUSTOMER:CREATE',
                    value: false,
                },
                {
                    key: 'CUSTOMER:DETAILS',
                    value: false,
                },
                {
                    key: 'CUSTOMER:UPDATE',
                    value: false,
                },
                {
                    key: 'CUSTOMER:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Booking',
            all: false,
            items: [
                {
                    key: 'BOOKING:READ',
                    value: false,
                },
                {
                    key: 'BOOKING:CREATE',
                    value: false,
                },
                {
                    key: 'BOOKING:DETAILS',
                    value: false,
                },
                {
                    key: 'BOOKING:UPDATE',
                    value: false,
                },
                {
                    key: 'BOOKING:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Subscription',
            all: false,
            items: [
                {
                    key: 'SUBSCRIPTION:READ',
                    value: false,
                },
                {
                    key: 'SUBSCRIPTION:CREATE',
                    value: false,
                },
                {
                    key: 'SUBSCRIPTION:DETAILS',
                    value: false,
                },
                {
                    key: 'SUBSCRIPTION:UPDATE',
                    value: false,
                }
            ]
        },
        {
            title: 'Key tag',
            all: false,
            items: [
                {
                    key: 'KEY_TAG:READ',
                    value: false,
                },
                {
                    key: 'KEY_TAG:CREATE',
                    value: false,
                },
                {
                    key: 'KEY_TAG:DETAILS',
                    value: false,
                },
                {
                    key: 'KEY_TAG:UPDATE',
                    value: false,
                },
                {
                    key: 'KEY_TAG:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Car Manufacturer',
            all: false,
            items: [
                {
                    key: 'CAR_MANUFACTURER:READ',
                    value: false,
                },
                {
                    key: 'CAR_MANUFACTURER:CREATE',
                    value: false,
                },
                {
                    key: 'CAR_MANUFACTURER:DETAILS',
                    value: false,
                },
                {
                    key: 'CAR_MANUFACTURER:UPDATE',
                    value: false,
                },
                {
                    key: 'CAR_MANUFACTURER:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Car Model',
            all: false,
            items: [
                {
                    key: 'CAR_MODEL:READ',
                    value: false,
                },
                {
                    key: 'CAR_MODEL:CREATE',
                    value: false,
                },
                {
                    key: 'CAR_MODEL:DETAILS',
                    value: false,
                },
                {
                    key: 'CAR_MODEL:UPDATE',
                    value: false,
                },
                {
                    key: 'CAR_MODEL:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Banner',
            all: false,
            items: [
                {
                    key: 'BANNER:READ',
                    value: false,
                },
                {
                    key: 'BANNER:CREATE',
                    value: false,
                },
                {
                    key: 'BANNER:DETAILS',
                    value: false,
                },
                {
                    key: 'BANNER:UPDATE',
                    value: false,
                },
                {
                    key: 'BANNER:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Company',
            all: false,
            items: [
                {
                    key: 'COMPANY:READ',
                    value: false,
                },
                {
                    key: 'COMPANY:CREATE',
                    value: false,
                },
                {
                    key: 'COMPANY:DETAILS',
                    value: false,
                },
                {
                    key: 'COMPANY:UPDATE',
                    value: false,
                },
                {
                    key: 'COMPANY:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Services',
            all: false,
            items: [
                {
                    key: 'SERVICE:READ',
                    value: false,
                },
                {
                    key: 'SERVICE:CREATE',
                    value: false,
                },
                {
                    key: 'SERVICE:DETAILS',
                    value: false,
                },
                {
                    key: 'SERVICE:UPDATE',
                    value: false,
                },
                {
                    key: 'SERVICE:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Currency',
            all: false,
            items: [
                {
                    key: 'CURRENCY:READ',
                    value: false,
                },
                {
                    key: 'CURRENCY:CREATE',
                    value: false,
                },
                {
                    key: 'CURRENCY:DETAILS',
                    value: false,
                },
                {
                    key: 'CURRENCY:UPDATE',
                    value: false,
                },
                {
                    key: 'CURRENCY:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Groups',
            all: false,
            items: [
                {
                    key: 'GROUPS:READ',
                    value: false,
                },
                {
                    key: 'GROUPS:CREATE',
                    value: false,
                },
                {
                    key: 'GROUPS:DETAILS',
                    value: false,
                },
                {
                    key: 'GROUPS:UPDATE',
                    value: false,
                },
                {
                    key: 'GROUPS:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Configuration',
            all: false,
            items: [
                {
                    key: 'CONFIGURATION:READ',
                    value: false,
                },
                {
                    key: 'CONFIGURATION:CONTROLPANEL',
                    value: false,
                },
                {
                    key: 'CONFIGURATION:SEARCH',
                    value: false,
                },
                {
                    key: 'CONFIGURATION:SENDSMS',
                    value: false,
                },
                {
                    key: 'CONFIGURATION:UPDATEVEHICLE',
                    value: false,
                },
                {
                    key: 'CONFIGURATION:UPDATEPARKING',
                    value: false,
                },
                {
                    key: 'CONFIGURATION:UPDATECUSTOMER',
                    value: false,
                },
                {
                    key: 'CONFIGURATION:UPDATEPARKER',
                    value: false,
                },
                {
                    key: 'CONFIGURATION:CREATE',
                    value: false,
                },
                {
                    key: 'CONFIGURATION:UPDATE',
                    value: false,
                },
                {
                    key: 'CONFIGURATION:DELETE',
                    value: false,
                },
            ]
        },
        {
            title: 'Reports',
            all: false,
            items: [
                {
                    key: 'REPORT:LANDLORD',
                    value: false,
                },
                {
                    key: 'REPORT:HOURWISE',
                    value: false,
                },
                {
                    key: 'REPORT:CHECKINOUT',
                    value: false,
                },
                {
                    key: 'REPORT:FEEDBACK',
                    value: false,
                },
                {
                    key: 'REPORT:CLOSING',
                    value: false,
                },
                {
                    key: 'REPORT:INCOME',
                    value: false,
                },
                {
                    key: 'REPORT:CUSTOMER',
                    value: false,
                },
                {
                    key: 'REPORT:INCOMESUMMARY',
                    value: false,
                },
                {
                    key: 'REPORT:DRIVERS',
                    value: false,
                },
                {
                    key: 'REPORT:KEYTAG',
                    value: false,
                },
                {
                    key: 'REPORT:SERVICE',
                    value: false,
                },
                {
                    key: 'REPORT:VOUCHER',
                    value: false,
                },
            ]
        },
        {
            title: 'Payment Methods',
            all: false,
            items: [
                {
                    key: 'PAYMENT_METHOD:READ',
                    value: false,
                },
            ]
        },

    ])
    const user = useUser()
    console.log(user)

    const onCreate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
        if (!checkPermission('ROLE_GROUP:CREATE')) return true;
        try {

            let permissions = []
            permissionMapper.map((group) => {
                group.items.map((item) => {
                    permissions.push({
                        target: (item.key).split(":")[1],
                        entity: (item.key).split(":")[0],
                        status: item.value
                    })
                })

            })
            formData['permission'] = permissions

            await adminService.addRoleGroup(formData)

            toast('Role Group create successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.ADMINISTRATION.ROLE_GROUP.ROOT.ABSOLUTE, { replace: true })
        } catch (err) {
            // toast('err in Creating Role Group!', 'err')
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            setSubmitting(false);
            console.log(err);
        }
    }

    const getDetails = async () => {
        try {
            setLoading(true)
            const response = await adminService.getRoleGroupDetails(details?.id)
            setRealDetails(response.data.data)

            const temp = structuredClone(permissionMapper)

            response.data.data.permission.forEach(perm => {
                temp.map((group) => {
                    group.items.map((pi) => {
                        if (`${perm.entity}:${perm.target}` == pi.key) {
                            pi.value = true
                        }
                    })
                })
            });

            setPermissionMapper(temp)

            setLoading(false)
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            setLoading(false)
            // toast('Error on get Details', 'error')
            console.log(err);
        }
    }

    useEffect(() => {
        if (details?.id) getDetails()
    }, [])

    const handleChangeRole = (value, index, pi) => {
        console.log(value.target.checked)
        let temp = structuredClone(permissionMapper)
        temp[index].items[pi].value = value.target.checked
        if (value.target.checked) {
            (temp[index].items[pi].key).split(':')[1] != 'READ'
            temp[index].items.map((iv, idxv) => {
                if ((iv.key).split(':')[1] == 'READ') iv.value = value.target.checked
            })
        }
        if (!value.target.checked && (temp[index].items[pi].key).split(':')[1] == 'READ') {
            temp[index].items.map((iv, idxv) => {
                iv.value = value.target.checked
            })
        }
        if (!value.target.checked) temp[index].all = false
        setPermissionMapper(temp)
    }

    const handleSelectAll = (value, index) => {
        let temp = structuredClone(permissionMapper)
        temp[index].all = value.target.checked
        temp[index].items.map((item) => {
            item.value = value.target.checked
        })

        setPermissionMapper(temp)
    }

    const onUpdate = async (formData, resetForm, setErrors, setStatus, setSubmitting) => {
        if (!checkPermission('ROLE_GROUP:UPDATE')) return true;
        try {

            let permissions = []
            permissionMapper.map((group) => {
                group.items.map((item) => {
                    permissions.push({
                        target: (item.key).split(":")[1],
                        entity: (item.key).split(":")[0],
                        status: item.value
                    })
                })

            })
            formData['permission'] = permissions

            await adminService.updateRoleGroup(targetId, formData)
            toast('Role Group update successful!', 'success')
            setSubmitting(false);
            resetForm();
            setStatus({ success: true });
            navigate(ROUTE_CONSTANTS.DASHBOARD.ADMINISTRATION.ROLE_GROUP.ROOT.ABSOLUTE, { replace: true })
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            // toast('err in updating Role Group!', 'err')
            setSubmitting(false);
            console.log(err);
        }
    }

    return (
        <>
            <Grid container padding={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {addNew ? 'Add new Role Group' : 'Update Role Group'}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container p={2}>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <Typography variant='subtitle2' marginBottom='20px'>
                        {addNew ? 'Fill out form below to add your Role Group' : 'Fill out form below to update your Role Group'}
                    </Typography>
                    <Card style={{ padding: '25px' }}>
                        <Formik
                            initialValues={{
                                name: details?.name || '',
                                description: details?.description || '',
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    name: Yup.string()
                                        .max(255)
                                        .required('The name field is required'),
                                    description: Yup.string()
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
                                    </Grid>
                                    <Divider />

                                    <Grid container style={{ margin: '20px 0px' }}></Grid>
                                    {
                                        loading ? <Box dir={'rtl'}
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "200px",
                                            }}
                                        >
                                            <CircularProgress />
                                        </Box> :
                                            permissionMapper.map((group, index) => {
                                                return <FormControl sx={{ m: 3 }} component="fieldset" variant="standard" key={'group-' + index}>
                                                    <FormLabel component="legend">{group.title}</FormLabel>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            key={'perm-' + index}
                                                            control={
                                                                <Checkbox checked={group.all}  onChange={(x) => handleSelectAll(x, index)} name={'select all'} disabled={details?.id && user?.roleId == details?.id && (group.items[0].key).split(':')[0] == 'ROLE_GROUP'} />
                                                            }
                                                            label="select all"
                                                        />
                                                        {
                                                            group.items.map((perm, pi) => {
                                                                const label = (perm.key).split(':')[1].toLowerCase()
                                                                const entity = (perm.key).split(':')[0]
                                                                return <FormControlLabel
                                                                    key={'perm-' + pi}
                                                                    control={
                                                                        <Checkbox checked={perm.value} onChange={(x) => handleChangeRole(x, index, pi)} name={label} disabled={details?.id && user?.roleId == details?.id && entity == 'ROLE_GROUP'} />
                                                                    }
                                                                    label={label == 'read' ? 'list' : label}
                                                                />
                                                            })
                                                        }

                                                    </FormGroup>
                                                </FormControl>
                                            })
                                    }
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
                <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    {!addNew && <AdminList fromOthers={true} filterId={details?.id} />}
                </Grid>
            </Grid>
        </>
    )
}

export default AddUpdatePage