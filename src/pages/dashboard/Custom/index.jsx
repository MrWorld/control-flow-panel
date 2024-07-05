// import { useUser } from "src/contexts/GlobalContext"

import { CarRentalOutlined, CreateOutlined, ExitToAppOutlined, MessageOutlined, PlusOneOutlined } from "@mui/icons-material"
import { Box, Grid, Typography } from "@mui/material"
import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { authService } from "src/api/services/auth"
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes"
import { usePurgeUser, useUser } from "src/contexts/GlobalContext"
import { useCheckPermission } from "src/hooks/useCheckPermission"
import useToast from "src/hooks/useToast"

const CustomDashboard = () => {
    const user = useUser()
    const purgeUser = usePurgeUser()
    const {checkPermission} = useCheckPermission()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const handleLogout = async () => {
        if (loading) return
    
        try {
          setLoading(true)
          await authService.logout()
          await purgeUser()
          localStorage.removeItem('branchId')
          toast('Sign out success!', 'success')
          setLoading(false)
          navigate(<Navigate to={ROUTE_CONSTANTS.AUTH.LOGIN.ABSOLUTE} />)
        } catch (err) {
          setLoading(false)
          toast('Sign out has problem, Please try again', 'error')
        }
      };

    return (
        <>
            <Box dir={'rtl'} sx={{p: 2}}>
                <Grid container spacing={2} justifyContent={'center'} >
                        {checkPermission('BOOKING:READ') ? <>
                            <Grid item>
                                <Box dir={'rtl'} borderRadius={'50%'} height={'200px'} width={'200px'} sx={{background:'#c5c5c5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '1px solid divider', cursor: 'pointer'}}
                                    onClick={() => navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.BOOKING.ADD_NEW.ROOT.ABSOLUTE, {replace: true})}
                                    >
                                    <CarRentalOutlined sx={{fontSize: '100px'}}/>
                                    <Typography fontSize={20}>
                                            Take Vehicle In
                                    </Typography>
                                </Box>
                            </Grid>
                        </>: <></>}
                        {checkPermission('CONFIGURATION:SENDSMS') ? <>
                            <Grid item>
                                <Box dir={'rtl'} borderRadius={'50%'} height={'200px'} width={'200px'} sx={{background:'#c5c5c5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '1px solid divider', cursor: 'pointer'}}
                                    onClick={() => navigate(ROUTE_CONSTANTS.DASHBOARD.SMS.ABSOLUTE, {replace: true})}
                                    >
                                    <MessageOutlined sx={{fontSize: '100px'}}/>
                                    <Typography fontSize={20}>
                                            Send SMS
                                    </Typography>
                                </Box>
                            </Grid>
                        </>: <></>}
                        <Grid item>
                            <Box dir={'rtl'} borderRadius={'50%'} height={'200px'} width={'200px'} sx={{background:'#c5c5c5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '1px solid divider', cursor: 'pointer'}}
                                onClick={() => handleLogout()}
                                >
                                <ExitToAppOutlined sx={{fontSize: '100px'}}/>
                                <Typography fontSize={20}>
                                        Logout
                                </Typography>
                            </Box>
                        </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default CustomDashboard