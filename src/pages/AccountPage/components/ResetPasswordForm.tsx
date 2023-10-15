import React from 'react';
import { TextField, Button, Paper, Typography, InputAdornment } from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import { useFormik } from 'formik';
import * as Yup from "yup";
import useThemePage from '../../../hooks/useThemePage';
import { EmailIcon } from '../../../assets/images';
import { AuthContext, useAuth } from '../../../contexts/AuthContext';

const ResetPasswordForm = () => {
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    const { forgotPassword } = useAuth();
    const formik = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email(t("form.validateEmail"))
                .required(t("form.required"))
        }),
        onSubmit: values => {
            forgotPassword(values.email);
        }
    });

    const {
        values,
        errors,
        touched,
        handleChange,
        handleSubmit
    } = formik;

    return (
        <Paper elevation={3} style={{ padding: '20px', width: isMobile ? "80%" : "30%", margin: '0 auto', borderRadius: '20px' }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                {t("form.resetpassword")}
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', flexDirection: 'column' }}>
                <Typography color='secondary.main' marginBottom='1.5rem' width='80%' textAlign='center' alignContent='center'>
                    {t("form.resetpassword_hint")}
                </Typography>
                <img src={EmailIcon} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <form onSubmit={handleSubmit} style={{ width: '80%' }}>
                    <TextField
                        name="email"
                        label={t("form.email")}
                        placeholder={t("form.email")}
                        variant="outlined"
                        fullWidth
                        margin='normal'
                        value={values.email}
                        onChange={handleChange}
                    />
                    {errors.email && touched.email && (
                        <Typography color='warning.main'>{errors.email}</Typography>
                    )}
                    <Button variant="contained" color="primary" size='large' fullWidth type='submit' sx={{ marginTop: '1.5rem' }}>
                        {t("form.sendLink")}
                    </Button>
                </form>
            </div>
        </Paper>
    );
};

export default ResetPasswordForm;
