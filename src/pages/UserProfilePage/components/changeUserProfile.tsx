import React, { useContext, useEffect, useState } from 'react';
import { RadioGroup, Typography, Grid, Button ,TextField , FormControlLabel, Radio} from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import { AuthContext } from '../../../contexts/AuthContext';


function changeUserProfileomponent() {
    const { user } = useContext(AuthContext);
    
    const { t } = usei18next();
    const users = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '0999888777',
        gender : '2',
        dob : '2000-01-01',
        address: '159 P. Thái Hà, Láng Hạ, Đống Đa, Hà Nội, Vietnam',
        avatar: 'https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg', // URL hình ảnh avatar
      };

      const centerTextStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      };
    
    const [gender, setGender] = useState(user ? user.gender : '');
    const handleChange = (event : any) => {
        setGender(event.target.value);
    };
    console.log(gender);
   
    const [name, setName] = useState(user ? user.name : '');
    const [address, setAddress] = useState(user ? user.address : '');
    const [dob, setDob] = useState(user ? user.dob : '');

   return (
    <Grid item xs container  spacing={2} sx={{marginTop : 5 , marginLeft : '25%'}}>
    <Grid item xs sx={{marginLeft: 4, marginTop : 3}} direction="column">

        <TextField
            sx= {{width : 500}}
            label={t("userProfile.Name")}
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
         <Typography  fontWeight="700"  sx={{width: '65%',marginTop : 2, display:'Block'}} >{t("userProfile.Gender")}</Typography>
        <RadioGroup
        name="options"
        value={gender}
        onChange={handleChange} row
        >
            <FormControlLabel
            value='Male'
            control={<Radio />}
            label={t("userProfile.Male")}
          />
          <FormControlLabel
            value='Female'
            control={<Radio />}
            label={t("userProfile.Female")}
        />
        </RadioGroup>
        
        <TextField
            sx= {{width : 500}}
            label={t("userProfile.DOB")}
            variant="outlined"
            type="date"
            fullWidth
            margin="normal"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            InputLabelProps={{
                shrink: true,
            }}
            placeholder=""
            
        />
        <TextField
            sx= {{width : 500}}
            label={t("userProfile.Address")}
            variant="outlined"
            fullWidth
            margin="normal"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
        />
        <div >
            <Button variant="outlined" sx={{width : 150,marginLeft : '25%', marginTop :  3, paddingTop : 1 , paddingBottom : 1}}>{t("changePassword.BtnChange")}</Button>
        </div>
    </Grid>
  </Grid>
   )
}
export default changeUserProfileomponent