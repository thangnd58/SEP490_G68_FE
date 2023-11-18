import { Box, IconButton, Typography } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import useThemePage from '../../../hooks/useThemePage';
import { useNavigate } from 'react-router-dom';
import usei18next from '../../../hooks/usei18next';
import MyCustomButton from '../../../components/common/MyButton';
import { ROUTES } from '../../../utils/Constant';
import Slider from 'react-slick';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Promotion } from '../../../utils/type';
import { PromotionService } from '../../../services/PromotionService';
import { ModalContext } from '../../../contexts/ModalContext';
import { DetailPromotion } from '../../PromotionPage/DetailPromotion';

export default function PromotionComponent() {
  const { isMobile } = useThemePage();
  const navigate = useNavigate();
  const { t } = usei18next();
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const { setContentModal, setShowModal } = useContext(ModalContext);

  useEffect(() => {
    try {
      PromotionService.getAllPromotionValid().then((data) => {
        if (data) {
          setPromotions(data.slice(0, 5))
        }
      })
    } catch (error) {

    }
  }, [])

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
          {t("homepage.hotPromotion")}
        </Typography>
        <MyCustomButton content={(t("dashBoardManager.news.viewsMore"))}
          width={'auto'}
          fontWeight={600}
          fontSize={isMobile ? 12 : 16}
          onClick={() => navigate(ROUTES.promotionpage)} />
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
            {promotions.map((promotion) => (
              <Box key={promotion.id}  onClick={() => setContentModal(<DetailPromotion id={promotion.id.toString()}/>)}>
                <HotPlaceItem promotion={promotion} isMobile={isMobile} />
              </Box>
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
function HotPlaceItem({ isMobile, promotion }: { isMobile: boolean, promotion: Promotion }) {
  return (<Box position={'relative'}
    sx={{
      width: '300px',
      height: '400px',
      cursor: 'pointer'
    }}
  >
    <img src={promotion.imageUrl} width={'100%'} height={"100%"} alt={promotion.image} style={{
      borderRadius: '8px',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      objectFit: 'cover'
    }} />
    <Box position='absolute' bottom={'0px'} style={{
      cursor: 'pointer',
      background: 'linear-gradient(rgba(255, 255, 255, 0) 0%, #000000)',
      width: '100%',
      height: '50%'
    }} borderRadius={'8px'}></Box>
    <Box position={'absolute'} bottom={'10px'} left={'10px'} color={'white'}>
      {<Typography variant='h6' fontSize={isMobile ? '14px' : '24px'}>
        {promotion.title.substring(0, 20) + '...'}
      </Typography>}
    </Box>
  </Box>);
}
