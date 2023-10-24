import React, { useState, FunctionComponent } from 'react';
import { Typography, TextField, InputAdornment, IconButton, Box } from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import { useFormik } from 'formik';
import * as Yup from "yup";
import UserService from '../../../services/UserService';
import ToastComponent from '../../../components/toast/ToastComponent';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ErrorMessage from '../../../components/common/ErrorMessage';
import MyCustomButton from '../../../components/common/MyButton';
import { MyCustomeTextField } from './userInformationComponent';
import useThemePage from '../../../hooks/useThemePage';

interface ChildComponentProps {
  setType: React.Dispatch<React.SetStateAction<string>>;
}

const ChangePassComponent: FunctionComponent<ChildComponentProps> = ({ setType }) => {
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
      changePass(values.oldPassword, values.newPassword, values.confirmPassword);
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
      ToastComponent(t("toast.changepassword.error"), "error");
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
  const { isMobile } = useThemePage();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit
  } = formik;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <form onSubmit={handleSubmit} style={{ width: isMobile ? "100%" : "50%", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <MyCustomeTextField
          name="oldPassword"
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
                  onMouseDown={(event:any) => event.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        /><Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>
          {errors.oldPassword && touched.oldPassword && <ErrorMessage message={errors.oldPassword} />}
        </Box>
        <MyCustomeTextField
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
                  onMouseDown={(event:any) => event.preventDefault()}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>
          {errors.newPassword && touched.newPassword && <ErrorMessage message={errors.newPassword} />}
        </Box>
        <MyCustomeTextField
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
                  onMouseDown={(event:any) => event.preventDefault()}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>
          {errors.confirmPassword && touched.confirmPassword && <ErrorMessage message={errors.confirmPassword} />}
        </Box>
        <Box style={{ marginTop: "16px" }}>
          <MyCustomButton
            borderRadius={8}
            fontSize={16}
            fontWeight={400}
            content={t('changePassword.BtnChange')}
            type="submit"
          />
        </Box>
      </form>
    </Box>
  );
};

export default ChangePassComponent;
