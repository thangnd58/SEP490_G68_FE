import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, InputAdornment, IconButton, Box, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import usei18next from '../../../hooks/usei18next';
import useThemePage from '../../../hooks/useThemePage';
import MyCustomButton from '../../../components/common/MyButton';

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
  '& .MuiTypography-root.heading': {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textTransform: 'uppercase',
  },
  '& .MuiBox-root.hint': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1.5rem',
    '& .MuiTypography-root': {
      color: theme.palette.text.secondary,
    },
    '& .MuiButton-root.login-button': {
      fontWeight: '700',
    },
  },

  '& .MuiBox-root.register-form': {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    '& .register-form-content': {
      width: '80%',
      '& .error-text': {
        color: theme.palette.error.main,
      },
      '& .MuiButton-root.submit-button': {
        marginTop: '1.5rem',
      },
    }
  },
}));

const RegisterForm = () => {
  const { register } = useAuth();
  const { t } = usei18next();
  const { isMobile } = useThemePage();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmpassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required(t('form.required')),
      email: Yup.string().email(t('form.validateEmail')).required(t('form.required')),
      phone: Yup.string().required(t('form.required')).matches(/^[0-9]{10}$/, t('form.validatePhone')),
      password: Yup.string().min(6, t('form.validatePassword', { min: 6 })).required(t('form.required')),
      confirmpassword: Yup.string().min(6, t('form.validatePassword', { min: 6 }))
        .oneOf([Yup.ref('password')], t('form.passwordsMustMatch')).required(t('form.required')),
    }),
    onSubmit: values => {
      register({ name: values.username, email: values.email, password: values.password });
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
  } = formik;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);


  const handleMouseDownPassword = (event: React.MouseEvent<any>) => {
    event.preventDefault();
  };

  return (
    <FormStyle className='form' onSubmit={handleSubmit}>
      <Paper elevation={3} sx={{ width: isMobile ? '80%' : '30%', }}>
        <Typography className='heading' variant="h5" gutterBottom>
          {t('form.register')}
        </Typography>
        <Box className='hint'>
          <Typography>
            {t('form.register_hint')}
          </Typography>
          <Button className='login-button' onClick={() => navigate('/login')}>
            {t('form.login')}
          </Button>
        </Box>
        <Box className='register-form'>
          <Box className='register-form-content'>
            <TextField
              name='username'
              label={t('form.userName')}
              placeholder={t('form.userName')}
              variant='outlined'
              fullWidth
              margin='normal'
              value={values.username}
              onChange={handleChange}
            />
            {errors.username && touched.username && (
              <Typography className='error-text'>{errors.username}</Typography>
            )}
            <TextField
              name='email'
              label={t('form.email')}
              placeholder={t('form.email')}
              variant='outlined'
              fullWidth
              margin='normal'
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && touched.email && (
              <Typography className='error-text'>{errors.email}</Typography>
            )}
            <TextField
              name='phone'
              label={t('form.phone')}
              placeholder={t('form.phone')}
              variant='outlined'
              fullWidth
              margin='normal'
              value={values.phone}
              onChange={handleChange}
            />
            {errors.phone && touched.phone && (
              <Typography className='error-text'>{errors.phone}</Typography>
            )}
            <TextField
              name='password'
              label={t('form.password')}
              placeholder={t('form.password')}
              variant='outlined'
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
                      {!showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.password && touched.password && (
              <Typography className='error-text'>{errors.password}</Typography>
            )}
            <TextField
              name='confirmpassword'
              label={t('form.confirmpassword')}
              placeholder={t('form.confirmpassword')}
              variant='outlined'
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              margin='normal'
              value={values.confirmpassword}
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
            {errors.confirmpassword && touched.confirmpassword && (
              <Typography className='error-text'>{errors.confirmpassword}</Typography>
            )}
            <Box className='submit-button'>
              {/* <Button className='submit-button' variant='contained' color='primary' size='large' fullWidth type='submit'>
                {t('form.register')}
              </Button> */}
            <MyCustomButton className='submit-button' content={t('form.register')} onClick={handleSubmit} width="100%" height="80%" fontSize={16} fontWeight={500} uppercase borderRadius={8} />
            </Box>
          </Box>
        </Box>
      </Paper>
    </FormStyle>
  );
};

export default RegisterForm;
