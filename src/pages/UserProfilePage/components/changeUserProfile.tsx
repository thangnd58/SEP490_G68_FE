import React, { FunctionComponent } from 'react';
import { RadioGroup, Typography, Button, TextField, FormControlLabel, Radio, Box } from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import { useFormik } from 'formik';
import ToastComponent from '../../../components/toast/ToastComponent';
import UserService from '../../../services/UserService';
import * as Yup from 'yup';
import ErrorMessage from '../../../components/common/ErrorMessage';
import MyCustomButton from '../../../components/common/MyButton';
import { MyCustomeTextField } from './userInformationComponent';
import { Dayjs } from 'dayjs';
import { useAppSelector } from '../../../hooks/useAction';
import { useDispatch } from 'react-redux';
import { getUserInfo } from '../../../redux/reducers/authReducer';
import useThemePage from '../../../hooks/useThemePage';

interface ChildComponentProps {
    setType: React.Dispatch<React.SetStateAction<string>>;
}

const ChangeUserProfileComponent: FunctionComponent<ChildComponentProps> = ({ setType }) => {
    const { t } = usei18next();
    const { user } = useAppSelector((state) => state.userInfo);
    const dispatch = useDispatch();
    const { isMobile } = useThemePage();
    const formik = useFormik({
        initialValues: {
            name: user ? user.name : '',
            gender: user ? user.gender : 'Male',
            dob: user ? user.dob : '',
            address: user ? user.address : '',
        },
        validationSchema: Yup.object({
            gender: Yup.string().required(t('form.required')),
            name: Yup.string().required(t('form.required')).max(256, t('form.validateString265Char')),
            dob: Yup.date().required(t('form.required')).max(new Date(),  t('form.validateDOB')),
            address: Yup.string().required(t('form.required')).max(256, t('form.validateString265Char')),
        }),
        onSubmit: values => {
            changeUserProfile(values.name,  values.gender, values.dob, values.address);
        },
    });

    const changeUserProfile = async (name: string, gender: string, dob: string, address: string) => {
        if(user){
        try {
            const response = await UserService.changeUserProfile(
                name,
                user.phone,
                gender,
                dob,
                address
            );
            if (response.status === 200) {
                ToastComponent(t('toast.changeUserProfile.success'), 'success');
                dispatch(getUserInfo());
                setType('info');
            } else {
                ToastComponent(t('toast.changeUserProfile.warning'), 'warning');
            }
        } catch (error) {
            ToastComponent(t('toast.changeUserProfile.error'), 'error');
        }
        }
    };

    const {
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
    } = formik;

    const [value, setValue] = React.useState<Dayjs | null>(null);

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <form onSubmit={handleSubmit} style={{ width: isMobile ? "100%" : "50%" , display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <MyCustomeTextField
                    name="name"
                    label={t('userProfile.Name')}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={values.name}
                    onChange={handleChange}
                />
                <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>
                    {errors.name && touched.name && <ErrorMessage message={errors.name} />}
                </Box>
                <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '16px' }}>
                    <Typography fontWeight="700">
                        {t('userProfile.Gender')}
                    </Typography>
                    <RadioGroup name="gender" value={values.gender} onChange={handleChange} row>
                        <FormControlLabel
                            value="Male"
                            control={<Radio />}
                            label={t('userProfile.Male')}
                        />
                        <FormControlLabel
                            value="Female"
                            control={<Radio />}
                            label={t('userProfile.Female')}
                        />
                    </RadioGroup>
                </Box>
                <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>
                    {errors.gender && touched.gender && <ErrorMessage message={errors.gender} />}
                </Box>
                <MyCustomeTextField
                    name="dob"
                    label={t('userProfile.DOB')}
                    variant="outlined"
                    type="date"
                    fullWidth
                    margin="normal"
                    value={values.dob}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']} sx={{
                        width: "100%",
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
                    }}>
                        <DatePicker sx={{ width: "100%" }} value={value} onChange={(newValue) => setValue(newValue)} />
                    </DemoContainer>
                </LocalizationProvider> */}
                <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>
                    {errors.dob && touched.dob && <ErrorMessage message={errors.dob} />}
                </Box>
                <MyCustomeTextField
                    name="address"
                    label={t('userProfile.Address')}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={values.address}
                    onChange={handleChange}
                />
                <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>
                    {errors.address && touched.address && <ErrorMessage message={errors.address} />}
                </Box>
                <Box style={{ marginTop: "16px" }}>
                    <MyCustomButton
                        borderRadius={8}
                        fontSize={16}
                        fontWeight={400}
                        content={t('changePassword.BtnChange')}
                        type="submit"
                    />
                </Box>
            </form>
        </Box>
    );
};

export default ChangeUserProfileComponent;
