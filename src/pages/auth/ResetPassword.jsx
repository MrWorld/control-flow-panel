import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from 'src/api/services/auth'
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import useToast from 'src/hooks/useToast'
import { errorMessage } from 'src/utils/errorTypeDetector'
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
} from '@mui/material';
import Logo from './components/Logo';

const ResetPassword = () => {
    const { search } = useLocation()
    const { toast } = useToast()
    const navigate = useNavigate();
    const secRef = useRef(null)
    const [loading, setLoading] = useState(true)
    const [isValid, setIsValid] = useState(true)

    const getAndCheckSecret = async () => {
        const queryParams = new URLSearchParams(search)
        const secret = queryParams.get("token")
        secRef.current = secret
        const check = await authService.checkResetHash(secret)
        setIsValid(check.data.data)
        setLoading(false)
    }

    const handleResetPassword = async (values, setErrors, setStatus, setSubmitting) => {
        const token = secRef.current
        if (token === null) return

        const { password, confirmPassword } = values
        const data = { password, confirmPassword, token }
        try {
            await authService.resetPassword(data)
            setStatus({ success: true })
            setSubmitting(false)
            toast('Password successfully changed', 'success')
            navigate(ROUTE_CONSTANTS.AUTH.LOGIN.ABSOLUTE, { replace: true })
        } catch (error) {
            setStatus({ success: false });
            setSubmitting(false);
            toast(errorMessage(error), 'error')
        }
    }

    useEffect(() => {
        getAndCheckSecret()
    }, [])

    return (<>
        {
            loading ? <div> loading </div>
                :
                isValid ?
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
                            }}>
                            <Logo />
                            <Typography variant="h4" style={{ marginBottom: '20px', textAlign: 'center' }}>
                                Reset your password
                            </Typography>
                            <Formik
                                initialValues={{
                                    password: '',
                                    confirmPassword: '',
                                    submit: null
                                }}
                                validationSchema={Yup.object().shape({
                                    password: Yup.string()
                                        .min(8)
                                        .max(255)
                                        .required('The password field is required'),
                                    confirmPassword: Yup.string()
                                        .required('The confirm password field is required')
                                        .oneOf([Yup.ref('password'), null], 'Passwords must match')
                                })}
                                onSubmit={(values, { setErrors, setStatus, setSubmitting }) => handleResetPassword(values, setErrors, setStatus, setSubmitting)}
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
                                    <form noValidate onSubmit={handleSubmit}>
                                        <TextField
                                            error={Boolean(touched?.password && errors.password)}
                                            fullWidth
                                            margin="normal"
                                            helperText={touched?.password && errors.password}
                                            label={'Password'}
                                            name="password"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            type="password"
                                            value={values.password}
                                            variant="outlined"
                                        />
                                        <TextField
                                            error={Boolean(touched?.confirmPassword && errors.confirmPassword)}
                                            fullWidth
                                            margin="normal"
                                            helperText={touched?.confirmPassword && errors.confirmPassword}
                                            label={'confirmPassword'}
                                            name="confirmPassword"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            type="password"
                                            value={values.confirmPassword}
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
                                            {'Submit'}
                                        </Button>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    </Box> :
                    <Box dir={'rtl'}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            minHeight: '100vh',
                        }}
                    >
                        <Typography variant="h1" style={{ color: '#000' }}>
                            401
                        </Typography>
                        <Typography variant="h6" style={{ color: '#000' }}>
                            Token is not valid or expires.
                        </Typography>
                    </Box>
        }
    </>)
}
export default ResetPassword