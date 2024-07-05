import React, { useState, useEffect } from 'react'
import {
    Card,
    Grid,
    Box,
    Divider,
    styled,
    Typography,
    CircularProgress
} from '@mui/material';
import { adminService } from 'src/api/services/admin';
import { useCheckPermission } from 'src/hooks/useCheckPermission';
import useToast from 'src/hooks/useToast'
// import { errorMessage } from '../../../../../../utils/errorTypeDetector'

const ShopTiming = ({ data }) => {
    const { checkPermission } = useCheckPermission()
    const [shopTiming, setShopTiming] = useState([])
    const [weekDays, setWeekDays] = useState([])

    const getTimingData = async () => {
        if (!checkPermission('GET_VENDOR_TIMINGS')) return true
        let tempWeeksDays = []
        try {
            let res = await adminService.getVendorTiming(data.id)
            setShopTiming(res.data.data)
            tempWeeksDays = [...new Set(res.data.data.map(item => item.day))];

            setWeekDays(tempWeeksDays)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTimingData()
    }, [])

    return (
        <>
            <Grid container display='flex' justifyContent='center'>
                <Grid item xl={8} lg={8} md={12} sm={12} xs={12}>
                    {weekDays.map(day => <DayCard key={day} day={day} data={shopTiming} />)}
                </Grid>
            </Grid>
        </>
    )
}

export default ShopTiming

const DayCard = ({ day, data }) => {
    const [shopTiming, setShopTiming] = useState([])

    const handleSetShopTiming = () => {
        let tempArray = []
        data.forEach(item => {
            if (item.day === day) tempArray = [...tempArray, item]
        })
        setShopTiming(tempArray)
    }

    useEffect(() => {
        handleSetShopTiming()
    }, [])

    return (
        <StyledWrapperCard>
            <StyledHeaderBox>
                <Typography className='header-text'>{day}</Typography>
            </StyledHeaderBox>
            <Divider
                sx={{
                    my: 1
                }}
            />
            <Box dir={'rtl'} display='flex' flexDirection='row' justifyContent='center' flexWrap='wrap'>
                {shopTiming.map(period =>
                    <WorkingHoursCard key={period.id} period={period} />
                )}
            </Box>
        </StyledWrapperCard>

    )
}

const WorkingHoursCard = ({ period }) => {
    const { checkPermission } = useCheckPermission()
    const [active, setActive] = useState(period.available)
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const handleUpdateActivity = async id => {
        if (checkPermission && !checkPermission('UPDATE_VENDOR_TIMINGS')) return true
        try {
            setLoading(true)
            await adminService.changeVendorTiming(id, { available: !active })
            setActive(prev => !prev)
            setLoading(false)
            toast('Timing updated', 'success')
        } catch (error) {
            setLoading(false)
            toast('Error in updating timing', 'error')
            console.log(error);
        }
    }

    return (
        <StyledWorkingHoursCard isActive={active ? 'true' : 'false'} onClick={() => checkPermission('UPDATE_VENDOR_TIMINGS') && handleUpdateActivity(period.id)}>
            <Typography className='text'>{period.timeRange}</Typography>
            {loading &&
                <HoveredLoading>
                    <CircularProgress size={20} disableShrink thickness={3} />
                </HoveredLoading>
            }
        </StyledWorkingHoursCard>
    )
}


const StyledHeaderBox = styled(Box)`
      display: flex;
      justify-content: start;
      padding-left: 20px;
      .header-text{
        font-size: 13px;
        font-weight: bold;
      } 

`

const HoveredLoading = styled(Box)`
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
      opacity: 0.5;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
`

const StyledWorkingHoursCard = styled(Box)`
      width: 100px;
      height: 40px;
      background: ${props => props.isActive === 'true' ? '#7e6fd0' : '#e9e9e9'};
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      position: relative;
      margin: 3px;
      .text{
        font-size: 12px;
        font-weight: 600;
        color: ${props => props.isActive === 'true' ? '#fff' : '#000'};
      }
`
const StyledWrapperCard = styled(Card)`
      padding: 8px;
      margin: 10px 0px 10px 0px;
      &:last-child{
        margin-bottom: 90px
      }
`