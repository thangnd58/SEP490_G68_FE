import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, Paper, Typography, InputAdornment, IconButton, Checkbox } from '@mui/material';
import { AuthContext } from '../../../contexts/AuthContext';
import usei18next from '../../../hooks/usei18next';
import { useFormik } from 'formik';
import * as Yup from "yup";
import useThemePage from '../../../hooks/useThemePage';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginForm = () => {
  const { login, externalLogin } = useContext(AuthContext);
  const { t } = usei18next();
  const { isMobile } = useThemePage();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("form.validateEmail"))
        .required(t("form.required")),
      password: Yup.string()
        .min(6, t("form.validatePassword", { min: 6 }))
        .required(t("form.required")),
    }),
    onSubmit: values => {
      login({ email: values.email, password: values.password }, !saveAccount)
    }
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue
  } = formik;

  const handleGoogleLogin = (credentialResponse: any) => {
    externalLogin(credentialResponse.credential)
  };

  const [showPassword, setShowPassword] = useState(false);
  const [saveAccount, setSaveAccount] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<any>) => {
    event.preventDefault();
  };

  useEffect(() => {
    const save = localStorage.getItem("acccount");
    if (save) {
      const account = JSON.parse(save);
      setSaveAccount(true)
      setFieldValue("email", account.email);
      setFieldValue("password", account.password)
    }
  }, [localStorage])

  return (
    <Paper elevation={3} style={{ padding: '20px', width: isMobile ? "80%" : "30%", margin: '0 auto', borderRadius: '20px' }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
        {t("form.login")}
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Typography sx={{ color: 'secondary.main' }}>
          {t("form.login_hint")}
        </Typography>
        <Button onClick={() => navigate("/register")} sx={{ fontWeight: '700' }}>
          {t("form.register")}
        </Button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', marginBottom: '1.5rem', gap: '2px' }}>
        <GoogleOAuthProvider clientId="1088937198611-lpsokcekdcethdobpeghbm43nf4fglcl.apps.googleusercontent.com">
          <GoogleLogin
            size='medium'
            onSuccess={credentialResponse => {
              handleGoogleLogin(credentialResponse)
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </GoogleOAuthProvider>
        <GoogleOAuthProvider clientId="1088937198611-lpsokcekdcethdobpeghbm43nf4fglcl.apps.googleusercontent.com">
          <GoogleLogin
            size='medium'
            onSuccess={credentialResponse => {
              handleGoogleLogin(credentialResponse)
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </GoogleOAuthProvider>
      </div>
      <Typography color='secondary.main' textAlign='center' marginBottom={'1.5rem'} >{t("form.login_with_account")}</Typography>
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
          <TextField
            name="password"
            label={t("form.password")}
            placeholder={t("form.password")}
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin='normal'
            value={values.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errors.password && touched.password && (
            <Typography color='warning.main'>{errors.password}</Typography>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Checkbox checked={saveAccount} onClick={() => setSaveAccount(!saveAccount)} />
              <Typography color='secondary.main'>{t("form.saveAccount")}</Typography>
            </div>
            <Typography color='primary.main' sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate("/reset-password")}>{t("form.forgotPassword")}</Typography>
          </div>
          <Button variant="contained" color="primary" size='large' fullWidth type='submit'>
            {t("form.login")}
          </Button>
        </form>
      </div>
    </Paper>
  );
};

export default LoginForm;
