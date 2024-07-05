import { Box, Card, Divider, Grid, Typography } from "@mui/material"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { adminService } from "src/api/services/admin"
import ClientLogo from "src/components/LogoSign/clientLogo"
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes"
import useToast from "src/hooks/useToast"

const PanelPrintPage = () => {
    const details = useLocation().pathname.split('/')
    const domain = useLocation().pathname
    const [isLoading, setIsLoading] = useState(true)
    const [realDetails, setRealDetails] = useState()
    const branchId = localStorage.getItem('branchId')
    const [carReadyIn, setCarReadyIn] = useState('')
    const [supportPhone, setSupportPhone] = useState('')
    const [branchConfigs, setBranchConfigs] = useState([])
    const [printed, setPrinted] = useState(false)
    const {id} = useParams()
    const navigate = useNavigate()
    const {toast} = useToast()
    const getDetails = async() => {
        try {
            const response = await adminService.getBookingDetails(id)
            setRealDetails(response.data.data)
            const configs = await adminService.getBranchConfigs(branchId)
            setBranchConfigs(configs.data.data)
            configs.data?.data?.map((conf) => {
              if(conf.key == 'brc#') {setCarReadyIn(conf.value)}
              if(conf.key == 'phone#') {setSupportPhone(conf.value)}
            })
            setTimeout(() => {
                if(!printed) print()
                setPrinted(true)
            },500)
        } catch (err) {
            toast(err?.response?.data?.message || 'Network Error!', 'error')
            // toast('Error on fetch details!', 'error')
            console.log(err);
        }
    }

    useEffect(() => {
        getDetails()
    }, [])

    

    const print = () => {
        var printContents = document.getElementById("printableArea").innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.BOOKING.GET_BY_DATA(id).ABSOLUTE, {replace: true})
        window.location.reload()
        
      }

    return (
        <>
        <Grid container display="flex" justifyContent="center" style={{ maxWidth: '400px' }} id="printableArea">

              <Box dir={'rtl'} style={{ marginBottom: -100, justifyContent: 'center', display: 'flex', zIndex: 10 }} >
                <ClientLogo />
              </Box>
              <Divider/>
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                pr={'20px'}
                pl={'20px'}
              >
                <Card
                  style={{ marginTop: "1rem", minHeight: "200px", paddingTop: '80px', paddingRight: '0', paddingLeft: '0', display: 'flex', justifyContent: 'center', boxShadow: 'none' }}
                >
                  <Grid container>
                    <Grid item xs={12} style={{ justifyContent: 'space-between', display: 'flex' }}>
                        <Box dir={'rtl'}>
                            <Typography fontSize={22}>Date</Typography>
                        </Box>
                        <Box dir={'rtl'}>
                            <Typography fontSize={22}>Time</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} style={{ justifyContent: 'space-between', display: 'flex' }}>
                        <Box dir={'rtl'}>
                            <Typography fontSize={22} fontWeight={800}>{dayjs().format('DD MMMM, YYYY')}</Typography>
                        </Box>
                        <Box dir={'rtl'}>
                            <Typography fontSize={22} fontWeight={800}>{dayjs().format('hh:mm A')}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} style={{ justifyContent: 'center', display: 'flex' }} pt={4}>
                      <Typography fontSize={32} style={{ textAlign: 'center', color: '#2C2C2C' }}>
                        Park Welcomes You!<br />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ justifyContent: 'center', display: 'flex' }} pt={2}>
                      <Typography fontSize={32} fontWeight={800} style={{ textAlign: 'center', color: '#2C2C2C' }}>
                        {realDetails?.keyTag?.code}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} style={{ justifyContent: 'center', display: 'flex' }} pt={2}>
                      <Typography fontSize={20} style={{ textAlign: 'center', color: '#2C2C2C' }}>
                        Support Phone: {supportPhone}<br />
                      </Typography>
                    </Grid>

                    <Grid item xs={12} style={{ justifyContent: 'center', display: 'flex' }} pt={2}>
                      <Typography fontSize={20} fontWeight={600} style={{ textAlign: 'center', color: '#2C2C2C' }}>
                        YOUR CAR WILL BE READY WITHIN {carReadyIn} MINUTES
                        <br />
                        SERVICE PRICE: <b>{realDetails?.price || 0}</b> KD
                      </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ justifyContent: 'center', display: 'flex' }} pt={0}>
                        <QRCode value={'https://' + window.location.hostname + '/client/' + realDetails?.hash || ''}/>
                    </Grid>
                  </Grid>

                </Card>
              </Grid>
            </Grid>
    </>
    )
}

export default PanelPrintPage