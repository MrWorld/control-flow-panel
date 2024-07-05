import React from 'react'
import {
    Grid,
    Typography,
    CardContent,
    Card,
    Box,
    Divider,
} from '@mui/material';
import Text from '../Text';
import Label from '../Label';


const EmailManagement = ({ user }) => {
    return (
        <Card>
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
                                {'Email Address'}:
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                            <Text color="black">
                                <b>{user.email}</b>
                            </Text>
                        </Grid>
                    </Grid>
                </Typography>
            </CardContent>
        </Card>
    )
}
export default EmailManagement