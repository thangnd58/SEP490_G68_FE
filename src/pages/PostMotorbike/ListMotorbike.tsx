import { Box, FormControl, Paper, Typography, styled } from '@mui/material'
import React from 'react'
import theme from '../../utils/theme'
import ListMotorbikeForm from './components/ListMotorbike/ListMotorbikeForm';
import usei18next from '../../hooks/usei18next';

const RegisterMotorbikeStyle = styled("form")(({ theme }) => ({
    '& .MuiPaper-root': {
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        margin: '32px auto',
        padding: '32px',
        borderRadius: '8px'
    },
}));


export default function ListMotorbike() {
    const {t} = usei18next();
    return (
        <RegisterMotorbikeStyle className='form'>
            <Paper elevation={2}>
                <Box
                    width={"100%"}
                    alignContent={'center'}
                    margin={"auto"}
                    display={"flex"}
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
            </Paper>
        </RegisterMotorbikeStyle>
    )
}
