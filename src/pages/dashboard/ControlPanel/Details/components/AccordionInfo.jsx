import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { Box, Button, Dialog, DialogContent, Divider, Grid, IconButton, useMediaQuery } from '@mui/material';
import GridedFeaturedText from 'src/components/FeaturedText/gridedtext';
import dayjs from 'dayjs';
import { BookingStatuses } from '../constants';
import { Swiper,SwiperSlide} from 'swiper/react';
import SwiperCore, { Navigation, Thumbs } from 'swiper/core';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@mui/icons-material';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
SwiperCore.use([Navigation, Thumbs]);

export default function BookingAccordionDetails({ data }) {
  const [expanded, setExpanded] = useState('panel1');
  const [showPic, setShowPic] = useState(false)
  const theme = useTheme()
  const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
  const [thumbsSwiper] = useState(null);
  const handleChange =
    (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };

  const statusToText = (status) => {
    switch (status) {
      case 0:
        return 'booked'
      case 1:
        return 'parked'
    }
  }

  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} variant="outlined">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Ticket Details
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {data?.id}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
        <GridedFeaturedText title='Ticket Number' text={data.ticket || '-'} />
          <Divider />
          <GridedFeaturedText title='Identifier' text={data.id} />
          <Divider />
          <GridedFeaturedText title='Key Tag' text={data.keyTag?.code} />
          <Divider />
          <GridedFeaturedText title='date' text={dayjs(data.createdAt).format('DD MMMM, YYYY hh:mm A')} />
          <Divider />
          <GridedFeaturedText title='status' text={data?.status?.title} textStyle={{color: data?.status?.color || '#000000'}}/>
          <Divider />
          <GridedFeaturedText title='Parker Name' text={data?.parkerName || '-'} />
          <Divider />
          <GridedFeaturedText title='Re Parker Name' text={data?.reParker || '-'} />
          <Divider />
          <GridedFeaturedText title='Driver Name' text={data?.driverName || '-'} />
          <Divider />
          <GridedFeaturedText title='amount' text={(data.price).toFixed(3)} suffix="KD" />
          <Divider />
          <GridedFeaturedText title='Payment Status' text={(data?.paymentStatus) ? 'Captured' : 'Pending' || 'Pending'} textStyle={{color: data?.paymentStatus ? 'green' : 'orange' || '#000000'}}/>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} variant="outlined">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Customer Details</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {data?.customer?.name || '---'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <GridedFeaturedText title='id' text={data.customer.id} />
          <Divider />
          <GridedFeaturedText title='name' text={data.customer.name} />
          <Divider />
          <GridedFeaturedText title='phone' text={data.customer.phone} />
          <Divider />
          <GridedFeaturedText title='note' text={data.customer.internalNote} />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} variant="outlined">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Vehicle Details
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>

          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {data?.BookingVehicle?.length ? data?.BookingVehicle?.map((item, index) => {
            return (
              <>
                <GridedFeaturedText title='color' text={item.color} />
                <Divider />
                <GridedFeaturedText title='car Plate' text={item.carPlate} />
                <Divider />
                <GridedFeaturedText title='manufacturer' text={item.vehicleManufacturer.name} />
                <Divider />
                <GridedFeaturedText title='model' text={item.vehicle.name} />
              </>
            )
          }): <>
            <GridedFeaturedText title='color' text={'-'} />
                <Divider />
                <GridedFeaturedText title='car Plate' text={'-'} />
                <Divider />
                <GridedFeaturedText title='manufacturer' text={'-'} />
                <Divider />
                <GridedFeaturedText title='model' text={'-'} />
          </>}
          {
            data?.medias?.length ? 
            <>
            <Divider />
                <GridedFeaturedText title='Picture' text={<Button onClick={() => setShowPic(true)} >show picture</Button>} />
                </> : <></>
          }
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} variant="outlined">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Parking Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <GridedFeaturedText title='block' text={data?.BookingLocations[0]?.parkingBlockId ? data?.BookingLocations[0]?.parkingBlock?.floor?.name + ' - ' +  data?.BookingLocations[0]?.parkingBlock?.initial : '' } />
          <Divider />
          <GridedFeaturedText title='branch' text={data?.keyTag?.branch?.name} />
          <Divider />
          <GridedFeaturedText title='description' textStyle={{ color:'red' }} text={data?.BookingLocations[0]?.description || ''} />
        </AccordionDetails>
      </Accordion>
      <Dialog open={showPic} onClose={() => setShowPic(false)}>
        <DialogContent>
        {data?.medias?.length ? <SwiperWrapper is_small_screen={is_small_screen ? 'true' : 'false'}>
                  <Box dir={'rtl'}
                    sx={{
                      position: 'relative'
                    }}
                  >
                    <Swiper
                      thumbs={{ swiper: thumbsSwiper }}
                      spaceBetween={15}
                      slidesPerView={1}
                      autoHeight
                      loop
                      navigation={{
                        nextEl: '.MuiSwipe-right',
                        prevEl: '.MuiSwipe-left'
                      }}
                    >
                      {data?.medias?.map((value) => {
                        return (
                          <SwiperSlide key={value.url}>
                            <img style={{ objectFit: 'contain' }} src={value.url} alt="car-images" />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                    <SwipeIndicator className="MuiSwipe-root MuiSwipe-left">
                      <ChevronLeftOutlined />
                    </SwipeIndicator>
                    <SwipeIndicator className="MuiSwipe-root MuiSwipe-right">
                      <ChevronRightOutlined />
                    </SwipeIndicator>
                  </Box>
                </SwiperWrapper>: <></>}
        </DialogContent>
      </Dialog>
    </div>
  );
}


const SwipeIndicator = styled(IconButton)(
  ({ theme }) => `
    @media (max-width: ${theme.breakpoints.values.sm}px) {
        display: none;
    }
    transition: ${theme.transitions.create(['background', 'color'])};
    color: ${theme.colors.primary.main};
    background: ${theme.colors.alpha.white[100]};
    position: absolute;
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
    top: 50%;
    margin-top: ${theme.spacing(-1.5)};
    border-radius: 100px;
    z-index: 5;

    &:hover {
      background: ${theme.colors.alpha.white[100]};
      color: ${theme.colors.alpha.black[100]};
    }

    &.MuiSwipe-left {
      left: ${theme.spacing(0.5)};
    }
    
    &.MuiSwipe-right {
      right: ${theme.spacing(0.5)};
    }
`
);

const SwiperWrapper = styled(Box)(
  ({ theme, is_small_screen }) => `
  .swiper-wrapper {
    height: ${is_small_screen === 'true' ? '40px' : '150px'};
    .swiper-slide {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: ${is_small_screen === 'true' ? '200px' : '400px'};
        object-fit: cover
      }
    }
  }

  .swiper-container-thumbs {
    .swiper-wrapper {
      display: flex;
      align-items: center;
    }

    .swiper-slide {
      width: 140px;
      display: flex;
      padding: 3px;

      img {
        width: 100%;
        height: auto;
        border-radius: ${theme.general.borderRadius};
        opacity: .7;
        transition: ${theme.transitions.create(['box-shadow', 'opacity'])};
      }

      &:hover {
        cursor: pointer;

        img {
          opacity: 1;
        }
      }

      &.swiper-slide-thumb-active {
        img {
          opacity: 1;
          box-shadow: 0 0 0 3px ${theme.colors.primary.main};
        }
      }
    }
  }
`
);