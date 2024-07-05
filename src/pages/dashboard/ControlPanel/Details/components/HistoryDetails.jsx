import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import dayjs from 'dayjs';

export default function HistoryDetails({ data }) {
  return (
    <Timeline>

      {data.map((history, index) => {
        return <TimelineItem key={index}>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{history.title}</TimelineContent>
          <TimelineContent>{dayjs(history.createdAt).format('d MMM, YYYY, h:mm a')}</TimelineContent>
        </TimelineItem>
      })}
    </Timeline>
  );
}