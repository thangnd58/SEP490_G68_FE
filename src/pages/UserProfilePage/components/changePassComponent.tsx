import React, { useEffect, useState } from 'react';
import { Avatar, Typography, Grid, Button ,TextField } from '@mui/material';
import usei18next from '../../../hooks/usei18next';

function changePassComponent() {
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

   return (
    <Grid item xs container  spacing={2} sx={{marginTop : 5 , marginLeft : -25}}>
    <Grid item xs sx={{marginLeft: 4, marginTop : 3}} direction="column">

        <TextField
            sx= {{width : 500}}
            label={t("changePassword.OldPassword")}
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
            sx= {{width : 500}}
            label={t("changePassword.NewPassword")}
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
            sx= {{width : 500}}
            label={t("changePassword.RePassword")}
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <div >
            <Button  variant="outlined"  sx={{ fontWeight: '500', width : 150, marginTop :  3, paddingTop : 1 , paddingBottom : 1, marginLeft : '19%'}}>{t("changePassword.BtnChange")}</Button>
        </div>
    </Grid>
  </Grid>
   )
}
export default changePassComponent