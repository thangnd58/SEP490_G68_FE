import { Box, FormControl, Paper, Typography, styled } from '@mui/material'
import React from 'react'
import theme from '../../utils/theme'
import RegisterMotorbikeForm from './components/RegisterMotorbike/RegisterMotorbikeForm';
import { t } from 'i18next';

const RegisterMotorbikeStyle = styled("form")(({ theme }) => ({
    '& .MuiPaper-root': {
        width: '60%',
        display: 'flex',
        flexDirection: 'column',
        margin: '32px auto',
        borderRadius: '8px'
    },
}));


export default function RegisterMotorbike() {
    return (
        
        <RegisterMotorbikeStyle className='form'>
            <Paper elevation={2}>
                <Box
                    alignContent={'center'}
                    margin={"auto"}
                    padding={"32px"}
                    display={"flex"}
                    flexDirection={"column"}>
                    <Typography
                        variant='h1'
                        color={theme.palette.text.primary}
                        fontSize={"32px"}
                        lineHeight={"60px"}
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
