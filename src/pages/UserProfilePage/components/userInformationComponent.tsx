import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react';
import { Avatar, Typography, Button, TextField, Box, Chip, styled, Tooltip } from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import { AuthContext, useAuth } from '../../../contexts/AuthContext';
import * as Yup from 'yup';
import { ImageUpload, Lisence } from '../../../utils/type';
import UserService from '../../../services/UserService';
import { useFormik } from 'formik';
import ErrorMessage from '../../../components/common/ErrorMessage';
import ToastComponent from '../../../components/toast/ToastComponent';
import UploadImageService from '../../../services/UploadImageService';
import MyCustomButton from '../../../components/common/MyButton';
import { CheckCircle, CheckCircleOutline, CheckCircleOutlineOutlined, EditOutlined, Error, ErrorOutline, Info, InfoOutlined, Link, LinkOff, Warning, WarningAmber } from '@mui/icons-material';
import theme from '../../../utils/theme';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAction';
import { getUserInfo } from '../../../redux/reducers/authReducer';
import useThemePage from '../../../hooks/useThemePage';
import EditIcon from '@mui/icons-material/Edit';
import MyIcon from '../../../components/common/MyIcon';
import MyDialog from '../../../components/common/MyDialog';
import { Image } from 'antd';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { ModalContext } from '../../../contexts/ModalContext';

interface ChildComponentProps {
  setType: React.Dispatch<React.SetStateAction<string>>;
  setShowButtons: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserInformationComponent: FunctionComponent<ChildComponentProps> = ({ setType, setShowButtons }) => {

  const { t } = usei18next();
  const { user } = useAppSelector((state: any) => state.userInfo);
  const [lisence, setLisence] = useState<Lisence>();
  const [isEditLisence, setIsEditLisence] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefLicense = useRef<HTMLInputElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [fileLicence, setFileLicence] = useState<File>();
  const dispatch = useAppDispatch();
  const { isMobile } = useThemePage();
  const { setShowModal, setContentModal } = useContext(ModalContext);
  useEffect(() => {
    getLisence();
  }, []);

  // useEffect(() => {
  //   const checkImageSize = () => {
  //     const img = new Image();
  //     img.crossOrigin = 'anonymous';
  //     img.src = imagePreviewUrl;
  //     img.onload = () => {
  //       const { naturalWidth, naturalHeight,  } = img;
  //       if (naturalWidth < naturalHeight) {
  //         const canvas = document.createElement('canvas');
  //         const ctx = canvas.getContext('2d');
  //         if (ctx) {
  //           canvas.width = naturalHeight;
  //           canvas.height = naturalWidth;
  //           ctx.translate(naturalHeight, 0);
  //           ctx.rotate(Math.PI/ 2);
  //           ctx.drawImage(img, 0, 0, naturalWidth, naturalHeight);
  //           setImagePreviewUrl(canvas.toDataURL());
  //         }
  //       }
  //     };
  //   };

  //   if (imagePreviewUrl !== '') {
  //     checkImageSize();
  //   }
  // }, [imagePreviewUrl]);




  const getLisence = async () => {
    try {
      const res = await UserService.getLisenceInfo(user?.userId);
      if (res.status === 200) {
        setLisence(res.data);
        setFieldValue('licenceNumber', res.data.licenceNumber);
        setFieldValue('fullName', res.data.fullName);
        setFieldValue('dob', res.data.dob);
        setFieldValue('licenceImage', res.data.licenceImage);
        setImagePreviewUrl(res.data.licenceImageUrl);
      }
    } catch (error) { }
  };

  const formik = useFormik({
    initialValues: {
      licenceNumber: '',
      fullName: '',
      dob: '',
      licenceImage: '',
    },
    validationSchema: Yup.object({
      licenceNumber: Yup.string().required(t('form.required')).matches(/^[0-9]{12}$/, t('form.validLicenseNumber')),
      fullName: Yup.string().required(t('form.required')).max(256, t('form.validateString265Char')),
      dob: Yup.date().required(t('form.required')).max(new Date(), t('form.validateDOB')),
    }),
    onSubmit: values => {
      changeLisence(values.licenceNumber, values.fullName, values.dob, values.licenceImage);
    },
  });

  const resetErrors = () => {
    formik.resetForm();
  };

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    handleSubmit,
  } = formik;

  const cancelEditLisence = () => {
    getLisence();
    setFieldValue('licenceImage', '');
    setIsEditLisence(false);
  };

  const changeLisence = async (licenceNumber: string, fullName: string, dob: string, licenceImage: string) => {
    try {
      const response = await UserService.changeLicense(licenceNumber, fullName, dob, licenceImage);
      if (response.status === 200) {
        const params: ImageUpload = {
          tableName: 'licence',
          columnName: 'licenceImage',
          code: response.data,
          fileName: fileLicence!.name,
        };
        const responseUrl = await UploadImageService.generateUrlUpload(params);
        if (responseUrl.status !== 200) {
          ToastComponent(t('toast.uploadImage.error'), 'error');
          return;
        }
        const urlUpload = responseUrl.data.uploadUrl;
        if (fileLicence) {
          const responseUpload = await UploadImageService.uploadImage(urlUpload, fileLicence);

          if (responseUpload.status !== 200) {
            ToastComponent(t('toast.uploadImage.error'), 'error');
            return;
          }
        }
        ToastComponent(t('toast.changeLicense.success'), 'success');
        setIsEditLisence(false);
        getLisence();
      } else {
        ToastComponent(t('toast.changeLicense.warning'), 'warning');
      }
    } catch (error) {
      ToastComponent(t('toast.changeLicense.error'), 'error');
    }
  };

  const onClickRef = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onClickRefLicense = () => {
    if (inputRefLicense.current) {
      inputRefLicense.current.click();
    }
  };

  const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files && event.target.files[0];
      if (inputRef.current) {
        if (!file) {
          inputRef.current.value = '';
          return;
        }
        const params: ImageUpload = {
          tableName: 'user',
          columnName: 'avatar',
          code: user!.userId.toString(),
          fileName: file.name,
        };

        const responseUrl = await UploadImageService.generateUrlUpload(params);
        if (responseUrl.status !== 200) {
          ToastComponent(t('toast.uploadImage.error'), 'error');
          return;
        }

        const urlUpload = responseUrl.data.uploadUrl;
        const responseUpload = await UploadImageService.uploadImage(urlUpload, file);

        if (responseUpload.status !== 200) {
          ToastComponent(t('toast.uploadImage.error'), 'error');
          return;
        }
        const resultUpdateAvatar = await UserService.updateAvatarUser(user!.userId, file.name);
        if (resultUpdateAvatar.status !== 200) {
          ToastComponent(t('toast.uploadImage.error'), 'error');
          return;
        }
        dispatch(getUserInfo());
        ToastComponent(t('toast.uploadImage.success'), 'success');
      }
    } catch (error) {
    } finally {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const response = await UserService.deleteAvatarUser(user!.userId);
      if (response.status === 200) {
        ToastComponent(t('toast.uploadImage.deleteSuccess'), 'success');
        dispatch(getUserInfo());
      } else {
        ToastComponent(t('toast.uploadImage.deleteError'), 'error');
      }
    } catch (error) {
      ToastComponent(t('toast.uploadImage.deleteError'), 'error');
    }
  };

  const handleUploadLicenseImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files && event.target.files[0];
      if (inputRefLicense.current) {
        if (!file) {
          inputRefLicense.current.value = '';
          return;
        }
        const newPreview = URL.createObjectURL(file);
        setFieldValue('licenceImage', file.name);
        setImagePreviewUrl(newPreview);
        setFileLicence(file);
        ToastComponent(t('toast.uploadImage.success'), 'success');
      }
    } catch (error) {
    } finally {
      if (inputRefLicense.current) {
        inputRefLicense.current.value = '';
      }
    }
  };

  const handleGoogleLink = async (credentialResponse: any) => {
    try {
      const res = await UserService.linkGoogleAccount({ accessToken: credentialResponse.credential })
      if (res) {
        ToastComponent(t('toast.userProfile.googleAccount.linkSuccess'), 'success');
        dispatch(getUserInfo());
      }
    } catch (error) {
      ToastComponent(t('toast.userProfile.googleAccount.linkError'), 'error');
    }
  };

  const handleConfirmUnlink = () => {
    setContentModal(<MyDialog content={t("toast.userProfile.confirmUnlink")} title={t("toast.userProfile.btnUnlink")} hasAgreeButton={true} hasCancelButton={true} onClickAgree={() => handleUnlinkGoogle()} />);
  }

  const handleUnlinkGoogle = async () => {
    try {
      await UserService.unlinkGoogleAccount();
      ToastComponent(t('toast.userProfile.googleAccount.unlinkSuccess'), 'success');
      dispatch(getUserInfo());
    } catch (error) {
      ToastComponent(t('toast.userProfile.googleAccount.unlinkError'), 'error');
    }
  }


  return (
    user ? (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
        {/* Part 1 (Top) */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            width: '100%',
            border: '3px solid #E0E0E0',
            borderRadius: '8px',
          }}
        >
          {/* Left Section (Avatar and Two Buttons) */}
          <Box sx={{ flexBasis: '30%', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
            <Box>
              <Avatar variant="rounded" sx={{ width: 200, height: 200, marginTop: isMobile ? '16px' : '0px' }} src={user.avatarUrl} alt={user.name} />
              <input
                aria-label='upload avatar'
                ref={inputRef}
                type="file"
                style={{ display: 'none' }}
                multiple={false}
                accept="image/jpeg, image/png"
                onChange={handleUploadAvatar}
              />
            </Box>
            <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: "16px" }}>
              <MyCustomButton
                borderRadius={8}
                fontSize={isMobile ? 12 : 16}
                fontWeight={400}
                content={t('userProfile.BtnUpload')}
                onClick={onClickRef} />

              {
                user.avatarUrl !== 'https://sep490g68.s3.ap-southeast-1.amazonaws.com/common/no-image/No_Image.jpg' &&
                <MyCustomButton
                  borderRadius={8}
                  fontSize={isMobile ? 12 : 16}
                  fontWeight={500}
                  variant='outlined'
                  content={t('userProfile.BtnDelete')}
                  onClick={handleDeleteAvatar} />
              }
            </Box>
          </Box>


          {/* Right Section (Basic Information) */}
          <Box sx={{ width: isMobile ? '100%' : '70%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: isMobile ? "16px" : "32px" }}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontSize={isMobile ? 14 : 16} color={theme.palette.text.secondary} fontWeight={400}>
                    {t('userProfile.Name')}
                  </Typography>
                  <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.primary} fontWeight={600}>
                    {user.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontSize={isMobile ? 14 : 16} color={theme.palette.text.secondary} fontWeight={400}>
                    {t('userProfile.Email')}
                  </Typography>
                  <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.primary} fontWeight={600}>
                    {user.email ? user.email : t('userProfile.InputProfile')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box display={'flex'} flexDirection='row' alignItems={'center'} alignContent={'center'}>
                    <Typography variant="h6" marginRight={1} fontSize={isMobile ? 14 : 16} color={theme.palette.text.secondary} fontWeight={400}>
                      {t('userProfile.PhoneNumber')}
                    </Typography>
                    {user.phoneVerified === true && (
                      <Tooltip title={t('userProfile.Verified')}>
                        <CheckCircle
                          sx={{
                            width: '16px',
                            height: '16px',
                            color: "#4caf50"

                          }}
                        />
                      </Tooltip>
                    )}
                    {user.phoneVerified === false && (
                      <Tooltip title={t('userProfile.AlertVerify')}>
                        <MyIcon icon={
                          <Info
                            sx={{
                              width: '16px',
                              height: '16px',
                              color: " #ff9800"
                            }}
                          />} onClick={() => {
                            setType('verifyPhone');
                            setShowButtons(false);
                          }} />
                      </Tooltip>
                    )}
                    {/*  <Tooltip title={t('userProfile.AlertVerify')}>
                           <Chip
                             sx={{ '& .MuiChip-label': { fontSize: isMobile ? "12px" : "14px" }, height: '90%', cursor: 'pointer' }}
                             color="warning"
                             icon={<WarningAmber sx={{
                               width: '16px',
                               height: '16px',
                             }} />}
                             label={t('userProfile.notYetVerify')}
                             onClick={() => {
                               setType('verifyPhone');
                               setShowButtons(false);
                             }}
                           />
                         </Tooltip> */}
                  </Box>
                  <Box display={'flex'} alignItems={'center'} alignContent={'center'}>
                    <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.primary} fontWeight={600} display={'inline'} marginRight={"4px"}>
                      {user.phone ? user.phone : t('userProfile.InputProfile')}
                    </Typography>
                    {
                      user.phoneVerified === true && (
                        <MyIcon icon={<EditIcon sx={{
                          width: '16px',
                          height: '16px',
                        }} />} noPadding hasTooltip tooltipText={t("userProfile.BtnChange")} onClick={() => {
                          setType('changePhone');
                          setShowButtons(false);
                        }} />
                      )
                    }

                    {/* <Button onClick={ChangePhone}>{t('userProfile.BtnChange')}</Button> */}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontSize={isMobile ? 14 : 16} color={theme.palette.text.secondary} fontWeight={400}>
                    {t('userProfile.Gender')}
                  </Typography>
                  <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.primary} fontWeight={600}>
                    {user.gender ? (user.gender === 'Male' ? t('userProfile.Male') : t('userProfile.Female')) : t('userProfile.InputProfile')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontSize={isMobile ? 14 : 16} color={theme.palette.text.secondary} fontWeight={400}>
                    {t('userProfile.DOB')}
                  </Typography>
                  <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.primary} fontWeight={600}>
                    {user.dob ? user.dob : t('userProfile.InputProfile')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontSize={isMobile ? 14 : 16} color={theme.palette.text.secondary} fontWeight={400}>
                    {t('userProfile.Address')}
                  </Typography>
                  <Typography fontSize={isMobile ? 14 : 16} color={theme.palette.text.primary} fontWeight={600}>
                    {user.address ? user.address : t('userProfile.InputProfile')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} gap={1}>
                    <Typography variant="h6" fontSize={isMobile ? 14 : 16} color={theme.palette.text.secondary} fontWeight={400}>
                      Google
                    </Typography>
                    {
                      user.googleIdentity !== "" &&
                      <Tooltip title={t('userProfile.Verified')}>
                        <CheckCircle
                          sx={{
                            width: '16px',
                            height: '16px',
                            color: "#4caf50"

                          }}
                        />
                      </Tooltip>
                    }
                  </Box>
                  <Box display={'flex'} alignItems={'center'} alignContent={'center'}>
                    <Typography marginRight={"4px"} fontSize={isMobile ? 14 : 16} color={theme.palette.text.primary} fontWeight={600}>
                      {user.googleIdentity ? user.googleIdentity : t('toast.userProfile.btnLink')}
                    </Typography>
                    {
                      user.googleIdentity === "" && user.email !== null ? (
                        <GoogleOAuthProvider clientId="1088937198611-lpsokcekdcethdobpeghbm43nf4fglcl.apps.googleusercontent.com">
                          <Tooltip title={t('toast.userProfile.btnLink')}>
                            <GoogleLogin
                              size='small'
                              type='icon'
                              logo_alignment='center'
                              shape='circle'
                              width={100}
                              text='continue_with'
                              onSuccess={credentialResponse => {
                                handleGoogleLink(credentialResponse)
                              }}
                              onError={() => {
                                console.log('Login Failed');
                              }}
                            />
                          </Tooltip>
                        </GoogleOAuthProvider>
                      ) : (
                        <MyIcon icon={<LinkOff sx={{
                          width: '16px',
                          height: '16px',
                        }} />} noPadding hasTooltip tooltipText={t("toast.userProfile.btnUnlink")} onClick={() => handleConfirmUnlink()} />
                      )
                    }

                    {/* <Button onClick={ChangePhone}>{t('userProfile.BtnChange')}</Button> */}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Part 2 (Bottom, Driver License) */}
        {
          user.role.roleName === 'Customer' && (
            <Box sx={{ marginTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              {/* Top Section (Title and Edit Button) */}
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', width: '100%', justifyContent: 'space-between' }}>
                <Box sx={{ flexBasis: '70%', flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: '16px' }}>
                  <Typography variant="h6" fontWeight="bold" fontSize={isMobile ? 16 : 20}>
                    {t('licenseInfo.Title')}
                  </Typography>
                  {lisence?.status !== undefined && (
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      {lisence.status === 0 && (
                        <Chip
                          sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                          color="warning"
                          icon={<WarningAmber />}
                          label={t('licenseInfo.Processing')} />
                      )}
                      {lisence.status === 1 && (
                        <Chip
                          sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                          color="success"
                          icon={<CheckCircleOutline />}
                          label={t('licenseInfo.Approve')} />
                      )}
                      {lisence.status === 2 && (
                        <Chip
                          sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                          color="error"
                          icon={<ErrorOutline />}
                          label={t('licenseInfo.Reject')} />
                      )}
                    </Box>
                  )}
                </Box>

                <Box sx={{ flexBasis: '30%', flexGrow: 1, display: 'flex', marginTop: isMobile ? '16px' : '0px', justifyContent: isMobile ? 'flex-start' : 'flex-end', gap: '16px' }}>
                  {isEditLisence ? (
                    <>
                      <MyCustomButton
                        borderRadius={8}
                        fontSize={isMobile ? 12 : 16}
                        fontWeight={400}
                        disabled={values.licenceNumber === lisence?.licenceNumber && values.fullName === lisence?.fullName && values.dob === lisence?.dob && values.licenceImage === lisence?.licenceImage}
                        content={t('licenseInfo.BtnSave')}
                        onClick={() => handleSubmit()} />
                      <MyCustomButton
                        borderRadius={8}
                        fontSize={isMobile ? 12 : 16}
                        variant='outlined'
                        fontWeight={500}
                        content={t('licenseInfo.BtnCancel')}
                        onClick={() => {
                          resetErrors();
                          cancelEditLisence()
                        }} />
                    </>
                  ) : (
                    <MyCustomButton
                      borderRadius={8}
                      fontSize={isMobile ? 12 : 16}
                      fontWeight={400}
                      content={t('licenseInfo.BtnEdit')}
                      onClick={() => setIsEditLisence(true)} />
                  )}
                </Box>
              </Box>

              {/* Bottom Section (License Details and Image) */}
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', width: '100%', justifyContent: 'space-between', marginTop: '32px', gap: '32px' }}>
                <Box sx={{ flexBasis: '50%', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '32px', justifyContent: 'space-between' }}>
                  <Box>
                    <MyCustomeTextField
                      disabled={!isEditLisence}
                      name="licenceNumber"
                      label={t('licenseInfo.NumberLicense')}
                      placeholder={t('licenseInfo.NumberLicense')}
                      variant="outlined"
                      fullWidth
                      type='number'
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onInput={(e: any) => {
                        e.preventDefault();
                        const value = e.target.value;

                        // Lọc chỉ những ký tự số và giới hạn độ dài là 12
                        const filteredValue = value.replace(/\D/g, '').slice(0, 12);

                        // Cập nhật giá trị
                        e.target.value = filteredValue;
                        handleChange(e);
                      }}
                      value={values.licenceNumber}
                    />

                    {errors.licenceNumber && touched.licenceNumber && <ErrorMessage message={errors.licenceNumber} />}
                  </Box>
                  <Box>
                    <MyCustomeTextField
                      disabled={!isEditLisence}
                      name="fullName"
                      label={t('licenseInfo.Name')}
                      placeholder={t('licenseInfo.Name')}
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        style: { textTransform: 'uppercase' },
                      }}
                      onChange={handleChange}
                      value={values.fullName}
                    />
                    {errors.fullName && touched.fullName && <ErrorMessage message={errors.fullName} />}
                  </Box>
                  <Box>
                    <MyCustomeTextField
                      onChange={handleChange}
                      disabled={!isEditLisence}
                      name="dob"
                      type="date"
                      label={t('userProfile.DOB')}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        max: new Date().toISOString().split("T")[0],

                      }}
                      variant="outlined"
                      fullWidth
                      value={values.dob}
                    />
                    {errors.dob && touched.dob && <ErrorMessage message={errors.dob} />}
                  </Box>
                </Box>
                <Box sx={{
                  flexBasis: '50%',
                  flexGrow: 1,
                  border: '3px solid #E0E0E0',
                  borderRadius: '8px',
                  padding: '16px',
                  height: '270px',
                }}>
                  {imagePreviewUrl !== "" ? (
                    // <Im style={{
                    //   width: '100%',
                    //   height: '100%',
                    //   objectFit: 'fill',
                    // }} src={imagePreviewUrl} alt={user.name} />
                    <Image
                      width={'100%'}
                      height={'100%'}
                      src={imagePreviewUrl}
                    />
                  ) : (
                    <Typography fontWeight="500" sx={{ width: '100%', margin: '100px 0px' }} align="center">
                      {t('licenseInfo.Image')}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Upload Button */}
              <input
                aria-label='upload license'
                ref={inputRefLicense}
                type="file"
                style={{ display: 'none' }}
                multiple={false}
                accept={"image/jpeg, image/png"}
                onChange={handleUploadLicenseImage}
              />
              <>
                {isEditLisence && (
                  <Box sx={{ display: 'flex', justifyContent: 'end', width: '100%', marginTop: '16px' }}>
                    <MyCustomButton
                      borderRadius={8}
                      fontSize={isMobile ? 12 : 16}
                      fontWeight={400}
                      content={t('licenseInfo.BtnchooseLicense')}
                      onClick={onClickRefLicense} />
                  </Box>
                )}
              </>
            </Box>
          )
        }
      </Box >

    ) : (
      <></>
    )
  );
};

export default UserInformationComponent;

export const MyCustomeTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.action.disabledBackground,
      borderRadius: '8px'
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));
