import React, { useState } from 'react'
import {
    Grid,
    Typography,
    CardContent,
    Card,
    Box,
    Divider,
    Button,
    TextField,
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import Text from '../Text';
import UpdateModal from './UpdateModal'
import * as Yup from 'yup';
import { phoneRegExp } from '../../constants'
import { adminService } from 'src/api/services/admin';
import useToast from 'src/hooks/useToast'
import { errorMessage } from 'src/utils/errorTypeDetector'
import { useCheckPermission } from 'src/hooks/useCheckPermission'
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';

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


const PersonalDetails = ({ user, handleRefreshData }) => {
    const isOwnProfile = user.ownProfile
    const { checkPermission } = useCheckPermission()
    const { toast } = useToast()
    const [modalShow, setModalShow] = useState(false)
    const [phone, setPhone] = useState(user.phone)

    const handleChangeModalShow = bool => {
        setPhone(user.phone)
        if (!bool) setModalShow(prevShow => !prevShow)
        else setModalShow(bool)
    }

    const handleUpdatePersonalInfo = async (_values) => {
        const data = {
            ..._values
        }
        try {
            const response = await adminService.updateAdmin(user.id ,data)
            toast(response.data.message, 'success')
            setModalShow(false)
            handleRefreshData()
        } catch (error) {
            toast(error.response.data.message, 'error')
            console.log(error)
        }
    }

    return (
        <Card>
            <Box dir={'rtl'}
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Box dir={'rtl'}>
                    <Typography variant="h4" gutterBottom>
                        {'Personal Details'}
                    </Typography>
                    <Typography variant="subtitle2">
                        {'Manage information related to personal details'}
                    </Typography>
                </Box>
                {checkPermission(isOwnProfile ? 'ADMIN:UPDATE' : 'ADMIN:UPDATE') &&
                checkPermission('ADMIN:UPDATE') &&
                    <Button variant="text" onClick={() => handleChangeModalShow(true)} startIcon={<EditTwoToneIcon />}>
                        {'Edit'}
                    </Button>
                }
            </Box>
            <Divider />
            <CardContent
                sx={{
                    p: 4
                }}
            >
                <Typography variant="subtitle2">
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                            <Box dir={'rtl'} pr={3} pb={2}>
                                {'Name'}:
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                            <Text color="black">
                                <b>{user.name}</b>
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                            <Box dir={'rtl'} pr={3} pb={2}>
                                {'Phone number'}:
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                            <Text color="black">
                                <b>{user.phone || '-'}</b>
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                            <Box dir={'rtl'} pr={3} pb={2}>
                                {'Username'}:
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                            <Text color="black">
                                <b>{user.username || '-'}</b>
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                            <Box dir={'rtl'} pr={3} pb={2}>
                                {'Email'}:
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                            <Text color="black">
                                <b>{user.email || '-'}</b>
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                            <Box dir={'rtl'} pr={3} pb={2}>
                                {'Internal Note'}:
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                            <Text color="black">
                                <b>{user.internalNote || '-'}</b>
                            </Text>
                        </Grid>
                    </Grid>
                </Typography>
            </CardContent>
            <UpdateModal
                show={modalShow}
                onHide={() => handleChangeModalShow(false)}
                onCancel={() => handleChangeModalShow(false)}
                title='Personal information form'
                subtitle='You can change personal information'
                buttonText='Update'
                onSubmitCustomAction={handleUpdatePersonalInfo}
                validationSchema={Yup.object().shape({
                    name: Yup
                        .string()
                        .max(100)
                        .required('The full name field is required'),
                    phone: Yup.string().phoneValidation({errorMessage: "The Phone Number Field should be a valid phone", value: phone}),
                    username: Yup
                        .string()
                        .required(),

                    unPaidPassword: Yup.string().optional(),
                    email: Yup
                        .string()
                        .required(),
                    internalNote: Yup
                        .string()
                        .optional(),
                })}
                initialValues={{
                    name: user.name || '',
                    phone: user.phone || '',
                    email: user.email || '',
                    username: user.username || '',
                    internalNote: user.internalNote || '',
                    unPaidPassword: '',

                }}
                fields={(errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values) =>
                (
                    <>
                        <Grid item>
                            <TextField
                                error={Boolean(touched?.name && errors.name)}
                                fullWidth
                                margin="normal"
                                autoFocus
                                helperText={touched?.name && errors.name}
                                label={'Name'}
                                name="name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="name"
                                value={values.name}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item mt={2}>
                            <MuiTelInput
                                error={Boolean(
                                    touched?.phone && errors.phone
                                )}
                                fullWidth
                                helperText={touched?.phone && errors.phone}
                                label={'Phone'}
                                name="phone"
                                onBlur={handleBlur}
                                onChange={setPhone}
                                value={phone}
                                variant="outlined"
                                defaultCountry='KW'
                                onlyCountries={['KW']}
                            />
                        </Grid>
                        <Grid item mt={2}>
                            <TextField
                                error={Boolean(
                                    touched?.email && errors.email
                                )}
                                fullWidth
                                helperText={touched?.email && errors.email}
                                label={'email'}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item mt={2}>
                            <TextField
                                error={Boolean(
                                    touched?.unPaidPassword && errors.unPaidPassword
                                )}
                                fullWidth
                                helperText={touched?.unPaidPassword && errors.unPaidPassword}
                                label={'unPaidPassword'}
                                name="unPaidPassword"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.unPaidPassword}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item mt={2}>
                            <TextField
                                error={Boolean(
                                    touched?.username && errors.username
                                )}
                                fullWidth
                                helperText={touched?.username && errors.username}
                                label={'username'}
                                name="username"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.username}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item mt={2}>
                            <TextField
                                error={Boolean(
                                    touched?.internalNote && errors.internalNote
                                )}
                                fullWidth
                                helperText={touched?.internalNote && errors.internalNote}
                                label={'internalNote'}
                                name="internalNote"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.internalNote}
                                variant="outlined"
                            />
                        </Grid>
                    </>
                )
                }
            />
        </Card>
    )
}
export default PersonalDetails
