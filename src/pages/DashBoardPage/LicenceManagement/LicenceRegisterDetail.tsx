import { Box, Button, TextField, TextareaAutosize, Typography } from "@mui/material";
import usei18next from "../../../hooks/usei18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LicenceManagementService from "../../../services/LicenceManagementService";
import { Lisence } from "../../../utils/type";
import MyCustomButton from "../../../components/common/MyButton";
import ToastComponent from "../../../components/toast/ToastComponent";
import { useFormik } from "formik";
import theme from "../../../utils/theme";
import useThemePage from "../../../hooks/useThemePage";
import MyIcon from "../../../components/common/MyIcon";
import { ArrowBack } from "@mui/icons-material";

const LicenceRegisterDetail = () => {
    const { t } = usei18next()
    const { id } = useParams();
    const navigate = useNavigate()
    const [statusChange, setStatusChange] = useState<Number>();
    const [licence, setLicence] = useState<Lisence>();
    const { isMobile, isIpad } = useThemePage();

    useEffect(() => {
        getLicenseById(Number(id))
    }, [id])

    const formik = useFormik({
        initialValues: {
            statusComment: ""
        },
        onSubmit: values => {
            changeStatus(Number(statusChange), values.statusComment);
        }
    });

    const getLicenseById = async (id: number) => {
        try {
            const response = await LicenceManagementService.getLicenceById(id);
            if (response) {
                setLicence(response)
            }
        } catch (error) {

        }
    }
    const changeStatus = async (status: number, statusComment: string) => {
        try {
            const response = await LicenceManagementService.changeStatus(Number(id), status, statusComment)
            if (response.status === 200) {
                if (status == 1) {
                    navigate(-1)
                    ToastComponent(t("toast.dashboardLicense.Arrprove.success"), "success");
                } else {
                    navigate(-1)
                    ToastComponent(t("toast.dashboardLicense.Reject.success"), "success");
                }

            } else {
                if (status == 1) {
                    ToastComponent(t("toast.dashboardLicense.Arrprove.warning"), "warning");
                } else {
                    ToastComponent(t("toast.dashboardLicense.Reject.warning"), "warning");
                }
            }
        } catch (error) {
            if (status == 1) {
                ToastComponent(t("toast.dashboardLicense.Arrprove.error"), "error");
            } else {
                ToastComponent(t("toast.dashboardLicense.Reject.error"), "error");
            }

        }

    };

    const {
        values,
        handleChange,
        handleSubmit,
    } = formik;

    return (
        <Box width={'100%'} display={'flex'} flexDirection={'column'} gap={"16px"}>
            <Box sx={{ backgroundColor: "#8B4513" }} width={'100%'} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1} >
                <MyIcon icon={<ArrowBack style={{ color: theme.palette.common.white }} />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => navigate(-1)} position='bottom' />
                <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700}>
                    {t("dashBoardManager.Navigation.licenseManager")}
                </Typography>
            </Box>

            <Box sx={{
                border: "1px solid #E0E0E0",
                backgroundColor: "#fff",
                borderRadius: "8px",
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignContent: 'center',
                padding: isMobile ? '2rem' : '3rem',
                justifyContent: 'center',
                gap: '3rem'
            }}>
                <Box sx={{ display: 'flex', width: isMobile ? '90%' : '40%', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        style={{
                            width:'90%',
                            borderRadius: '16px',
                            objectFit: 'cover',
                            border: '3px solid #8B4513',
                            padding: '1rem'
                        }}
                        src={licence?.licenceImageUrl}
                        alt={'licence'} />
                </Box>
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: isMobile ? '90%' : '40%',
                        gap: '1rem'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px',
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'Black',
                                fontWeight: 'bold',
                            }}
                        >
                            {t("licenseInfo.NumberLicense")} :
                        </Typography>
                        <Typography variant="h5" align="left">
                            {licence?.licenceNumber}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px',
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'Black',
                                fontWeight: 'bold',
                            }}
                        >
                            {t("licenseInfo.Name")} :
                        </Typography>
                        <Typography variant="h5" align="left">
                            {licence?.fullName}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'Black',
                                fontWeight: 'bold',
                            }}
                        >
                            {t("userProfile.DOB")} :
                        </Typography>
                        <Typography variant="h5" align="left">
                            {licence?.dob}
                        </Typography>
                    </Box>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="statusComment"
                            aria-label={t("licenseInfo.InputComment")}
                            minRows={3}
                            onChange={handleChange}
                            value={values.statusComment}
                            placeholder={t("licenseInfo.InputComment")}
                            sx={{
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
                                width: '100%',
                                paddingTop: '10px',
                                fontFamily: 'Arial, sans-serif',
                                fontSize: '16px'
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "16px", mt: "16px" }}>
                            <MyCustomButton
                                type="submit"
                                borderRadius={8}
                                fontSize={16}
                                fontWeight={500}
                                variant='outlined'
                                content={t("licenseInfo.BtnReject")}
                                onClick={() => setStatusChange(2)} />
                            <MyCustomButton
                                type="submit"
                                borderRadius={8}
                                fontSize={16}
                                fontWeight={400}
                                content={t("licenseInfo.BtnApprove")}
                                onClick={() => setStatusChange(1)} />
                        </Box>
                    </form>
                </Box>

            </Box>
        </Box>
    )
}

export default LicenceRegisterDetail;