import React from 'react'
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
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
                404
            </Typography>
            <Typography variant="h6" style={{ color: '#000' }}>
                The page you’re looking for doesn’t exist.
            </Typography>
            <Button 
                style={{ marginTop: '20px'}} 
                onClick={() => navigate(-1)} 
                variant="contained"
            >
                Go Back
            </Button>
        </Box>
    )
}
export default NotFound