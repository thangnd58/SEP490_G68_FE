import React, { useContext, useEffect, useState, FunctionComponent  } from 'react';
import { Avatar, Typography, Grid, Button ,TextField } from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { AuthContext } from '../../../contexts/AuthContext';
import UserService from '../../../services/UserService';
import ToastComponent from '../../../components/toast/ToastComponent';

interface ChildComponentProps {
  setType: React.Dispatch<React.SetStateAction<string>>;
}

const changePassComponent : FunctionComponent<ChildComponentProps> = ({ setType }) => {
    const [email, setEmail] = useState('');
    const { t } = usei18next();
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '0999888777',
        gender : 'male',
        dob : '01/01/2000',
        address: '159 P. Thái Hà, Láng Hạ, Đống Đa, Hà Nội, Vietnam',
        avatar: 'https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg', // URL hình ảnh avatar
      };

      const centerTextStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      };
    
    const formik = useFormik({
        initialValues: {
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        },
        onSubmit: values => {
          changePass(values.oldPassword,values.newPassword,values.confirmPassword)
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

    
    const {
        values,
        handleChange,
        handleSubmit
    } = formik;

   return (
    <Grid item xs container  spacing={2} sx={{marginTop : 5 , marginLeft : -25}}>
    <Grid item xs sx={{marginLeft: 4, marginTop : 3}} direction="column">
    <form onSubmit={handleSubmit} style={{ width: '80%' }}>
        <TextField
            name="oldPassword"
            sx= {{width : 500}}
            label={t("changePassword.OldPassword")}
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={values.oldPassword}
            onChange={handleChange}
        />
        <TextField
            name="newPassword"
            sx= {{width : 500}}
            label={t("changePassword.NewPassword")}
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={values.newPassword}
            onChange={handleChange}
        />
        <TextField
            name="confirmPassword"
            sx= {{width : 500}}
            label={t("changePassword.RePassword")}
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={values.confirmPassword}
            onChange={handleChange}
        />
        <div >
            <Button  variant="outlined" type='submit' sx={{ fontWeight: '500', width : 150, marginTop :  3, paddingTop : 1 , paddingBottom : 1, marginLeft : '19%'}}>{t("changePassword.BtnChange")}</Button>
        </div>
        </form>
    </Grid>
  </Grid>
   )
}
export default changePassComponent