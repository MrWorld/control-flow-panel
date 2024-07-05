import React, { useEffect, useState, useCallback } from 'react'
import {
    Grid,
    Card,
    styled,
    CircularProgress,
    Typography,
    Box,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableContainer,
    TableRow,
    Tabs,
    Tab
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import useToast from 'src/hooks/useToast'
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from './components/PageHeader';
import { useCheckPermission } from 'src/hooks/useCheckPermission';
import { adminService } from 'src/api/services/admin';
import dayjs from 'dayjs';
import OrderStatusSelector from '../../Orders/components/OrderStatusSelector';
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { QRCode } from 'react-qrcode-logo';

const ParcelDetails = () => {
    let tabs = [{ label: 'English', value: 'en' }, { label: 'Arabic', value: 'ar' }]
    const { checkPermission } = useCheckPermission()
    const navigate = useNavigate()
    const parcelId = useParams().id //**** order ID from list
    const { toast } = useToast()
    const [parcel, setParcel] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState({ label: 'English', value: 'en' })

    const handleChangeLanguage = (e, val) => {
        let selected = tabs.find(tab => tab.value === val)

        setActiveTab(selected)
    }

    const getData = useCallback(async () => {
        if (!checkPermission('GET_PARCEL_DETAIL')) return true;
        try {
            setLoading(true)
            let res = await adminService.getParcelDetails(parcelId)
            setLoading(false)
            setParcel(res.data.data)
        } catch (error) {
            setLoading(false)
            if (error?.response?.status === 403) {
                navigate(-1)
                toast("you don't have permission to get this parcerl", 'error')
            }
        }
    }, [])

    useEffect(() => {
        getData()
    }, [])

    if (loading) return <Box dir={'rtl'} style={{ height: '400px', alignItems: 'center', display: 'flex', justifyContent: 'center' }}><CircularProgress size="3rem" /></Box>
    return (
        <>
            <PageTitleWrapper>
                <PageHeader />
            </PageTitleWrapper>
            <Grid container p={2}>
                <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
                    <StyledCard>
                        <Typography fontSize={20} fontWeight='800'>Parcel Status</Typography>
                        {
                            checkPermission('GET_PARCEL_DETAIL') && checkPermission('UPDATE_PARCEL_STATUS') && <Box dir={'rtl'} display='flex' flexDirection='row' >
                                <OrderStatusSelector
                                    listOrder={parcelId}
                                    onUpdateStatus={getData}
                                    status={parcel?.parcelStatus}
                                    style={{ height: '40px', backgroundColor: parcel?.statusColor, color: parcel?.textColor }}
                                    containerStyle={{ marginTop: '15px' }}
                                    from="parcelDetail"
                                />
                            </Box>
                        }
                    </StyledCard>
                    <StyledCard>
                        <Box dir={'rtl'} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Typography fontSize={20} fontWeight='800'>Address</Typography>
                            <TabsWrapper
                                onChange={handleChangeLanguage}
                                scrollButtons="auto"
                                textColor="secondary"
                                value={activeTab.value || 'Details'}
                                variant="scrollable"
                            >
                                {tabs.map((tab) => (
                                    <Tab key={tab.value} value={tab.value} label={tab.label} />
                                ))}
                            </TabsWrapper>
                        </Box>
                        <AddressWrapper>
                            <Typography variant='h5' style={{ direction: activeTab.value === 'en' ? 'ltr' : 'rtl' }}>
                                {activeTab.value === 'en'
                                    ? parcel?.address?.area?.name
                                    : parcel?.address?.area?.nameAr
                                }
                            </Typography>
                            <Typography mt={2} style={{ direction: activeTab.value === 'en' ? 'ltr' : 'rtl' }}>
                                {activeTab.value === 'en'
                                    ? parcel?.address?.text
                                    : parcel?.address?.textAr
                                }
                            </Typography>
                        </AddressWrapper>
                    </StyledCard>
                    <StyledCard>
                        <Typography fontSize={20} fontWeight='800'>Products</Typography>
                        <Box dir={'rtl'} display='flex' flexDirection='column' style={{}}>
                            <ProductTable data={parcel?.soldItems || []} />
                        </Box>
                    </StyledCard>
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                    <StyledCard>
                        <Typography fontSize={20} fontWeight='800'>QR code</Typography>
                        <QrCodeWrapper>
                            <QRCode
                                value="https://github.com/gcoro/react-qrcode-logo"
                                ecLevel='M'
                                size={170}
                            />
                        </QrCodeWrapper>
                    </StyledCard>
                    <StyledCard>
                        <Typography fontSize={20} fontWeight='800'>Delivery Range</Typography>
                        <DeliveryRange parcel={parcel} />
                    </StyledCard>
                    <StyledCard>
                        <Typography fontSize={20} fontWeight='800'>Order</Typography>
                        <OrderWrapper>
                            <Box dir={'rtl'} className='order-status-wrapper'>
                                order status here: {parcel?.order?.status}
                            </Box>
                            <StyledPaymentCard>
                                <Box dir={'rtl'} display='flex' flexDirection='row' justifyContent='space-between'>
                                    <Typography fontSize={11} textTransform='uppercase'>Delivery Price</Typography>
                                    <Typography ml={1} fontSize={13} fontWeight='700'>KD {parcel?.order?.deliveryPrice}</Typography>
                                </Box>
                                <Box dir={'rtl'} display='flex' flexDirection='row' justifyContent='space-between'>
                                    <Typography fontSize={11} textTransform='uppercase'>Sub Total</Typography>
                                    <Typography ml={1} fontSize={13} fontWeight='700'>KD {parcel?.order?.subTotal}</Typography>
                                </Box>
                                <Box dir={'rtl'} display='flex' flexDirection='row' justifyContent='space-between'>
                                    <Typography fontSize={11} textTransform='uppercase'>Tax</Typography>
                                    <Typography ml={1} fontSize={13} fontWeight='700'>KD {parcel?.order?.taxAmout}</Typography>
                                </Box>
                                <Box dir={'rtl'} display='flex' flexDirection='row' justifyContent='space-between'>
                                    <Typography fontSize={11} textTransform='uppercase'>Total Price</Typography>
                                    <Typography ml={1} fontSize={13} fontWeight='700'>KD {parcel?.order?.totalPrice}</Typography>
                                </Box>
                            </StyledPaymentCard>
                        </OrderWrapper>
                    </StyledCard>
                </Grid>
            </Grid>
        </>
    )
}
export default ParcelDetails

const DeliveryRange = ({ parcel }) => {
    return (
        <DeliveryRangeWrapper>
            <Box dir={'rtl'} className='range-wrapper'>
                <Typography variant='h5'>{dayjs(parcel?.deliveryStart).format('HH:mm')}</Typography>
                <Typography variant='h5'>{dayjs(parcel?.deliveryEnd).format('HH:mm')}</Typography>
            </Box>
            <Box dir={'rtl'} className='delivery-bar'>
                {/* <Box dir={'rtl'} className='now-pointer' style={{left: '20%'}}/> */}
            </Box>
        </DeliveryRangeWrapper>
    )
}

const ProductTable = ({ data }) => {
    const { checkPermission } = useCheckPermission()
    const navigate = useNavigate()

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{'Photo'}</TableCell>
                        <TableCell>{'Name'}</TableCell>
                        <TableCell>{'Count'}</TableCell>
                        <TableCell>{'Type'}</TableCell>
                        <TableCell>{'Category'}</TableCell>
                    </TableRow>
                </TableHead>
                {data.map(sItem =>
                    <TableBody key={sItem.id}>
                        <TableRow hover key={data.id}>
                            <TableCell>
                                <StyledAvatar alt={'product-image'} src={sItem?.product?.medias[0]?.url} />
                            </TableCell>
                            <TableCell>
                                {checkPermission('GET_PRODUCT_DETAIL')
                                    ? <Link
                                        variant="h5"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(ROUTE_CONSTANTS.DASHBOARD.CATALOG.PRODUCT.GET_BY_DATA(sItem.product.id).ABSOLUTE)}
                                    >
                                        {sItem?.product?.name}
                                    </Link>
                                    : <Typography variant='h5'>{sItem?.product?.name}</Typography>
                                }
                            </TableCell>
                            <TableCell>
                                <Typography variant='h5'>{sItem?.count}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant='h5'>{sItem?.product?.category?.name}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant='h5'>{sItem?.product?.type?.name}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                )}
            </Table>
        </TableContainer>
    )
}

const OrderWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    .order-status-wrapper{
    }
`

const QrCodeWrapper = styled(Box)`
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
`
const AddressWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    margin-top: 10px;

`

const DeliveryRangeWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
    .range-wrapper{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .delivery-bar{
        margin-top: 8px;
        width: 100%;
        height: 15px;
        background: #c7c7c7;
        border-radius: 8px;
        position: relative;
        .now-pointer{
            width: 25px;
            height: 25px;
            background: green;
            border-radius: 50%;
            position: absolute;
        }
    } 
`

const StyledCard = styled(Card)(
    () => `
        padding: 20px;
        margin-top: 20px;
        margin: 10px
  `
);

const StyledAvatar = styled('img')(
    () => `
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 8px;
  `
);

const StyledPaymentCard = styled(Box)(
    () => `
        width: 100%;
        box-shadow: 0px 0px 3px #c4c4c4;
        border-radius: 9px;
        margin-top: 8px;
        padding: 10px;
        // display: flex;
        // justify-content: center;
        // align-items: center
  `
);

const TabsWrapper = styled(Tabs)(
    ({ theme }) => `
      @media (max-width: ${theme.breakpoints.values.md}px) {
        .MuiTabs-scrollableX {
          overflow-x: auto !important;
        }
  
        .MuiTabs-indicator {
            box-shadow: none;
        }
      }
      `
);





