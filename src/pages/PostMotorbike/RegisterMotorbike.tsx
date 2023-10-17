import { Box, FormControl, Paper, Typography, styled } from '@mui/material'
import React from 'react'
import theme from '../../utils/theme'
import RegisterMotorbikeForm from './components/RegisterMotorbikeForm'

const RegisterMotorbikeStyle = styled("form")(({ theme }) => ({
    '& .MuiPaper-root': {
        width: '60%',
        display: 'flex',
        flexDirection: 'column',
        margin: '32px auto',
        padding: '32px',
        borderRadius: '8px'
    },
}));


export default function RegisterMotorbike() {
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
                        Đăng ký cho thuê xe máy
                    </Typography>
                    <RegisterMotorbikeForm />
                </Box>
            </Paper>
        </RegisterMotorbikeStyle>
    )
}
