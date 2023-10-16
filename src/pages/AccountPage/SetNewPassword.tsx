import { Box, Button, IconButton, InputAdornment, Paper, TextField, Typography, styled } from '@mui/material';
import React, { useState } from 'react';
import usei18next from '../../hooks/usei18next';
import { useNavigate, useParams } from 'react-router-dom';
import useThemePage from '../../hooks/useThemePage';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ResetPassword } from '../../utils/type';
import UserService from '../../services/UserService';
import ToastComponent from '../../components/ToastComponent';
import { ROUTES } from '../../utils/Constant';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import MyCustomButton from '../../components/common/MyButton';

const SetNewPasswordStyle = styled('form')(({ theme }) => ({
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
        '& .set-password': {
            fontSize: '30px',
            textAlign: 'center',
            fontWeight: '600',
            marginBottom: '1.5rem',
            textTransform: 'uppercase'
        },
    },
}));

const SetNewPassword = () => {
    const { isMobile } = useThemePage();
    const { t } = usei18next();
    const navigate = useNavigate();
    const { ticket } = useParams();
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<any>) => {
        event.preventDefault();
    };
    const formik = useFormik({
        initialValues: {
            ticket: ticket || "",
            newPassword: "",
            confirmPassword: ""
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .min(8, t("form.validatePassword", { min: 8 }))
                .max(32, t("form.validatePasswordMax", { max: 32 }))
                .matches(
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    t("form.validateCharacter")
                )
                .required(t("form.required")),
            confirmPassword: Yup.string()
                .min(8, t("form.validatePassword", { min: 8 }))
                .max(32, t("form.validatePasswordMax", { max: 32 }))
                .matches(
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    t("form.validateCharacter")
                )
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
        <SetNewPasswordStyle onSubmit={handleSubmit}>
            <Paper elevation={3} style={{ width: isMobile ? "80%" : "30%" }}>
                <Typography className='set-password' gutterBottom>
                    {t("form.input_new_password")}
                </Typography>
                <TextField
                    name="newPassword"
                    label={t("changePassword.NewPassword")}
                    variant="outlined"
                    type={showNewPassword ? 'text' : 'password'}
                    fullWidth
                    margin="normal"
                    value={values.newPassword}
                    onChange={handleChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowNewPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {!showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {errors.newPassword && touched.newPassword && (
                    <Typography color='warning.main'>{errors.newPassword}</Typography>
                )}
                <TextField
                    name="confirmPassword"
                    label={t("changePassword.RePassword")}
                    variant="outlined"
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth
                    margin="normal"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <IconButton
                                    aria-label="toggle confirm password visibility"
                                    onClick={handleClickShowConfirmPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {!showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                    <Typography color='warning.main'>{errors.confirmPassword}</Typography>
                )}
                <MyCustomButton className='submit-button' content={t("changePassword.BtnChange")} onClick={handleSubmit} width="100%" height="80%" fontSize={16} fontWeight={500} uppercase borderRadius={8} />
            </Paper>
        </SetNewPasswordStyle>
    );
}

export default SetNewPassword