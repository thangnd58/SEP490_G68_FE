import React, { FunctionComponent, useState, } from 'react';
import { Typography, TextField, Box, Button } from '@mui/material';
import MyCustomButton from '../../../components/common/MyButton';
import useThemePage from '../../../hooks/useThemePage';
import usei18next from '../../../hooks/usei18next';
import UserService from '../../../services/UserService';
import ToastComponent from '../../../components/toast/ToastComponent';
import { useFormik } from 'formik';
import * as Yup from "yup";
import ErrorMessage from '../../../components/common/ErrorMessage';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { useAppSelector } from '../../../hooks/useAction';

interface ChildComponentProps {
    setType: React.Dispatch<React.SetStateAction<string>>;
}
  
const ChangePhoneComponent: FunctionComponent<ChildComponentProps> = ({ setType }) => {
    const { isMobile } = useThemePage();
    const { user } = useAppSelector((state) => state.userInfo);
    const { t } = usei18next();
    const [showButtons, setShowButtons] = useState(true);
    const [showOtp, setShowOtp] = useState(true);
    const getOTP = async() => {
        try {
            const response = await UserService.requestVerifyPhone();
            if (response.status === 200) {
              setShowButtons(false);
              ToastComponent(t("toast.sendOtp.success"), "success");
            } else {
              ToastComponent(t("toast.sendOtp.warning"), "warning");
            }
          } catch (error) {
            ToastComponent(t("toast.sendOtp.error"), "error");
          }
    };

    const formik = useFormik({
      initialValues: {
        otp: "",
      },
      validationSchema: Yup.object({
        otp: Yup.string().required(t('form.required')).matches(/^[0-9]{6}$/, t('form.validateOtp')),
      }),
      onSubmit: values => {
        verifyOtp(values.otp);
      }
    });


    const verifyOtp = async (otp : string) =>{
      try {
        const response = await UserService.requestVerifyOtp(otp);
        if (response.status === 200) {
          setShowOtp(false);
          ToastComponent(t("toast.ConfirmOtp.success"), "success");
        } else {
          ToastComponent(t("toast.ConfirmOtp.warning"), "warning");
        }
      } catch (error) {
        ToastComponent(t("toast.ConfirmOtp.error"), "error");
      }
    }
    const {
      values,
      errors,
      touched,
      handleChange,
      handleSubmit
    } = formik;

    return (
      <Box width={'100%'}>
      {showOtp ? (
        
        <Box className='confirm-old-phone-otp' sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box display={'flex'} alignItems={'center'}>
            <PhoneAndroidIcon></PhoneAndroidIcon>
            <Typography display={'inline'}>{user?.phone}</Typography>
          </Box>
          
          <form onSubmit={handleSubmit} style={{ width: isMobile ? "100%" : "50%", display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Box display={'flex'} justifyContent={'flex-end'} gap={'40px'} alignContent={'center'} alignItems={'center'}>
              <TextField
                style={{marginBottom : '13px',width:'90%'}}
                name="otp"
                label="OTP"
                variant="outlined"                
                margin="normal"
                value={values.otp}
                onChange={handleChange}
                />
                
                <MyCustomButton
                    borderRadius={8}
                    fontSize={isMobile ? 12 : 16}
                    fontWeight={400} 
                    height='67%'
                    content={t("ChangePhone.GetOTP")}
                    isWrap={false}
                    variant='outlined'
                    onClick={getOTP}
                    disabled={showButtons ? false : true}
                    ></MyCustomButton>
            </Box>
                <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' , marginBottom : '13px'}}>
                  {errors.otp && touched.otp && <ErrorMessage message={errors.otp} />}
                </Box>
                <MyCustomButton
                    borderRadius={8}
                    fontSize={isMobile ? 12 : 16}
                    fontWeight={400} 
                    content={t("ChangePhone.BtnConfirm")}
                    type='submit'
                    isWrap={false}></MyCustomButton>
               
            
            
          </form>
        </Box>)
        : (
        <Box className='input-new-phone' sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>    
          <form onSubmit={handleSubmit} style={{ width: isMobile ? "100%" : "50%", display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <TextField
              style={{width:'85%'}}
              name="otp1"
              label={t("ChangePhone.NewPhone")}
              variant="outlined"                
              margin="normal"
              value={values.otp}
              onChange={handleChange}
              />
            <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' , marginBottom : '13px'}}>
                {errors.otp && touched.otp && <ErrorMessage message={errors.otp} />}
            </Box>
            <Box display={'flex'} justifyContent={'flex-end'} gap={'40px'} alignContent={'center'} alignItems={'center'}>
              <TextField
                style={{marginBottom : '13px',width:'90%'}}
                name="otp1"
                label="OTP"
                variant="outlined"                
                margin="normal"
                value={values.otp}
                onChange={handleChange}
                />
                
                <MyCustomButton
                    borderRadius={8}
                    fontSize={isMobile ? 12 : 16}
                    fontWeight={400} 
                    height='67%'
                    content={t("ChangePhone.GetOTP")}
                    isWrap={false}
                    variant='outlined'
                    onClick={getOTP}
                    disabled={showButtons ? false : true}
                    ></MyCustomButton>
            </Box>
            <MyCustomButton
                borderRadius={8}
                fontSize={isMobile ? 12 : 16}
                fontWeight={400} 
                content={t("ChangePhone.BtnConfirm")}
                type='submit'
                isWrap={false}></MyCustomButton>
          </form>
        </Box>
      )}
      </Box>
      );
};
export default ChangePhoneComponent;
