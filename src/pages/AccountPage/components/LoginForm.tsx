import React, { useEffect, useState } from 'react';
import { TextField, Button, Paper, Typography, InputAdornment, IconButton, Checkbox, styled, Box } from '@mui/material';
import { AuthContext, useAuth } from '../../../contexts/AuthContext';
import usei18next from '../../../hooks/usei18next';
import { useFormik } from 'formik';
import * as Yup from "yup";
import useThemePage from '../../../hooks/useThemePage';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router';
import { Height, Visibility, VisibilityOff } from '@mui/icons-material';

const FormStyle = styled('form')(({ theme }) => ({
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
  },
  '& .login': {
    fontSize: '30px',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: '1.5rem',
  },
  '& .login-hint': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1.5rem',
    '& .MuiTypography-root': {
      color: theme.palette.text.secondary,
    },
    '& .MuiButton-root.register-button': {
      fontWeight: '700',
    },
  },
  '& .MuiBox-root.google-buttons': {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginBottom: '1.5rem',
    gap: '2px',
  },
  '& .MuiTypography-root.login-with-account': {
    color: theme.palette.text.secondary,
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  '& .MuiBox-root.login-form': {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    '& .login-form-content': {
      width: '80%',
      '& .error-text': {
        color: theme.palette.error.main,
      },
      '& .MuiButton-root.submit-button': {
        width: '100%',
        marginTop: '1.5rem',
      },
      '& .MuiBox-root.save-account-forgot-password': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& .MuiBox-root.save-account': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '& .MuiTypography-root.save-account-text': {
            color: theme.palette.text.secondary,
          },
        },
        '& .MuiTypography-root.forgot-password': {
          cursor: 'pointer',
          textDecoration: 'underline',
          color: theme.palette.primary.main,
        },
      },
    },
  },
}));

const LoginForm = () => {
  const { login, externalLogin } = useAuth();
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
    <FormStyle className='form' onSubmit={handleSubmit}>
      <Paper elevation={3} sx={{ width: isMobile ? '80%' : '30%', }}>
        <Typography className='login'>
          {t("form.login")}
        </Typography>
        <Box className='login-hint'>
          <Typography>
            {t("form.login_hint")}
          </Typography>
          <Button className='register-button' onClick={() => navigate("/register")}>
            {t("form.register")}
          </Button>
        </Box>
        <Box className='google-buttons'>
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
        </Box>
        <Typography className='login-with-account'>
          {t("form.login_with_account")}
        </Typography>
        <Box className='login-form'>
          <Box className="login-form-content">
            <TextField
              name='email'
              label={t("form.email")}
              placeholder={t("form.email")}
              variant='outlined'
              size='medium'
              fullWidth
              margin='normal'
              value={values.email}
              onChange={handleChange}
              className='centered-placeholder'
            />
            {errors.email && touched.email && (
              <Typography className='error-text'>{errors.email}</Typography>
            )}
            <TextField
              name='password'
              label={t("form.password")}
              placeholder={t("form.password")}
              variant='outlined'
              size='medium'
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin='normal'
              value={values.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='start'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'
                    >
                      {!showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.password && touched.password && (
              <Typography className='error-text'>{errors.password}</Typography>
            )}
            <Box className='save-account-forgot-password'>
              <Box className='save-account'>
                <Checkbox checked={saveAccount} onClick={() => setSaveAccount(!saveAccount)} />
                <Typography className='save-account-text'>{t("form.saveAccount")}</Typography>
              </Box>
              <Typography className='forgot-password' onClick={() => navigate("/reset-password")}>{t("form.forgotPassword")}</Typography>
            </Box>
            <Button className='submit-button' variant='contained' color='primary' size='large' type='submit'>
              {t("form.login")}
            </Button>
          </Box>
        </Box>
      </Paper>
    </FormStyle>
  );
};

export default LoginForm;
