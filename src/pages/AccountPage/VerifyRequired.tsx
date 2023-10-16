import { Box, Button, Paper, Typography, styled } from "@mui/material"
import useThemePage from "../../hooks/useThemePage";
import { EmailIcon } from "../../assets/images";
import usei18next from "../../hooks/usei18next";
import { useParams } from "react-router-dom";
import React from "react";

const VerifyRequiredStyle = styled("form")(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiBox-root.form-content': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& .MuiPaper-root': {
            padding: theme.spacing(4),
            margin: '32px auto',
            borderRadius: '20px',
            '& .heading': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexDirection: 'column',
                '& .submit-button': 
                {
                    width: '100%',
                    marginTop: '0.5rem',
                }
            }
        }

    }
}));

const VerifyRequired = () => {
    const { isMobile } = useThemePage();
    const { type } = useParams();
    const { t } = usei18next();

    const handleGoToEmailPage = () => {
        window.open('https://mail.google.com', '_blank');
    };

    return (
        <VerifyRequiredStyle className="form">
            <Box className="form-content">
                <Paper elevation={3} style={{ width: isMobile ? "80%" : "50%" }}>
                    <Box className="heading">
                        <img alt="email-icon" src={EmailIcon} />
                        <Typography color='text.secondary' width='80%' textAlign='center' alignContent='center'>
                            {
                                type === "register" ? <>
                                    {t("form.message_verify_register")}
                                </> : <>
                                    {t("form.message_verify_change_password")}
                                </>
                            }
                        </Typography>
                        {/* button go to email of google */}
                        <Box className='submit-button'>
                            <Button
                                className='submit-button'
                                variant='contained'
                                color='primary'
                                size='large'
                                fullWidth
                                onClick={handleGoToEmailPage}
                            >
                                {t('form.go_to_email_page')}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </VerifyRequiredStyle>
    )
}

export default VerifyRequired