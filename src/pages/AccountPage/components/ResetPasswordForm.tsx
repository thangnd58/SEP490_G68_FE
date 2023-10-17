import React from 'react';
import { TextField, Button, Paper, Typography, InputAdornment, Box, styled } from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import { useFormik } from 'formik';
import * as Yup from "yup";
import useThemePage from '../../../hooks/useThemePage';
import { EmailIcon } from '../../../assets/images';
import { AuthContext, useAuth } from '../../../contexts/AuthContext';
import ErrorMessage from '../../../components/common/ErrorMessage';
import MyCustomButton from '../../../components/common/MyButton';

const ResetPassworStyle = styled('form')(({ theme }) => ({
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
        '& .reset-password-text': {
            fontSize: '30px',
            textAlign: 'center',
            fontWeight: '600',
            marginBottom: '1.5rem',
            textTransform: 'uppercase'
        },
        '& .box-hint': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        },
        '& .box-input-email': {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            '& .box-input-email-content': {
                width: '80%',
                '& .warning-content': {
                    color: theme.palette.error.main,
                },
                '& .btn_sendlink': {
                    width: '100%',
                    marginTop: '1.5rem',
                }
            }
        }
    },
}));

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
        <ResetPassworStyle onSubmit={handleSubmit}>
            <Paper elevation={3} style={{ width: isMobile ? "80%" : "30%" }}>
                <Typography className='reset-password-text' gutterBottom>
                    {t("form.resetpassword")}
                </Typography>
                <Box className={"box-hint"}>
                    <Typography color='text.secondary' marginBottom='1.5rem' width='80%' textAlign='center' alignContent='center'>
                        {t("form.resetpassword_hint")}
                    </Typography>
                    <img alt='ic-icon' src={EmailIcon} />
                </Box>
                <Box className="box-input-email">
                    <Box className="box-input-email-content" >
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
                            <ErrorMessage message={errors.email} />
                        )}
                        <Box className='submit-button'>
                            <MyCustomButton className='submit-button' content={t("form.sendLink")} onClick={handleSubmit} width="100%" height="80%" fontSize={16} fontWeight={500} uppercase borderRadius={8} />
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </ResetPassworStyle>
    );
};

export default ResetPasswordForm;
