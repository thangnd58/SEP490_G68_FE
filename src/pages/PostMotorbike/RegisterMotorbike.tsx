import { Box, FormControl, Paper, Typography, styled } from '@mui/material'
import React from 'react'
import theme from '../../utils/theme'
import RegisterMotorbikeForm from './components/RegisterMotorbike/RegisterMotorbikeForm';
import usei18next from '../../hooks/usei18next';
import useThemePage from '../../hooks/useThemePage';

const RegisterMotorbikeStyle = styled("form")(({ theme }) => ({
    '& .MuiPaper-root': {
        display: 'flex',
        flexDirection: 'column',
        margin: '32px auto',
        borderRadius: '8px'
    },
}));


export default function RegisterMotorbike() {
    const { isMobile } = useThemePage();

    const { t } = usei18next();
    return (

        <RegisterMotorbikeStyle className='form'>
            <Paper elevation={2} sx={{ width: isMobile ? '90%' : '60%' }}>
                <Box
                    alignContent={'center'}
                    display={"flex"}
                    padding={isMobile ? "16px" : "32px"}
                    flexDirection={"column"}>
                    <Typography
                        variant='h1'
                        color={theme.palette.text.primary}
                        fontSize={isMobile ? "24px" : "32px"}
                        lineHeight={"40px"}
                        fontWeight={"600"}
                        sx={{ textAlign: 'center' }}>
                        {t("postMotorbike.registedForm.title")}
                    </Typography>
                    <RegisterMotorbikeForm />
                </Box>
            </Paper>
        </RegisterMotorbikeStyle>
    )
}
