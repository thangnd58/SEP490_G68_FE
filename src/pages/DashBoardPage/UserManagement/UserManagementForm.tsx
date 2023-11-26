import { useEffect, useState } from "react";
import { User } from "../../../utils/type";
import { useNavigate, useParams } from "react-router-dom";
import useThemePage from "../../../hooks/useThemePage";
import usei18next from "../../../hooks/usei18next";
import { Box, Select, Typography, MenuItem } from "@mui/material";
import MyIcon from "../../../components/common/MyIcon";
import { ArrowBack } from "@mui/icons-material";
import theme from "../../../utils/theme";
import ErrorMessage from "../../../components/common/ErrorMessage";
import MyCustomButton from "../../../components/common/MyButton";
import { useFormik } from "formik";
import * as Yup from 'yup';
import ToastComponent from "../../../components/toast/ToastComponent";
import UserService from "../../../services/UserService";

const UserManagementForm = () => {
    const [user, setUser] = useState<User>();
    const { id } = useParams();
    const { isMobile } = useThemePage();
    const { t } = usei18next()
    const navigate = useNavigate()
    const [isSave, setIsSave] = useState<boolean>(false);

    useEffect(() => {
        getUserById(Number(id));
    }, [id])

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            gender: "",
            dob: "",
            address: "",
            roleName: "",
            roleId: ""
        },
        validationSchema: Yup.object({
            roleId: Yup.string().required(t('form.required')),
        }),
        onSubmit: async (values) => {
            if (user) {
                try {
                    setIsSave(true)
                    const responseUrl = await UserService.updateRoleUserByIdManage(user.userId, values.roleId);
                    if (responseUrl.status === 200) {
                        ToastComponent(t('toast.UserManager.Edit.success'), 'success');
                    } else {
                        ToastComponent(t('toast.UserManager.Edit.warning'), 'warning');
                        return;
                    }
                    setTimeout(() => {
                        navigate(-1)
                    }, 2000);
                } catch (error) {
                    ToastComponent(t('toast.UserManager.Edit.warning'), 'warning');
                }
            }
        }
    });

    const getUserById = async (id: number) => {
        try {
            const response = await UserService.getUserByIdManage(id);
            if (response) {
                setUser(response);
                setFieldValue("name", response.name);
                setFieldValue("email", response.email);
                setFieldValue("phone", response.phone);
                setFieldValue("gender", response.gender);
                setFieldValue("dob", response.dob);
                setFieldValue("address", response.address);
                setFieldValue("roleName", response.role.roleName);
                setFieldValue("roleId", response.role.roleId);
            }
        } catch (error) {

        }
    }

    const {
        values,
        handleChange,
        handleSubmit,
        setFieldValue,
        errors,
        touched
    } = formik;

    return (
        <Box width={'100%'} display={'flex'} flexDirection={'column'} gap={"16px"}>
            <Box sx={{ backgroundColor: "#8B4513" }} width={'100%'} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1} >
                <MyIcon icon={<ArrowBack style={{ color: theme.palette.common.white }} />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => navigate(-1)} position='bottom' />
                <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700}>
                    {t("dashBoardManager.Navigation.user")}
                </Typography>
            </Box>

            <Box
                sx={{
                    border: "1px solid #E0E0E0",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignContent: 'center',
                    padding: isMobile ? '2rem' : '3rem',
                    gap: '3rem',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>

                <Box
                    sx={{ display: 'flex', flexDirection: 'column', width: isMobile ? '90%' : '60%', justifyContent: 'center' }}>
                    <Typography variant="h1" fontSize={24} fontWeight={700} marginTop={'-20px'} marginBottom={'15px'}>
                        {t("dashBoardManager.user.TitleChange")}
                    </Typography>
                    <Typography color={'black'} marginBottom={'5px'}>
                        {t("userProfile.Role")}
                    </Typography>

                    <Select
                        sx={{
                            borderRadius: '8px',
                        }}
                        fullWidth
                        displayEmpty
                        name="roleId"
                        value={values.roleId}
                        onChange={handleChange}
                    >
                        <MenuItem key={0} value="">
                            <em>{t("dashBoardManager.user.chooseRole")}</em>
                        </MenuItem>
                        <MenuItem key={1} value={'1'}>
                            {t("dashBoardManager.user.customer")}
                        </MenuItem>
                        <MenuItem key={2} value={'2'}>
                            {t("dashBoardManager.user.staff")}
                        </MenuItem>
                        <MenuItem key={3} value={'3'}>
                            {t("dashBoardManager.user.admin")}
                        </MenuItem>
                    </Select>
                    {errors.roleId && touched.roleId && (
                        <ErrorMessage message={errors.roleId} />
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "16px", mt: "16px" }}>
                        <MyCustomButton
                            type="submit"
                            borderRadius={8}
                            fontSize={16}
                            fontWeight={400}
                            disabled={isSave}
                            content={t("dashBoardManager.news.buttonSave")}
                            onClick={handleSubmit}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>

    );
}
export default UserManagementForm;