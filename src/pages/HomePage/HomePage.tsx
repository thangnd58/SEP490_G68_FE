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

  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
      <SeachBoxComponent />
      <NewsComponent />
      <PromotionComponent />
      <HotMotorbikesOfMonthComponent />
      <HotPlacesComponent />
      <EasyToRentalMotorbikeComponent />
      <DoYouWantToBeAOwner />
    </Box>
  )
}

export default Home