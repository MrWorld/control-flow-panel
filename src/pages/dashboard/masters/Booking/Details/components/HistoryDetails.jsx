import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import dayjs from 'dayjs';
import { ArrowCircleRight, HomeMiniOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';

export default function HistoryDetails({ data }) {
  return (
    <Box dir={'rtl'}>
       <Timeline>
        {data.map((history, index) => {
          return <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot sx={{
                height: 'auto',
                marginLeft: '-12px',
                marginTop: '-18px'
              }}>
                <ArrowCircleRight />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{
              marginLeft: 2
            }}>
              <Typography fontWeight={700} color={'primary'}>
                {dayjs(history.createdAt).format('hh:mm A')}
              </Typography>
              <Typography fontWeight={400}>
                {history.title}
              </Typography>
              <Typography fontWeight={200}>
                {history?.data?.message} {history?.data?.location ? `"${history?.data?.location}"`: '' || ''}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        })}
        </Timeline>
    </Box>
   
  );
}