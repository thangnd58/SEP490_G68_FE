import { Button, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import usei18next from '../../hooks/usei18next';
import { useNavigate, useParams } from 'react-router-dom';
import useThemePage from '../../hooks/useThemePage';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ResetPassword } from '../../utils/type';
import UserService from '../../services/UserService';
import ToastComponent from '../../components/toast/ToastComponent';
import { ROUTES } from '../../utils/Constant';

const SetNewPassword = () => {
    const { isMobile } = useThemePage();
    const { t } = usei18next();
    const navigate = useNavigate();
    const { ticket } = useParams();

    const formik = useFormik({
        initialValues: {
            ticket: ticket || "",
            newPassword: "",
            confirmPassword: ""
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .min(6, t("form.validatePassword", { min: 6 }))
                .required(t("form.required")),
            confirmPassword: Yup.string()
                .min(6, t("form.validatePassword", { min: 6 }))
                .oneOf([Yup.ref('newPassword')], t("form.passwordsMustMatch"))
                .required(t("form.required")),
        }),
        onSubmit: values => {
            const resetObject: ResetPassword = {
                ticket: values.ticket,
                password: values.newPassword,
                confirmPassword: values.confirmPassword
            }
            setPassword(resetObject);
        }
    });

    const {
        values,
        handleChange,
        handleSubmit,
        errors,
        touched
    } = formik;

    const setPassword = async (resetObject: ResetPassword) => {
        try {
            const response = await UserService.setForgotPassword(resetObject);
            if (response.status === 200) {
                ToastComponent(t("toast.changepassword.success"), "success")
                navigate(`/${ROUTES.account.login}`);
            } else {
                ToastComponent(t("toast.changepassword.warning"), "warning")
            }
        } catch (error) {
            ToastComponent(t("toast.changepassword.error"), "error")
        }
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Paper elevation={3} style={{ padding: "20px", width: isMobile ? "80%" : "30%", margin: "0 auto", borderRadius: "20px" }}>
                <form onSubmit={handleSubmit}  style={{ display: "flex", justifyContent: "center", flexWrap: 'wrap'}}>
                    <TextField
                        name="newPassword"
                        label={t("changePassword.NewPassword")}
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={values.newPassword}
                        onChange={handleChange}
                    />
                    {errors.newPassword && touched.newPassword && (
                        <Typography color='warning.main'>{errors.newPassword}</Typography>
                    )}
                    <TextField
                        name="confirmPassword"
                        label={t("changePassword.RePassword")}
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={values.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                        <Typography color='warning.main'>{errors.confirmPassword}</Typography>
                    )}
                    <Button variant="outlined" type='submit' sx={{marginTop: 2}}>{t("changePassword.BtnChange")}</Button>
                </form>
            </Paper>
        </div>
    );
}

export default SetNewPassword