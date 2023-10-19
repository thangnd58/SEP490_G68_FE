import React, { useState, FunctionComponent } from 'react';
import { Avatar, Typography, Grid, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import { useFormik } from 'formik';
import * as Yup from "yup";
import UserService from '../../../services/UserService';
import ToastComponent from '../../../components/toast/ToastComponent';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface ChildComponentProps {
  setType: React.Dispatch<React.SetStateAction<string>>;
}

const changePassComponent: FunctionComponent<ChildComponentProps> = ({ setType }) => {
  const { t } = usei18next();

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .min(8, t("form.validatePassword", { min: 8 }))
        .max(32, t("form.validatePasswordMax", { max: 32 }))
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          t("form.validateCharacter")
        )
        .required(t("form.required")),
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
      changePass(values.oldPassword, values.newPassword, values.confirmPassword)
    }
  });

  const changePass = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      const response = await UserService.changePass(
        oldPassword,
        newPassword,
        confirmPassword
      );
      if (response.status === 200) {
        ToastComponent(t("toast.changepassword.success"), "success");
        setType('info');
      } else {
        ToastComponent(t("toast.changepassword.warning"), "warning");
      }
    } catch (error) {
      ToastComponent(t("toast.changepassword.error"), "error")
    }
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);


  const handleMouseDownPassword = (event: React.MouseEvent<any>) => {
    event.preventDefault();
  };


  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit
  } = formik;

  return (
    <Grid item xs container spacing={2} sx={{ marginTop: 5 }}>
      <Grid item xs sx={{ marginLeft: 4, marginTop: 3 }} direction="column">
        <form onSubmit={handleSubmit} style={{ width: '80%' }}>
          <TextField
            name="oldPassword"
            sx={{ width: 500 }}
            label={t("changePassword.OldPassword")}
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={values.oldPassword}
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
          {errors.oldPassword && touched.oldPassword && (
            <Typography color='warning.main'>{errors.oldPassword}</Typography>
          )}
          <TextField
            name="newPassword"
            sx={{ width: 500 }}
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
            sx={{ width: 500 }}
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
          <div >
            <Button variant="outlined" type='submit' sx={{ fontWeight: '500', width: 150, marginTop: 3, paddingTop: 1, paddingBottom: 1, marginLeft: '31%' }}>{t("changePassword.BtnChange")}</Button>
          </div>
        </form>
      </Grid>
    </Grid>
  )
}
export default changePassComponent