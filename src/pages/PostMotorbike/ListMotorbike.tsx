import { Box, FormControl, Paper, Typography, styled } from '@mui/material'
import React from 'react'
import theme from '../../utils/theme'
import ListMotorbikeForm from './components/ListMotorbike/ListMotorbikeForm';
import usei18next from '../../hooks/usei18next';
import useThemePage from '../../hooks/useThemePage';

const RegisterMotorbikeStyle = styled("form")(({ theme }) => ({

}));


export default function ListMotorbike() {
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    return (
        <RegisterMotorbikeStyle className='form'>
            <Box
                width={"100%"}
                alignContent={'center'}
                margin={"auto"}
                display={"flex"}
                padding={isMobile ? "16px 0px" : "32px 0px"}
                flexDirection={"column"}>
                <Typography
                    variant='h1'
                    color={theme.palette.text.primary}
                    fontSize={isMobile ? "24px" : "32px"}
                    lineHeight={isMobile ? "48px" :"60px"}
                    fontWeight={"600"}
                    sx={{ textAlign: 'center' }}>
                    {t("postMotorbike.listform.title")}
                </Typography>
                <ListMotorbikeForm />
            </Box>
        </RegisterMotorbikeStyle>
    )
}
