import { Box, FormControl, IconButton, Paper, Typography, styled } from '@mui/material'
import React from 'react'
import theme from '../../utils/theme'
import RegisterMotorbikeForm from './components/RegisterMotorbike/RegisterMotorbikeForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import MyIcon from '../../components/common/MyIcon';


const UpdateRegisterMotorbikeStyle = styled("form")(({ theme }) => ({
    '& .MuiPaper-root': {
        width: '60%',
        display: 'flex',
        flexDirection: 'column',
        margin: '32px auto',
        padding: '32px',
        borderRadius: '8px'
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));


export default function UpdateRegisterMotorbike() {

    const history = useNavigate();

    const handleGoBack = () => {
        history(-1); // Go back to the previous route
    };

    return (
        <UpdateRegisterMotorbikeStyle className='form'>
            <Paper elevation={2}>
                <Box
                    width={"100%"}
                    alignContent={'center'}
                    margin={"auto"}
                    display={"flex"}
                    flexDirection={"column"}>

                    <Box display="flex" alignItems="center">
                        <MyIcon icon={<ArrowBackIcon />} hasTooltip tooltipText="Quay lại" onClick={handleGoBack} position='right'/>
                        <Typography
                            variant='h1'
                            color={theme.palette.text.primary}
                            fontSize={"32px"}
                            lineHeight={"60px"}
                            fontWeight={"600"}
                            margin={"auto"}
                            sx={{ textAlign: 'center' }}>
                            Cập nhật thông tin xe
                        </Typography>
                    </Box>

                    <RegisterMotorbikeForm />
                </Box>
            </Paper>
        </UpdateRegisterMotorbikeStyle>
    );
}
