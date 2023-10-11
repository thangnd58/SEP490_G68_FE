import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Typography, Grid, Button  } from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import ChangePassComponent from './changePassComponent';
import ChangeUserProfile from './changeUserProfile';
import UserInformationComponent from './userInformationComponent';
import { AuthContext } from '../../../contexts/AuthContext';

function userProfileComponent() {
    
    const [type, setType] = useState<string>('info');
    const { t } = usei18next();    
  
    return (
      <Grid container spacing={2}>
        {
          type === 'info' ? 
            <Grid item xs={12} sm >
              <Grid item xs={12} sm container>
                <Typography variant="h5" fontWeight="bold" sx={{width: '65%',marginLeft : 2}} >{t("userProfile.Title")}</Typography>
                <Grid container  xs={4} sx={{width: '30%'}}>
                  <Button variant="contained"  onClick={() => setType('changeUser')} sx={{marginRight: 3}}>{t("userProfile.ChangeProfile")}</Button>
                  <Button variant="contained"  onClick={() => setType('changePass')}>{t("userProfile.ChangePassword")}</Button>
                </Grid>
              </Grid>
              <UserInformationComponent/>
            </Grid>
          :
            type === 'changePass' ?
              <Grid item xs={12} sm container>
                  <Typography variant="h5" fontWeight="bold" sx={{width: 300}}>{t("changePassword.Title")}</Typography>
                  <ChangePassComponent setType={setType}/>
                <Grid item>
                  <Button variant="contained" key={'changePass'} onClick={() => setType('info')}>{t("changePassword.Back")}</Button>
                </Grid>
              </Grid>
            :
              <Grid item xs={12} sm container>
                    <Typography variant="h5" fontWeight="bold" sx={{width: 300}}>{t("userProfile.ChangeProfile")}</Typography>
                    <ChangeUserProfile setType={setType}/>
                  <Grid item>
                    <Button variant="contained" key={'changePass'} sx={{marginTop: -7}} onClick={() => setType('info')}>{t("changePassword.Back")}</Button>
                  </Grid>
                </Grid>
        }
      </Grid>
    )
}
export default userProfileComponent