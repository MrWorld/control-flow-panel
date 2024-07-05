/* eslint-disable no-undef */
import React, { useState } from 'react'
import {
    Typography,
    Box,
    styled,
    Tooltip,
    IconButton,
    Avatar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from "dayjs";
import {
    parcelCardDimension,
} from '../constants'
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import { imageURLCombiner } from 'src/utils/imageUrlCombiner'
import { staticImages } from 'src/assets/images'
import OrderStatusSelector from '../../Orders/components/OrderStatusSelector';

const duration = require('dayjs/plugin/duration')
const relativeTime = require('dayjs/plugin/relativeTime')
const isBetween = require('dayjs/plugin/isBetween')

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(isBetween)

const ParcelCard = ({ parcel, rangeView, minuteWidth, update }) => {
    // const navigate = useNavigate()
    const [hoveredParcel, setHoveredParcel] = useState(undefined)

    const offsetGenerator = () => {
        if (rangeView) return `${parcel.offsetStart + 5}px`
        else return `${parcel.offsetStart}px`
    }

    const parcelCardWidthGenerator = () => {
        const { width } = parcelCardDimension

        let parcelCardWidth = width
        if (!rangeView) {
            const formattedGivenTime = dayjs(parcel.deliveryStart).format('YYYY/MM/DD HH:mm')
            const width = dayjs(parcel.deliveryEnd).diff(dayjs(formattedGivenTime), 'm')
            parcelCardWidth = width * minuteWidth
        }

        if (parcelCardWidth < 250) parcelCardWidth = 250
        return parcelCardWidth + 'px'
    }

    const stylesGenerator = () => {
        let zIndex, backgroundColor

        if (hoveredParcel === undefined) {
            backgroundColor = '#243750'
            zIndex = 1
        }
        else if (hoveredParcel === parcel.id) {
            backgroundColor = '#2a415e'
            zIndex = 10
        }
        else {
            backgroundColor = '#243750'
            zIndex = 1
        }

        return {
            backgroundColor,
            zIndex
        }
    }

    return (
        <StyledParcelCardWrapper
            onMouseLeave={() => setHoveredParcel(undefined)}
            onMouseEnter={() => setHoveredParcel(parcel.id)}
            color={parcel?.statusColor || '#fff'}
            style={{
                left: offsetGenerator(),
                top: parcel.top,
                backgroundColor: stylesGenerator().backgroundColor,
                zIndex: stylesGenerator().zIndex,
                width: parcelCardWidthGenerator(),
            }}
        >
            <Box dir={'rtl'} className='border-raight' />
            <Box dir={'rtl'} className='parcel-card-body'>
                <Box dir={'rtl'} className='parcel-card-row'>
                    <Box dir={'rtl'}>
                        <Typography className='pcl-id'>PCL_{parcel.id}</Typography>
                    </Box>
                    <Box dir={'rtl'} className='details-icon'>
                        <Typography noWrap>
                            <Tooltip title={'View'} arrow>
                                <IconButton
                                    component={RouterLink}
                                    // disabled={!checkPermission('GET_VENDOR_DETAIL')}
                                    // to={checkPermission('GET_VENDOR_DETAIL') && ROUTE_CONSTANTS.DASHBOARD.LOGISTICS.VENDORS.GET_BY_DATA(data.id).ABSOLUTE}
                                    to={ROUTE_CONSTANTS.DASHBOARD.LOGISTICS.PARCELS.GET_BY_DATA(parcel.id).ABSOLUTE}
                                    style={{ color: '#dbdbdb' }}
                                >
                                    <LaunchTwoToneIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Typography>
                    </Box>
                </Box>
                <Box dir={'rtl'} className='parcel-card-row'>
                    <Typography>{dayjs(parcel.deliveryStart).format('HH:mm')}</Typography>
                    <Typography>{parcel.deliveryType}</Typography>
                </Box>
                <Box dir={'rtl'} className='parcel-card-row' style={{ borderBottom: '1px solid #dbdbdb60', marginTop: '10px' }} />
                <Box dir={'rtl'} className='parcel-card-row' style={{ marginTop: '9px', alignItems: 'center' }}>
                    <Box dir={'rtl'} >
                        <OrderStatusSelector
                            status={parcel?.parcelStatus}
                            listOrder={parcel?.id}
                            onUpdateStatus={update}
                            style={{ backgroundColor: parcel?.statusColor, color: parcel?.textColor, minWidth: '120px', height: '30px' }}
                            from='parcelDetail'
                        />
                    </Box>
                    <Box dir={'rtl'} style={{ display: 'flex', flexDirection: 'row-reverse', position: 'relative' }}>
                        {parcel.soldItems.length > 0 && parcel.soldItems.map((p, index) =>
                            <Avatar
                                key={index}
                                alt="product-images"
                                src={imageURLCombiner(p.product?.medias[0]?.url) || staticImages.sampleWorld}
                                sx={{ width: 35, height: 35 }}
                                className='product-item'
                            />
                        )}
                    </Box>
                </Box>
            </Box>
        </StyledParcelCardWrapper>
    )
}
export default ParcelCard

const StyledParcelCardWrapper = styled(Box)`
    height: 130px; 
    margin-top: 10px; 
    border-radius: 15px;
    display: flex;
    flex-direction: row;
    border: 1px solid #3b4c62;
    position: absolute;
    .border-raight{
        height: 80%;
        width: 5px;
        background-color: ${p => p.color};
        display: flex;
        align-self: center;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        margin-left: 0px;
        box-shadow: -0px 0px 8px 0px ${p => p.color};
    }
    .parcel-card-body{
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 8px;
        .parcel-card-row{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            color: #dbdbdb;
            .pcl-id{
                color: #dbdbdb;
                margin-top: 5px;
                font-weight: 600;
            };
            .details-icon{
                display: flex;
                justify-content: center;
                align-items: center;
            };
            .product-item{
                margin-left: -20px;
                border: 2px solid #243750;
            };
            .divider{
                width: 3px;
                color: red;
                height: 3px;
            };
            .status-box{
                width: auto;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #427899;
                padding: 0px 20px;
                border-radius: 8px;
            }
        }
    }
`
