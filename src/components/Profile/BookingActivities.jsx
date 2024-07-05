import React, { useState, useEffect } from 'react'
import {
    Grid,
    Typography,
    CardContent,
    Card,
    Box,
    Divider,
    Button,
    FormControl, 
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import Text from '../Text';
import UpdateModal from './UpdateModal'
import * as Yup from 'yup';
import { adminRolesOptions } from '../../constants'
import { adminService } from 'src/api/services/admin'
import useToast from 'src/hooks/useToast' 
import { useCheckPermission } from 'src/hooks/useCheckPermission'
import { errorMessage } from 'src/utils/errorTypeDetector'
import Bookings from 'src/pages/dashboard/masters/Booking';
import { BookingStatuses } from 'src/pages/dashboard/ControlPanel/Details/constants';

// ***** role management should be restricted and only super admin should see and work with it. so dynamic importing is required!
const BookingActivities = ({ user, handleRefreshData }) => {

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
                        {'Bookings '}
                    </Typography>
                    <Typography variant="subtitle2">
                        {'List of Bookings related to this admin'}
                    </Typography>
                </Box>
            </Box>
            <Divider />
            <CardContent
                sx={{
                    p: 0
                }}
            >
                <Typography variant="subtitle2">
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <Bookings forAdmin={user.id}/>
                        </Grid>
                    </Grid>
                </Typography>
            </CardContent>
        </Card>
    )
}
export default BookingActivities