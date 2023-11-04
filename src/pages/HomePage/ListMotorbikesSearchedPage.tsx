import { Box } from '@mui/material';
import React, { useEffect } from 'react'
import usei18next from '../../hooks/usei18next';
import { useParams } from 'react-router-dom';
import { SearchMotorbikeServices } from '../../services/SearchMotorbikeService';
import { SearchMotorbikeRequest } from '../../utils/type';

export default function ListMotorbikesSearchedPage() {
    const { startDate, endDate, address } = useParams();

    // useEffect(() => {
    //     getMotorbikesByPlaceAndTime();
    // }, [startDate, endDate, address]);

    // const getMotorbikesByPlaceAndTime = async () => {
    //     if (!startDate || !endDate || !address) return;
    //     const formData: SearchMotorbikeRequest = {
    //         startDate: startDate,
    //         endDate: endDate,
    //         address: address
    //     }
    //     const response = await SearchMotorbikeServices.getMotorbikesByPlaceAndTime(formData);
    //     console.log(response);
    // }

    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <h1>Search motorbikes</h1>
        </Box>
    )
}
