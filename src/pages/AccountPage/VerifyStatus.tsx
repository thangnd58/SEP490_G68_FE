import { Button, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { EmailIcon, ErrorIcon, SuccessIcon } from "../../assets/images";
import usei18next from "../../hooks/usei18next";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../../services/UserService";
import useThemePage from "../../hooks/useThemePage";
import { ROUTES } from "../../utils/Constant";

const VerifyStatus = () => {
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
            const res = await UserService.verifyUser(ticket || "");
            if (res.status === 200) {
                setIsSuccess(true);
            } else {
                setIsSuccess(false);
            }
        } catch (error) { }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Paper elevation={3} style={{ padding: "20px", width: isMobile ? "80%" : "30%", margin: "0 auto", borderRadius: "20px" }}>
                {isSuccess ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "2rem", flexDirection: "column" }}>
                        <img src={SuccessIcon} />
                        <Typography color="secondary.main" marginBottom="1.5rem" width="80%" textAlign="center" alignContent="center">
                            {t("form.verifySuccess")}
                        </Typography>
                        <Button variant="contained" onClick={() => navigate(`/${ROUTES.account.login}`)}>{t("form.login")}</Button>
                    </div>
                ) : (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "2rem", flexDirection: "column" }}>
                        <img src={ErrorIcon} />
                        <Typography color="secondary.main" marginBottom="1.5rem" width="80%" textAlign="center" alignContent="center">
                            {t("form.verifyError")}
                        </Typography>
                        <Button variant="contained">{t("form.resubmit")}</Button>
                    </div>
                )}
            </Paper>
        </div>
    );
};

export default VerifyStatus;
