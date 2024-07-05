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
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Rating,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useToast from 'src/hooks/useToast'
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { useCheckPermission } from 'src/hooks/useCheckPermission';
import SuspenseLoader from 'src/components/layouts/SuspenseLoader';

const AddUpdatePage = ({ addNew }) => {
    const { checkPermission } = useCheckPermission();
    const details = useLocation().state
    const theme = useTheme()
    const { toast } = useToast()
    const navigate = useNavigate()
    const {id} = useParams()
    const [realDetails, setRealDetail] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
    const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
    const targetId = details?.id

    const getDetails = async() => {
        try {
            const response = await adminService.getFeedback(id)
            setRealDetail(response.data.data)
            setIsLoading(false)

        }catch(err) {
            toast(err.response.data.message, 'error')
            console.log(err)
        }
    }

    useEffect(() => {
        getDetails()
    }, [])

    return (
        <>
            <Grid container padding={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {addNew ? 'Feedback' : 'Feedback'}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container p={2}>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <Typography variant='subtitle2' marginBottom='20px'>
                        {addNew ? 'See your customer feed back' : 'See your customer feed back'}
                    </Typography>
                    <Card style={{ padding: '25px', }}>
                        {isLoading ? <SuspenseLoader /> : <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Rating value={realDetails?.rating || 0} readOnly ></Rating>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth value={realDetails?.subject} label={'Subject'} readOnly>

                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth value={realDetails?.message} rows={4} label={'message'} multiline
                                    maxRows={10} readOnly/>
                                </Grid>
                            </Grid>
                        </>}
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default AddUpdatePage