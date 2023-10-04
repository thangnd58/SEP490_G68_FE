import React, { useContext, useState } from 'react';
import { TextField, Button, Typography, Paper, InputAdornment, IconButton } from '@mui/material';
import { AuthContext } from '../../../contexts/AuthContext';
import usei18next from '../../../hooks/usei18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useThemePage from '../../../hooks/useThemePage';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const {register} = useContext(AuthContext);
  const { t } = usei18next();
  const { isMobile } = useThemePage();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required(t("form.required")),
      email: Yup.string()
        .email(t("form.validateEmail"))
        .required(t("form.required")),
      phone: Yup.string()
        .required(t("form.required"))
        .matches(/^[0-9]{10}$/, t("form.validatePhone")),
      password: Yup.string()
        .min(6, t("form.validatePassword", { min: 6 }))
        .required(t("form.required")),
      confirmpassword: Yup.string()
        .min(6, t("form.validatePassword", { min: 6 }))
        .oneOf([Yup.ref('password')], t("form.passwordsMustMatch"))
        .required(t("form.required")),
    }),
    onSubmit: values => {
      register({ name: values.username, email: values.email, password: values.password })
    }
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit
  } = formik;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);


  const handleMouseDownPassword = (event : React.MouseEvent<any>) => {
    event.preventDefault();
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', width: isMobile ? "80%" : "30%", margin: '0 auto', borderRadius: '20px' }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '1.5rem', textTransform: 'uppercase'  }}>
        {t("form.register")}
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Typography sx={{ color: 'secondary.main' }}>
          {t("form.register_hint")}
        </Typography>
        <Button onClick={() => navigate("/login")} sx={{ fontWeight: '700' }}>
          {t("form.login")}
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSubmit} style={{ width: '80%' }}>
          <TextField
            name="username"
            label={t("form.userName")}
            placeholder={t("form.userName")}
            variant="outlined"
            fullWidth
            margin='normal'
            value={values.username}
            onChange={handleChange}
          />
          {errors.username && touched.username && (
            <Typography color='warning.main'>{errors.username}</Typography>
          )}
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
            name="phone"
            label={t("form.phone")}
            placeholder={t("form.phone")}
            variant="outlined"
            fullWidth
            margin='normal'
            value={values.phone}
            onChange={handleChange}
          />
          {errors.phone && touched.phone && (
            <Typography color='warning.main'>{errors.phone}</Typography>
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
          <TextField
            name="confirmpassword"
            label={t("form.confirmpassword")}
            placeholder={t("form.confirmpassword")}
            variant="outlined"
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
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errors.confirmpassword && touched.confirmpassword && (
            <Typography color='warning.main'>{errors.confirmpassword}</Typography>
          )}
          <div style={{marginBottom: '1.5rem'}}></div>
          <Button variant="contained" color="primary" size='large' fullWidth type='submit'>
            {t("form.register")}
          </Button>
        </form>
      </div>
    </Paper>
  );
};

export default RegisterForm;
