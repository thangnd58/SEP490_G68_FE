import { Box, Button, Paper, Typography, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ErrorIcon, SuccessIcon } from "../../assets/images";
import usei18next from "../../hooks/usei18next";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../../services/UserService";
import useThemePage from "../../hooks/useThemePage";
import { ROUTES } from "../../utils/Constant";
import MyCustomButton from "../../components/common/MyButton";

const VerifyReigsterStatusStyle = styled('form')(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    '& .MuiTextField-root': {
        marginBottom: theme.spacing(1),
        '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '& fieldset': {
                borderColor: theme.palette.action.disabledBackground,
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.secondary.main,
            },
        },
    },
    '& .MuiPaper-root': {
        padding: theme.spacing(4),
        margin: '32px auto',
        borderRadius: '20px',
        '& .status': {
            fontSize: '30px',
            textAlign: 'center',
            fontWeight: '600',
            marginBottom: '1.5rem',
            textTransform: 'uppercase'
        },
    },
}));

const VerifyReigsterStatus = () => {
    const { isMobile } = useThemePage();
    const { t } = usei18next();
    const { ticket } = useParams();
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        verify();
    }, [ticket]);

    const verify = async () => {
        try {
            const res = await UserService.verifyUserRegister(ticket || "");
            if (res.status === 200) {
                setIsSuccess(true);
            } else {
                setIsSuccess(false);
            }
        } catch (error) { }
    };

    return (
        <VerifyReigsterStatusStyle>
            <Paper elevation={3} style={{ width: isMobile ? "80%" : "30%" }}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "2rem", flexDirection: "column" }}>
                    {isSuccess ? (
                        <>
                            <Typography className='status' gutterBottom>
                                {t("form.verifySuceessLabel")}
                            </Typography>
                            <img alt="success-icon" src={SuccessIcon} style={{marginBottom: '2rem'}}/>
                            <Typography style={{marginBottom: '2rem'}}>
                                {t("form.verifySuccess")}
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Typography className='status' gutterBottom>
                                {t("form.verifyErrorLabel")}
                            </Typography>
                            <img alt="error-icon" src={ErrorIcon} style={{marginBottom: '2rem'}}/>
                            <Typography style={{marginBottom: '2rem'}}>
                                {t("form.verifyError")}
                            </Typography>
                        </>
                    )
                    }
                    <MyCustomButton className='submit-button' content={t("form.back_to_home_page")} onClick={() => navigate(`${ROUTES.homepage}`)} width="100%" height="80%" fontSize={16} fontWeight={500} uppercase borderRadius={8} />
                </Box>
            </Paper>
        </VerifyReigsterStatusStyle>
    );
};

export default VerifyReigsterStatus;
