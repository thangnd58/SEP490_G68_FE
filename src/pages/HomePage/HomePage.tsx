import { Box } from '@mui/material'
import React from 'react'
import SeachBoxComponent from './components/SeachBoxComponent'
import NewsComponent from './components/NewsComponent'
import PromotionComponent from './components/PromotionComponent'
import HotMotorbikesOfMonthComponent from './components/HotMotorbikesOfMonthComponent'
import HotPlacesComponent from './components/HotPlacesComponent'
import EasyToRentalMotorbikeComponent from './components/EasyToRentalMotorbikeComponent'
import DoYouWantToBeAOwner from './components/DoYouWantToBeAOwner'

function Home() {
  const components = [
    <SeachBoxComponent key="search" />,
    <NewsComponent key="news" />,
    <PromotionComponent key="promotion" />,
    <HotMotorbikesOfMonthComponent key="hotMotorbikes" />,
    <HotPlacesComponent key="hotPlaces" />,
    <EasyToRentalMotorbikeComponent key="easyToRentalMotorbike" />,
    <DoYouWantToBeAOwner key="beAOwner" />,
  ];

  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
      {components.map(component => component)}
    </Box>
  )
}

export default Home