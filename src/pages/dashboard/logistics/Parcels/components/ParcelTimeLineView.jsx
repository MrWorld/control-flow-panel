/* eslint-disable no-undef */
import React, { useState, useRef, useLayoutEffect } from 'react'
import { Box, styled, Typography } from '@mui/material';
import { timeLinePeriod, parcelCardDimension } from '../constants'

import ParcelCard from '../components/ParcelCard'

import dayjs from "dayjs";
const duration = require('dayjs/plugin/duration')
const relativeTime = require('dayjs/plugin/relativeTime')
const isBetween = require('dayjs/plugin/isBetween')

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(isBetween)
let timeInterval
const ParcelTimeLineView = ({ parcelsList, rangeView, update }) => {
    const containerRef = useRef(null)
    const hourWidth = rangeView ? 150 : 300
    const initialCurrentTimeOffset = -50 // **** This is for putting center of elemet in the exact time offset
    const minuteWidth = hourWidth / 60
    const defaultOffset = 70
    const [currentTimeLineOffset, setCurrentTimeLineOffset] = useState(initialCurrentTimeOffset)
    const [generatedColumns, setGeneratedColumns] = useState([])
    const [parcelCards, setParcelCards] = useState([])

    const currentTimeLineOffsetCalculator = (givenColumns) => {
        const startOfPeriod = givenColumns[0].date + ' ' + givenColumns[0].hour
        const formattedNow = dayjs().format('YYYY/MM/DD HH:mm:ss')
        const minutesAwaitFromStart = dayjs(formattedNow).diff(dayjs(startOfPeriod), 'm')

        setCurrentTimeLineOffset((minutesAwaitFromStart * minuteWidth) + initialCurrentTimeOffset)
    }

    const handleScrollToCurrentTimePointer = () => {
        containerRef.current.scrollTo({
            left: (currentTimeLineOffset - initialCurrentTimeOffset) - 300, // 300 is for showing sometimes in the past
            behavior: "smooth"
        })
    }

    const filteredParcelData = (givenColumns) => {
        const startOfPeriod = givenColumns[0].date + ' ' + givenColumns[0].hour
        const parcels = {}
        let targetArray = []

        givenColumns.forEach(column => {
            const formattedColumnDate = new Date(column.date + ' ' + column.hour)
            const formattedNextHourOfGivenDate = formattedColumnDate.getTime() + 1 * 60 * 60 * 1000

            parcelsList.forEach(parcel => {
                const fomattedGivenItemDate = dayjs(new Date(dayjs(parcel.deliveryStart).format('YYYY/MM/DD HH:mm:ss')).getTime() + 1000)
                const columnDate = dayjs(formattedColumnDate).format('YYYY/MM/DD HH:mm:ss')

                const formattedGivenTime = dayjs(parcel.deliveryStart).format('YYYY/MM/DD HH:mm')
                const minutesAwaitFromStart = dayjs(formattedGivenTime).diff(dayjs(startOfPeriod), 'm')
                const offset = minutesAwaitFromStart * minuteWidth

                if (fomattedGivenItemDate.isBetween(columnDate, formattedNextHourOfGivenDate, 'second')) {
                    if (parcels[column.hour]) {
                        const calculation = (parcelCardDimension.height * (parcels[column.hour].length)) + ((parcels[column.hour].length) * 20) + defaultOffset
                        parcels[column.hour] = [...parcels[column.hour], { ...parcel, offsetStart: offset, top: calculation }]
                    } else {

                        parcels[column.hour] = [{ ...parcel, offsetStart: offset, top: defaultOffset }]
                    }
                }
            })
        })

        Object.values(parcels).forEach(item => {
            targetArray = [...targetArray, ...item]
        })
        setParcelCards(targetArray)
    }


    const columnGenerator = () => {
        let hoursAgo = parseInt(dayjs().subtract(timeLinePeriod.hoursBefore, 'hour').format('HH'))
        let today = new Date()
        let tomorrow = new Date()
        let isTomorrow = false
        tomorrow.setDate(today.getDate() + 1)

        const twentyFourHoursRange = []
        let tempHour = hoursAgo

        for (let i = 0; i < timeLinePeriod.durationHours; i++) {
            if (tempHour < 24) {
                let formattedTempHour
                if (tempHour < 10) formattedTempHour = `0${tempHour}:00`
                else formattedTempHour = `${tempHour}:00`

                twentyFourHoursRange.push({
                    hour: formattedTempHour,
                    date: isTomorrow
                        ? dayjs(tomorrow).format('YYYY/MM/DD')
                        : dayjs(today).format('YYYY/MM/DD')
                })
            } else {
                let formattedTempHour = '00:00'
                isTomorrow = true
                tempHour = 0
                twentyFourHoursRange.push({
                    hour: formattedTempHour,
                    date: dayjs(tomorrow).format('YYYY/MM/DD')
                })
            }
            tempHour += 1
        }
        setGeneratedColumns(twentyFourHoursRange)
        return twentyFourHoursRange
    }

    useLayoutEffect(() => {
        let gColumns = columnGenerator()
        currentTimeLineOffsetCalculator(gColumns)
        filteredParcelData(gColumns)

        timeInterval = setInterval(() => {
            currentTimeLineOffsetCalculator(gColumns)
        }, 30000)
        return () => {
            clearInterval(timeInterval)
        }
    }, [rangeView])

    useLayoutEffect(() => {
        handleScrollToCurrentTimePointer()
    }, [currentTimeLineOffset])

    const elementDimension = () => {
        const myWrapperHeight = 536 // calc(100vh - 448px)
        let parcelCardHeight = 0
        let theMostDeepestParcelCard, bottom, height


        if (parcelCards.length > 0) {
            theMostDeepestParcelCard = parcelCards.sort((a, b) => b.top - a.top)[0].top
            if (theMostDeepestParcelCard < myWrapperHeight) {
                bottom = myWrapperHeight
                height = myWrapperHeight
                parcelCardHeight = 0
            }
            else {
                bottom = theMostDeepestParcelCard
                height = theMostDeepestParcelCard + parcelCardDimension.height
                parcelCardHeight = parcelCardDimension.height
            }
        }

        return {
            bottom: bottom ? (myWrapperHeight - (bottom + parcelCardHeight)) + 'px' : '0px',
            height: height ? height + 'px' : myWrapperHeight + 'px'
        }
    }

    return (
        <StyledTimeLineWrapper ref={containerRef}>

            <StyledCurrentTimeLine style={{ left: currentTimeLineOffset + 'px', top: '0px', bottom: elementDimension().bottom }}>
                <Box dir={'rtl'} className='current-time-wrapper'>
                    <Typography variant='h5'>{dayjs().format('HH:mm')}</Typography>
                </Box>
                <Box dir={'rtl'} className='divider-wrapper'>
                    <Box dir={'rtl'} className='divier' />
                </Box>
            </StyledCurrentTimeLine>
            {generatedColumns.map((hourColumn, index) =>
                <StyledGrandParentColumn key={index} style={{ height: 'calc(100vh - 448px)' }}>
                    <Box dir={'rtl'} className='wrapper-box' key={index} style={{ width: hourWidth, height: elementDimension().height }}>
                        <Box dir={'rtl'} className='time-label-header'>
                            {hourColumn.hour}
                        </Box>
                    </Box>
                </StyledGrandParentColumn>
            )}
            {parcelCards.map((parcel, index) =>
                <ParcelCard key={index} parcel={parcel} rangeView={rangeView} minuteWidth={minuteWidth} update={update} />
            )}
        </StyledTimeLineWrapper>
    )
}
export default ParcelTimeLineView


const StyledTimeLineWrapper = styled(Box)`
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap:
    overflow: auto;
    width: 100%;
    background: #122334;
    padding-top: 60px;
    position: relative;
    height: calc(100vh - 350px);
    overflow: scroll;
`
const StyledGrandParentColumn = styled(Box)`
    .wrapper-box{
        // height: 800px; // ********this is target element
        flex-shrink: 0;  
        border-left: 1px dashed #dbdbdb24; 
        position: relative;
        padding: 16px 8px 0px 8px;
        .time-label-header{
            position: absolute;
            top: -20px;
            left: -18px;
            color: #dbdbdb80;
        }
    }
`

const StyledCurrentTimeLine = styled(Box)`
    width: 100px;
    // height: 800px; // ********this is target element 
    position: absolute;
    top: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .divider-wrapper{
        width: 100%;
        height: 100%;
        // background: #dde2ff;
        background: rgb(126,111,208);
        background: linear-gradient(0deg, rgba(126,111,208,0) 0%, rgba(126,111,208,0.4248074229691877) 50%, rgba(126,111,208,0.7441351540616247) 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        .divier{
            position:absolute;
            width: 2px;
            top: -40px;
            height: 100%;
            background: rgb(174,213,255);
            background: linear-gradient(0deg, rgba(174,213,255,0.22872899159663862) 0%, rgba(174,213,255,0.6152836134453781) 50%, rgba(174,213,255,1) 100%);
        };
    };
    .current-time-wrapper{
        display: flex;
        justify-content: center;
        width: 100%;
        height: 66px;
        color: rgb(174,213,255)
    }
`