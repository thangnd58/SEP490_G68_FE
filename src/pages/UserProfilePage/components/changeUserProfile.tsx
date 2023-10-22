import React, { FunctionComponent } from 'react';
import { RadioGroup, Typography, Button, TextField, FormControlLabel, Radio, Box } from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import { useAuth } from '../../../contexts/AuthContext';
import { useFormik } from 'formik';
import ToastComponent from '../../../components/toast/ToastComponent';
import UserService from '../../../services/UserService';
import * as Yup from 'yup';
import ErrorMessage from '../../../components/common/ErrorMessage';
import MyCustomButton from '../../../components/common/MyButton';
import { MyCustomeTextField } from './userInformationComponent';

import { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import theme from '../../../utils/theme';
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
            phone: user ? user.phone : '',
            dob: user ? user.dob : '',
            address: user ? user.address : '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required(t('form.required')),
            phone: Yup.string().required(t('form.required')).matches(/^[0-9]{10}$/, t('form.validatePhone')),
            dob: Yup.string().required(t('form.required')),
            address: Yup.string().required(t('form.required')),
        }),
        onSubmit: values => {
            changeUserProfile(values.name, values.phone, values.gender, values.dob, values.address);
        },
    });

    const changeUserProfile = async (name: string, phone: string, gender: string, dob: string, address: string) => {
        try {
            const response = await UserService.changeUserProfile(
                name,
                phone,
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
                <MyCustomeTextField
                    name="phone"
                    label={t('userProfile.PhoneNumber')}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={values.phone}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>
                    {errors.phone && touched.phone && <ErrorMessage message={errors.phone} />}
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
                <div style={{ marginTop: "16px" }}>
                    <MyCustomButton
                        borderRadius={8}
                        fontSize={16}
                        fontWeight={400}
                        content={t('changePassword.BtnChange')}
                        type="submit"
                    />
                </div>
            </form>
        </Box>
    );
};

export default ChangeUserProfileComponent;
