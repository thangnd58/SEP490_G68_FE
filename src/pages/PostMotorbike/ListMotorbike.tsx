import { Box, FormControl, Paper, Typography, styled } from '@mui/material'
import React from 'react'
import theme from '../../utils/theme'
import ListMotorbikeForm from './components/ListMotorbike/ListMotorbikeForm';
import usei18next from '../../hooks/usei18next';

const RegisterMotorbikeStyle = styled("form")(({ theme }) => ({
    
}));


export default function ListMotorbike() {
    const {t} = usei18next();
    return (
        <RegisterMotorbikeStyle className='form'>
                <Box
                    width={"100%"}
                    alignContent={'center'}
                    margin={"auto"}
                    display={"flex"}
                    padding={"32px 0px"}
                    flexDirection={"column"}>
                    <Typography
                        variant='h1'
                        color={theme.palette.text.primary}
                        fontSize={"32px"}
                        lineHeight={"60px"}
                        fontWeight={"600"}
                        sx={{ textAlign: 'center' }}>
                        {t("postMotorbike.listform.title")}
                    </Typography>
                    <ListMotorbikeForm />
                </Box>
        </RegisterMotorbikeStyle>
    )
}
