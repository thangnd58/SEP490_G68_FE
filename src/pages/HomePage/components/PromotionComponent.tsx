import { Box, IconButton, Typography } from '@mui/material'
import React, { useRef } from 'react'
import useThemePage from '../../../hooks/useThemePage';
import { useNavigate } from 'react-router-dom';
import usei18next from '../../../hooks/usei18next';
import MyCustomButton from '../../../components/common/MyButton';
import { ROUTES } from '../../../utils/Constant';
import Slider from 'react-slick';
import { ClockIcon } from '@mui/x-date-pickers';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

export default function PromotionComponent() {
  const { isMobile } = useThemePage();
  const navigate = useNavigate();
  const { t } = usei18next();
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
  const sliderPlaceRef = useRef<Slider>(null);
  const handlePlaceBack = () => {
    if (sliderPlaceRef.current)
      sliderPlaceRef.current.slickPrev();
  };
  const handlePlaceNext = () => {
    if (sliderPlaceRef.current)
      sliderPlaceRef.current.slickNext();
  };
  const placeSettings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    infinite: true,
    centerMode: true,
    centerPadding: '0px',
    speed: 300,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          centerMode: true,
          centerPadding: '0px',
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          centerMode: true,
          centerPadding: '0px',
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          dots: true,
          centerPadding: '0px',
        },
      },
    ],
  };
  return (
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} width={'100%'} gap={'24px'} padding={isMobile ? '32px' : '32px 64px'}>
        {/* Title */}
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={'8px'} width={'90%'}>
          <Typography
          width={'100%'}
            sx={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 'bold',
              color: 'common.black',
            }}
          >
            Khuyến mãi hot trong tháng
          </Typography>
          <MyCustomButton content={(t("dashBoardManager.news.viewsMore"))}
            width={'auto'}
            fontWeight={600}
            fontSize={isMobile ? 12 : 16}
            onClick={() => navigate(ROUTES.newspage)} />
        </Box>
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
          {!isMobile &&
            <IconButton sx={{ p: '24px' }} onClick={handlePlaceBack}>
              <ArrowBack />
            </IconButton>}
          <Box alignContent={'center'} width={isMobile ? '300px' : '70%'}
            padding={
              isMobile ? '0px 0px' : '0px 24px'

            }>
            <Slider ref={sliderPlaceRef} {...placeSettings}>
              {hotPlaces.map((place) => (
                <HotPlaceItem key={place.id} namePlace={place.name} isMobile={isMobile} />
              ))}
            </Slider>
          </Box>
          {!isMobile &&
            <IconButton onClick={handlePlaceNext} >
              <ArrowForward />
            </IconButton>}
        </Box>
      </Box>
  )
}
function HotPlaceItem({ isMobile, namePlace, key, image, numOfMotorbike }: { isMobile: boolean, namePlace?: string, key?: number, image?: string, numOfMotorbike?: number }) {
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
      {<Typography variant='h6' fontSize={isMobile ? '14px' : '24px'}>
        {namePlace}
      </Typography>}
      <Box minHeight={"8px"} width={"100%"} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} />
      <Box display={'flex'} gap={'8px'} alignItems={'center'}>
        <ClockIcon width={isMobile ? 14 : 24} height={isMobile ? 14 : 24} />
        <Typography fontStyle={'italic'} fontSize={isMobile ? '10px' : '16px'}>200 xe</Typography>
      </Box>
    </Box>
  </Box>);
}
