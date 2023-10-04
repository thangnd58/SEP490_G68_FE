import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Typography, Grid, Button, TextField, Box, ListItem } from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import { AuthContext } from '../../../contexts/AuthContext';

const UserInformationComponent = () => {
  const { t } = usei18next();
  const { user } = useContext(AuthContext);
  const [isEditLisence, setIsEditLisence] = useState<boolean>(false);

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
        <Typography variant="h5" sx={{ marginTop: 3 }} align="left"> {user.email}</Typography>
        <Typography variant="h5" sx={{ marginTop: 3 }} align="left"> {user.phone}</Typography>
        <Typography variant="h5" sx={{ marginTop: 3 }} align="left"> {user.gender === 'Male' ? t("userProfile.Male") : t("userProfile.Female")}</Typography>
        <Typography variant="h5" sx={{ marginTop: 3 }} align="left"> {user.dob}</Typography>
        <Typography variant="h5" sx={{ marginTop: 3 }} align="left"> {user.address}</Typography>
      </Grid>
      <Grid item xs={11} container sx={{ border: '2px solid #cfcecc', p: 2, borderRadius: 2, marginTop: 8 }}>
        <Grid item xs={12} sm container>
          <Typography variant="h6" fontWeight="bold" sx={{ width: '70%', marginLeft: 2 }} >{t("licenseInfo.Title")}</Typography>
          <Grid container xs={3}>
            {
              isEditLisence ?
                (<>
                  <Button variant="outlined" sx={{ marginRight: 2,marginLeft: 4 }}>{t("licenseInfo.BtnSave")}</Button>
                  <Button variant="contained" onClick={() => setIsEditLisence(false)}>{t("licenseInfo.BtnCancel")}</Button>
                </>)
                :
                (
                  <Button variant="outlined" key={'info'} sx={{ marginLeft: 10 }} onClick={() => setIsEditLisence(true)}>
                    {t("licenseInfo.BtnEdit")}
                  </Button>
                )
            }
          </Grid>


          <Grid container xs={5} sx={{ marginLeft: 2, marginTop: 4 }}>
            <TextField
              disabled={!isEditLisence}
              name="email"
              label={t("licenseInfo.NumberLicense")}
              placeholder={t("licenseInfo.NumberLicense")}
              variant="outlined"
              fullWidth
              margin='normal'
              sx={{ width: '80%', marginBottom: '20px' }}
            />

            <TextField
              disabled={!isEditLisence}
              name="email"
              label={t("licenseInfo.Name")}
              placeholder={t("licenseInfo.Name")}
              variant="outlined"
              fullWidth
              margin='normal'
              sx={{ width: '80%', marginBottom: '20px' }}
            />

            <TextField
              disabled={!isEditLisence}
              name="email"
              type='date'
              label={t("licenseInfo.Date")}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              fullWidth
              margin='normal'
              sx={{ width: '80%', marginBottom: '20px' }}
            />
          </Grid>
          <Grid container xs={6} sx={{ width: '90%', height: '70%', border: '2px solid #cfcecc', p: 2, borderRadius: 2, marginTop: '50px' }}>
            {
              user.avatar ?
                <Typography fontWeight="500" sx={{ width: '100%', marginTop: '20%' }} align="center">{t("licenseInfo.Image")}</Typography>
                :
                <Avatar sx={{ width: '100%', height: '100%' }} src={user.avatar} alt={user.name} />
            }
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    :
    <></>
  )
}
export default UserInformationComponent