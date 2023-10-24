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
    const [oldOtp, setOldOtp] = useState(true); 
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
        otpOld: "",
        phone: "",
        otpNew:""
      },
      validationSchema: Yup.object({
        otpOld: Yup.string().required(t('form.required')).matches(/^[0-9]{6}$/, t('form.validateOtp')),
        phone:  Yup.string().required(t('form.required')).matches(/^[0-9]{10}$/, t('form.validateOtp')),
      }),
      onSubmit: values => {
        verifyOtp(values.otpOld);
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
      {!showOtp ? (
        
        <Box className='confirm-old-phone-otp' sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box display={'flex'} alignItems={'center'}>
            <PhoneAndroidIcon></PhoneAndroidIcon>
            <Typography display={'inline'}>{user?.phone}</Typography>
          </Box>
          
          <form onSubmit={handleSubmit} style={{ width: isMobile ? "100%" : "50%", display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Box display={'flex'} justifyContent={'flex-end'} gap={'40px'} alignContent={'center'} alignItems={'center'}>
              <TextField
                style={{marginBottom : '13px',width:'90%'}}
                name="otpOld"
                label="OTP"
                variant="outlined"                
                margin="normal"
                value={values.otpOld}
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
                  {errors.otpOld && touched.otpOld && <ErrorMessage message={errors.otpOld} />}
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
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>    
          <form 
          onSubmit={handleSubmit} 
          style={{ 
            width: isMobile ? "100%" : "50%",
             display: 'flex', 
             flexDirection: 'column', 
             alignItems: 'center',
             padding:"0px 64px"
             }}>
            <Box width={"100%"} display={'flex'}  justifyContent={'space-between'} flexDirection={'column'} alignContent={'center'} alignItems={'center'}>
              <TextField
                sx= {
                  {
                    width: "100%"
                  }
                }
                name="phone"
                label={t("ChangePhone.NewPhone")}
                variant="outlined"                
                margin="normal"
                value={values.phone}
                onChange={handleChange}
                />
              <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  {errors.phone && touched.phone && <ErrorMessage message={errors.phone} />}
              </Box>
            </Box>
            
            <Box width={"100%"} display={'flex'} justifyContent={'space-between'} alignContent={'center'} alignItems={'center'} gap={"32px"}>
              <TextField
                style={{marginBottom : '13px',width:'100%'}}
                name="otpNew"
                label="OTP"
                variant="outlined"                
                margin="normal"
                value={values.otpNew}
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
                    ></MyCustomButton>
            </Box>


            <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' , marginBottom : '13px'}}>
                  {errors.phone && touched.phone && <ErrorMessage message={errors.phone} />}
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
