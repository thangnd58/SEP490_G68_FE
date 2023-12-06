import React, { FunctionComponent, useState, } from 'react';
import { Typography, TextField, Box, Tooltip } from '@mui/material';
import MyCustomButton from '../../../components/common/MyButton';
import useThemePage from '../../../hooks/useThemePage';
import usei18next from '../../../hooks/usei18next';
import UserService from '../../../services/UserService';
import ToastComponent from '../../../components/toast/ToastComponent';
import { useFormik } from 'formik';
import EditIcon from '@mui/icons-material/Edit';
import * as Yup from "yup";
import ErrorMessage from '../../../components/common/ErrorMessage';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { useAppSelector } from '../../../hooks/useAction';
import { getUserInfo } from '../../../redux/reducers/authReducer';
import { useDispatch } from 'react-redux';
import MyIcon from '../../../components/common/MyIcon';
import ReactInputVerificationCode from 'react-input-verification-code';

interface ChildComponentProps {
  setType: React.Dispatch<React.SetStateAction<string>>;
}

const VerifyPhoneNumberComponent: FunctionComponent<ChildComponentProps> = ({ setType }) => {
  const { isMobile } = useThemePage();
  const { user } = useAppSelector((state) => state.userInfo);
  const { t } = usei18next();
  const [showButtonsOtp1, setShowButtonsOtp1] = useState<boolean>(true);
  const [showButtonsConfirm1, setShowButtonsConfirm1] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [typeOtp, setTypeOtp] = useState<number>();


  const formik = useFormik({
    initialValues: {
      otpOld: "",
      phone: ""
    },
    validationSchema: Yup.object({
      otpOld: Yup.string().required(t('form.required')).matches(/^[0-9]{6}$/, t('form.validateOtp')),
      phone: Yup.string().required(t('form.required')).matches(/^[0-9]{10}$/, t('form.validatePhone')),
    }),
    onSubmit: values => {
      verifyOtp(values.otpOld);
    }
  });
  
  const getOTP = async (type : number) => {
    if(user){
      try {
        setTypeOtp(type);
        let phoneToSend = ""
        if (type === 1 && user) {
          phoneToSend = user.phone;
          setFieldValue("phone", "0000000000");
        } else {
          phoneToSend = values.phone;
        }
        const response = await UserService.requestVerifyPhone(phoneToSend,type)
        if (response.status === 200) {
            ToastComponent(t("toast.sendOtp.success"), "success");
            setShowButtonsOtp1(false);
            setShowButtonsConfirm1(true);
            setTimeout(() => {
              setShowButtonsOtp1(true);
            }, 10000);
        }else if(response.status === 409){
          ToastComponent(t("toast.sendOtp.Conflict"), "warning");
        } else {
          ToastComponent(t("toast.sendOtp.warning"), "warning");
        }
      } catch (error) {
        ToastComponent(t("toast.sendOtp.error"), "error");
      }
    }
    
  };

  const verifyOtp = async (otpOld: string) => {
    try {
      if(user){
        let phoneToSend = ""
        if (typeOtp === 1 ) {
          phoneToSend = user.phone;
          setFieldValue("phone", "");
        } else {
          phoneToSend = values.phone;
        }
        const response = await UserService.requestVerifyOtp(phoneToSend, otpOld);
        if (response.status === 200) {
            dispatch(getUserInfo());
            setType('info');
            ToastComponent(t("toast.VerifyPhone.success"), "success");
        } else {
        ToastComponent(t("toast.VerifyPhone.warning"), "warning");
        }
      }
    } catch (error) {
      ToastComponent(t("toast.VerifyPhone.error"), "error");
    }
  }
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue
  } = formik;

  return (
    <Box width={'100%'}>
      { user && user.phone && user.phone !== '' ? 
        <Box className='confirm-old-phone-otp' sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box display={'flex'} alignItems={'center'}>
            <PhoneAndroidIcon></PhoneAndroidIcon>
            <Typography display={'inline'}>{user?.phone}</Typography>
          </Box>
          

          <form onSubmit={handleSubmit} style={{ width: isMobile ? "100%" : "50%", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box display={'flex'} justifyContent={'flex-end'} gap={'40px'} alignContent={'center'} alignItems={'center'}>
              <TextField
                style={{ marginBottom: '13px', width: '90%' }}
                name="otpOld"
                label="OTP"
                variant="outlined"
                margin="normal"
                value={values.otpOld}
                onChange={handleChange}
              />
              <Tooltip title={t("VerifyPhone.TooltipGetOTP")}>
                <Box>
                <MyCustomButton 
                    borderRadius={8}
                    fontSize={isMobile ? 12 : 16}
                    fontWeight={400}
                    content={t("ChangePhone.GetOTP")}
                    isWrap={false}
                    variant='outlined'
                    onClick={() => getOTP(1)}
                    disabled={showButtonsOtp1 ? false : true}
                ></MyCustomButton>
                </Box>
              </Tooltip>
              
            </Box>
            <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: '13px' }}>
              {errors.otpOld && touched.otpOld && <ErrorMessage message={errors.otpOld} />}
            </Box>
            <MyCustomButton
              borderRadius={8}
              fontSize={isMobile ? 12 : 16}
              fontWeight={400}
              content={t("ChangePhone.BtnConfirm")}
              type='submit'
              disabled={showButtonsConfirm1 ? false : true}
              isWrap={false}></MyCustomButton>
          </form>
        </Box>
        :
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <form
                      onSubmit={handleSubmit}
                      style={{
                        width: isMobile ? "100%" : "50%",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: "0px 64px"
                      }}>
                      <Box width={"100%"} display={'flex'} justifyContent={'space-between'} flexDirection={'column'} alignContent={'center'} alignItems={'center'}>
                        <TextField
                          sx={
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
                        <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          {errors.phone && touched.phone && <ErrorMessage message={errors.phone} />}
                        </Box>
                      </Box>
        
                      <Box width={"100%"} display={'flex'} justifyContent={'space-between'} alignContent={'center'} alignItems={'center'} gap={"32px"}>
                        <TextField
                          style={{ marginBottom: '13px', width: '100%' }}
                          name="otpOld"
                          label="OTP"
                          variant="outlined"
                          margin="normal"
                          value={values.otpOld}
                          onChange={handleChange}
                        />
                        {/* <ReactInputVerificationCode
                          length={6}
                          onChange={(value) => {
                            setFieldValue("otpOld", value);
                          }}
                          autoFocus={true}
                          placeholder={"-"}
                        /> */}
                        <Tooltip title={t("VerifyPhone.TooltipGetOTP")}>
                          <Box>
                            <MyCustomButton
                              borderRadius={8}
                              fontSize={isMobile ? 12 : 16}
                              fontWeight={400}
                              height='67%'
                              content={t("ChangePhone.GetOTP")}
                              isWrap={false}
                              variant='outlined'
                              onClick={() => getOTP(2)}
                              disabled={showButtonsOtp1 ? false : true}
                            ></MyCustomButton>
                          </Box>
                        </Tooltip>
                      </Box>
        
                      <MyCustomButton
                        borderRadius={8}
                        fontSize={isMobile ? 12 : 16}
                        fontWeight={400}
                        content={t("ChangePhone.BtnConfirm")}
                        type='submit'
                        disabled={showButtonsConfirm1 ? false : true}
                        isWrap={false}></MyCustomButton>
                    </form>
                  </Box>
                
              }
    </Box>
  );
};
export default VerifyPhoneNumberComponent;
