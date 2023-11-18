import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import MyDialog from './MyDialog';
import { HelmetIcon } from '../../assets/icons';
import Slider from "react-slick";
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { ClockIcon } from '@mui/x-date-pickers';


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MyMapArea() {

  const sliderRef = useRef<Slider>(null);

  const handleNext = () => {
    if (sliderRef.current)
    sliderRef.current.slickNext();
  };

  const handleBack = () => {
    if (sliderRef.current)
    sliderRef.current.slickPrev();
  };
  const settings = {

    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: false,
    infinite: true,
    dots: true,
    centerMode: true,
    speed: 1000,
    centerPadding: '0px',
  };
  const hotPlaces = [
    // Thay thế bằng danh sách các địa điểm nổi bật của bạn
    { id: 1, name: 'Địa điểm 1' },
    { id: 2, name: 'Địa điểm 2' },
    { id: 3, name: 'Địa điểm 3' },
    { id: 4, name: 'Địa điểm 4' },
    { id: 5, name: 'Địa điểm 5' },
    { id: 6, name: 'Địa điểm 6' },
    { id: 7, name: 'Địa điểm 7' },
    { id: 8, name: 'Địa điểm 8' },
  ];

  return (
    <div>
      <h2>Previous and Next methods</h2>
      <IconButton onClick={handleBack}>
        <ArrowBack />
      </IconButton>
      <Slider ref={sliderRef} {...settings}>
        {hotPlaces.map((item) => (
          <HotPlaceItem key={item.id} namePlace={item.name} />
        ))}
      </Slider>
      <IconButton  onClick={handleNext} >
        <ArrowForward />
      </IconButton>
    </div>
  );
}

function HotPlaceItem({ namePlace, key }: { namePlace?: string, key?: number }) {
  return (<Box position={'relative'}
    key={key}
    sx={{
      width: '300px',
      height: '400px',
      cursor: 'pointer'
    }} // onClick={() => navigate(`${ROUTES.newspage}/${listNews[0].newsId}`)}
  >
    <img src={"https://vcdn1-dulich.vnecdn.net/2022/05/11/hoan-kiem-lake-7673-1613972680-1508-1652253984.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=2wB1cBTUcNKuk68nrG6LMQ"} width={'100%'} height={"100%"} alt={'ha-noi'} style={{
      // cursor: 'pointer',
      borderRadius: '8px',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
    }} />
    <Box position='absolute' bottom={'0px'} style={{
      cursor: 'pointer',
      background: 'linear-gradient(rgba(255, 255, 255, 0) 0%, #000000)',
      width: '100%',
      height: '50%'
    }} borderRadius={'8px'}></Box>
    <Box position={'absolute'} bottom={'10px'} left={'10px'} color={'white'}>
      {<Typography variant='h6' fontSize={'24px'}>
        {namePlace}
      </Typography>}
      <Box minHeight={"8px"} width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} />
      <Box display={'flex'} gap={'8px'} alignItems={'center'}>
        <ClockIcon width={24} height={24} />
        <Typography fontStyle={'italic'} fontSize={'16px'}>200 xe</Typography>
      </Box>
    </Box>
  </Box>);
}