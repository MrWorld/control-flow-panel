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
    Option,
    MenuItem,
    List,
    ListItem,
    IconButton,
    ListItemText,
} from '@mui/material';
import { adminService } from 'src/api/services/admin'
import useToast from 'src/hooks/useToast' 
import { useCheckPermission } from 'src/hooks/useCheckPermission'
import Bookings from 'src/pages/dashboard/masters/Booking';

  
const BookingManagement = ({ user, handleRefreshData }) => {

    const { checkPermission } = useCheckPermission()
    const { toast } = useToast()

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
                        {'Customer Bookings'}
                    </Typography>
                    <Typography variant="subtitle2">
                        {'You can see customer booking list here'}
                    </Typography>
                </Box>
            </Box>
            <Divider />
            <CardContent
                sx={{
                    p: 0
                }}
            >

            <Bookings fromOthers={true} filterKey={'customerId'} filterId={user?.id}/>

            </CardContent>
        </Card>
    )
}
export default BookingManagement