import { Box, FormControl, IconButton, Paper, Typography, styled } from '@mui/material'
import React from 'react'
import theme from '../../utils/theme'
import RegisterMotorbikeForm from './components/RegisterMotorbike/RegisterMotorbikeForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import MyIcon from '../../components/common/MyIcon';
import usei18next from '../../hooks/usei18next';
import useThemePage from '../../hooks/useThemePage';


const UpdateRegisterMotorbikeStyle = styled("form")(({ theme }) => ({
    '& .MuiPaper-root': {
        display: 'flex',
        flexDirection: 'column',
        margin: '32px auto',
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

    const { t } = usei18next();
    const { isMobile } = useThemePage();

    return (
        <UpdateRegisterMotorbikeStyle className='form'>
            <Paper elevation={2} sx={{ width: isMobile ? '90%' : '60%' }}>
                <Box
                    alignContent={'center'}
                    padding={isMobile ? "16px" : "32px"}
                    display={"flex"}
                    flexDirection={"column"}>

                    <Box display="flex" alignItems="center">
                        <MyIcon icon={<ArrowBackIcon />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={handleGoBack} position='right' />
                        <Typography
                            variant='h1'
                            color={theme.palette.text.primary}
                            fontSize={isMobile ? "24px" : "32px"}
                            lineHeight={"40px"}
                            fontWeight={"600"}
                            margin={"auto"}
                            sx={{ textAlign: 'center' }}>
                            {t("postMotorbike.registedForm.updateTitle")}
                        </Typography>
                    </Box>
                    <Box margin={"16px 0px 0px 0px"}>

                    </Box>

                    <RegisterMotorbikeForm />
                </Box>
            </Paper>
        </UpdateRegisterMotorbikeStyle>
    );
}
