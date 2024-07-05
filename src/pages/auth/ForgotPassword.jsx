import React, { useState } from 'react'
import * as Yup from 'yup';
import { Formik } from 'formik';
import { authService } from 'src/api/services/auth'
import useToast from 'src/hooks/useToast'
import { errorMessage } from 'src/utils/errorTypeDetector'

import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    styled,
    Card
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Logo from './components/Logo';


const ResetPassword = () => {
    const { toast } = useToast()
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = async (values, setStatus, setSubmitting, resetForm) => {
        const { email } = values
        const data = { email }

        try {
            await authService.forgotPassword(data)
            setStatus({ success: true })
            setEmailSent(true)
            setSubmitting(false)
            resetForm()
            toast('Email sent successfully', 'success')
        } catch (error) {
            setStatus({ success: false });
            setSubmitting(false);
            toast(errorMessage(error), 'error')
        }
    }

    if (emailSent) return (
        <Box dir={'rtl'}
            sx={{
                width: '100%',
                height: '100%',
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Box dir={'rtl'}
                style={{
                    maxWidth: '100%',
                    width: '400px',
                }}
            >
                <StyledNotificationBox>
                    <CheckCircleOutlineIcon style={{ width: '70px', height: '70px', color: '#82d271' }} />
                    <Typography mt={2} variant="h2" style={{ marginBottom: '20px', textAlign: 'center', color: '#82d271' }}>
                        Success!
                    </Typography>
                    <Typography variant="h4" style={{ marginBottom: '20px', textAlign: 'center' }}>
                        Email has been send successfully!
                    </Typography>
                </StyledNotificationBox>

            </Box>
        </Box>
    )

    return (
        <Box dir={'rtl'}
            sx={{
                width: '100%',
                height: '100%',
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Box dir={'rtl'}
                style={{
                    maxWidth: '100%',
                    width: '400px',
                }}
            >
                <Logo />
                <Typography variant="h4" style={{ marginBottom: '20px', textAlign: 'center' }}>
                    Reset your password
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Enter your user account verified email address and we will send you a password reset link.
                </Typography>
                <Formik
                    initialValues={{
                        email: '',
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string()
                            .email('The email provided should be a valid email address')
                            .max(255)
                            .required('The email field is required'),
                    })}
                    onSubmit={(values, { setStatus, setSubmitting, resetForm }) => handleSubmit(values, setStatus, setSubmitting, resetForm)}
                >
                    {({
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values,
                    }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <TextField
                                error={Boolean(touched?.email && errors.email)}
                                fullWidth
                                margin="normal"
                                autoFocus
                                helperText={touched?.email && errors.email}
                                label='Enter your email address'
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="email"
                                value={values.email}
                                variant="outlined"
                            />
                            <Button
                                sx={{
                                    mt: 3
                                }}
                                color="primary"
                                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                                disabled={isSubmitting}
                                type="submit"
                                fullWidth
                                size="large"
                                variant="contained"
                            >
                                {'Send password reset email'}
                            </Button>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    )
}
export default ResetPassword

const StyledNotificationBox = styled(Card)(
    () => `
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px 0px;
  `
);

