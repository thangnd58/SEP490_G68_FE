import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Typography, Grid, Button, TextField, Box, ListItem, colors } from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import { AuthContext } from '../../../contexts/AuthContext';
import { Lisence } from '../../../utils/type';
import UserService from '../../../services/UserService';
import { useFormik } from 'formik';
import ToastComponent from '../../../components/toast/ToastComponent';

const UserInformationComponent = () => {
  const { t } = usei18next();
  const { user, getUser } = useContext(AuthContext);
  const [lisence, setLisence] = useState<Lisence>();
  const [isEditLisence, setIsEditLisence] = useState<boolean>(false);

  
  useEffect(() => {
    getLisence();
  }, [user]);

  useEffect(() => {
    getUser();
  }, [])
  

  
  const getLisence = async () => {
    try {
      const res = await UserService.getLisenceInfo(user?.userId);
      if (res.status === 200) {
        setLisence(res.data);
        setFieldValue('licenceNumber',res.data.licenceNumber)
        setFieldValue('fullName',res.data.fullName)
        setFieldValue('dob',res.data.dob)
        setFieldValue('licenceImage',res.data.licenceImage)
      }
    } catch (error) {

    }
  }
  const formik = useFormik({
    initialValues: {
        licenceNumber:'',
        fullName: '',
        dob: '',
        licenceImage:''
    },
    onSubmit: values => {
        changeLisence(values.licenceNumber, values.fullName, values.dob, "null");
    }
  });

  console.log(lisence);
  const {
    values,
    setFieldValue,
    handleChange,
    handleSubmit
  } = formik;

  const changeLisence = async (licenceNumber: string, fullName: string, dob: string, licenceImage: string) => {
    try {
        const response = await UserService.changeLicense(
            licenceNumber,
            fullName,
            dob,
            licenceImage
        );
        if (response.status === 200) {
            ToastComponent(t("toast.changepassword.success"), "success");
            setIsEditLisence(false);
            getLisence();
        } else {
            ToastComponent(t("toast.changepassword.warning"), "warning");
        }
    } catch (error) {
        ToastComponent(t("toast.changepassword.error"), "error")
    }
  };

  console.log(lisence?.status);
  return (
    user ? <Grid item xs container direction="row" spacing={2} sx={{ marginTop: 7, marginLeft: 3 }}>
      <Grid item xs={5} container sx={{ width: '90%', height: '250px', border: '2px solid #cfcecc', p: 2, borderRadius: 2 }}>
        <Avatar sx={{ width: 200, height: 200 }} src={user.avatar} alt={user.name} />
        <Grid item xs>
          <Button variant="contained" sx={{ display: 'block', marginTop: 5, marginLeft: 4, marginRight: 2 }} >{t("userProfile.BtnUpload")}</Button>
          <Button variant="outlined" color="error" sx={{ display: 'block', marginTop: 3, marginLeft: 4 }} >{t("userProfile.BtnDelete")}</Button>
        </Grid>
      </Grid>
      <Grid item xs={2} sx={{ marginLeft: 2 }}>
        <Typography variant="h5" sx={{ color: '#bdb9af' }} align="right" >{t("userProfile.Name")} :</Typography>
        <Typography variant="h5" sx={{ marginTop: 3, color: '#9e9c98' }} align="right">{t("userProfile.Email")} : </Typography>
        <Typography variant="h5" sx={{ marginTop: 3, color: '#9e9c98' }} align="right">{t("userProfile.PhoneNumber")} : </Typography>
        <Typography variant="h5" sx={{ marginTop: 3, color: '#9e9c98' }} align="right">{t("userProfile.Gender")} : </Typography>
        <Typography variant="h5" sx={{ marginTop: 3, color: '#9e9c98' }} align="right">{t("userProfile.DOB")} : </Typography>
        <Typography variant="h5" sx={{ marginTop: 3, color: '#9e9c98' }} align="right">{t("userProfile.Address")} : </Typography>
      </Grid>
      <Grid item xs={4} sx={{ marginLeft: 1 }}>
        <Typography variant="h5" >{user.name}</Typography>
        <Typography variant="h5" sx={{ marginTop: 3 }} align="left"> {user.email?user.email : t("userProfile.InputProfile")}</Typography>
        <Typography variant="h5" sx={{ marginTop: 3 }} align="left"> {user.phone?user.phone : t("userProfile.InputProfile")}</Typography>
        <Typography variant="h5" sx={{ marginTop: 3 }} align="left"> {user.gender? (user.gender=== 'Male' ? t("userProfile.Male") : t("userProfile.Female")):t("userProfile.InputProfile")}</Typography>
        <Typography variant="h5" sx={{ marginTop: 3 }} align="left"> {user.dob?user.dob : t("userProfile.InputProfile")}</Typography>
        <Typography variant="h5" sx={{ marginTop: 3 }} align="left"> {user.address?user.address : t("userProfile.InputProfile")}</Typography>
      </Grid>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Grid item xs={11} container sx={{ border: '2px solid #cfcecc', p: 2, borderRadius: 2, marginTop: 8 }}>
        <Grid item xs={12} sm container>
          <Grid container xs={4}>
          <Typography variant="h6" fontWeight="bold" sx={{ width: '70%', marginLeft: 2 }} >{t("licenseInfo.Title")}</Typography>
          </Grid>
          <Grid container xs={4}>
          {
            lisence?.status === 0 ?
            <div  style={{color : '#e3be05' ,border : '1px #e3be05 solid',paddingLeft : '10px',paddingRight : '10px', borderRadius : '10px',paddingTop :'5px',marginLeft:'-70px'}} >
                  {t("licenseInfo.Processing")}
                  </div>
            : lisence?.status === 1 ?
            <div  style={{color : '#23c211' ,border : '1px #23c211 solid',paddingLeft : '10px',paddingRight : '10px', borderRadius : '10px',paddingTop :'5px',marginLeft:'-70px'}} >
                  {t("licenseInfo.Approve")}
                  </div>
            :lisence?.status === 2 ?
            <div  style={{color : 'red' ,border : '1px red solid',paddingLeft : '10px',paddingRight : '10px', borderRadius : '10px',paddingTop :'5px',marginLeft:'-70px'}} >
                  {t("licenseInfo.Reject")}
                  </div>
            :
            <></>
          }  
          
          </Grid>
          <Grid container xs={3}>
            {
              isEditLisence ?
                (<>
                  <Button variant="outlined" type='submit' sx={{ marginRight: 2, marginLeft: 8, height: '90%' }}>{t("licenseInfo.BtnSave")}</Button>
                  <Button variant="contained" sx={{ height: '90%' }} onClick={() => setIsEditLisence(false)}>{t("licenseInfo.BtnCancel")}</Button>
                </>)
                :
                (
                  <Button variant="outlined" key={'info'} sx={{ marginLeft: 17, height: '90%' }} onClick={() => setIsEditLisence(true)}>
                    {t("licenseInfo.BtnEdit")}
                  </Button>
                )
            }
          </Grid>

          <Grid container xs={5} sx={{ marginLeft: 2, marginTop: 6 }}>
            <TextField
              disabled={!isEditLisence}
              name="licenceNumber"
              label={t("licenseInfo.NumberLicense")}
              placeholder={t("licenseInfo.NumberLicense")}
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              margin='normal'
              value={values.licenceNumber}
              sx={{ width: '80%' }}
              onChange={handleChange}
            />

            <TextField
              disabled={!isEditLisence}
              name="fullName"
              label={t("licenseInfo.Name")}
              placeholder={t("licenseInfo.Name")}
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={values.fullName}
              margin='normal'
              sx={{ width: '80%' }}
              onChange={handleChange}
            />

            <TextField
              onChange={handleChange}
              disabled={!isEditLisence}
              name="dob"
              type='date'
              label={t("userProfile.DOB")}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              fullWidth
              value={values.dob}
              margin='normal'
              sx={{ width: '80%' }}
            />
          </Grid>
          <Grid container xs={6} sx={{ width: '90%', height: '70%', border: '2px solid #cfcecc', p: 2, borderRadius: 2, marginTop: '50px', minHeight: '270px' }}>
            {
              !lisence ?
                <Typography fontWeight="500" sx={{ width: '100%', marginTop: '20%' }} align="center">{t("licenseInfo.Image")}</Typography>
                :
                <img width="100%" height="100%" src={lisence.licenceImage} alt={user.name} />
            }
          </Grid>
          <>{isEditLisence ?
            <Grid item xs={12} sx={{ marginTop: '1%' }}>
              <Button variant="contained" sx={{ marginLeft: '62%' }} >
                {t("licenseInfo.BtnchooseLicense")}
              </Button>
            </Grid>
            :
            <Grid item xs={12} sx={{ marginTop: '1%' }}>
              <Button variant="contained" disabled sx={{ marginLeft: '62%' }} >
                {t("licenseInfo.BtnchooseLicense")}
              </Button>
            </Grid>
          }</>
          
        </Grid>
      </Grid>
      </form>
    </Grid>
      :
      <></>
  )
}
export default UserInformationComponent