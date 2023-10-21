import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Typography, Button, TextField, Box, Chip, styled } from '@mui/material';
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
import { CheckCircle, CheckCircleOutline, Error, ErrorOutline, Warning, WarningAmber } from '@mui/icons-material';
import theme from '../../../utils/theme';

const UserInformationComponent = () => {
  const { t } = usei18next();
  const { user, getUser } = useAuth();
  const [lisence, setLisence] = useState<Lisence>();
  const [isEditLisence, setIsEditLisence] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefLicense = useRef<HTMLInputElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");

  useEffect(() => {
    getLisence();
  }, []);

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
      fullName: Yup.string().required(t('form.required')),
      dob: Yup.string().required(t('form.required')),
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
          return;
        }

        const urlUpload = responseUrl.data.uploadUrl;
        const responseUpload = await UploadImageService.uploadImage(urlUpload, file);

        if (responseUpload.status !== 200) {
          return;
        }

        const resultUpdateAvatar = await UserService.updateAvatarUser(user!.userId, file.name);
        if (resultUpdateAvatar.status !== 200) {
          return;
        }

        getUser();
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
        // Avatar deletion is successful
        ToastComponent(t('userProfile.AvatarDeleted'), 'success');
        getUser();
      } else {
        // Handle error here if the deletion was not successful
        ToastComponent(t('userProfile.AvatarDeleteError'), 'error');
      }
    } catch (error) {
      // Handle any unexpected errors here
      ToastComponent(t('userProfile.AvatarDeleteError'), 'error');
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

        const params: ImageUpload = {
          tableName: 'licence',
          columnName: 'licenceImage',
          code: lisence!.licenceId.toString(),
          fileName: file.name,
        };

        const responseUrl = await UploadImageService.generateUrlUpload(params);
        if (responseUrl.status !== 200) {
          return;
        }

        const urlUpload = responseUrl.data.uploadUrl;
        const responseUpload = await UploadImageService.uploadImage(urlUpload, file);

        if (responseUpload.status !== 200) {
          return;
        }
        const newPreview = URL.createObjectURL(file);
        setFieldValue('licenceImage', file.name);
        setImagePreviewUrl(newPreview);
      }
    } catch (error) {
    } finally {
      if (inputRefLicense.current) {
        inputRefLicense.current.value = '';
      }
    }
  };


  return (
    user ? (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
        {/* Part 1 (Top) */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            border: '3px solid #E0E0E0',
            borderRadius: '8px',
          }}
        >
          {/* Left Section (Avatar and Two Buttons) */}
          <Box sx={{ flexBasis: '30%', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px', padding: "32px" }}>
            <Box>
              <Avatar variant="rounded" sx={{ width: 200, height: 200 }} src={user.avatarUrl} alt={user.name} />
              <input
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
                fontSize={16}
                fontWeight={400}
                content={t('userProfile.BtnUpload')}
                onClick={onClickRef} />

              <MyCustomButton
                borderRadius={8}
                fontSize={16}
                fontWeight={500}
                variant='outlined'
                content={t('userProfile.BtnDelete')}
                onClick={handleDeleteAvatar} />
            </Box>
          </Box>


          {/* Right Section (Basic Information) */}
          <Box sx={{ width: '70%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '32px' }}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'  }}>
                  <Typography variant="h6" fontSize={16} color={theme.palette.text.secondary} fontWeight={400}>
                    {t('userProfile.Name')}
                  </Typography>
                  <Typography fontSize={20} color={theme.palette.text.primary} fontWeight={600}>
                    {user.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontSize={16} color={theme.palette.text.secondary} fontWeight={400}>
                    {t('userProfile.Email')}
                  </Typography>
                  <Typography fontSize={20} color={theme.palette.text.primary} fontWeight={600}>
                    {user.email ? user.email : t('userProfile.InputProfile')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontSize={16} color={theme.palette.text.secondary} fontWeight={400}>
                    {t('userProfile.PhoneNumber')}
                  </Typography>
                  <Typography fontSize={20} color={theme.palette.text.primary} fontWeight={600}>
                    {user.phone ? user.phone : t('userProfile.InputProfile')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontSize={16} color={theme.palette.text.secondary} fontWeight={400}>
                    {t('userProfile.Gender')}
                  </Typography>
                  <Typography fontSize={20} color={theme.palette.text.primary} fontWeight={600}>
                    {user.gender ? (user.gender === 'Male' ? t('userProfile.Male') : t('userProfile.Female')) : t('userProfile.InputProfile')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontSize={16} color={theme.palette.text.secondary} fontWeight={400}>
                    {t('userProfile.DOB')}
                  </Typography>
                  <Typography fontSize={20} color={theme.palette.text.primary} fontWeight={600}>
                    {user.dob ? user.dob : t('userProfile.InputProfile')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontSize={16} color={theme.palette.text.secondary} fontWeight={400}>
                    {t('userProfile.Address')}
                  </Typography>
                  <Typography fontSize={20} color={theme.palette.text.primary} fontWeight={600}>
                    {user.address ? user.address : t('userProfile.InputProfile')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontSize={16} color={theme.palette.text.secondary} fontWeight={400}>
                    Google
                  </Typography>
                  <Typography fontSize={20} color={theme.palette.text.primary} fontWeight={600}>
                    {user.address ? user.address : t('userProfile.InputProfile')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Part 2 (Bottom, Driver License) */}
        <Box sx={{ marginTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {/* Top Section (Title and Edit Button) */}
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
            <Box sx={{ flexBasis: '70%', flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: '16px' }}>
              <Typography variant="h6" fontWeight="bold">
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

            <Box sx={{ flexBasis: '30%', flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              {isEditLisence ? (
                <>
                  <MyCustomButton
                    borderRadius={8}
                    fontSize={16}
                    fontWeight={400}
                    content={t('licenseInfo.BtnSave')}
                    onClick={() => handleSubmit()} />
                  <MyCustomButton
                    borderRadius={8}
                    fontSize={16}
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
                  fontSize={16}
                  fontWeight={400}
                  content={t('licenseInfo.BtnEdit')}
                  onClick={() => setIsEditLisence(true)} />
              )}
            </Box>
          </Box>

          {/* Bottom Section (License Details and Image) */}
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: '32px', gap: '32px' }}>
            <Box sx={{ flexBasis: '50%', flexGrow: 1, display: 'flex', flexDirection: 'column', height: '270px', justifyContent: 'space-between' }}>
              <Box>
                <MyCustomeTextField
                  disabled={!isEditLisence}
                  name="licenceNumber"
                  label={t('licenseInfo.NumberLicense')}
                  placeholder={t('licenseInfo.NumberLicense')}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
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
              {lisence ? (
                <Avatar variant="rounded" sx={{ width: 373, height: 234 }} src={imagePreviewUrl} alt={user.name} />
              ) : (
                <Typography fontWeight="500" sx={{ width: '100%', margin: '100px 0px' }} align="center">
                  {t('licenseInfo.Image')}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Upload Button */}
          <input
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
                  fontSize={16}
                  fontWeight={400}
                  content={t('licenseInfo.BtnchooseLicense')}
                  onClick={onClickRefLicense} />
              </Box>
            )}
          </>
        </Box>
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
