import { Box, Button, IconButton, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import useThemePage from '../../../hooks/useThemePage';
import { useNavigate } from 'react-router-dom';
import usei18next from '../../../hooks/usei18next';
import { ClockIcon } from '@mui/x-date-pickers';
import { ArrowBack, ArrowForward, NavigateBefore, NavigateNext } from '@mui/icons-material';
import Slider from 'react-slick';


export default function HotPlacesComponent() {
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

    const sliderStationRef = useRef<Slider>(null);
    const sliderPlaceRef = useRef<Slider>(null);

    const handleStationBack = () => {
        if (sliderStationRef.current)
            sliderStationRef.current.slickPrev();
    };
    const handleStationNext = () => {
        if (sliderStationRef.current)
            sliderStationRef.current.slickNext();
    };

    const handlePlaceBack = () => {
        if (sliderPlaceRef.current)
            sliderPlaceRef.current.slickPrev();
    };
    const handlePlaceNext = () => {
        if (sliderPlaceRef.current)
            sliderPlaceRef.current.slickNext();
    };

    const placeSettings = {
        slidesToShow: 4,
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
    const stationSettings = {
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
                    slidesToShow: 1,
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
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'space-between'}
            width={'100%'}
            gap={isMobile ? '32px' : '24px'}
            padding={isMobile ? '32px 0px 48px 0px' : '32px 0px'}
        >
            {/* Title */}
            <Typography
                sx={{
                    fontSize: isMobile ? '24px' : '32px',
                    fontWeight: 'bold',
                    color: 'common.black',
                }}
            >
                Những địa điểm nổi bật
            </Typography>

            {/* Content */}
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                {!isMobile &&
                    <IconButton sx={{ p: '24px' }} onClick={handlePlaceBack}>
                        <ArrowBack />
                    </IconButton>}
                <Box alignContent={'center'} width={isMobile ? '300px' : '90%'}
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
            {/* Content */}
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                {!isMobile &&
                    <Box width={'20%'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={'24px'} >
                        {/* Giao xe tại nhà ga hoặc bên tàu */}
                        <Typography
                            sx={{
                                fontSize: isMobile ? '24px' : '28px',
                                fontWeight: 'bold',
                                color: 'common.black',
                                textAlign: 'center'
                            }}
                        >Giao xe tại <span style={{ color: '#8B4513', fontStyle: 'italic' }}>
                                nhà ga
                            </span> hoặc <span style={{ color: '#8B4513', fontStyle: 'italic' }}>
                                bến tàu
                            </span>
                        </Typography>
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                            <IconButton onClick={handleStationBack}>
                                <ArrowBack />
                            </IconButton>
                            <IconButton onClick={handleStationNext} >
                                <ArrowForward />
                            </IconButton>
                        </Box>
                    </Box>
                }
                <Box alignContent={'center'} width={isMobile ? '275px' : '65%'}>
                    <Slider ref={sliderStationRef} {...stationSettings}>
                        {hotPlaces.map((place) => (
                            <HotStationItem key={place.id} namePlace={place.name} isMobile={isMobile} />
                        ))}
                    </Slider>
                </Box>
            </Box>
        </Box >
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

function HotStationItem({ isMobile, namePlace, key, image, numOfMotorbike }: { isMobile: boolean, namePlace?: string, key?: number, image?: string, numOfMotorbike?: number }) {
    return (<Box position={'relative'}
        key={key}
        sx={{
            width: '275px',
            height: '230px',
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
