
import { Box, Button, Typography, TextareaAutosize, TextField } from "@mui/material";
import usei18next from "../../../hooks/usei18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MotorbikeManagementService from "../../../services/MotorbikeManagementService";
import { Motorbike } from "../../../utils/type";
import MyCustomButton from "../../../components/common/MyButton";
import ToastComponent from "../../../components/toast/ToastComponent";
import { useFormik } from "formik";
import MyIcon from "../../../components/common/MyIcon";
import { ArrowBack } from "@mui/icons-material";
import theme from "../../../utils/theme";
import useThemePage from "../../../hooks/useThemePage";

const MotorbikeRegisterDetail = () => {
    const { t } = usei18next()
    const { id } = useParams();
    const [statusChange, setStatusChange] = useState<string>();
    const navigate = useNavigate()
    const [motorbike, setMotorbike] = useState<Motorbike>();
    const { isMobile, isIpad } = useThemePage();

    useEffect(() => {
        getMotobikeById(Number(id))
    }, [id])

    const formik = useFormik({
        initialValues: {
            statusComment: ""
        },
        onSubmit: values => {
            if (statusChange)
                changeStatus(statusChange, values.statusComment);
        }
    });

    const {
        values,
        handleChange,
        handleSubmit,
    } = formik;

    const getMotobikeById = async (id: number) => {
        try {
            const response = await MotorbikeManagementService.getMotorbikesById(id);
            if (response) {
                setMotorbike(response)
            }
        } catch (error) {

        }
    }

    const changeStatus = async (status: string, statusComment: string) => {
        try {
            const response = await MotorbikeManagementService.changeStatus(Number(id), status, statusComment)
            if (response.status === 200) {
                if (status == "Approved") {
                    navigate(-1);
                    ToastComponent(t("toast.dashboardMotorbike.Arrprove.success"), "success");
                } else {
                    navigate(-1);
                    ToastComponent(t("toast.dashboardMotorbike.Reject.success"), "success");
                }

            } else {
                if (status == "Approved") {
                    ToastComponent(t("toast.dashboardMotorbike.Arrprove.warning"), "warning");
                } else {
                    ToastComponent(t("toast.dashboardMotorbike.Reject.warning"), "warning");
                }
            }
        } catch (error) {
            if (status == "Approved") {
                ToastComponent(t("toast.dashboardMotorbike.Arrprove.error"), "error");
            } else {
                ToastComponent(t("toast.dashboardMotorbike.Reject.error"), "error");
            }

        }

    };
    // get first image in list imageUrl
    const getImageUrl = motorbike?.imageUrl[0];

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
                            width: '90%',
                            borderRadius: '16px',
                            objectFit: 'cover',
                            border: '3px solid #8B4513',
                            padding: '1rem'
                        }}
                        src={getImageUrl}
                        alt={'motorbike'}>

                    </img>
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
                            variant="h6" // Chỉnh cỡ chữ thành h6
                            sx={{
                                color: 'Black',
                                fontWeight: 'bold',
                            }}
                        >
                            {t("dashBoardManager.Motobike.Name")}
                        </Typography>
                        <Typography variant="h6" align="left">
                            {motorbike?.model.modelName}
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
                            variant="h6" // Chỉnh cỡ chữ thành h6
                            sx={{
                                color: 'Black',
                                fontWeight: 'bold',
                            }}
                        >
                            {t("dashBoardManager.Motobike.Plate")}
                        </Typography>
                        <Typography variant="h6" align="left">
                            {motorbike?.licensePlate}
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
                            variant="h6" // Chỉnh cỡ chữ thành h6
                            sx={{
                                color: 'Black',
                                fontWeight: 'bold',
                            }}
                        >
                            {t("dashBoardManager.Motobike.Fuel")}
                        </Typography>
                        <Typography variant="h6" align="left">
                            {motorbike?.type}
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
                            variant="h6" // Chỉnh cỡ chữ thành h6
                            sx={{
                                color: 'Black',
                                fontWeight: 'bold',
                            }}
                        >
                            {t("dashBoardManager.Motobike.Location")}
                        </Typography>
                        <Typography variant="h6" align="right">
                            {motorbike?.address}
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
                            variant="h6" // Chỉnh cỡ chữ thành h6
                            sx={{
                                color: 'Black',
                                fontWeight: 'bold',
                            }}
                        >
                            {t("dashBoardManager.Motobike.PriceForRent")} :
                        </Typography>
                        <Typography variant="h6" align="left">
                            {motorbike?.priceRent}
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
                                onClick={() => setStatusChange("Rejected")} />
                            <MyCustomButton
                                type="submit"
                                borderRadius={8}
                                fontSize={16}
                                fontWeight={400}
                                content={t("licenseInfo.BtnApprove")}
                                onClick={() => setStatusChange("Approved")} />
                        </Box>
                    </form>
                </Box>

            </Box>
        </Box>

    );
}

export default MotorbikeRegisterDetail;