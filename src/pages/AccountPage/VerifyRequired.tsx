import { Paper, Typography } from "@mui/material"
import useThemePage from "../../hooks/useThemePage";
import { EmailIcon } from "../../assets/images";
import usei18next from "../../hooks/usei18next";
import { useParams } from "react-router-dom";
import React from "react";

const VerifyRequired = () => {
    const { isMobile } = useThemePage();
    const { type } = useParams();
    const { t } = usei18next();

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} style={{ padding: '20px', width: isMobile ? "80%" : "30%", margin: '0 auto', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', flexDirection: 'column' }}>
                    <img src={EmailIcon} />
                    <Typography color='secondary.main' marginBottom='1.5rem' width='80%' textAlign='center' alignContent='center'>
                        {
                            type === "register" ? <>
                                {t("form.message_verify_register")}
                            </> : <>
                                {t("form.message_verify_change_password")}
                            </>
                        }
                    </Typography>
                </div>
            </Paper>
        </div>
    )
}

export default VerifyRequired