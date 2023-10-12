import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { RadioGroup, Typography, Grid, Button, TextField, FormControlLabel, Radio } from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import { AuthContext } from '../../../contexts/AuthContext';
import { useFormik } from 'formik';
import ToastComponent from '../../../components/toast/ToastComponent';
import UserService from '../../../services/UserService';

interface ChildComponentProps {
    setType: React.Dispatch<React.SetStateAction<string>>;
}

const changeUserProfileComponent: FunctionComponent<ChildComponentProps> = ({ setType }) => {
    const { user } = useContext(AuthContext);

    const formik = useFormik({
        initialValues: {
            name: user ? user.name : '',
            gender: user ? user.gender : 'Male',
            phone: user ? user.phone :'',
            dob: user ? user.dob : '',
            address: user ? user.address : ''
        },
        onSubmit: values => {
            changeUserProfile(values.name,values.phone ,values.gender, values.dob, values.address);
        }
    });

    const changeUserProfile = async (name: string,phone: string, gender: string, dob: string, address: string) => {
        try {
            const response = await UserService.changeUserProfile(
                name,
                phone,
                gender,
                dob,
                address
            );
            if (response.status === 200) {
                ToastComponent(t("toast.changepassword.success"), "success");
                setType('info');
            } else {
                ToastComponent(t("toast.changepassword.warning"), "warning");
            }
        } catch (error) {
            ToastComponent(t("toast.changepassword.error"), "error")
        }
    };

    const { t } = usei18next();

    const {
        values,
        handleChange,
        handleSubmit
    } = formik;
    console.log(values.name);
    return (
        <Grid item xs container spacing={2} sx={{ marginTop: 5, marginLeft: '25%' }}>
            <Grid item xs sx={{ marginLeft: 4, marginTop: 3 }} direction="column">
                <form onSubmit={handleSubmit} style={{ width: '80%' }}>
                    <TextField
                        name='name'
                        sx={{ width: 500 }}
                        label={t("userProfile.Name")}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={values.name}
                        onChange={handleChange}
                    />
                    <Typography fontWeight="700" sx={{ width: '65%', marginTop: 2, display: 'Block' }} >{t("userProfile.Gender")}</Typography>
                    <RadioGroup
                        name="gender"
                        value={values.gender}
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
                        name='phone'
                        sx={{ width: 500 }}
                        label={t("userProfile.PhoneNumber")}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={values.phone}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder=""

                    />
                    <TextField
                        name='dob'
                        sx={{ width: 500 }}
                        label={t("userProfile.DOB")}
                        variant="outlined"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={values.dob}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder=""

                    />
                    <TextField
                        name='address'
                        sx={{ width: 500 }}
                        label={t("userProfile.Address")}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={values.address}
                        onChange={handleChange}
                    />
                    <div >
                        <Button variant="outlined" type='submit' sx={{ width: 150, marginLeft: '25%', marginTop: 3, paddingTop: 1, paddingBottom: 1 }}>{t("changePassword.BtnChange")}</Button>
                    </div>
                </form>
            </Grid>
        </Grid>
    )
}
export default changeUserProfileComponent