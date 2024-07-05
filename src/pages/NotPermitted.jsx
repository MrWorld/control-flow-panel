import React from 'react'
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'

const NotPermitted = () => {
    const navigate = useNavigate()

    return (
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
                Forbidden
            </Typography>
            <Typography variant="h6" style={{ color: '#000' }}>
                You are not permitted to see this page
            </Typography>
            <Button
                style={{ marginTop: '20px' }}
                onClick={() => navigate(ROUTE_CONSTANTS.DASHBOARD.ANALYTICS.ABSOLUTE)}
                variant="contained"
            >
                Back to home
            </Button>
        </Box>
    )
}
export default NotPermitted